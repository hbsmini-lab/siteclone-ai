"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FolderOpen,
  Plus,
  Globe,
  Edit3,
  Trash2,
  ExternalLink,
  Clock,
  Loader2,
  Settings,
  Save,
  X,
  Upload,
  Download,
} from "lucide-react";
import { useTranslation } from "@/lib/hooks/useTranslation";
import { useAppStore } from "@/lib/store";

interface Project {
  id: string;
  name: string;
  sourceUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export default function ProjectsPage() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Edit modal state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editSourceUrl, setEditSourceUrl] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      toast.error(t.dashboard.projects.actions.errorLoad);
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm(t.dashboard.projects.actions.confirmDelete)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success(t.dashboard.projects.actions.successDelete);
      }
    } catch (error) {
      toast.error(t.dashboard.projects.actions.errorDelete);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditSourceUrl(project.sourceUrl || "");
    setEditThumbnail(project.thumbnail || "");
  };

  const closeEditModal = () => {
    setEditingProject(null);
    setEditName("");
    setEditSourceUrl("");
    setEditThumbnail("");
  };

  const saveEdit = async () => {
    if (!editingProject) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          sourceUrl: editSourceUrl,
          thumbnail: editThumbnail,
        }),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      const data = await res.json();
      setProjects(projects.map((p) => (p.id === editingProject.id ? data.project : p)));
      toast.success("Proje güncellendi");
      closeEditModal();
    } catch (error) {
      toast.error("Güncelleme başarısız");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setEditThumbnail(data.url);
      toast.success("Resim yüklendi");
    } catch (error) {
      toast.error("Resim yüklenemedi");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const exportProject = async (project: Project) => {
    try {
      toast.loading("Proje paketleniyor...", { id: "export" });
      const res = await fetch(`/api/projects/${project.id}/export`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ftp_ready.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("ZIP indirildi! FTP'ye yükleyebilirsiniz.", { id: "export" });
    } catch (error) {
      toast.error("Dışarı aktarma başarısız", { id: "export" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-inter">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.dashboard.projects.title}</h1>
          <p className="text-dark-200 mt-1 font-inter">
            {t.dashboard.projects.subtitle}
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


      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 card">
          <FolderOpen className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {t.dashboard.projects.empty.title}
          </h3>
          <p className="text-dark-200 mb-6">
            {t.dashboard.projects.empty.subtitle}
          </p>
          <Link
            href="/dashboard/clone"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Globe className="w-5 h-5" />
            {t.dashboard.projects.empty.cta}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card-hover group border border-dark-600/50 overflow-hidden bg-dark-800/40 backdrop-blur-sm">
              {/* Thumbnail */}
              <div className="h-48 bg-dark-900 overflow-hidden relative border-b border-dark-600/50">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-purple-600/20 flex items-center justify-center">
                    <Globe className="w-12 h-12 text-dark-400 opacity-20" />
                  </div>
                )}

                <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Link
                    href={`/dashboard/editor/${project.id}`}
                    className="p-3 bg-primary-600 rounded-full text-white shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <Edit3 className="w-5 h-5" />
                  </Link>
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => exportProject(project)}
                    className="p-1.5 bg-dark-800/80 rounded-lg text-white hover:bg-green-600 transition-colors"
                    title="FTP'ye Aktar (İndir)"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 bg-dark-800/80 rounded-lg text-white hover:bg-primary-600 transition-colors"
                    title="Proje Ayarları"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 bg-dark-800/80 rounded-lg text-white hover:bg-red-600 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${project.status === "published"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-black"
                      }`}
                  >
                    {project.status === "published" ? t.dashboard.projects.status.published : t.dashboard.projects.status.draft}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-primary-400 transition-colors">
                  {project.name}
                </h3>
                {project.sourceUrl && (
                  <p className="text-xs text-dark-300 truncate mb-4 flex items-center gap-1.5 italic">
                    <Globe className="w-3.5 h-3.5 text-primary-500" />
                    {project.sourceUrl}
                  </p>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-dark-600/30">
                  <span className="text-[10px] text-dark-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-dark-500" />
                    {new Date(project.updatedAt).toLocaleDateString(language === "tr" ? "tr-TR" : "en-US")}
                  </span>
                  <Link
                    href={`/dashboard/editor/${project.id}`}
                    className="flex items-center gap-1 text-xs text-primary-400 hover:text-white font-bold transition-colors"
                  >
                    {t.dashboard.projects.actions.edit} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary-400" />
                Proje Düzenle
              </h3>
              <button
                onClick={closeEditModal}
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
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
                  value={editSourceUrl}
                  onChange={(e) => setEditSourceUrl(e.target.value)}
                  className="input-field w-full"
                  placeholder="https://example.com"
                />
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-2">
                  Önizleme Resmi
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={editThumbnail}
                    onChange={(e) => setEditThumbnail(e.target.value)}
                    className="input-field w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="btn-ghost px-3 py-2 flex items-center gap-2 whitespace-nowrap"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Yükle
                  </button>
                </div>
                {editThumbnail && (
                  <div className="mt-2 p-2 bg-dark-700 rounded-lg">
                    <img
                      src={editThumbnail}
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
                onClick={closeEditModal}
                className="flex-1 btn-ghost py-2.5"
              >
                İptal
              </button>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2"
              >
                {savingEdit ? (
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
