"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Palette,
  Search,
  Filter,
  ArrowRight,
  Check,
  Globe,
  Smartphone,
  Laptop,
  Sparkles,
  Star,
  TrendingUp,
  Layout,
  ShoppingBag,
  Briefcase,
  Camera,
  Music,
  Heart,
  Zap,
  Code2,
  ExternalLink,
  Loader2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Link as LinkIcon,
  Save,
  RotateCcw,
  Image as ImageIcon,
} from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

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
  isNew?: boolean;
  isPopular?: boolean;
  order?: number;
}

const categories = [
  { id: "all", name: "Tümü", icon: Layout },
  { id: "business", name: "İş & Kurumsal", icon: Briefcase },
  { id: "ecommerce", name: "E-Ticaret", icon: ShoppingBag },
  { id: "portfolio", name: "Portfolyo", icon: Camera },
  { id: "landing", name: "Landing Page", icon: Zap },
  { id: "blog", name: "Blog", icon: Globe },
  { id: "creative", name: "Kreatif", icon: Palette },
];

const defaultThemes: Theme[] = [
  {
    id: "modern-business",
    name: "Modern Business Pro",
    description: "Profesyonel işletmeler için modern ve şık kurumsal tema",
    category: "business",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/business",
    features: ["Responsive", "Hero Slider", "İletişim Formu", "Harita Entegrasyonu"],
    colorScheme: ["#2563eb", "#1e40af", "#f8fafc"],
    isPopular: true,
  },
  {
    id: "shopify-style",
    name: "Shopify Style",
    description: "E-ticaret siteleri için tam donanımlı modern mağaza teması",
    category: "ecommerce",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/shop",
    features: ["Ürün Kataloğu", "Sepet Sistemi", "Ödeme Entegrasyonu", "Filtreleme"],
    colorScheme: ["#059669", "#047857", "#ecfdf5"],
    isNew: true,
  },
  {
    id: "photographer",
    name: "Portfolio Photography",
    description: "Fotoğrafçılar ve sanatçılar için görsel odaklı portfolyo",
    category: "portfolio",
    image: "https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/photo",
    features: ["Galeri Grid", "Lightbox", "Tam Ekran Modu", "Sosyal Paylaşım"],
    colorScheme: ["#111827", "#374151", "#f3f4f6"],
  },
  {
    id: "saas-landing",
    name: "SaaS Landing",
    description: "Yazılım ve SaaS ürünleri için yüksek dönüşümlü landing page",
    category: "landing",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/saas",
    features: ["Fiyatlandırma Tablosu", "Özellikler Bölümü", "Müşteri Yorumları", "CTA Butonları"],
    colorScheme: ["#7c3aed", "#5b21b6", "#faf5ff"],
    isPopular: true,
  },
  {
    id: "minimal-blog",
    name: "Minimal Blog",
    description: "Yazarlar ve içerik üreticileri için temiz ve okunabilir blog teması",
    category: "blog",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/blog",
    features: ["Kategori Sistemi", "Arama", "Yorumlar", "Sosyal Medya"],
    colorScheme: ["#ea580c", "#c2410c", "#fff7ed"],
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    description: "Ajanslar ve kreatif ekipler için canlı ve enerjik tema",
    category: "creative",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/agency",
    features: ["Animasyonlar", "Video Arka Plan", "Ekip Bölümü", "Portfolyo Grid"],
    colorScheme: ["#db2777", "#be185d", "#fdf2f8"],
    isNew: true,
  },
  {
    id: "restaurant",
    name: "Restaurant & Cafe",
    description: "Restoran ve kafeler için menü odaklı şık tema",
    category: "business",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/restaurant",
    features: ["Dijital Menü", "Rezervasyon Sistemi", "Galeri", "İletişim"],
    colorScheme: ["#dc2626", "#b91c1c", "#fef2f2"],
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    description: "Teknoloji startup'ları için modern ve dinamik landing page",
    category: "landing",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/startup",
    features: ["İstatistikler", "Takım Bölümü", "Yatırımcı Bilgileri", "Blog"],
    colorScheme: ["#0891b2", "#0e7490", "#ecfeff"],
    isPopular: true,
  },
  {
    id: "fashion-store",
    name: "Fashion Store",
    description: "Moda ve giyim markaları için şık e-ticaret teması",
    category: "ecommerce",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=600&fit=crop",
    demoUrl: "https://demo.example.com/fashion",
    features: ["Lookbook", "Beden Rehberi", "Hızlı Bakış", "İstek Listesi"],
    colorScheme: ["#7c2d12", "#9a3412", "#fff7ed"],
  },
  {
    id: "line-mode",
    name: "Line Mode Retro",
    description: "WWW'nin ilk günlerini hatırlatan retro terminal tarzı tema",
    category: "creative",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop",
    demoUrl: "/dashboard/themes/line-mode",
    features: ["Retro Tasarım", "Terminal UI", "Türkçe İçerik", "Eğitici"],
    colorScheme: ["#22c55e", "#000000", "#14532d"],
    isNew: true,
  },
];

export default function ThemesPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>(defaultThemes);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [cloningTheme, setCloningTheme] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTheme, setEditingTheme] = useState<string | null>(null);

  // Load saved themes order from localStorage
  useEffect(() => {
    const savedThemes = localStorage.getItem("themes-order");
    if (savedThemes) {
      try {
        const parsed = JSON.parse(savedThemes);
        setThemes(parsed);
      } catch (e) {
        console.error("Failed to load themes order");
      }
    }
  }, []);

  // Save themes order
  const saveThemesOrder = () => {
    localStorage.setItem("themes-order", JSON.stringify(themes));
    toast.success("Tema sıralaması kaydedildi!");
  };

  // Reset to default
  const resetThemes = () => {
    setThemes(defaultThemes);
    localStorage.removeItem("themes-order");
    toast.success("Tema sıralaması sıfırlandı!");
  };

  // Move theme up
  const moveThemeUp = (index: number) => {
    if (index === 0) return;
    const newThemes = [...themes];
    [newThemes[index], newThemes[index - 1]] = [newThemes[index - 1], newThemes[index]];
    setThemes(newThemes);
  };

  // Move theme down
  const moveThemeDown = (index: number) => {
    if (index === themes.length - 1) return;
    const newThemes = [...themes];
    [newThemes[index], newThemes[index + 1]] = [newThemes[index + 1], newThemes[index]];
    setThemes(newThemes);
  };

  // Update theme live demo URL
  const updateThemeLiveDemo = (themeId: string, url: string) => {
    const updatedThemes = themes.map(t => t.id === themeId ? { ...t, liveDemoUrl: url } : t);
    setThemes(updatedThemes);
    // Also update previewTheme if it's the same theme
    if (previewTheme && previewTheme.id === themeId) {
      setPreviewTheme({ ...previewTheme, liveDemoUrl: url });
    }
  };

  // Update any theme field
  const updateThemeField = (themeId: string, field: keyof Theme, value: any) => {
    const updatedThemes = themes.map(t => t.id === themeId ? { ...t, [field]: value } : t);
    setThemes(updatedThemes);
    // Also update previewTheme if it's the same theme
    if (previewTheme && previewTheme.id === themeId) {
      setPreviewTheme({ ...previewTheme, [field]: value });
    }
  };

  const filteredThemes = themes.filter((theme) => {
    const matchesCategory = selectedCategory === "all" || theme.category === selectedCategory;
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCloneTheme = async (theme: Theme) => {
    setCloningTheme(theme.id);
    try {
      // Store theme info in localStorage for the clone page
      localStorage.setItem("clonePrompt", `[Tema: ${theme.name}] ${theme.description}`);
      localStorage.setItem("selectedTheme", JSON.stringify(theme));
      
      toast.success(`${theme.name} teması seçildi!`);
      router.push("/dashboard/clone");
    } catch (error) {
      toast.error("Tema seçilemedi");
    } finally {
      setCloningTheme(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-600/20 rounded-lg">
              <Palette className="w-6 h-6 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Hazır Temalar</h1>
          </div>
          
          {/* Edit Mode Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isEditMode
                  ? "bg-primary-600 text-white"
                  : "bg-dark-700 text-dark-200 hover:bg-dark-600"
              }`}
            >
              {isEditMode ? <Check className="w-4 h-4" /> : <GripVertical className="w-4 h-4" />}
              {isEditMode ? "Düzenlemeyi Bitir" : "Sırala & Düzenle"}
            </button>
            {isEditMode && (
              <>
                <button
                  onClick={saveThemesOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Kaydet
                </button>
                <button
                  onClick={resetThemes}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-700 text-dark-200 rounded-lg hover:bg-dark-600 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Sıfırla
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-dark-200 ml-11">
          Profesyonel tasarlanmış hazır temaları kullanarak hızla başlayın
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card mb-8 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Tema ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>

          {/* Device Preview Toggles */}
          <div className="flex items-center gap-2 bg-dark-900/50 p-1 rounded-lg">
            <button className="p-2 hover:bg-dark-700 rounded-md text-primary-400 transition-colors">
              <Laptop className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-dark-700 rounded-md text-dark-400 hover:text-white transition-colors">
              <Smartphone className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-dark-700 text-dark-200 hover:bg-dark-600 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme, index) => (
          <div
            key={theme.id}
            className={`card-hover group overflow-hidden bg-dark-800/40 backdrop-blur-sm border border-dark-600/50 ${
              isEditMode ? "ring-2 ring-primary-500/50" : ""
            }`}
          >
            {/* Edit Mode: Order Controls */}
            {isEditMode && (
              <div className="flex items-center justify-between px-4 py-2 bg-primary-600/20 border-b border-dark-600">
                <span className="text-sm font-bold text-primary-400">#{index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveThemeUp(index)}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-dark-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Yukarı taşı"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveThemeDown(index)}
                    disabled={index === filteredThemes.length - 1}
                    className="p-1.5 hover:bg-dark-700 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Aşağı taşı"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={theme.image}
                alt={theme.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-60" />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {theme.isNew && (
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Yeni
                  </span>
                )}
                {theme.isPopular && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Popüler
                  </span>
                )}
              </div>

              {/* Edit Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setPreviewTheme(theme)}
                  className="px-4 py-2 bg-primary-600/90 backdrop-blur-sm text-white rounded-lg font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                >
                  <ExternalLink className="w-4 h-4" />
                  Düzenle
                </button>
              </div>

              {/* Color Scheme */}
              <div className="absolute bottom-3 right-3 flex -space-x-2">
                {theme.colorScheme.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-6 h-6 rounded-full border-2 border-dark-800"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">
                  {theme.name}
                </h3>
              </div>
              
              <p className="text-sm text-dark-200 mb-4 line-clamp-2">
                {theme.description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {theme.features.slice(0, 3).map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-dark-700/50 text-dark-100 text-xs rounded-full"
                  >
                    {feature}
                  </span>
                ))}
                {theme.features.length > 3 && (
                  <span className="px-2 py-0.5 bg-dark-700/50 text-dark-100 text-xs rounded-full">
                    +{theme.features.length - 3}
                  </span>
                )}
              </div>

              {/* Live Demo URL Editor - Edit Mode */}
              {isEditMode && (
                <div className="mb-4 p-3 bg-dark-700/50 rounded-lg">
                  <label className="text-xs text-dark-300 block mb-1 flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" />
                    Canlı Demo Linki
                  </label>
                  <input
                    type="text"
                    value={theme.liveDemoUrl || ""}
                    onChange={(e) => updateThemeLiveDemo(theme.id, e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-dark-800 border border-dark-600 rounded px-2 py-1 text-sm text-white"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-dark-600/30">
                <button
                  onClick={() => handleCloneTheme(theme)}
                  disabled={cloningTheme === theme.id}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-sm"
                >
                  {cloningTheme === theme.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Code2 className="w-4 h-4" />
                  )}
                  Bu Tema ile Başla
                </button>
                <a
                  href={theme.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 btn-ghost"
                  title="Önizleme"
                >
                  <Globe className="w-4 h-4" />
                </a>
                {theme.liveDemoUrl && (
                  <a
                    href={theme.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 btn-ghost text-green-400 hover:text-green-300"
                    title="Canlı Demo"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-20 card">
          <Search className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Tema bulunamadı
          </h3>
          <p className="text-dark-200">
            Arama kriterlerinize uygun tema bulunamadı. Farklı bir arama deneyin.
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {previewTheme && (
        <div className="fixed inset-0 z-[200] bg-dark-900/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-600 bg-dark-800">
              <div className="flex items-center gap-3">
                <Palette className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-semibold text-white">Tema Düzenle</h3>
              </div>
              <button
                onClick={() => setPreviewTheme(null)}
                className="p-2 hover:bg-dark-700 rounded-lg text-dark-200 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Edit Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="bg-dark-700/30 rounded-lg p-4">
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Tema Görseli
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={previewTheme.image}
                      alt={previewTheme.name}
                      className="w-32 h-24 object-cover rounded-lg border border-dark-600"
                    />
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateThemeField(previewTheme.id, 'image', reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <div className="px-4 py-2 bg-dark-600 hover:bg-dark-500 rounded-lg text-sm text-center transition-colors">
                        Yeni Görsel Yükle
                      </div>
                    </label>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-1 block">Tema Adı</label>
                    <input
                      type="text"
                      value={previewTheme.name}
                      onChange={(e) => updateThemeField(previewTheme.id, 'name', e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-1 block">Kategori</label>
                    <select
                      value={previewTheme.category}
                      onChange={(e) => updateThemeField(previewTheme.id, 'category', e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    >
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-white mb-1 block">Açıklama</label>
                  <textarea
                    value={previewTheme.description}
                    onChange={(e) => updateThemeField(previewTheme.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-1 block flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Demo URL (Yerel)
                    </label>
                    <input
                      type="text"
                      value={previewTheme.demoUrl}
                      onChange={(e) => updateThemeField(previewTheme.id, 'demoUrl', e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-1 block flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" />
                      Canlı Demo URL
                    </label>
                    <input
                      type="text"
                      value={previewTheme.liveDemoUrl || ''}
                      onChange={(e) => updateThemeLiveDemo(previewTheme.id, e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Özellikler
                  </label>
                  <div className="space-y-2">
                    {previewTheme.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...previewTheme.features];
                            newFeatures[idx] = e.target.value;
                            updateThemeField(previewTheme.id, 'features', newFeatures);
                          }}
                          className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white text-sm"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = previewTheme.features.filter((_, i) => i !== idx);
                            updateThemeField(previewTheme.id, 'features', newFeatures);
                          }}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newFeatures = [...previewTheme.features, 'Yeni Özellik'];
                        updateThemeField(previewTheme.id, 'features', newFeatures);
                      }}
                      className="w-full py-2 border border-dashed border-dark-500 text-dark-300 rounded-lg hover:border-primary-500 hover:text-primary-400 transition-colors text-sm"
                    >
                      + Özellik Ekle
                    </button>
                  </div>
                </div>

                {/* Color Scheme */}
                <div>
                  <label className="text-sm font-medium text-white mb-2 block flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Renk Şeması
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {previewTheme.colorScheme.map((color, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-dark-700/30 rounded-lg p-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...previewTheme.colorScheme];
                            newColors[idx] = e.target.value;
                            updateThemeField(previewTheme.id, 'colorScheme', newColors);
                          }}
                          className="w-10 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => {
                            const newColors = [...previewTheme.colorScheme];
                            newColors[idx] = e.target.value;
                            updateThemeField(previewTheme.id, 'colorScheme', newColors);
                          }}
                          className="w-24 bg-dark-700 border border-dark-600 rounded px-2 py-1 text-sm text-white"
                        />
                        <button
                          onClick={() => {
                            const newColors = previewTheme.colorScheme.filter((_, i) => i !== idx);
                            updateThemeField(previewTheme.id, 'colorScheme', newColors);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {previewTheme.colorScheme.length < 5 && (
                      <button
                        onClick={() => {
                          const newColors = [...previewTheme.colorScheme, '#000000'];
                          updateThemeField(previewTheme.id, 'colorScheme', newColors);
                        }}
                        className="px-4 py-2 border border-dashed border-dark-500 text-dark-300 rounded-lg hover:border-primary-500 hover:text-primary-400 transition-colors"
                      >
                        + Renk Ekle
                      </button>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={previewTheme.isNew || false}
                      onChange={(e) => updateThemeField(previewTheme.id, 'isNew', e.target.checked)}
                      className="w-4 h-4 rounded border-dark-600"
                    />
                    <span className="text-sm text-white">Yeni</span>
                    <Sparkles className="w-3 h-3 text-green-400" />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={previewTheme.isPopular || false}
                      onChange={(e) => updateThemeField(previewTheme.id, 'isPopular', e.target.checked)}
                      className="w-4 h-4 rounded border-dark-600"
                    />
                    <span className="text-sm text-white">Popüler</span>
                    <TrendingUp className="w-3 h-3 text-orange-400" />
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-dark-600 bg-dark-800">
              <button
                onClick={() => {
                  setPreviewTheme(null);
                }}
                className="px-4 py-2 text-dark-300 hover:text-white transition-colors"
              >
                Kapat
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    saveThemesOrder();
                    setPreviewTheme(null);
                    toast.success("Tema başarıyla kaydedildi!");
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setPreviewTheme(null);
                    handleCloneTheme(previewTheme);
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  Bu Tema ile Başla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
