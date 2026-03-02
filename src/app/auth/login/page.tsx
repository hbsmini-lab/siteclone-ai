"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t.auth.login.success);
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error(t.auth.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (<div className="min-h-screen bg-dark-900 flex">
    {/* Left Side - Form */}
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            SiteClone<span className="text-primary-400">AI</span>
          </span>
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">{t.auth.login.title}</h1>
        <p className="text-dark-200 mb-8">
          {t.auth.login.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-100 mb-2">
              {t.auth.login.email}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-dark-100">
                {t.auth.login.password}
              </label>
              <Link href="/auth/forgot-password" className="text-sm text-primary-400 hover:text-primary-300">
                {t.auth.login.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-300 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (<Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg font-semibold group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {t.auth.login.button}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-dark-200">
          {t.auth.login.noAccount}{" "}
          <Link
            href="/auth/register"
            className="text-primary-400 hover:text-primary-300 font-medium"
          >
            {t.auth.login.registerLink}
          </Link>
        </p>
      </div>
    </div>

    {/* Right Side - Decorative */}
    <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary-600/20 via-dark-800 to-purple-600/20 border-l border-dark-600">
      <div className="max-w-md text-center px-8">
        <div className="w-20 h-20 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-8">
          <Sparkles className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">
          {t.auth.register.decorative.title}
        </h2>
        <p className="text-dark-100 leading-relaxed">
          {t.auth.register.decorative.subtitle}
        </p>
      </div>
    </div>
  </div>
  );
}
