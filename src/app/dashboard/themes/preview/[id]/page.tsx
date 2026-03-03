"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, Monitor, Smartphone, Tablet, Download, Code, FileCode, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Theme {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  demoUrl: string;
  liveDemoUrl?: string;
  features: string[];
  colorScheme: string[];
  customCode?: {
    html?: string;
    css?: string;
    js?: string;
  };
}

export default function ThemePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showCode, setShowCode] = useState(false);
  const [codeType, setCodeType] = useState<"html" | "php">("html");

  useEffect(() => {
    const savedThemes = localStorage.getItem("themes-order");
    if (savedThemes) {
      const themes = JSON.parse(savedThemes);
      const foundTheme = themes.find((t: Theme) => t.id === params.id);
      if (foundTheme) {
        setTheme(foundTheme);
      } else {
        toast.error("Tema bulunamadı!");
        router.push("/dashboard/themes");
      }
    } else {
      toast.error("Tema bulunamadı!");
      router.push("/dashboard/themes");
    }
  }, [params.id, router]);

  const generateHTML = () => {
    if (!theme) return "";
    const customHtml = theme.customCode?.html || "";
    const customCss = theme.customCode?.css || "";
    const customJs = theme.customCode?.js || "";

    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${theme.name}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: ${theme.colorScheme[1] || '#f3f4f6'};
            color: #1f2937;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .hero {
            background: ${theme.colorScheme[0] || '#3b82f6'};
            color: white;
            padding: 80px 20px;
            text-align: center;
            border-radius: 16px;
            margin-bottom: 40px;
        }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; }
        .hero p { font-size: 1.25rem; opacity: 0.9; }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin-bottom: 40px;
        }
        .feature-card {
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .feature-card h3 {
            color: ${theme.colorScheme[0] || '#3b82f6'};
            margin-bottom: 12px;
        }
        .btn {
            display: inline-block;
            background: ${theme.colorScheme[0] || '#3b82f6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: opacity 0.3s;
        }
        .btn:hover { opacity: 0.9; }
        footer {
            text-align: center;
            padding: 40px 20px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            margin-top: 60px;
        }
        ${customCss}
    </style>
</head>
<body>
    <div class="hero">
        <h1>${theme.name}</h1>
        <p>${theme.description}</p>
        <br>
        <a href="#" class="btn">Hemen Başla</a>
    </div>
    <div class="container">
        <div class="features">
            ${theme.features.map(feature => `
            <div class="feature-card">
                <h3>${feature}</h3>
                <p>Bu özellik ile işletmenizi büyütün.</p>
            </div>
            `).join('')}
        </div>
        ${customHtml}
    </div>
    <footer>
        <p>&copy; 2024 ${theme.name}. Tüm hakları saklıdır.</p>
    </footer>
    <script>
        console.log('${theme.name} yüklendi!');
        ${customJs}
    </script>
</body>
</html>`;
  };

  const generatePHP = () => {
    const html = generateHTML();
    return `<?php
// ${theme?.name} - PHP Template
$themeName = "${theme?.name}";
$themeDescription = "${theme?.description}";
?>
${html}`;
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${filename} indirildi!`);
  };

  if (!theme) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-white">Yükleniyor...</div>
      </div>
    );
  }

  const previewHTML = generateHTML();
  const previewPHP = generatePHP();

  const getFrameWidth = () => {
    switch (viewMode) {
      case "mobile": return "375px";
      case "tablet": return "768px";
      case "desktop": return "100%";
      default: return "100%";
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Compact Header */}
      <div className="bg-dark-800 border-b border-dark-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard/themes"
                className="p-1 hover:bg-dark-700 rounded text-dark-200 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-white text-sm font-medium">{theme.name}</h1>
                <p className="text-dark-400 text-xs hidden sm:block">{theme.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5 bg-dark-700/50 p-0.5 rounded">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-1 rounded transition-colors ${viewMode === "desktop" ? "bg-primary-600 text-white" : "text-dark-200 hover:text-white"}`}
                  title="Masaüstü"
                >
                  <Monitor className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("tablet")}
                  className={`p-1 rounded transition-colors ${viewMode === "tablet" ? "bg-primary-600 text-white" : "text-dark-200 hover:text-white"}`}
                  title="Tablet"
                >
                  <Tablet className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-1 rounded transition-colors ${viewMode === "mobile" ? "bg-primary-600 text-white" : "text-dark-200 hover:text-white"}`}
                  title="Mobil"
                >
                  <Smartphone className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => setShowCode(!showCode)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all ${showCode ? "bg-primary-600 text-white" : "bg-dark-700 text-dark-200 hover:bg-dark-600"}`}
              >
                <Code className="w-3 h-3" />
                <span className="hidden sm:inline">{showCode ? "Önizleme" : "Kod"}</span>
              </button>

              <button
                onClick={() => downloadFile(previewHTML, `${theme.id}.html`, "text/html")}
                className="flex items-center gap-1 px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">HTML</span>
              </button>
              <button
                onClick={() => downloadFile(previewPHP, `${theme.id}.php`, "application/x-php")}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
              >
                <FileCode className="w-3 h-3" />
                <span className="hidden sm:inline">PHP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-2">
        {showCode ? (
          <div className="max-w-7xl mx-auto">
            <div className="bg-dark-800 border border-dark-600 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-dark-600">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setCodeType("html")}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${codeType === "html" ? "bg-green-600/20 text-green-400" : "text-dark-200"}`}
                  >
                    <FileCode className="w-4 h-4" />
                    HTML
                  </button>
                  <button
                    onClick={() => setCodeType("php")}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${codeType === "php" ? "bg-purple-600/20 text-purple-400" : "text-dark-200"}`}
                  >
                    <FileCode className="w-4 h-4" />
                    PHP
                  </button>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeType === "html" ? previewHTML : previewPHP);
                    toast.success("Kod kopyalandı!");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-dark-200 hover:text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Kopyala
                </button>
              </div>
              <pre className="p-4 overflow-auto max-h-[calc(100vh-120px)] text-sm font-mono text-dark-200 bg-dark-900">
                <code>{codeType === "html" ? previewHTML : previewPHP}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="bg-white rounded-lg overflow-hidden shadow-2xl transition-all duration-300"
              style={{ width: getFrameWidth(), maxWidth: "100%", height: "calc(100vh - 60px)" }}
            >
              <iframe
                srcDoc={previewHTML}
                className="w-full h-full border-0"
                sandbox="allow-scripts"
                title={theme.name}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
