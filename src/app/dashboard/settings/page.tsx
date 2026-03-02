"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Save,
  Loader2,
  Camera,
  Moon,
  Sun,
  Globe,
  Bell,
  Key,
  Trash2,
  Shield,
  Download,
} from "lucide-react";

import { useTranslation } from "@/lib/hooks/useTranslation";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  // New settings states
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Ayarlar kaydedilemedi");
      toast.success("Ayarlar kaydedildi");
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      // Generate random API key
      const newKey = "sc_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setApiKey(newKey);
      toast.success("Yeni API anahtarı oluşturuldu");
    } catch (error) {
      toast.error("API anahtarı oluşturulamadı");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Hesap silinemedi");
      toast.success("Hesap silindi");
      window.location.href = "/";
    } catch (error) {
      toast.error("Hesap silinirken bir hata oluştu");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">{t.dashboard.settings.title}</h1>
        <p className="text-dark-200 mt-1">{t.dashboard.settings.subtitle}</p>
      </div>

      {/* Profile Section */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-white mb-6">{t.dashboard.settings.profile}</h2>
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary-600/20 border-2 border-primary-500/30 flex items-center justify-center text-primary-400 text-2xl font-bold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center text-white hover:bg-primary-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="text-white font-medium">{session?.user?.name}</p>
            <p className="text-dark-300 text-sm">{session?.user?.email}</p>
            <p className="text-primary-400 text-xs mt-1 capitalize">
              {(session?.user as any)?.plan || "Free"} {t.dashboard.page.stats.currentPlan}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-100 mb-2">
              {t.dashboard.settings.labels.name}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-100 mb-2">
              {t.dashboard.settings.labels.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-12"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-dark-500">
            <h3 className="text-sm font-semibold text-white mb-4">
              {t.dashboard.settings.password.title}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  {t.dashboard.settings.labels.currentPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
                  <input
                    type="password"
                    value={form.currentPassword}
                    onChange={(e) =>
                      setForm({ ...form, currentPassword: e.target.value })
                    }
                    className="input-field pl-12"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  {t.dashboard.settings.labels.newPassword}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
                  <input
                    type="password"
                    value={form.newPassword}
                    onChange={(e) =>
                      setForm({ ...form, newPassword: e.target.value })
                    }
                    className="input-field pl-12"
                    placeholder={t.dashboard.settings.labels.placeholderPassword}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.dashboard.settings.buttons.updating}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t.dashboard.settings.buttons.save}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Appearance & Theme */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-white mb-6">Görünüm ve Tema</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="w-5 h-5 text-primary-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              <div>
                <p className="text-white font-medium">Tema</p>
                <p className="text-sm text-dark-300">Karanlık veya aydınlık tema seçimi</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${theme === "light" ? "bg-primary-600 text-white" : "bg-dark-600 text-dark-200 hover:bg-dark-500"}`}
              >
                Aydınlık
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${theme === "dark" ? "bg-primary-600 text-white" : "bg-dark-600 text-dark-200 hover:bg-dark-500"}`}
              >
                Karanlık
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-white mb-6">Bildirimler</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">E-posta Bildirimleri</p>
                <p className="text-sm text-dark-300">Önemli güncellemeler ve haberler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium">Push Bildirimleri</p>
                <p className="text-sm text-dark-300">Tarayıcı bildirimleri</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">Pazarlama E-postaları</p>
                <p className="text-sm text-dark-300">Kampanyalar ve özel teklifler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* API Key */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-white mb-6">API Anahtarı</h2>
        <div className="space-y-4">
          <div className="p-4 bg-dark-700/50 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Key className="w-5 h-5 text-yellow-400" />
              <p className="text-white font-medium">API Erişimi</p>
            </div>
            <p className="text-sm text-dark-300 mb-4">
              API anahtarınızı kullanarak programatik erişim sağlayabilirsiniz.
            </p>
            {apiKey && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-dark-800 rounded-lg">
                <code className="flex-1 text-sm text-primary-400 font-mono">
                  {showApiKey ? apiKey : "••••••••••••••••••••••••••"}
                </code>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-sm text-dark-300 hover:text-white"
                >
                  {showApiKey ? "Gizle" : "Göster"}
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleGenerateApiKey}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Key className="w-4 h-4" />
                {apiKey ? "Yeni Anahtar Oluştur" : "API Anahtarı Oluştur"}
              </button>
              {apiKey && (
                <button
                  onClick={() => { navigator.clipboard.writeText(apiKey); toast.success("Kopyalandı"); }}
                  className="btn-secondary text-sm"
                >
                  Kopyala
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-500/20">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Tehlikeli Bölge</h2>
        <p className="text-dark-200 text-sm mb-4">
          Hesabınızı kalıcı olarak silmek için aşağıdaki butonu kullanın. Bu işlem geri alınamaz!
        </p>
        <button
          onClick={handleDeleteAccount}
          className="btn-danger text-sm flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Hesabı Sil
        </button>
      </div>
    </div>
  );
}
