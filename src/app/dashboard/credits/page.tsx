"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  CreditCard,
  Check,
  Zap,
  Crown,
  Rocket,
  Star,
  Gift,
  Loader2,
  Tag,
  Coins,
} from "lucide-react";

import { useTranslation } from "@/lib/hooks/useTranslation";

const creditPacks = [
  { credits: 5, price: 4.99 },
  { credits: 15, price: 12.99 },
  { credits: 30, price: 22.99 },
  { credits: 100, price: 59.99 },
];

export default function CreditsPage() {
  const { t } = useTranslation();
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [couponCode, setCouponCode] = useState("");

  const packages = [
    {
      id: "starter",
      name: t.dashboard.credits.packages.starter.name,
      price: 9,
      credits: 10,
      icon: Zap,
      color: "blue",
      features: t.dashboard.credits.packages.starter.features,
    },
    {
      id: "pro",
      name: t.dashboard.credits.packages.pro.name,
      price: 29,
      credits: 50,
      icon: Crown,
      color: "primary",
      popular: true,
      features: t.dashboard.credits.packages.pro.features,
    },
    {
      id: "enterprise",
      name: t.dashboard.credits.packages.enterprise.name,
      price: 99,
      credits: 999,
      icon: Rocket,
      color: "purple",
      features: t.dashboard.credits.packages.enterprise.features,
    },
  ];

  const handlePurchase = async (packageName: string, price: number) => {
    setLoading(packageName);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName, amount: price, couponCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`${packageName} plan activated!`);
      await update();
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Payment failed");
    } finally {
      setLoading(null);
    }
  };

  const handleBuyCredits = async (credits: number, price: number) => {
    setLoading(`credits-${credits}`);
    try {
      const res = await fetch("/api/payments/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits, amount: price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`${credits} credits added!`);
      await update();
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Purchase failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{t.dashboard.credits.title}</h1>
        <p className="text-dark-200">{t.dashboard.credits.subtitle}</p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{(session?.user as any)?.credits || 0}</p>
              <p className="text-xs text-dark-300">{t.dashboard.credits.status.available}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white capitalize">{(session?.user as any)?.plan || "Free"}</p>
              <p className="text-xs text-dark-300">{t.dashboard.credits.status.currentPlan}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
              <Gift className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{t.dashboard.credits.status.coupon}</p>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-dark-600 border border-dark-400 rounded-lg px-3 py-1 text-xs text-white w-28"
                  placeholder={t.dashboard.credits.status.codePlaceholder}
                />
                <button className="text-xs text-primary-400 hover:text-primary-300">{t.dashboard.credits.status.apply}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Plans Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-primary-400" />
          Aylık Planlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 ${pkg.popular ? "bg-gradient-to-b from-primary-600/20 to-dark-700 border-2 border-primary-500 shadow-xl shadow-primary-600/20" : "card"}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-medium">
                  {t.dashboard.credits.packages.popular}
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-600/10 flex items-center justify-center">
                  <pkg.icon className="w-5 h-5 text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-white">${pkg.price}</span>
                <span className="text-dark-300 text-sm">/month</span>
              </div>
              <p className="text-sm text-primary-400 mb-6">{pkg.credits} {t.dashboard.credits.packs.title}</p>
              <ul className="space-y-2.5 mb-6">
                {pkg.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-dark-100">
                    <Check className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePurchase(pkg.name, pkg.price)}
                disabled={loading === pkg.name}
                className={`w-full py-3 rounded-xl font-medium transition-all ${pkg.popular ? "btn-primary" : "btn-secondary"}`}
              >
                {loading === pkg.name ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  "Satın Al"
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packs Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-400" />
          Kredi Satın Al
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {creditPacks.map((pack) => (
            <div key={pack.credits} className="card text-center">
              <div className="w-12 h-12 rounded-xl bg-yellow-600/10 flex items-center justify-center mx-auto mb-3">
                <Coins className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{pack.credits}</p>
              <p className="text-sm text-dark-300 mb-3">Kredi</p>
              <p className="text-lg font-semibold text-primary-400 mb-4">${pack.price}</p>
              <button
                onClick={() => handleBuyCredits(pack.credits, pack.price)}
                disabled={loading === `credits-${pack.credits}`}
                className="w-full btn-secondary text-sm py-2"
              >
                {loading === `credits-${pack.credits}` ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  t.dashboard.credits.packs.buyNow
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
