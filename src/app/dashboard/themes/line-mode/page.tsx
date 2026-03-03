"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, Terminal, Cpu, Globe } from "lucide-react";
import Link from "next/link";

export default function LineModeThemePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: "web",
      title: "World Wide Web",
      icon: Globe,
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
      icon: Terminal,
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
      icon: Cpu,
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
      icon: Monitor,
      content: `Web'in gelişimi:

1989 - Tim Berners-Lee WWW önerisini sundu
1990 - İlk web sunucusu ve tarayıcı geliştirildi
1991 - WWW halka açıldı
1993 - Mosaic tarayıcı yayınlandı
1994 - Netscape Navigator piyasaya çıktı
1995 - Microsoft Internet Explorer'ı duyurdu

Türkiye'de ilk internet bağlantısı 1993'te ODTÜ'de kuruldu.`
    }
  ];

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b-2 border-green-500 pb-4">
        <Link
          href="/dashboard/themes"
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{"< GERI"}</span>
        </Link>
        <div className="text-right">
          <h1 className="text-xl font-bold">Line Mode Browser</h1>
          <p className="text-sm text-green-400">WWW Retrospektif</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <pre className="text-xs sm:text-sm text-green-400 mb-4">
{`
 _    _      _ _         __      __       _    _
| |  | |    | | |        \ \    / /      | |  | |
| |__| | ___| | | ___     \ \  / /_ _ ___| |__| |
|  __  |/ _ \ | |/ _ \     \ \/ / _  / __|  __  |
| |  | |  __/ | | (_) |     \  / (_| \__ \ |  | |
|_|  |_|\___|_|_|\___/       \/ \__,_|___/_|  |_|
`}
          </pre>
          <h2 className="text-2xl font-bold mb-2">World Wide Web Projesi</h2>
          <p className="text-green-400 max-w-2xl mx-auto">
            World Wide Web (WWW), evrensel bir belge evrenine erişim sağlamayı amaçlayan 
            geniş alanlı bir hipermedya bilgi erişim girişimidir. 1989'da Tim Berners-Lee 
            tarafından CERN'de icat edildi.
          </p>
        </motion.div>

        {/* Menu */}
        <div className="border-2 border-green-500 p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-center">=== KONU LİSTESİ ===</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className={`flex items-center gap-3 p-4 border border-green-500 text-left hover:bg-green-900/30 transition-all ${
                  activeSection === section.id ? "bg-green-900/50" : ""
                }`}
              >
                <span className="text-green-300">[{index + 1}]</span>
                <section.icon className="w-5 h-5" />
                <span>{section.title}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Display */}
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-green-500 p-6 bg-green-900/10"
          >
            {sections.map((section) =>
              section.id === activeSection ? (
                <div key={section.id}>
                  <div className="flex items-center gap-3 mb-4 border-b border-green-500 pb-2">
                    <section.icon className="w-6 h-6" />
                    <h3 className="text-xl font-bold">{section.title}</h3>
                  </div>
                  <pre className="whitespace-pre-wrap text-green-300 text-sm leading-relaxed">
                    {section.content}
                  </pre>
                </div>
              ) : null
            )}
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-green-600">
          <p>Mail: info@sitecloneai.com</p>
          <p className="mt-2">SiteClone AI - Modern Web Klonlama Aracı</p>
          <p className="mt-1">Bu tema, WWW'nin ilk günlerini hatırlatmaktadır.</p>
        </div>

        {/* Use Template Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => alert("Bu tema editöre kopyalandı!")}
            className="px-8 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all font-bold"
          >
            BU TEMAYI KULLAN
          </button>
        </div>
      </div>

      {/* Cursor Effect */}
      <div className="fixed bottom-4 right-4 text-green-500 animate-pulse">
        <span className="inline-block w-3 h-5 bg-green-500 ml-1"></span>
      </div>
    </div>
  );
}
