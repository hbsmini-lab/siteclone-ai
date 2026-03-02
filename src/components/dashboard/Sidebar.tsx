"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  LayoutDashboard,
  Globe,
  FolderOpen,
  CreditCard,
  Settings,
  Shield,
  BarChart3,
  Tag,
  Users,
  Megaphone,
  Zap,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
  Palette,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { t } = useTranslation();
  const isAdmin = (session?.user as any)?.role === "admin";

  const userMenuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.dashboard.sidebar.items.dashboard },
    { href: "/dashboard/clone", icon: Globe, label: t.dashboard.sidebar.items.clone },
    { href: "/dashboard/themes", icon: Palette, label: "Hazır Temalar" },
    { href: "/dashboard/projects", icon: FolderOpen, label: t.dashboard.sidebar.items.projects },
    { href: "/dashboard/credits", icon: CreditCard, label: t.dashboard.sidebar.items.credits },
    { href: "/dashboard/settings", icon: Settings, label: "Kullanıcı Ayarları" },
  ];

  const adminMenuItems = [
    { href: "/dashboard/admin", icon: Shield, label: "Admin Panel" },
    { href: "/dashboard/admin/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/admin/users", icon: Users, label: "Users" },
    { href: "/dashboard/admin/projects", icon: Package, label: "Projects" },
    { href: "/dashboard/admin/payments", icon: DollarSign, label: "Payments" },
    { href: "/dashboard/admin/packages", icon: Tag, label: "Packages" },
    { href: "/dashboard/admin/campaigns", icon: Megaphone, label: "Campaigns" },
    { href: "/dashboard/admin/features", icon: Zap, label: "Features" },
    { href: "/dashboard/admin/settings", icon: Settings, label: "Site Ayarları" },
  ];

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-card border-r border-border flex flex-col transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted hover:text-foreground transition-colors z-10"
      >
        {sidebarOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Logo */}
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <span className="text-xl font-bold text-foreground">
              SiteClone<span className="text-primary-400">AI</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* User Menu */}
        {sidebarOpen && (
          <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 py-2">
            {t.dashboard.sidebar.userMenu}
          </p>
        )}
        {userMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary-600/10 text-primary-400 border border-primary-500/20"
                  : "text-muted hover:text-foreground hover:bg-accent"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-400" : ""}`} />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Admin Menu */}
        {isAdmin && (
          <>
            {sidebarOpen && (
              <p className="text-xs font-semibold text-muted uppercase tracking-wider px-3 py-2 mt-6">
                {t.dashboard.sidebar.adminMenu}
              </p>
            )}
            {adminMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary-600/10 text-primary-400 border border-primary-500/20"
                  : "text-muted hover:text-foreground hover:bg-accent"
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary-400" : ""}`} />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </>
        )}
      </nav>
    </aside>
  );
}
