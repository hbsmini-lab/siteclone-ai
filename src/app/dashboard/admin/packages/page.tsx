"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  CreditCard,
  Check,
  Loader2,
  Star,
  DollarSign,
} from "lucide-react";

interface PackageData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  credits: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  duration: number;
}

const defaultPackages: PackageData[] = [
  {
    name: "Starter",
    slug: "starter",
    description: "Başlangıç için ideal",
    price: 9,
    credits: 10,
    features: [
      "10 Website Klonlama",
      "Temel Görsel Editör",
      "HTML/CSS Export",
      "Email Desteği",
      "1 Yayınlanmış Site",
    ],
    isPopular: false,
    isActive: true,
    duration: 30,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "Profesyoneller için",
    price: 29,
    credits: 50,
    features: [
      "50 Website Klonlama",
      "Gelişmiş Görsel Editör",
      "Tüm Export Formatları",
      "Öncelikli Destek",
      "10 Yayınlanmış Site",
      "Özel Domain",
      "Versiyon Geçmişi",
    ],
    isPopular: true,
    isActive: true,
    duration: 30,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "Ekipler ve ajanslar için",
    price: 99,
    credits: 999,
    features: [
      "Sınırsız Klonlama",
      "Tam Editör Suiti",
      "API Erişimi",
      "7/24 Destek",
      "Sınırsız Site",
      "Özel Domain",
      "Beyaz Etiket",
      "Ekip İşbirliği",
    ],
    isPopular: false,
    isActive: true,
    duration: 30,
  },
];

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PackageData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || defaultPackages);
      } else {
        setPackages(defaultPackages);
      }
    } catch (error) {
      setPackages(defaultPackages);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pkg: PackageData) => {
    try {
      const res = await fetch("/api/admin/packages", {
        method: pkg.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pkg),
      });

      if (!res.ok) throw new Error("Failed to save package");

      toast.success(pkg.id ? "Paket güncellendi" : "Paket oluşturuldu");
      setEditing(null);
      setIsCreating(false);
      fetchPackages();
    } catch (error) {
      toast.error("Paket kaydedilemedi");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/packages?slug=${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete package");

      toast.success("Paket silindi");
      fetchPackages();
    } catch (error) {
      toast.error("Paket silinemedi");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Paketler</h1>
          <p className="text-dark-200">Fiyatlandırma paketlerini yönetin</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yeni Paket
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.slug}
            className={`card relative overflow-hidden ${
              pkg.isPopular ? "border-primary-500 shadow-lg shadow-primary-600/10" : ""
            }`}
          >
            {pkg.isPopular && (
              <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 rounded-bl-lg text-xs font-medium">
                Popüler
              </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-400" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(pkg)}
                  className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.slug)}
                  className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
            <p className="text-dark-200 text-sm mb-4">{pkg.description}</p>

            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-3xl font-bold text-white">${pkg.price}</span>
              <span className="text-dark-200">/{pkg.duration} gün</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-primary-400 mb-4">
              <CreditCard className="w-4 h-4" />
              <span>{pkg.credits} Kredi</span>
            </div>

            <ul className="space-y-2">
              {pkg.features.slice(0, 5).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-dark-200">
                  <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
              {pkg.features.length > 5 && (
                <li className="text-sm text-dark-300">+{pkg.features.length - 5} daha...</li>
              )}
            </ul>

            {!pkg.isActive && (
              <div className="mt-4 px-3 py-1 bg-red-500/10 text-red-400 text-sm rounded-lg inline-block">
                Pasif
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editing) && (
        <PackageModal
          pkg={editing}
          onClose={() => {
            setEditing(null);
            setIsCreating(false);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Package Modal Component
function PackageModal({
  pkg,
  onClose,
  onSave,
}: {
  pkg: PackageData | null;
  onClose: () => void;
  onSave: (pkg: PackageData) => void;
}) {
  const [formData, setFormData] = useState<PackageData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    credits: 0,
    features: [],
    isPopular: false,
    isActive: true,
    duration: 30,
  });
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    if (pkg) {
      setFormData(pkg);
    }
  }, [pkg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {pkg ? "Paket Düzenle" : "Yeni Paket"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-200 mb-2">Paket Adı</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-dark-200 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })
                }
                className="input-field"
                required
                disabled={!!pkg}
              />
            </div>

            <div>
              <label className="block text-sm text-dark-200 mb-2">Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-dark-200 mb-2">Fiyat ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-200 mb-2">Kredi</label>
                <input
                  type="number"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-dark-200 mb-2">Süre (gün)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="input-field"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-dark-200 mb-2">Özellikler</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Özellik ekle..."
                />
                <button type="button" onClick={addFeature} className="btn-secondary">
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-dark-700 rounded-full text-sm text-white flex items-center gap-2"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-dark-300 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600"
                />
                <span className="text-dark-200">Popüler</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-dark-600"
                />
                <span className="text-dark-200">Aktif</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                İptal
              </button>
              <button type="submit" className="btn-primary flex-1">
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
