"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Monitor, 
  Terminal, 
  Cpu, 
  Globe, 
  Edit2, 
  Save, 
  Upload,
  Palette,
  Type,
  Image as ImageIcon,
  Eye,
  Code
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface ThemeContent {
  title: string;
  subtitle: string;
  asciiArt: string;
  sections: {
    id: string;
    title: string;
    icon: string;
    content: string;
  }[];
  footer: {
    email: string;
    company: string;
    description: string;
  };
  colors: {
    background: string;
    text: string;
    accent: string;
    border: string;
  };
  images: {
    header?: string;
    background?: string;
  };
}

const defaultContent: ThemeContent = {
  title: "World Wide Web Projesi",
  subtitle: "WWW Retrospektif",
  asciiArt: `
 _    _      _ _         __      __       _    _
| |  | |    | | |        \\ \\    / /      | |  | |
| |__| | ___| | | ___     \\ \\  / /_ _ ___| |__| |
|  __  |/ _ \\ | |/ _ \\     \\ \\/ / _  / __|  __  |
| |  | |  __/ | | (_) |     \\  / (_| \\__ \\ |  | |
|_|  |_|\\___|_|_|\\___/       \\/ \\__,_|___/_|  |_|
  `,
  sections: [
    {
      id: "web",
      title: "World Wide Web",
      icon: "Globe",
      content: `World Wide Web (WWW), evrensel bir belge evrenine erişim sağlamayı amaçlayan geniş alanlı bir hipermedya bilgi erişim girişimidir.

Tim Berners-Lee, 1989'da CERN'de çalışırken WWW'yi icat etti. İlk web sitesi 1991'de yayına girdi.

WWW'nin temel teknolojileri:
• HTML (HyperText Markup Language)
• HTTP (HyperText Transfer Protocol)
• URL (Uniform Resource Locator)`
    },
    {
      id: "browser",
      title: "Line Mode Browser",
      icon: "Terminal",
      content: `Line Mode Browser, WWW'nin ikinci tarayıcısı ve ilk komut satırı tabanlı tarayıcısıdır.

Özellikler:
• 1990'da Nicola Pellow tarafından geliştirildi
• Herhangi bir terminalde çalışabilir
• Düşük bant genişliği gerektirir
• Sadece metin tabanlıdır

Bu tarayıcı, modern web tarayıcılarının temelini oluşturdu.`
    },
    {
      id: "cern",
      title: "CERN ve Web",
      icon: "Cpu",
      content: `CERN (Avrupa Nükleer Araştırma Merkezi), dünya çapında işbirliği yapan bilim insanları için bilgi paylaşımını kolaylaştırmak amacıyla WWW'yi geliştirdi.

İlk web sunucusu: nxoc01.cern.ch
İlk web sayfası: info.cern.ch

Türkçe bilgi kaynakları:
• TÜBİTAK Ulakbim
• Yükseköğretim Kurulu (YÖK)
• Türkiye Bilimler Akademisi (TÜBA)`
    },
    {
      id: "history",
      title: "Web Tarihi",
      icon: "Monitor",
      content: `Web'in gelişimi:

1989 - Tim Berners-Lee WWW önerisini sundu
1990 - İlk web sunucusu ve tarayıcı geliştirildi
1991 - WWW halka açıldı
1993 - Mosaic tarayıcı yayınlandı
1994 - Netscape Navigator piyasaya çıktı
1995 - Microsoft Internet Explorer'ı duyurdu

Türkiye'de ilk internet bağlantısı 1993'te ODTÜ'de kuruldu.`
    }
  ],
  footer: {
    email: "info@sitecloneai.com",
    company: "SiteClone AI",
    description: "Bu tema, WWW'nin ilk günlerini hatırlatmaktadır."
  },
  colors: {
    background: "#000000",
    text: "#22c55e",
    accent: "#14532d",
    border: "#22c55e"
  },
  images: {}
};

export default function LineModeThemePage() {
  const { data: session } = useSession();
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState<ThemeContent>(defaultContent);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved content from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("line-mode-theme-content");
    if (saved) {
      try {
        setContent(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved content");
      }
    }
  }, []);

  const saveContent = () => {
    setIsSaving(true);
    localStorage.setItem("line-mode-theme-content", JSON.stringify(content));
    setTimeout(() => setIsSaving(false), 500);
  };

  const updateSection = (id: string, field: keyof typeof content.sections[0], value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          images: { ...prev.images, [type]: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const IconComponent = ({ name }: { name: string }) => {
    const icons: Record<string, React.ReactNode> = {
      Globe: <Globe className="w-5 h-5" />,
      Terminal: <Terminal className="w-5 h-5" />,
      Cpu: <Cpu className="w-5 h-5" />,
      Monitor: <Monitor className="w-5 h-5" />
    };
    return <>{icons[name] || <Globe className="w-5 h-5" />}</>;
  };

  return (
    <div 
      className="min-h-screen font-mono p-4"
      style={{ 
        backgroundColor: content.colors.background,
        color: content.colors.text
      }}
    >
      {/* Edit Mode Toggle */}
      {session?.user && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="flex items-center gap-2 px-4 py-2 border-2 rounded transition-all"
            style={{ 
              borderColor: content.colors.border,
              backgroundColor: isEditMode ? content.colors.text : 'transparent',
              color: isEditMode ? content.colors.background : content.colors.text
            }}
          >
            {isEditMode ? <Eye className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            {isEditMode ? "Önizleme" : "Düzenle"}
          </button>
          {isEditMode && (
            <button
              onClick={saveContent}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border-2 rounded transition-all"
              style={{ 
                borderColor: content.colors.border,
                backgroundColor: content.colors.accent
              }}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          )}
        </div>
      )}

      {/* Header */}
      <div 
        className="flex items-center justify-between mb-8 border-b-2 pb-4"
        style={{ borderColor: content.colors.border }}
      >
        <Link
          href="/dashboard/themes"
          className="flex items-center gap-2 transition-colors hover:opacity-80"
          style={{ color: content.colors.text }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{"< GERI"}</span>
        </Link>
        <div className="text-right">
          {isEditMode ? (
            <div className="space-y-2">
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                className="bg-transparent border text-right w-full px-2 py-1"
                style={{ borderColor: content.colors.border, color: content.colors.text }}
              />
              <input
                type="text"
                value={content.subtitle}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                className="bg-transparent border text-right w-full px-2 py-1 text-sm"
                style={{ borderColor: content.colors.border, color: content.colors.text }}
              />
            </div>
          ) : (
            <>
              <h1 className="text-xl font-bold">{content.title}</h1>
              <p className="text-sm opacity-80">{content.subtitle}</p>
            </>
          )}
        </div>
      </div>

      {/* Edit Panel */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 border-2 rounded"
          style={{ borderColor: content.colors.border, backgroundColor: content.colors.accent }}
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tema Ayarları
          </h3>
          
          {/* Color Pickers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs block mb-1">Arka Plan</label>
              <input
                type="color"
                value={content.colors.background}
                onChange={(e) => setContent({ 
                  ...content, 
                  colors: { ...content.colors, background: e.target.value }
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Metin Rengi</label>
              <input
                type="color"
                value={content.colors.text}
                onChange={(e) => setContent({ 
                  ...content, 
                  colors: { ...content.colors, text: e.target.value }
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Vurgu Rengi</label>
              <input
                type="color"
                value={content.colors.accent}
                onChange={(e) => setContent({ 
                  ...content, 
                  colors: { ...content.colors, accent: e.target.value }
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs block mb-1">Kenarlık Rengi</label>
              <input
                type="color"
                value={content.colors.border}
                onChange={(e) => setContent({ 
                  ...content, 
                  colors: { ...content.colors, border: e.target.value }
                })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* ASCII Art Editor */}
          <div className="mb-4">
            <label className="text-xs block mb-1 flex items-center gap-2">
              <Code className="w-3 h-3" />
              ASCII Art
            </label>
            <textarea
              value={content.asciiArt}
              onChange={(e) => setContent({ ...content, asciiArt: e.target.value })}
              className="w-full h-32 bg-black border rounded p-2 text-xs font-mono"
              style={{ borderColor: content.colors.border, color: content.colors.text }}
            />
          </div>

          {/* Image Upload */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border rounded hover:opacity-80">
              <ImageIcon className="w-4 h-4" />
              <span>Arka Plan Resmi</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'background')}
                className="hidden"
              />
            </label>
            {content.images.background && (
              <button
                onClick={() => setContent({ ...content, images: { ...content.images, background: undefined } })}
                className="text-red-400 hover:text-red-300"
              >
                Resmi Kaldır
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* ASCII Art */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <pre 
            className="text-xs sm:text-sm mb-4 overflow-x-auto"
            style={{ color: content.colors.text }}
          >
            {content.asciiArt}
          </pre>
          
          {isEditMode ? (
            <div className="space-y-2 max-w-2xl mx-auto">
              <textarea
                value={content.sections[0].content.split('\n\n')[0]}
                onChange={(e) => {
                  const newSections = [...content.sections];
                  const lines = newSections[0].content.split('\n\n');
                  lines[0] = e.target.value;
                  newSections[0].content = lines.join('\n\n');
                  setContent({ ...content, sections: newSections });
                }}
                className="w-full bg-transparent border rounded p-2 text-center"
                style={{ borderColor: content.colors.border, color: content.colors.text }}
                rows={3}
              />
            </div>
          ) : (
            <p 
              className="max-w-2xl mx-auto opacity-80"
              style={{ color: content.colors.text }}
            >
              {content.sections[0].content.split('\n\n')[0]}
            </p>
          )}
        </motion.div>

        {/* Menu */}
        <div 
          className="border-2 p-6 mb-8"
          style={{ borderColor: content.colors.border }}
        >
          <h3 className="text-lg font-bold mb-4 text-center">=== KONU LİSTESİ ===</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !isEditMode && setActiveSection(activeSection === section.id ? null : section.id)}
                className="flex items-center gap-3 p-4 border text-left transition-all hover:opacity-80"
                style={{ 
                  borderColor: content.colors.border,
                  backgroundColor: activeSection === section.id ? content.colors.accent : 'transparent'
                }}
              >
                <span style={{ color: content.colors.text }}>[{index + 1}]</span>
                <IconComponent name={section.icon} />
                {isEditMode ? (
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                    className="bg-transparent border-b flex-1 px-1"
                    style={{ borderColor: content.colors.border, color: content.colors.text }}
                  />
                ) : (
                  <span>{section.title}</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Display / Edit */}
        {(activeSection || isEditMode) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 p-6"
            style={{ 
              borderColor: content.colors.border,
              backgroundColor: content.colors.accent + '20'
            }}
          >
            {isEditMode ? (
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Bölüm İçerikleri
                </h3>
                {content.sections.map((section) => (
                  <div key={section.id} className="border rounded p-3" style={{ borderColor: content.colors.border }}>
                    <label className="text-xs font-bold block mb-1">{section.title}</label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                      className="w-full bg-transparent border rounded p-2 text-sm"
                      style={{ borderColor: content.colors.border, color: content.colors.text }}
                      rows={8}
                    />
                  </div>
                ))}
                
                {/* Footer Editor */}
                <div className="border-t pt-4 mt-4" style={{ borderColor: content.colors.border }}>
                  <h4 className="font-bold mb-2">Footer</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={content.footer.email}
                      onChange={(e) => setContent({ ...content, footer: { ...content.footer, email: e.target.value } })}
                      placeholder="E-posta"
                      className="w-full bg-transparent border rounded p-2 text-sm"
                      style={{ borderColor: content.colors.border, color: content.colors.text }}
                    />
                    <input
                      type="text"
                      value={content.footer.company}
                      onChange={(e) => setContent({ ...content, footer: { ...content.footer, company: e.target.value } })}
                      placeholder="Şirket Adı"
                      className="w-full bg-transparent border rounded p-2 text-sm"
                      style={{ borderColor: content.colors.border, color: content.colors.text }}
                    />
                    <input
                      type="text"
                      value={content.footer.description}
                      onChange={(e) => setContent({ ...content, footer: { ...content.footer, description: e.target.value } })}
                      placeholder="Açıklama"
                      className="w-full bg-transparent border rounded p-2 text-sm"
                      style={{ borderColor: content.colors.border, color: content.colors.text }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              content.sections.map((section) =>
                section.id === activeSection ? (
                  <div key={section.id}>
                    <div 
                      className="flex items-center gap-3 mb-4 border-b pb-2"
                      style={{ borderColor: content.colors.border }}
                    >
                      <IconComponent name={section.icon} />
                      <h3 className="text-xl font-bold">{section.title}</h3>
                    </div>
                    <pre 
                      className="whitespace-pre-wrap text-sm leading-relaxed opacity-90"
                      style={{ color: content.colors.text }}
                    >
                      {section.content}
                    </pre>
                  </div>
                ) : null
              )
            )}
          </motion.div>
        )}

        {/* Footer */}
        <div 
          className="mt-12 text-center text-sm"
          style={{ color: content.colors.text, opacity: 0.6 }}
        >
          <p>Mail: {content.footer.email}</p>
          <p className="mt-2">{content.footer.company} - {content.footer.description}</p>
        </div>

        {/* Use Template Button */}
        {!isEditMode && (
          <div className="mt-8 text-center">
            <button
              onClick={() => alert("Bu tema editöre kopyalandı!")}
              className="px-8 py-3 border-2 font-bold transition-all hover:opacity-80"
              style={{ 
                borderColor: content.colors.border,
                color: content.colors.text
              }}
            >
              BU TEMAYI KULLAN
            </button>
          </div>
        )}
      </div>

      {/* Cursor Effect */}
      {!isEditMode && (
        <div 
          className="fixed bottom-4 right-4 animate-pulse"
          style={{ color: content.colors.text }}
        >
          <span 
            className="inline-block w-3 h-5 ml-1"
            style={{ backgroundColor: content.colors.text }}
          />
        </div>
      )}
    </div>
  );
}
