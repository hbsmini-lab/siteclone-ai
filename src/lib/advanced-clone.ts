/**
 * Advanced Clone Utilities - Saadet.org.tr ve benzeri siteler için
 * Dinamik içerik, anti-scraping, görsel çekme sorunlarını çözer
 */

import puppeteer from "puppeteer";

/**
 * Gelişmiş site klonlama - Daha iyi görsel ve yapı çıkarma
 */
export async function advancedClone(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-blink-features=AutomationControlled", // Anti-bot koruması
    ],
  });

  try {
    const page = await browser.newPage();
    
    // Anti-scraping önlemlerini aşmak için user-agent ve viewport
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1920, height: 1080 });
    
    // JavaScript ve resimleri engelleme (isteğe bağlı)
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const resourceType = req.resourceType();
      // Fontları ve media engelle, resimlere izin ver
      if (["font", "media"].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Sayfaya git ve bekle
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Ek bekleme süresi (dinamik içerik için)
    await page.waitForTimeout(3000);

    // Scroll yaparak lazy-load resimlerini yükle
    await autoScroll(page);

    // Tüm resimleri absolute URL yap
    await fixImagesInPage(page, url);

    // HTML ve diğer verileri topla
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    const screenshot = await page.screenshot({ 
      encoding: "base64", 
      fullPage: true,
      type: "jpeg",
      quality: 80
    });

    // Görsel listesini çıkar
    const images = await extractImagesFromPage(page);

    return { html, screenshot, images };
  } finally {
    await browser.close();
  }
}

/**
 * Sayfayı otomatik scroll yaparak lazy-load içeriği yükle
 */
async function autoScroll(page: puppeteer.Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0); // Başa dön
          resolve();
        }
      }, 100);
    });
  });
}

/**
 * Sayfadaki tüm resimleri bul ve absolute URL'ye çevir
 */
async function fixImagesInPage(page: puppeteer.Page, baseUrl: string) {
  await page.evaluate((base) => {
    const baseUrl = new URL(base);
    
    // Tüm img tag'lerini işle
    document.querySelectorAll("img").forEach((img) => {
      // Lazy-load src'lerini düzelt
      const src = img.getAttribute("src") || 
                  img.getAttribute("data-src") || 
                  img.getAttribute("data-original");
      
      if (src && !src.startsWith("http") && !src.startsWith("data:")) {
        try {
          const absoluteUrl = new URL(src, baseUrl).href;
          img.src = absoluteUrl;
          img.removeAttribute("data-src");
          img.removeAttribute("data-original");
        } catch (e) {
          console.warn("Image URL fix failed:", src);
        }
      }
      
      // srcset'i düzelt
      const srcset = img.getAttribute("srcset");
      if (srcset) {
        const newSrcset = srcset.split(",").map(part => {
          const [url, size] = part.trim().split(/\s+/);
          if (url && !url.startsWith("http") && !url.startsWith("data:")) {
            try {
              return `${new URL(url, baseUrl).href}${size ? " " + size : ""}`;
            } catch (e) {
              return part;
            }
          }
          return part;
        }).join(", ");
        img.setAttribute("srcset", newSrcset);
      }
    });

    // Background image'ları düzelt
    document.querySelectorAll("*").forEach((el) => {
      const style = (el as HTMLElement).style;
      if (style.backgroundImage && style.backgroundImage.includes("url")) {
        const urlMatch = style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith("http") && !urlMatch[1].startsWith("data:")) {
          try {
            const absoluteUrl = new URL(urlMatch[1], baseUrl).href;
            style.backgroundImage = `url("${absoluteUrl}")`;
          } catch (e) {}
        }
      }
    });
  }, baseUrl);
}

/**
 * Sayfadaki tüm görselleri detaylı olarak çıkar
 */
async function extractImagesFromPage(page: puppeteer.Page): Promise<Array<{
  src: string;
  alt: string;
  width: number;
  height: number;
  isVisible: boolean;
}>> {
  return await page.evaluate(() => {
    const images: Array<{
      src: string;
      alt: string;
      width: number;
      height: number;
      isVisible: boolean;
    }> = [];
    
    document.querySelectorAll("img").forEach((img) => {
      const rect = img.getBoundingClientRect();
      images.push({
        src: img.src,
        alt: img.alt,
        width: img.naturalWidth || rect.width,
        height: img.naturalHeight || rect.height,
        isVisible: rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight,
      });
    });
    
    return images;
  });
}

/**
 * Bozuk HTML yapısını düzelt
 */
export function fixBrokenHtml(html: string): string {
  // Yaygın hataları düzelt
  
  // 1. Kapanmamış tag'leri kapat
  const selfClosing = ["br", "hr", "img", "input", "meta", "link", "area", "base", "col", "embed", "param", "source", "track", "wbr"];
  
  // 2. Inline style'ları temizle (isteğe bağlı)
  // html = html.replace(/style="[^"]*"/g, "");
  
  // 3. Event handler'ları temizle (güvenlik)
  html = html.replace(/on\w+="[^"]*"/g, "");
  html = html.replace(/on\w+='[^']*'/g, "");
  
  // 4. Script ve iframe'leri kaldır
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "");
  
  // 5. Bozuk attribute'ları düzelt
  html = html.replace(/\s+/g, " ");
  
  return html;
}

/**
 * HTML'den temiz içerik çıkar (GPT için hazırlık)
 */
export function extractCleanContent(html: string): {
  title: string;
  description: string;
  mainContent: string;
  images: string[];
} {
  // Basit bir çıkarım - gerçek uygulamada cheerio kullanılabilir
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                     html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  
  const imgMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  const images = imgMatches.map(img => {
    const src = img.match(/src=["']([^"']+)["']/);
    return src ? src[1] : "";
  }).filter(Boolean);
  
  return {
    title: titleMatch ? titleMatch[1] : "",
    description: descMatch ? descMatch[1] : "",
    mainContent: html.substring(0, 100000), // İlk 100KB
    images: images.slice(0, 50), // İlk 50 resim
  };
}
