/**
 * Site Klonlama Utility Fonksiyonları
 * Resim URL'lerini düzeltme, CSS işleme vb.
 */

/**
 * Relative resim URL'lerini absolute URL'lere çevirir
 */
export function fixImageUrls(html: string, baseUrl: string): string {
  const base = new URL(baseUrl);
  
  // src attribute'larını düzelt
  html = html.replace(
    /src=["']((?!http|https|data:)[^"']+)["']/gi,
    (match, path) => `src="${new URL(path, base).href}"`
  );
  
  // srcset attribute'larını düzelt
  html = html.replace(
    /srcset=["']([^"']+)["']/gi,
    (match, srcset) => {
      const urls = srcset.split(',').map((part: string) => {
        const [url, size] = part.trim().split(/\s+/);
        if (url && !url.match(/^https?:\/\//)) {
          return `${new URL(url, base).href}${size ? ' ' + size : ''}`;
        }
        return part;
      });
      return `srcset="${urls.join(', ')}"`;
    }
  );
  
  // CSS background-image URL'lerini düzelt
  html = html.replace(
    /url\(["']?((?!http|https|data:)[^"')]+)["']?\)/gi,
    (match, path) => `url("${new URL(path, base).href}")`
  );
  
  return html;
}

/**
 * HTML içindeki resimleri bulur ve listeler
 */
export function extractImages(html: string): Array<{src: string, alt: string, tag: string}> {
  const images: Array<{src: string, alt: string, tag: string}> = [];
  
  // img tag'lerini bul
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
    images.push({
      src: match[1],
      alt: altMatch ? altMatch[1] : '',
      tag: match[0]
    });
  }
  
  // background-image ile div'leri bul
  const bgRegex = /style=["'][^"']*url\(([^)]+)\)[^"']*["']/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    images.push({
      src: match[1].replace(/["']/g, ''),
      alt: 'Background Image',
      tag: match[0]
    });
  }
  
  return images;
}

/**
 * HTML içindeki belirli bir resmi yeni URL ile değiştirir
 */
export function replaceImage(html: string, oldSrc: string, newSrc: string): string {
  // Escape special regex characters
  const escapedSrc = oldSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // src attribute'unu değiştir
  const srcRegex = new RegExp(`src=["']${escapedSrc}["']`, 'g');
  html = html.replace(srcRegex, `src="${newSrc}"`);
  
  // CSS url()'sini değiştir
  const urlRegex = new RegExp(`url\\(["']?${escapedSrc}["']?\\)`, 'g');
  html = html.replace(urlRegex, `url("${newSrc}")`);
  
  return html;
}

/**
 * Bozuk HTML yapısını düzeltir
 */
export function sanitizeHtml(html: string): string {
  // Kapatılmamış tag'leri kapat
  const selfClosingTags = ['br', 'hr', 'img', 'input', 'meta', 'link'];
  
  // Script ve style tag'lerini temizle (güvenlik için)
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Yorumları kaldır
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  
  return html;
}
