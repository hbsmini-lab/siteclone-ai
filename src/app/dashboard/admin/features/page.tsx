"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Zap, Plus, Edit3, Trash2, Loader2, GripVertical } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", icon: "zap" });

  useEffect(() => {
    fetch("/api/admin/features")
      .then((res) => res.json())
      .then((data) => setFeatures(data.features || []))
      .catch(() => toast.error("Failed to load features"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Feature added!");
      setShowForm(false);
      setForm({ title: "", description: "", icon: "zap" });
      // Refresh
      const data = await fetch("/api/admin/features").then((r) => r.json());
      setFeatures(data.features || []);
    } catch {
      toast.error("Failed to add feature");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/features/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      setFeatures(features.map((f) => (f.id === id ? { ...f, isActive: !isActive } : f)));
    } catch {
      toast.error("Failed to update");
    }
  };

  const deleteFeature = async (id: string) => {
    if (!confirm("Delete this feature?")) return;
    try {
      await fetch(`/api/admin/features/${id}`, { method: "DELETE" });
      setFeatures(features.filter((f) => f.id !== id));
      toast.success("Feature deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Features</h1>
          <p className="text-dark-200 mt-1">Manage platform features displayed on landing page</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Feature
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-dark-200 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-dark-200 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm text-dark-200 mb-1">Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="input-field"
                >
                  <option value="zap">Zap</option>
                  <option value="wand">Wand</option>
                  <option value="layers">Layers</option>
                  <option value="code">Code</option>
                  <option value="rocket">Rocket</option>
                  <option value="shield">Shield</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Add Feature</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature) => (
            <div key={feature.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-dark-400 cursor-move" />
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.isActive ? "bg-primary-600/10" : "bg-dark-600"}`}>
                  <Zap className={`w-5 h-5 ${feature.isActive ? "text-primary-400" : "text-dark-400"}`} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{feature.title}</h3>
                  <p className="text-xs text-dark-300">{feature.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(feature.id, feature.isActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    feature.isActive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-dark-600 text-dark-300"
                  }`}
                >
                  {feature.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  onClick={() => deleteFeature(feature.id)}
                  className="p-2 text-dark-200 hover:text-red-400 hover:bg-dark-600 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
