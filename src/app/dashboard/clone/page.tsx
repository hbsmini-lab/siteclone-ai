"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Globe,
  Loader2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  X,
  Lightbulb,
  Settings,
  Wand2,
} from "lucide-react";

import { useTranslation } from "@/lib/hooks/useTranslation";

// AI Suggestions data
const aiSuggestions = [
  "Modern e-commerce website with product carousel",
  "Minimalist portfolio for a photographer",
  "SaaS landing page with pricing tables",
  "Restaurant website with menu and reservation",
  "Blog platform with dark mode support",
  "Real estate listing website with map integration",
  "Fitness trainer website with booking system",
  "Online course platform with video player",
];

export default function ClonePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [url, setUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isUrlMode, setIsUrlMode] = useState(true);

  // Load prompt from localStorage on mount
  useEffect(() => {
    const savedPrompt = localStorage.getItem("clonePrompt");
    if (savedPrompt) {
      setUrl(savedPrompt);
      localStorage.removeItem("clonePrompt");
    }
  }, []);

  // Handle AI Suggestion click
  const handleAiSuggestion = (suggestion: string) => {
    setUrl(suggestion);
    setShowAiSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleClone = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error(t.dashboard.clone.status.urlError);
      return;
    }

    setLoading(true);
    setProgress(1);
    setStatus(t.dashboard.clone.status.analyzing);

    try {
      // Start API call
      const clonePromise = fetch("/api/projects/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          name: projectName || (url.startsWith("http") ? new URL(url).hostname : "My Project"),
        }),
      });

      // Linear proportional progress from 1 to 100
      // Estimated total time: 45 seconds, each percentage waits proportionally
      const estimatedTotalTime = 45000; // 45 seconds in ms
      const stepDelay = estimatedTotalTime / 100; // ~450ms per percentage
      let currentProgress = 1;
      
      const progressInterval = setInterval(() => {
        currentProgress += 1;
        setProgress(currentProgress);
        
        // Update status messages based on progress ranges
        if (currentProgress < 20) {
          setStatus(t.dashboard.clone.status.fetching);
        } else if (currentProgress < 40) {
          setStatus(t.dashboard.clone.status.html);
        } else if (currentProgress < 60) {
          setStatus(t.dashboard.clone.status.styles);
        } else if (currentProgress < 80) {
          setStatus(t.dashboard.clone.status.optimizing);
        } else if (currentProgress < 100) {
          setStatus(t.dashboard.clone.status.finalizing);
        }
        
        // Stop at 99 until API completes
        if (currentProgress >= 99) {
          clearInterval(progressInterval);
        }
      }, stepDelay);

      const res = await clonePromise;
      clearInterval(progressInterval);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.dashboard.clone.status.error);
      }

      setProgress(100);
      setStatus(t.dashboard.clone.status.complete);
      toast.success(t.dashboard.clone.status.success);

      setTimeout(() => {
        router.push(`/dashboard/editor/${data.project.id}`);
      }, 800);
    } catch (error: any) {
      toast.error(error.message || t.dashboard.clone.status.error);
      setProgress(0);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  // Handle Sparkles - Show AI suggestions
  const handleSparklesClick = () => {
    setShowAiSuggestions(!showAiSuggestions);
    setShowAdvancedSettings(false);
  };

  // Handle Wand2 - Show advanced settings
  const handleWand2Click = () => {
    setShowAdvancedSettings(!showAdvancedSettings);
    setShowAiSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">{t.dashboard.clone.title}</h1>
        <p className="text-dark-200">
          {t.dashboard.clone.subtitle}
        </p>
      </div>

      {/* Modern AI-Style Prompt Input */}
      <div className="card mb-8">
        <form onSubmit={handleClone}>
          <div className="relative group">
            {/* Soft Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-primary-600/20 rounded-3xl opacity-50 group-hover:opacity-80 transition duration-500 blur-md"></div>
            
            {/* Main Input Container */}
            <div className="relative bg-dark-800/80 backdrop-blur-sm rounded-3xl p-6">
              {/* Text Area */}
              <textarea
                ref={textareaRef}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={isUrlMode ? "Enter website URL to clone..." : "Describe the website you want to create..."}
                rows={4}
                className="w-full bg-transparent text-white placeholder-gray-500 outline-none text-lg resize-none"
                disabled={loading}
              />
              
              {/* AI Suggestions Popup */}
              {showAiSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-4 bottom-28 bg-dark-800 border border-gray-700 rounded-xl p-3 shadow-xl z-20 w-80"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      AI Suggestions
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowAiSuggestions(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aiSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAiSuggestion(suggestion)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-primary-600/20 hover:text-white rounded-lg transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Advanced Settings Popup */}
              {showAdvancedSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-4 bottom-28 bg-dark-800 border border-gray-700 rounded-xl p-4 shadow-xl z-20 w-80"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary-400" />
                      Advanced Settings
                    </span>
                    <button 
                      type="button"
                      onClick={() => setShowAdvancedSettings(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-dark-100 mb-2">
                        {t.dashboard.clone.form.nameLabel}
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="input-field w-full"
                        placeholder={t.dashboard.clone.form.namePlaceholder}
                        disabled={loading}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="responsive" defaultChecked className="rounded border-gray-700 bg-dark-900" />
                      <label htmlFor="responsive" className="text-sm text-gray-300">Fully Responsive</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="animations" defaultChecked className="rounded border-gray-700 bg-dark-900" />
                      <label htmlFor="animations" className="text-sm text-gray-300">Smooth Animations</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="seo" defaultChecked className="rounded border-gray-700 bg-dark-900" />
                      <label htmlFor="seo" className="text-sm text-gray-300">SEO Optimized</label>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Bottom Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30">
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={handleSparklesClick}
                    className={`p-2 hover:bg-gray-700/30 rounded-lg transition-colors ${showAiSuggestions ? 'text-primary-400 bg-primary-600/20' : 'text-gray-400 hover:text-white'}`}
                    title="AI Suggestions"
                    disabled={loading}
                  >
                    <Sparkles className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsUrlMode(!isUrlMode)}
                    className={`p-2 hover:bg-gray-700/30 rounded-lg transition-colors ${isUrlMode ? 'text-primary-400 bg-primary-600/20' : 'text-gray-400 hover:text-white'}`}
                    title="URL Mode"
                    disabled={loading}
                  >
                    <Globe className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    onClick={handleWand2Click}
                    className={`p-2 hover:bg-gray-700/30 rounded-lg transition-colors ${showAdvancedSettings ? 'text-primary-400 bg-primary-600/20' : 'text-gray-400 hover:text-white'}`}
                    title="Advanced Settings"
                    disabled={loading}
                  >
                    <Wand2 className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm rounded-xl font-medium transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.dashboard.clone.form.cloning}
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      {t.dashboard.clone.form.button}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {loading && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-200 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-400 animate-spin" />
                  {status}
                </span>
                <span className="text-primary-400 font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary-600 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-white mb-1">
                {t.dashboard.clone.tips.supportedTitle}
              </h3>
              <p className="text-xs text-dark-200">
                {t.dashboard.clone.tips.supportedDesc}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-white mb-1">
                {t.dashboard.clone.tips.limitTitle}
              </h3>
              <p className="text-xs text-dark-200">
                {t.dashboard.clone.tips.limitDesc}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
