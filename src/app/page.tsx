"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Globe,
  ArrowRight,
  Lightbulb,
  Copy,
  PenTool,
  Home,
  Star,
  Zap,
  Plus,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Mode types
type PromptMode = "idea" | "clone" | "redesign" | "local";

// Quick start sites
const quickStartSites = [
  { name: "Stripe", url: "https://stripe.com", icon: "💳" },
  { name: "Linear", url: "https://linear.app", icon: "📈" },
  { name: "Vercel", url: "https://vercel.com", icon: "▲" },
  { name: "Notion", url: "https://notion.so", icon: "📝" },
  { name: "Shopify", url: "https://shopify.com", icon: "🛍️" },
];

export default function HomePage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [promptText, setPromptText] = useState("");
  const [mode, setMode] = useState<PromptMode>("clone");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleModeChange = (newMode: PromptMode) => {
    setMode(newMode);
  };

  const handleQuickStart = (url: string) => {
    setPromptText(url);
    setMode("clone");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleNewProject = () => {
    setPromptText("");
    setMode("idea");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const enhancePrompt = async () => {
    if (!promptText.trim()) {
      alert("Önce bir prompt girin!");
      return;
    }
    setIsEnhancing(true);
    // Simulate AI enhancement
    setTimeout(() => {
      setPromptText(promptText + " - Modern, responsive, SEO-friendly design with smooth animations");
      setIsEnhancing(false);
    }, 1000);
  };

  const handleCreate = () => {
    if (!promptText.trim()) {
      alert("Lütfen bir açıklama veya URL girin!");
      return;
    }
    
    localStorage.setItem("clonePrompt", promptText);
    localStorage.setItem("cloneMode", mode);
    router.push("/dashboard/clone");
  };

  const getPlaceholder = () => {
    switch (mode) {
      case "idea":
        return "Sitenizi tanımlayın... (ör: 'shiba inu köpek sahipleri için sıcak bir topluluk sitesi')";
      case "clone":
        return "Klonlamak istediğiniz site URL'sini yapıştırın...";
      case "redesign":
        return "Yeniden tasarlamak istediğiniz siteyi tanımlayın...";
      case "local":
        return "İşletmenizi tanımlayın... (ör: 'İstanbul Kadıköy'de bir kafe')";
      default:
        return "Sitenizi tanımlayın...";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Backed By Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-dark-800/50 border border-gray-700 text-gray-300 text-sm font-medium mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-gray-400">BACKED BY</span>
                <span className="font-semibold text-white">OpenAI</span>
                <span className="text-gray-400">FUND</span>
              </motion.div>

              {/* Heading */}
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-center">
                <span className="text-white">Launch Your Business</span>
                <br />
                <span className="text-primary-400">in 10 Minutes</span>
                <span className="text-white"> with AI</span>
              </h1>

              {/* Main Prompt Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-3xl mx-auto px-4 mb-6"
              >
                <div className="relative group">
                  {/* Soft Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-primary-600/20 rounded-2xl opacity-50 group-hover:opacity-80 transition duration-500 blur-md"></div>
                  
                  {/* Main Input Container */}
                  <div className="relative bg-dark-800/90 backdrop-blur-sm rounded-2xl overflow-hidden">
                    {/* Text Area */}
                    <textarea
                      ref={textareaRef}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder={getPlaceholder()}
                      rows={3}
                      className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-base resize-none px-6 pt-4 pb-2"
                    />
                    
                    {/* Prompt Bar */}
                    <div className="flex items-center justify-between px-4 pb-4 gap-2 flex-wrap">
                      {/* Left Chips */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleModeChange("idea")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            mode === "idea"
                              ? "bg-primary-600 text-white"
                              : "bg-dark-700/50 text-gray-400 hover:text-white hover:bg-dark-600"
                          }`}
                        >
                          <Lightbulb className="w-3 h-3" />
                          Fikir
                        </button>
                        
                        <button
                          onClick={() => handleModeChange("clone")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            mode === "clone"
                              ? "bg-primary-600 text-white"
                              : "bg-dark-700/50 text-gray-400 hover:text-white hover:bg-dark-600"
                          }`}
                        >
                          <Copy className="w-3 h-3" />
                          Klonla
                        </button>
                        
                        <button
                          onClick={() => handleModeChange("redesign")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            mode === "redesign"
                              ? "bg-primary-600 text-white"
                              : "bg-dark-700/50 text-gray-400 hover:text-white hover:bg-dark-600"
                          }`}
                        >
                          <PenTool className="w-3 h-3" />
                          Redesign
                        </button>
                        
                        <button
                          onClick={() => handleModeChange("local")}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            mode === "local"
                              ? "bg-primary-600 text-white"
                              : "bg-dark-700/50 text-gray-400 hover:text-white hover:bg-dark-600"
                          }`}
                        >
                          <Home className="w-3 h-3" />
                          İşletme
                        </button>
                      </div>

                      {/* Separator */}
                      <div className="h-6 w-px bg-gray-700 hidden sm:block"></div>

                      {/* Enhance & Create */}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={enhancePrompt}
                          disabled={isEnhancing}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-dark-700/50 text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
                          title="Prompt'u AI ile geliştir"
                        >
                          <Sparkles className={`w-3 h-3 ${isEnhancing ? "animate-spin" : ""}`} />
                          Geliştir
                        </button>
                        
                        <button
                          onClick={handleCreate}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium bg-primary-600 text-white hover:bg-primary-500 transition-all"
                        >
                          <Globe className="w-3 h-3" />
                          Oluştur
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Popular Quick Starts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-6"
              >
                {quickStartSites.map((site, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickStart(site.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800/50 hover:bg-dark-700/50 border border-gray-700/30 rounded-full text-gray-400 hover:text-white text-xs transition-all"
                  >
                    <span>{site.icon}</span>
                    {site.name}
                  </button>
                ))}
                
                <button
                  onClick={handleNewProject}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-800/50 hover:bg-dark-700/50 border border-gray-700/30 rounded-full text-gray-400 hover:text-white text-xs transition-all"
                >
                  <Plus className="w-3 h-3" />
                  Yeni Proje
                </button>
              </motion.div>

              {/* Home Refs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-3 text-xs text-gray-500"
              >
                <span>24 aktif proje</span>
                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                <span>18.4K aylık ziyaretçi</span>
                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                <button className="hover:text-white transition-colors">Gösterge Paneli</button>
                <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                <button className="flex items-center gap-1 hover:text-white transition-colors">
                  AI İşler
                  <span className="px-1.5 py-0.5 bg-primary-600/20 text-primary-400 rounded-full text-[10px]">3 aktif</span>
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
