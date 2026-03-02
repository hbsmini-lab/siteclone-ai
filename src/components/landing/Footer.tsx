"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark-800 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                SiteClone<span className="text-primary-400">AI</span>
              </span>
            </Link>
            <p className="text-dark-200 text-sm leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-dark-200 hover:text-primary-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.product}</h3>
            <ul className="space-y-3">
              <li><Link href="#features" className="text-dark-200 hover:text-white text-sm transition-colors">{t.nav.features}</Link></li>
              <li><Link href="#pricing" className="text-dark-200 hover:text-white text-sm transition-colors">{t.nav.pricing}</Link></li>
              <li><Link href="/templates" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.templates}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.api}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.changelog}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.company}</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.about}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.blog}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.careers}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.contact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.legal}</h3>
            <ul className="space-y-3">
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.privacy}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.terms}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.cookie}</Link></li>
              <li><Link href="#" className="text-dark-200 hover:text-white text-sm transition-colors">{t.footer.links.gdpr}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-300 text-sm">
            © {new Date().getFullYear()} SiteClone AI. {t.footer.rights}
          </p>
          <p className="text-dark-300 text-sm">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
