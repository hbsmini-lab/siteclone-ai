"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Users,
  CreditCard,
  Globe,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { useTranslation } from "@/lib/hooks/useTranslation";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalRevenue: 0,
    activeUsers: 0,
    newUsersToday: 0,
    clonesToday: 0,
  });

  useEffect(() => {
    // Fetch admin stats
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => { });
  }, []);

  const statCards = [
    {
      label: t.dashboard.admin.stats.totalUsers,
      value: stats.totalUsers,
      icon: Users,
      change: "+12%",
      up: true,
      color: "blue",
    },
    {
      label: t.dashboard.admin.stats.totalProjects,
      value: stats.totalProjects,
      icon: Globe,
      change: "+8%",
      up: true,
      color: "green",
    },
    {
      label: t.dashboard.admin.stats.revenue,
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+23%",
      up: true,
      color: "purple",
    },
    {
      label: t.dashboard.admin.stats.activeUsers,
      value: stats.activeUsers,
      icon: Activity,
      change: "-3%",
      up: false,
      color: "orange",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{t.dashboard.admin.title}</h1>
        <p className="text-dark-200 mt-1">
          {t.dashboard.admin.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-${stat.color}-400/10 flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-400" : "text-red-400"
                  }`}
              >
                {stat.up ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-dark-200 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t.dashboard.admin.today.title}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-dark-600">
              <span className="text-dark-200">{t.dashboard.admin.today.newUsers}</span>
              <span className="text-white font-semibold">{stats.newUsersToday}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-dark-600">
              <span className="text-dark-200">{t.dashboard.admin.today.clonesMade}</span>
              <span className="text-white font-semibold">{stats.clonesToday}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-dark-200">{t.dashboard.admin.today.revenueToday}</span>
              <span className="text-white font-semibold">$0</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t.dashboard.admin.recent.title}
          </h2>
          <div className="space-y-3">
            {[
              { text: t.dashboard.admin.recent.userRegistered, time: "2 min ago", type: "user" },
              { text: t.dashboard.admin.recent.siteCloned, time: "5 min ago", type: "clone" },
              { text: t.dashboard.admin.recent.paymentReceived, time: "12 min ago", type: "payment" },
              { text: t.dashboard.admin.recent.projectPublished, time: "1 hour ago", type: "publish" },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2 border-b border-dark-600 last:border-0"
              >
                <div
                  className={`w-2 h-2 rounded-full ${activity.type === "user"
                      ? "bg-blue-400"
                      : activity.type === "clone"
                        ? "bg-green-400"
                        : activity.type === "payment"
                          ? "bg-purple-400"
                          : "bg-orange-400"
                    }`}
                />
                <span className="text-sm text-dark-100 flex-1">
                  {activity.text}
                </span>
                <span className="text-xs text-dark-300">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
