"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Globe,
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  User,
  Calendar,
  Filter,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  sourceUrl: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      toast.error("Projeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter((p) => p.id !== id));
      toast.success("Proje silindi");
    } catch (error) {
      toast.error("Proje silinemedi");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projeler</h1>
          <p className="text-dark-200 mt-1">{projects.length} toplam proje</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 w-full"
            placeholder="Proje veya kullanıcı ara..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-dark-300" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">Tümü</option>
            <option value="active">Aktif</option>
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card border border-dark-600/50">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary-400" />
              </div>
              <div className="flex gap-2">
                <a
                  href={`/dashboard/editor/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-dark-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="p-2 text-dark-300 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {project.name}
            </h3>
            <p className="text-sm text-dark-300 truncate mb-4">{project.sourceUrl}</p>

            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  project.status === "published"
                    ? "bg-green-500/20 text-green-400"
                    : project.status === "active"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-dark-300 mb-2">
              <User className="w-4 h-4" />
              <span className="truncate">{project.user.name || project.user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-dark-300">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.createdAt).toLocaleDateString("tr-TR")}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <Globe className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <p className="text-dark-300">Proje bulunamadı</p>
        </div>
      )}
    </div>
  );
}
