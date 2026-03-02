"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Users, Search, Shield, CreditCard, Trash2, Loader2, Mail, Calendar } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  plan: string;
  createdAt: string;
  _count: { projects: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      toast.success(`User role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  };

  const addCredits = async (userId: string, currentCredits: number) => {
    const amount = prompt("Kredi eklemek için pozitif, çıkarmak için negatif sayı girin:\nÖrnek: 10 veya -5");
    if (!amount || isNaN(Number(amount))) return;
    
    const creditChange = Number(amount);
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addCredits: creditChange }),
      });
      
      if (!res.ok) throw new Error("Failed to update credits");
      
      const data = await res.json();
      const newCredits = data.user?.credits || currentCredits + creditChange;
      
      setUsers(users.map((u) => (u.id === userId ? { ...u, credits: newCredits } : u)));
      
      if (creditChange > 0) {
        toast.success(`${creditChange} kredi eklendi`);
      } else {
        toast.success(`${Math.abs(creditChange)} kredi çıkarıldı`);
      }
    } catch {
      toast.error("Kredi güncellenemedi");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <p className="text-dark-200 mt-1">{users.length} total users</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
          placeholder="Search users..."
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-500">
                <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Plan</th>
                <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Credits</th>
                <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Projects</th>
                <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Role</th>
                <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Joined</th>
                <th className="text-right text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-dark-600 hover:bg-dark-600/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center text-primary-400 text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-dark-300">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-100 capitalize">{user.plan}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-primary-400 font-medium">{user.credits}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-100">{user._count?.projects || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-dark-500 text-dark-200"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-dark-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => addCredits(user.id, user.credits)}
                        className="p-1.5 text-dark-200 hover:text-green-400 hover:bg-dark-600 rounded-lg"
                        title="Add Credits"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="p-1.5 text-dark-200 hover:text-purple-400 hover:bg-dark-600 rounded-lg"
                        title="Toggle Role"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
