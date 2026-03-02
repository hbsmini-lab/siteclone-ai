"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  User,
  Settings,
  LogOut,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-6">
      {/* Left side - empty */}
      <div className="flex-1 max-w-md"></div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-dark-200 hover:text-white hover:bg-dark-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Credits Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5">
          <CreditCard className="w-4 h-4 text-primary-400" />
          <span className="text-sm font-medium text-white">
            {(session?.user as any)?.credits || 0}
          </span>
          <span className="text-xs text-dark-300">{t.dashboard.header.credits}</span>
        </div>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 text-sm font-semibold">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-white">
                {session?.user?.name || t.dashboard.page.welcome}
              </p>
              <p className="text-xs text-dark-300">
                {(session?.user as any)?.plan || "Free"} {t.dashboard.page.stats.currentPlan}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-dark-300 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-dark-700 border border-dark-500 rounded-xl shadow-xl py-2 animate-slide-down z-50">
              <div className="px-4 py-2 border-b border-dark-500">
                <p className="text-sm font-medium text-white">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-dark-300">{session?.user?.email}</p>
              </div>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-dark-600 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="w-4 h-4" />
                {t.dashboard.header.profile}
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-dark-600 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                {t.dashboard.sidebar.items.settings}
              </Link>
              <div className="border-t border-dark-500 my-1" />
              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-dark-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t.dashboard.header.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
