'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Save,
  Globe,
  CreditCard,
  Users,
  FolderOpen,
  Mail,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  Upload,
  RefreshCw
} from 'lucide-react';

interface SiteSettings {
  [key: string]: string;
}

const tabs = [
  { id: 'general', label: 'Genel Ayarlar', icon: Globe },
  { id: 'payment', label: 'Ödeme Ayarları', icon: CreditCard },
  { id: 'user', label: 'Kullanıcı Ayarları', icon: Users },
  { id: 'project', label: 'Proje Ayarları', icon: FolderOpen },
  { id: 'email', label: 'E-posta Şablonları', icon: Mail },
  { id: 'security', label: 'Güvenlik', icon: Shield },
];

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    
    if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    fetchSettings();
  }, [status, session, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setNotification(null);
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNotification({ type: 'success', message: data.message });
        setHasChanges(false);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('settings-updated'));
        }
      } else {
        setNotification({ type: 'error', message: data.error || 'Bir hata oluştu' });
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Ayarlar kaydedilirken hata oluştu' });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Site Adı</label>
          <input
            type="text"
            value={settings['site.name'] || ''}
            onChange={(e) => handleChange('site.name', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">E-posta Adresi</label>
          <input
            type="email"
            value={settings['site.email'] || ''}
            onChange={(e) => handleChange('site.email', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Telefon Numarası</label>
          <input
            type="text"
            value={settings['site.phone'] || ''}
            onChange={(e) => handleChange('site.phone', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={settings['site.logo'] || ''}
              onChange={(e) => handleChange('site.logo', e.target.value)}
              className="flex-1 px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Site Açıklaması</label>
        <textarea
          value={settings['site.description'] || ''}
          onChange={(e) => handleChange('site.description', e.target.value)}
          rows={3}
          className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-yellow-500">Bakım Modu</h4>
            <p className="text-xs text-gray-400 mt-1">Siteyi bakım moduna alırsanız sadece adminler erişebilir</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings['site.maintenanceMode'] === 'true'}
              onChange={(e) => handleChange('site.maintenanceMode', e.target.checked.toString())}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>
        {settings['site.maintenanceMode'] === 'true' && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-400 mb-1">Bakım Mesajı</label>
            <textarea
              value={settings['site.maintenanceMessage'] || ''}
              onChange={(e) => handleChange('site.maintenanceMessage', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-dark-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-blue-400 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Stripe Ayarları
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Secret Key</label>
            <input
              type="password"
              value={settings['payment.stripeSecretKey'] || ''}
              onChange={(e) => handleChange('payment.stripeSecretKey', e.target.value)}
              className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="sk_live_..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Public Key</label>
            <input
              type="text"
              value={settings['payment.stripePublicKey'] || ''}
              onChange={(e) => handleChange('payment.stripePublicKey', e.target.value)}
              className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="pk_live_..."
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-purple-400 mb-4 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> PayPal Ayarları
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client ID</label>
            <input
              type="text"
              value={settings['payment.paypalClientId'] || ''}
              onChange={(e) => handleChange('payment.paypalClientId', e.target.value)}
              className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Client Secret</label>
            <input
              type="password"
              value={settings['payment.paypalClientSecret'] || ''}
              onChange={(e) => handleChange('payment.paypalClientSecret', e.target.value)}
              className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Para Birimi</label>
          <select
            value={settings['payment.currency'] || 'USD'}
            onChange={(e) => handleChange('payment.currency', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="TRY">TRY (₺)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Komisyon Oranı (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={settings['payment.commissionRate'] || '0'}
            onChange={(e) => handleChange('payment.commissionRate', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Çekim ($)</label>
          <input
            type="number"
            min="1"
            value={settings['payment.minWithdrawal'] || '50'}
            onChange={(e) => handleChange('payment.minWithdrawal', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
    </div>
  );

  const renderUserSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-dark-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">E-posta Doğrulama</h4>
              <p className="text-xs text-gray-400 mt-1">Kullanıcıların e-posta doğrulaması zorunlu olsun</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings['user.requireEmailVerification'] === 'true'}
                onChange={(e) => handleChange('user.requireEmailVerification', e.target.checked.toString())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>

        <div className="p-4 bg-dark-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Yeni Kayıtlar</h4>
              <p className="text-xs text-gray-400 mt-1">Yeni kullanıcı kaydı açık olsun</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings['user.allowRegistration'] === 'true'}
                onChange={(e) => handleChange('user.allowRegistration', e.target.checked.toString())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>

        <div className="p-4 bg-dark-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Sosyal Giriş</h4>
              <p className="text-xs text-gray-400 mt-1">Google/GitHub ile giriş aktif olsun</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings['user.enableSocialLogin'] === 'true'}
                onChange={(e) => handleChange('user.enableSocialLogin', e.target.checked.toString())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Varsayılan Kredi Miktarı</label>
          <input
            type="number"
            min="0"
            value={settings['user.defaultCredits'] || '3'}
            onChange={(e) => handleChange('user.defaultCredits', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Yeni kayıt olan kullanıcıya verilecek kredi</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ücretsiz Plan Kredisi</label>
          <input
            type="number"
            min="0"
            value={settings['user.freePlanCredits'] || '3'}
            onChange={(e) => handleChange('user.freePlanCredits', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Ücretsiz plan kullanıcısının aylık kredisi</p>
        </div>
      </div>
    </div>
  );

  const renderProjectSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-dark-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Otomatik Onay</h4>
              <p className="text-xs text-gray-400 mt-1">Projeler otomatik onaylansın</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings['project.autoApprove'] === 'true'}
                onChange={(e) => handleChange('project.autoApprove', e.target.checked.toString())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>

        <div className="p-4 bg-dark-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Halka Açık Projeler</h4>
              <p className="text-xs text-gray-400 mt-1">Kullanıcılar projelerini herkese açabilsin</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings['project.allowPublicProjects'] === 'true'}
                onChange={(e) => handleChange('project.allowPublicProjects', e.target.checked.toString())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>

        <div className="p-4 bg-dark-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-white">Versiyonlama</h4>
              <p className="text-xs text-gray-400 mt-1">Proje geçmişi kaydı tutulsun</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings['project.enableVersioning'] === 'true'}
                onChange={(e) => handleChange('project.enableVersioning', e.target.checked.toString())}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Kullanıcı Başına Maksimum Proje</label>
        <input
          type="number"
          min="1"
          max="1000"
          value={settings['project.maxProjectsPerUser'] || '10'}
          onChange={(e) => handleChange('project.maxProjectsPerUser', e.target.value)}
          className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <p className="text-xs text-gray-500 mt-1">Bir kullanıcının oluşturabileceği maksimum proje sayısı</p>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      {['welcome', 'payment', 'resetPassword'].map((type) => (
        <div key={type} className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-sm font-medium text-blue-400 mb-4">
            {type === 'welcome' && 'Hoş Geldin E-postası'}
            {type === 'payment' && 'Ödeme Onay E-postası'}
            {type === 'resetPassword' && 'Şifre Sıfırlama E-postası'}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Konu</label>
              <input
                type="text"
                value={settings[`email.${type}Subject`] || ''}
                onChange={(e) => handleChange(`email.${type}Subject`, e.target.value)}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">İçerik</label>
              <textarea
                value={settings[`email.${type}Body`] || ''}
                onChange={(e) => handleChange(`email.${type}Body`, e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Değişkenler: {"{{name}}"}, {"{{email}}"}, {"{{amount}}"}, {"{{link}}"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Maksimum Giriş Denemesi</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings['security.maxLoginAttempts'] || '5'}
            onChange={(e) => handleChange('security.maxLoginAttempts', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Hesap kilitlenmeden önceki başarısız giriş denemesi</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Şifre Uzunluğu</label>
          <input
            type="number"
            min="6"
            max="32"
            value={settings['security.passwordMinLength'] || '8'}
            onChange={(e) => handleChange('security.passwordMinLength', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Oturum Süresi (saat)</label>
          <input
            type="number"
            min="1"
            max="720"
            value={settings['security.sessionTimeout'] || '24'}
            onChange={(e) => handleChange('security.sessionTimeout', e.target.value)}
            className="w-full px-4 py-2 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">Oturumun otomatik kapanma süresi</p>
        </div>
      </div>

      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Güvenlik Uyarısı
        </h4>
        <p className="text-sm text-gray-400">
          Bu ayarlar uygulamanızın güvenliğini doğrudan etkiler. Değişiklik yapmadan önce etkilerini anladığınızdan emin olun.
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-gray-800">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-500/10 rounded-lg">
                <Settings className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Site Ayarları</h1>
                <p className="text-gray-400 text-sm mt-1">Platformunuzu yönetin ve yapılandırın</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-yellow-500 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Kaydedilmemiş değişiklikler
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === 'success'
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-800 rounded-xl p-6 border border-gray-700"
          >
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'payment' && renderPaymentSettings()}
            {activeTab === 'user' && renderUserSettings()}
            {activeTab === 'project' && renderProjectSettings()}
            {activeTab === 'email' && renderEmailSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
          </motion.div>

          {/* Cache Clear Info */}
          <div className="mt-6 p-4 bg-dark-800/50 rounded-lg border border-gray-700/50">
            <div className="flex items-start gap-3">
              <RefreshCw className="w-5 h-5 text-primary-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-white">Otomatik Cache Temizleme</h4>
                <p className="text-sm text-gray-400 mt-1">
                  Ayarlar kaydedildiğinde uygulama cache'i otomatik olarak temizlenir ve yeni ayarlar anında tüm kullanıcılara yansır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
