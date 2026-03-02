import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import JSZip from "jszip";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const zip = new JSZip();
    const folderName = project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const rootFolder = zip.folder(folderName);
    
    if (!rootFolder) {
      throw new Error("Failed to create zip folder");
    }

    // Create organized folder structure
    const cssFolder = rootFolder.folder("css");
    const jsFolder = rootFolder.folder("js");
    const imagesFolder = rootFolder.folder("images");

    // Extract images from HTML content
    let htmlContent = project.htmlContent || "";
    const imageUrls: string[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let match;
    while ((match = imgRegex.exec(htmlContent)) !== null) {
      const url = match[1];
      if (url && (url.startsWith("http") || url.startsWith("//"))) {
        imageUrls.push(url);
      }
    }

    // Download and save images
    const imageMap = new Map<string, string>();
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const url = imageUrls[i];
        const response = await fetch(url);
        if (response.ok) {
          const blob = await response.blob();
          const ext = url.split(".").pop()?.split("?")[0] || "jpg";
          const filename = `image_${i + 1}.${ext}`;
          const arrayBuffer = await blob.arrayBuffer();
          imagesFolder?.file(filename, arrayBuffer);
          imageMap.set(url, `images/${filename}`);
        }
      } catch (e) {
        console.error(`Failed to download image: ${imageUrls[i]}`);
      }
    }

    // Replace image URLs in HTML with local paths
    imageMap.forEach((localPath, originalUrl) => {
      htmlContent = htmlContent.replace(new RegExp(originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), localPath);
    });

    // Create CSS file
    const cssContent = project.cssContent || "/* No CSS content */";
    cssFolder?.file("style.css", cssContent);

    // Create JS file
    const jsContent = project.jsContent || "// No JavaScript content";
    jsFolder?.file("script.js", jsContent);

    // Create organized HTML file
    const organizedHtml = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <meta name="description" content="${project.name} - Cloned Website">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
${htmlContent}
    <script src="js/script.js"></script>
</body>
</html>`;

    rootFolder.file("index.html", organizedHtml);

    // Create README file
    const readmeContent = `# ${project.name}

## Proje Bilgileri
- **Adı:** ${project.name}
- **Kaynak URL:** ${project.sourceUrl || "Belirtilmemiş"}
- **Oluşturulma Tarihi:** ${new Date(project.createdAt).toLocaleDateString("tr-TR")}
- **Son Güncelleme:** ${new Date(project.updatedAt).toLocaleDateString("tr-TR")}

## Dosya Yapısı
\`\`\`
${folderName}/
├── index.html      # Ana sayfa
├── css/
│   └── style.css   # Stil dosyası
├── js/
│   └── script.js   # JavaScript dosyası
└── images/         # Resimler
    └── image_1.jpg
    └── image_2.png
    └── ...
\`\`\`

## FTP'ye Yükleme
1. Tüm dosyaları ZIP'tan çıkarın
2. FTP istemcisi ile sunucunuza bağlanın
3. \`${folderName}\` klasörünü public_html veya www klasörüne yükleyin
4. Tarayıcıda \`http://siteniz.com/${folderName}/\` adresini açın

## Notlar
- Tüm görseller otomatik olarak indirilmiştir
- CSS ve JS dosyaları ayrı klasörlere organize edilmiştir
- Responsive tasarım desteklidir
`;

    rootFolder.file("README.txt", readmeContent);

    // Generate ZIP file
    const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });

    // Set headers for file download
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${folderName}_ftp_ready.zip"`);

    return new NextResponse(zipBuffer, { headers });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
