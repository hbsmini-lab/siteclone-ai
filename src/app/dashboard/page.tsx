"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Globe,
  FolderOpen,
  CreditCard,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
  Zap,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { useTranslation } from "@/lib/hooks/useTranslation";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const user = session?.user as any;
  const [stats, setStats] = useState({ projects: 0, activities: 0 });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          const projects = data.projects || [];
          setStats({ projects: projects.length, activities: projects.length });
          setRecentProjects(projects.slice(0, 3));
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const quickStats = [
    {
      label: t.dashboard.page.stats.totalProjects,
      value: loading ? "..." : stats.projects,
      icon: FolderOpen,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: t.dashboard.page.stats.remainingCredits,
      value: user?.role === "admin" ? "∞" : (user?.credits || 0),
      icon: CreditCard,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      label: t.dashboard.page.stats.currentPlan,
      value: user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1) || "Free",
      icon: Zap,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: t.dashboard.page.stats.thisMonth,
      value: loading ? "..." : `${stats.activities} ${t.dashboard.page.stats.clones}`,
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {t.dashboard.page.welcome}, {user?.name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-dark-200 mt-1">
            {t.dashboard.page.subtitle}
          </p>
        </div>
        <Link
          href="/dashboard/clone"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t.dashboard.page.newClone}
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-dark-200 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clone Website Card */}
        <div className="card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-dark-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {t.dashboard.page.actions.cloneTitle}
          </h3>
          <p className="text-dark-200 text-sm mb-4">
            {t.dashboard.page.actions.cloneDesc}
          </p>
          <Link
            href="/dashboard/clone"
            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
          >
            {t.dashboard.page.actions.cloneCta} →
          </Link>
        </div>

        {/* My Projects Card */}
        <div className="card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-600/10 border border-green-500/20 flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-green-400" />
            </div>
            <ArrowRight className="w-5 h-5 text-dark-300 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {t.dashboard.page.actions.projectsTitle}
          </h3>
          <p className="text-dark-200 text-sm mb-4">
            {t.dashboard.page.actions.projectsDesc}
          </p>
          <Link
            href="/dashboard/projects"
            className="text-green-400 hover:text-green-300 text-sm font-medium"
          >
            {t.dashboard.page.actions.projectsCta} →
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">{t.dashboard.page.recent.title}</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-primary-400 hover:text-primary-300"
          >
            {t.dashboard.page.recent.viewAll}
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-dark-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-dark-200 mb-2">
              {t.dashboard.page.recent.noActivity}
            </h3>
            <p className="text-dark-300 text-sm mb-6">
              {t.dashboard.page.recent.noActivityDesc}
            </p>
            <Link href="/dashboard/clone" className="btn-primary inline-flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t.dashboard.page.recent.firstSiteCta}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project: any) => (
              <Link key={project.id} href={`/dashboard/editor/${project.id}`} className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50 hover:bg-dark-600/50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-600/10 flex items-center justify-center overflow-hidden">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Globe className="w-5 h-5 text-primary-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{project.name}</p>
                    <p className="text-xs text-dark-300">{project.sourceUrl || t.dashboard.page.recent.generatedByAi}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-dark-400 group-hover:text-primary-400 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
