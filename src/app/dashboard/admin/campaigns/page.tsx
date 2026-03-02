"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Megaphone,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Loader2,
  Calendar,
  Percent,
  Users,
} from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    code: "",
    discount: 10,
    maxUses: 100,
    expiresAt: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/admin/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `/api/admin/campaigns/${editingId}`
        : "/api/admin/campaigns";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save campaign");

      toast.success(editingId ? "Campaign updated!" : "Campaign created!");
      setShowForm(false);
      setEditingId(null);
      setForm({ title: "", description: "", code: "", discount: 10, maxUses: 100, expiresAt: "" });
      fetchCampaigns();
    } catch (error) {
      toast.error("Failed to save campaign");
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Delete this campaign?")) return;
    try {
      await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
      setCampaigns(campaigns.filter((c) => c.id !== id));
      toast.success("Campaign deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-dark-200 mt-1">Manage discount campaigns and promo codes</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({ title: "", description: "", code: "", discount: 10, maxUses: 100, expiresAt: "" });
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Campaign
        </button>
      </div>

      {/* Campaign Form Modal */}
      {showForm && (
        <div className="card mb-8 animate-slide-down">
          <h2 className="text-lg font-semibold text-white mb-4">
            {editingId ? "Edit Campaign" : "Create Campaign"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-200 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="Summer Sale"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">Promo Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="input-field font-mono"
                placeholder="SUMMER2024"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">Discount (%)</label>
              <input
                type="number"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                className="input-field"
                min="1"
                max="100"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">Max Uses</label>
              <input
                type="number"
                value={form.maxUses}
                onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })}
                className="input-field"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-dark-200 mb-1">Expires At</label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
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
                placeholder="Optional description"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">
                {editingId ? "Update" : "Create"} Campaign
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-20 card">
          <Megaphone className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No campaigns yet</h3>
          <p className="text-dark-200">Create your first campaign to attract users</p>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  campaign.isActive ? "bg-green-500/10" : "bg-dark-600"
                }`}>
                  <Megaphone className={`w-5 h-5 ${
                    campaign.isActive ? "text-green-400" : "text-dark-300"
                  }`} />
                </div>
                <div>
                  <h3 className="text-white font-medium">{campaign.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-dark-300 flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      {campaign.discount}% off
                    </span>
                    <span className="text-xs text-dark-300 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {campaign.usedCount}/{campaign.maxUses} used
                    </span>
                    <span className="text-xs text-dark-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Expires {new Date(campaign.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCode(campaign.code)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-dark-600 rounded-lg text-xs text-dark-100 hover:text-white font-mono"
                >
                  {campaign.code}
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={() => {
                    setEditingId(campaign.id);
                    setForm({
                      title: campaign.title,
                      description: campaign.description,
                      code: campaign.code,
                      discount: campaign.discount,
                      maxUses: campaign.maxUses,
                      expiresAt: campaign.expiresAt,
                    });
                    setShowForm(true);
                  }}
                  className="p-2 text-dark-200 hover:text-white hover:bg-dark-600 rounded-lg"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteCampaign(campaign.id)}
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
