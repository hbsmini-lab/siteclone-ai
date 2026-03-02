"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Sparkles,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { t, language, setLanguage } = useTranslation();

  return (<nav className="fixed top-0 left-0 right-0 z-50 glass">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">
            SiteClone<span className="text-primary-400">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-dark-100 hover:text-white transition-colors text-sm font-medium">
            {t.nav.features}
          </Link>
          <Link href="#how-it-works" className="text-dark-100 hover:text-white transition-colors text-sm font-medium">
            {t.nav.howItWorks}
          </Link>
          <Link href="#pricing" className="text-dark-100 hover:text-white transition-colors text-sm font-medium">
            {t.nav.pricing}
          </Link>
          <button
            onClick={() => setLanguage(language === "en" ? "tr" : "en")}
            className="flex items-center gap-2 text-dark-100 hover:text-white transition-colors text-sm font-medium"
          >
            <Globe className="w-4 h-4" />
            {language === "en" ? "TR" : "EN"}
          </button>
          <ThemeToggle />
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="btn-primary flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              {t.dashboard.header.dashboard}
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">
                {t.nav.login}
              </Link>
              <Link href="/auth/register" className="btn-primary">
                {t.nav.register}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {mobileMenuOpen && (
      <div className="md:hidden bg-dark-700 border-t border-dark-500 animate-slide-down">
        <div className="px-4 py-4 space-y-3">
          <Link href="#features" className="block text-dark-100 hover:text-white py-2">
            {t.nav.features}
          </Link>
          <Link href="#how-it-works" className="block text-dark-100 hover:text-white py-2">
            {t.nav.howItWorks}
          </Link>
          <Link href="#pricing" className="block text-dark-100 hover:text-white py-2">
            {t.nav.pricing}
          </Link>
          <button
            onClick={() => setLanguage(language === "en" ? "tr" : "en")}
            className="flex items-center gap-2 text-dark-100 hover:text-white py-2 w-full"
          >
            <Globe className="w-4 h-4" />
            {language === "en" ? "Türkçe" : "English"}
          </button>
          <div className="flex items-center justify-between py-2">
            <span className="text-dark-100">Theme</span>
            <ThemeToggle />
          </div>
          <div className="pt-3 border-t border-dark-500 space-y-2">
            {session ? (
              <Link href="/dashboard" className="btn-primary block text-center">
                {t.dashboard.header.dashboard}
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="btn-ghost block text-center">
                  {t.nav.login}
                </Link>
                <Link href="/auth/register" className="btn-primary block text-center">
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )}
  </nav>
  );
}
