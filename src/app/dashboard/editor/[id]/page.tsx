"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Save,
  Undo2,
  Redo2,
  Eye,
  Code2,
  Smartphone,
  Tablet,
  Monitor,
  ZoomIn,
  ZoomOut,
  Download,
  Palette,
  Type,
  Image,
  Trash2,
  Copy,
  Move,
  Settings,
  Loader2,
  ArrowLeft,
  Grid3X3,
  Layers,
  MousePointerClick,
  Maximize,
  Minimize,
  Upload,
  X,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useTranslation } from "@/lib/hooks/useTranslation";

export default function EditorPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [viewMode, setViewMode] = useState<"visual" | "code">("visual");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [editPanel, setEditPanel] = useState<"style" | "text" | "layout" | "image" | "move" | null>("style");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  // Project settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectSourceUrl, setProjectSourceUrl] = useState("");
  const [projectThumbnail, setProjectThumbnail] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  // Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${params.id}`);
        if (!res.ok) throw new Error(t.editor.status.projectNotFound);
        const data = await res.json();
        setProject(data.project);
        setHtmlContent(data.project.htmlContent || "");
        setUndoStack([data.project.htmlContent || ""]);
        // Set settings modal initial values
        setProjectName(data.project.name || "");
        setProjectSourceUrl(data.project.sourceUrl || "");
        setProjectThumbnail(data.project.thumbnail || "");
      } catch (error) {
        toast.error(t.editor.status.errorLoad);
        router.push("/dashboard/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [params.id, router]);

  // Update iframe content
  useEffect(() => {
    if (iframeRef.current && htmlContent && viewMode === "visual") {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();

        // Add click handler for element selection
        doc.addEventListener("click", (e) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (target) {
            // Remove previous selection
            doc.querySelectorAll("[data-sc-selected]").forEach((el) => {
              (el as HTMLElement).style.outline = "";
              el.removeAttribute("data-sc-selected");
            });

            // Select new element
            target.style.outline = "2px solid #4c6ef5";
            target.setAttribute("data-sc-selected", "true");

            const computedStyle = window.getComputedStyle(target);
            setSelectedElement({
              tag: target.tagName.toLowerCase(),
              id: target.id,
              classes: Array.from(target.classList).filter(c => !c.startsWith("data-sc")),
              width: target.offsetWidth,
              height: target.offsetHeight,
              color: computedStyle.color,
              backgroundColor: computedStyle.backgroundColor,
              fontSize: computedStyle.fontSize,
              fontFamily: computedStyle.fontFamily.split(",")[0].replace(/['"]/g, ""),
            });
          }
        });

        // Add hover effect
        doc.addEventListener("mouseover", (e) => {
          const target = e.target as HTMLElement;
          if (target && !target.hasAttribute("data-sc-selected")) {
            target.style.outline = "1px dashed #748ffc";
          }
        });

        doc.addEventListener("mouseout", (e) => {
          const target = e.target as HTMLElement;
          if (target && !target.hasAttribute("data-sc-selected")) {
            target.style.outline = "";
          }
        });

        // Enable contenteditable on double click
        doc.addEventListener("dblclick", (e) => {
          const target = e.target as HTMLElement;
          if (target) {
            target.contentEditable = "true";
            target.focus();
            target.addEventListener(
              "blur",
              () => {
                target.contentEditable = "false";
                const newHtml = doc.documentElement.outerHTML;
                pushToUndo(newHtml);
                setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
              },
              { once: true }
            );
          }
        });
      }
    }
  }, [htmlContent, viewMode]);

  const pushToUndo = useCallback((html: string) => {
    setUndoStack((prev) => {
      if (prev[prev.length - 1] === html) return prev;
      return [...prev, html];
    });
    setRedoStack([]);
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleCodeChange = (val: string | undefined) => {
    setHtmlContent(val || "");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushToUndo(val || "");
    }, 1000);
  };

  const handleUndo = () => {
    if (undoStack.length > 1) {
      const current = undoStack[undoStack.length - 1];
      const previous = undoStack[undoStack.length - 2];
      setRedoStack((prev) => [...prev, current]);
      setUndoStack((prev) => prev.slice(0, -1));
      setHtmlContent(previous);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setUndoStack((prev) => [...prev, next]);
      setRedoStack((prev) => prev.slice(0, -1));
      setHtmlContent(next);
    }
  };

  const handleDeleteElement = useCallback(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const selected = doc?.querySelector("[data-sc-selected]");
      if (selected) {
        selected.remove();
        const newHtml = doc?.documentElement.outerHTML || "";
        pushToUndo(newHtml);
        setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
        setSelectedElement(null);
        toast.success(t.editor.status.elementDeleted);
      }
    }
  }, [pushToUndo]);

  const handleDuplicateElement = useCallback(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const selected = doc?.querySelector("[data-sc-selected]");
      if (selected) {
        const clone = selected.cloneNode(true) as HTMLElement;
        clone.style.outline = "";
        clone.removeAttribute("data-sc-selected");
        selected.after(clone);
        const newHtml = doc?.documentElement.outerHTML || "";
        pushToUndo(newHtml);
        setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
        toast.success(t.editor.status.elementCopied);
      }
    }
  }, [pushToUndo]);

  // Handle Image Upload
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && iframeRef.current) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const doc = iframeRef.current?.contentDocument;
        const selected = doc?.querySelector("[data-sc-selected]") as HTMLElement;
        if (selected) {
          if (selected.tagName.toLowerCase() === "img") {
            (selected as HTMLImageElement).src = event.target?.result as string;
          } else {
            const img = doc?.createElement("img");
            if (img) {
              img.src = event.target?.result as string;
              img.style.maxWidth = "100%";
              selected.appendChild(img);
            }
          }
          const newHtml = doc?.documentElement.outerHTML || "";
          pushToUndo(newHtml);
          setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
          toast.success("Resim eklendi!");
        } else {
          toast.error("Önce bir element seçin!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Move Mode
  const handleMoveMode = () => {
    setEditPanel("move");
    toast.success("Taşıma modu aktif! Element sürükleyebilirsiniz.");
  };

  // Update selected element styles
  const updateElementStyle = (property: string, value: string) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const selected = doc?.querySelector("[data-sc-selected]") as HTMLElement;
      if (selected) {
        selected.style[property as any] = value;
        const newHtml = doc?.documentElement.outerHTML || "";
        pushToUndo(newHtml);
        setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
      }
    }
  };

  // Update selected element text
  const updateElementText = (property: string, value: string) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const selected = doc?.querySelector("[data-sc-selected]") as HTMLElement;
      if (selected) {
        selected.style[property as any] = value;
        const newHtml = doc?.documentElement.outerHTML || "";
        pushToUndo(newHtml);
        setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
      }
    }
  };

  // Update layout
  const updateLayout = (property: string, value: string) => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      const selected = doc?.querySelector("[data-sc-selected]") as HTMLElement;
      if (selected) {
        selected.style[property as any] = value;
        const newHtml = doc?.documentElement.outerHTML || "";
        pushToUndo(newHtml);
        setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent }),
      });

      if (!res.ok) throw new Error(t.editor.status.saveError);
      toast.success(t.editor.status.saveSuccess);
    } catch (error) {
      toast.error(t.editor.status.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          sourceUrl: projectSourceUrl,
          thumbnail: projectThumbnail,
        }),
      });

      if (!res.ok) throw new Error("Ayarlar kaydedilemedi");
      
      const data = await res.json();
      setProject(data.project);
      toast.success("Proje ayarları kaydedildi");
      setShowSettingsModal(false);
    } catch (error) {
      toast.error("Ayarlar kaydedilemedi");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.name || "project"}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t.editor.status.exportSuccess);
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-3 text-dark-200">{t.editor.status.loading}</span>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${isFullscreen ? "fixed inset-0 z-[100] bg-dark-900" : "-m-6 h-[calc(100vh-4rem)]"}`}>
      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Toolbar */}
      <div className={`bg-dark-800 border-b border-dark-600 px-4 py-2 flex items-center justify-between ${isFullscreen ? "h-10" : ""}`}>
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <>
              <button
                onClick={() => router.push("/dashboard/projects")}
                className="btn-ghost flex items-center gap-1 text-sm font-inter"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.editor.toolbar.back}
              </button>
              <div className="h-6 w-px bg-dark-500" />
            </>
          )}
          <h2 className="text-sm font-medium text-white truncate max-w-[200px] font-inter">
            {project?.name}
          </h2>
        </div>

        {/* Center Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
            className="p-2 text-dark-200 hover:text-white hover:bg-dark-700 rounded-lg disabled:opacity-30 transition-colors"
            title={t.editor.toolbar.undo}
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 text-dark-200 hover:text-white hover:bg-dark-700 rounded-lg disabled:opacity-30 transition-colors"
            title={t.editor.toolbar.redo}
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-dark-500 mx-1" />

          {/* Device Modes */}
          <button
            onClick={() => setDeviceMode("desktop")}
            className={`p-2 rounded-lg transition-colors ${deviceMode === "desktop" ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={t.editor.toolbar.desktop}
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode("tablet")}
            className={`p-2 rounded-lg transition-colors ${deviceMode === "tablet" ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={t.editor.toolbar.tablet}
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode("mobile")}
            className={`p-2 rounded-lg transition-colors ${deviceMode === "mobile" ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={t.editor.toolbar.mobile}
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-dark-500 mx-1" />

          {/* Zoom */}
          <button
            onClick={() => setZoom(Math.max(25, zoom - 10))}
            className="p-2 text-dark-200 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-dark-200 min-w-[40px] text-center">{zoom}%</span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="p-2 text-dark-200 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-dark-500 mx-1" />

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg transition-colors ${isFullscreen ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={isFullscreen ? t.editor.toolbar.exitFullscreen : t.editor.toolbar.fullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <div className="h-6 w-px bg-dark-500 mx-1" />

          {/* View Mode */}
          <button
            onClick={() => setViewMode("visual")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "visual" ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={t.editor.toolbar.visual}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("code")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "code" ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={t.editor.toolbar.code}
          >
            <Code2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2 rounded-lg transition-colors ${showGrid ? "text-primary-400 bg-primary-600/10" : "text-dark-200 hover:text-white hover:bg-dark-700"}`}
            title={t.editor.toolbar.grid}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettingsModal(true)}
            className="btn-ghost flex items-center gap-1 text-sm"
            title="Proje Ayarları"
          >
            <Settings className="w-4 h-4" />
            Ayarlar
          </button>
          <button
            onClick={handleExport}
            className="btn-ghost flex items-center gap-1 text-sm"
          >
            <Download className="w-4 h-4" />
            {t.editor.toolbar.export}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-1 text-sm py-2 px-4"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t.editor.toolbar.save}
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas */}
        <div className="flex-1 bg-dark-900 overflow-auto flex items-start justify-center p-8">
          {viewMode === "visual" ? (
            <div
              className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${showGrid ? "ring-1 ring-primary-500/30" : ""}`}
              style={{
                width: getDeviceWidth(),
                maxWidth: "100%",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}
            >
              <iframe
                ref={iframeRef}
                className="w-full border-0"
                style={{ height: "80vh" }}
                title="Editor Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          ) : (
            <div className="w-full h-full">
              <Editor
                height="100%"
                language="html"
                theme="vs-dark"
                value={htmlContent}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineHeight: 1.5,
                  padding: { top: 20 },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            </div>
          )}
        </div>

        {/* Right Panel - All Properties */}
        <div className="w-[320px] bg-dark-800 border-l border-dark-600 flex flex-col overflow-hidden">
          {/* Panel Tabs */}
          <div className="flex border-b border-dark-600">
            {[
              { id: "style", icon: Palette, label: "Stil" },
              { id: "text", icon: Type, label: "Metin" },
              { id: "layout", icon: Layers, label: "Düzen" },
              { id: "image", icon: Image, label: "Resim" },
              { id: "move", icon: Move, label: "Taşı" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setEditPanel(tab.id as any)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                  editPanel === tab.id
                    ? "text-primary-400 bg-primary-600/10 border-b-2 border-primary-400"
                    : "text-dark-300 hover:text-white hover:bg-dark-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Style Panel */}
            {editPanel === "style" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Stil Özellikleri</h3>
                {selectedElement ? (
                  <>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Arka Plan Rengi</label>
                      <input
                        type="color"
                        onChange={(e) => updateElementStyle("backgroundColor", e.target.value)}
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Yazı Rengi</label>
                      <input
                        type="color"
                        onChange={(e) => updateElementStyle("color", e.target.value)}
                        className="w-full h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Yazı Boyutu (px)</label>
                      <input
                        type="range"
                        min="8"
                        max="72"
                        onChange={(e) => updateElementStyle("fontSize", e.target.value + "px")}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">İç Boşluk (padding)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        onChange={(e) => updateElementStyle("padding", e.target.value + "px")}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Dış Boşluk (margin)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        onChange={(e) => updateElementStyle("margin", e.target.value + "px")}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Köşe Yuvarlaklığı</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        onChange={(e) => updateElementStyle("borderRadius", e.target.value + "px")}
                        className="w-full"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-dark-300">Düzenlemek için bir element seçin</p>
                )}
              </div>
            )}

            {/* Text Panel */}
            {editPanel === "text" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Metin Özellikleri</h3>
                {selectedElement ? (
                  <>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Yazı Tipi</label>
                      <select
                        onChange={(e) => updateElementText("fontFamily", e.target.value)}
                        className="input-field text-sm py-2 w-full"
                      >
                        <option>Inter</option>
                        <option>Arial</option>
                        <option>Georgia</option>
                        <option>Courier New</option>
                        <option>Times New Roman</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Yazı Kalınlığı</label>
                      <select
                        onChange={(e) => updateElementText("fontWeight", e.target.value)}
                        className="input-field text-sm py-2 w-full"
                      >
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="600">Semibold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Hizalama</label>
                      <div className="flex gap-1">
                        {["left", "center", "right", "justify"].map((align) => (
                          <button
                            key={align}
                            onClick={() => updateElementText("textAlign", align)}
                            className="flex-1 py-1.5 text-xs bg-dark-700 hover:bg-dark-600 rounded text-dark-200 hover:text-white capitalize"
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Satır Yüksekliği</label>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        onChange={(e) => updateElementText("lineHeight", e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-dark-300">Düzenlemek için bir element seçin</p>
                )}
              </div>
            )}

            {/* Layout Panel */}
            {editPanel === "layout" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Düzen Özellikleri</h3>
                {selectedElement ? (
                  <>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Görünüm</label>
                      <select
                        onChange={(e) => updateLayout("display", e.target.value)}
                        className="input-field text-sm py-2 w-full"
                      >
                        <option>block</option>
                        <option>flex</option>
                        <option>grid</option>
                        <option>inline</option>
                        <option>inline-block</option>
                        <option>none</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Genişlik</label>
                      <input
                        type="text"
                        onChange={(e) => updateLayout("width", e.target.value)}
                        className="input-field text-sm py-2 w-full"
                        placeholder="auto, 100px, 50%"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Yükseklik</label>
                      <input
                        type="text"
                        onChange={(e) => updateLayout("height", e.target.value)}
                        className="input-field text-sm py-2 w-full"
                        placeholder="auto, 100px, 50%"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-dark-200 mb-1 block">Pozisyon</label>
                      <select
                        onChange={(e) => updateLayout("position", e.target.value)}
                        className="input-field text-sm py-2 w-full"
                      >
                        <option>static</option>
                        <option>relative</option>
                        <option>absolute</option>
                        <option>fixed</option>
                        <option>sticky</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-dark-300">Düzenlemek için bir element seçin</p>
                )}
              </div>
            )}

            {/* Image Panel */}
            {editPanel === "image" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Resim İşlemleri</h3>
                <button
                  onClick={handleImageUpload}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-dark-700 hover:bg-dark-600 rounded-lg text-white transition-colors border border-dashed border-dark-500"
                >
                  <Upload className="w-5 h-5" />
                  Resim Yükle
                </button>
                <p className="text-xs text-dark-300">
                  Resim yüklemek için önce bir element seçin, sonra resim yükleyin.
                </p>
              </div>
            )}

            {/* Move Panel */}
            {editPanel === "move" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-white">Taşıma İşlemleri</h3>
                {selectedElement ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const doc = iframeRef.current?.contentDocument;
                          const selected = doc?.querySelector("[data-sc-selected]") as HTMLElement;
                          if (selected && selected.previousElementSibling) {
                            selected.parentNode?.insertBefore(selected, selected.previousElementSibling);
                            const newHtml = doc?.documentElement.outerHTML || "";
                            pushToUndo(newHtml);
                            setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
                            toast.success("Yukarı taşındı!");
                          }
                        }}
                        className="p-3 bg-dark-700 hover:bg-dark-600 rounded text-white text-sm"
                      >
                        ⬆️ Yukarı
                      </button>
                      <button
                        onClick={() => {
                          const doc = iframeRef.current?.contentDocument;
                          const selected = doc?.querySelector("[data-sc-selected]") as HTMLElement;
                          if (selected && selected.nextElementSibling) {
                            selected.parentNode?.insertBefore(selected.nextElementSibling, selected);
                            const newHtml = doc?.documentElement.outerHTML || "";
                            pushToUndo(newHtml);
                            setHtmlContent(`<!DOCTYPE html>\n${newHtml}`);
                            toast.success("Aşağı taşındı!");
                          }
                        }}
                        className="p-3 bg-dark-700 hover:bg-dark-600 rounded text-white text-sm"
                      >
                        ⬇️ Aşağı
                      </button>
                    </div>
                    <button
                      onClick={handleDuplicateElement}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-dark-700 hover:bg-dark-600 rounded text-white text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Kopyala
                    </button>
                    <button
                      onClick={handleDeleteElement}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-red-900/20 hover:bg-red-900/30 rounded text-red-400 text-sm border border-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-dark-300">Taşımak için bir element seçin</p>
                )}
              </div>
            )}
          </div>

          {/* Element Info (if selected) */}
          {selectedElement && (
            <div className="border-t border-dark-600 p-3 bg-dark-700/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] bg-primary-600/20 text-primary-400 px-1.5 py-0.5 rounded font-mono">
                  &lt;{selectedElement.tag}&gt;
                </span>
              </div>
              <div className="text-[10px] text-dark-400">
                {selectedElement.width}px × {selectedElement.height}px
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-400" />
                Proje Ayarları
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-2 text-dark-200 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Proje Adı
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input-field w-full"
                  placeholder="Proje adı girin..."
                />
              </div>

              {/* Source URL */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Kaynak URL (Link)
                </label>
                <input
                  type="text"
                  value={projectSourceUrl}
                  onChange={(e) => setProjectSourceUrl(e.target.value)}
                  className="input-field w-full"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-dark-400 mt-1">
                  Orijinal klonlanan sitenin URL&apos;si
                </p>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Önizleme Resmi URL
                </label>
                <input
                  type="text"
                  value={projectThumbnail}
                  onChange={(e) => setProjectThumbnail(e.target.value)}
                  className="input-field w-full"
                  placeholder="https://example.com/image.jpg"
                />
                {projectThumbnail && (
                  <div className="mt-2 p-2 bg-dark-700 rounded-lg">
                    <img
                      src={projectThumbnail}
                      alt="Thumbnail preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-dark-600">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 btn-ghost py-2.5"
              >
                İptal
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
