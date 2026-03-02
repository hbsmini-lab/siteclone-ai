"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  BarChart3,
  TrendingUp,
  Users,
  CreditCard,
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

interface AnalyticsData {
  totalUsers: number;
  totalProjects: number;
  totalPayments: number;
  totalCredits: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeProjects: number;
  revenueThisMonth: number;
  topPlans: { name: string; count: number }[];
  dailyStats: { date: string; users: number; projects: number; payments: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) throw new Error("Failed to load analytics");
      const analyticsData = await res.json();
      setData(analyticsData);
    } catch (error) {
      toast.error("Analytics yüklenemedi");
    } finally {
      setLoading(false);
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-dark-200">Platform istatistikleri ve performans metrikleri</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={data?.totalUsers || 0}
          icon={Users}
          trend={data?.newUsersThisMonth || 0}
          trendLabel="bu ay"
          color="blue"
        />
        <StatCard
          title="Toplam Proje"
          value={data?.totalProjects || 0}
          icon={Globe}
          trend={data?.activeProjects || 0}
          trendLabel="aktif"
          color="green"
        />
        <StatCard
          title="Toplam Gelir"
          value={`$${data?.revenueThisMonth || 0}`}
          icon={CreditCard}
          trend={data?.totalPayments || 0}
          trendLabel="ödeme"
          color="purple"
        />
        <StatCard
          title="Kredi Kullanımı"
          value={data?.totalCredits || 0}
          icon={BarChart3}
          trend={0}
          trendLabel="toplam"
          color="yellow"
        />
      </div>

      {/* Daily Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Günlük Aktivite</h3>
          <div className="space-y-3">
            {data?.dailyStats?.slice(-7).map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-dark-300" />
                  <span className="text-sm text-white">{new Date(stat.date).toLocaleDateString("tr-TR")}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-blue-400">+{stat.users} kullanıcı</span>
                  <span className="text-green-400">+{stat.projects} proje</span>
                  <span className="text-purple-400">+{stat.payments} ödeme</span>
                </div>
              </div>
            )) || <p className="text-dark-300">Veri bulunamadı</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Popüler Paketler</h3>
          <div className="space-y-3">
            {data?.topPlans?.map((plan, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400 font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-white capitalize">{plan.name}</span>
                </div>
                <span className="text-sm text-dark-300">{plan.count} kullanıcı</span>
              </div>
            )) || <p className="text-dark-300">Veri bulunamadı</p>}
          </div>
        </div>
      </div>

      {/* New Users Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Yeni Kullanıcılar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-dark-700/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-white mb-1">{data?.newUsersToday || 0}</p>
            <p className="text-sm text-dark-300">Bugün</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-white mb-1">{data?.newUsersThisWeek || 0}</p>
            <p className="text-sm text-dark-300">Bu Hafta</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-white mb-1">{data?.newUsersThisMonth || 0}</p>
            <p className="text-sm text-dark-300">Bu Ay</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend: number;
  trendLabel: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-600/20 text-blue-400",
    green: "bg-green-600/20 text-green-400",
    purple: "bg-purple-600/20 text-purple-400",
    yellow: "bg-yellow-600/20 text-yellow-400",
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        {trend > 0 ? (
          <ArrowUpRight className="w-4 h-4 text-green-400" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-dark-300" />
        )}
        <span className="text-sm text-dark-300">
          {trend} {trendLabel}
        </span>
      </div>
    </div>
  );
}
