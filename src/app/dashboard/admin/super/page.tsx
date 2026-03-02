"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Users,
  CreditCard,
  Globe,
  Package,
  Settings,
  Shield,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Power,
  PowerOff,
  DollarSign,
  TrendingUp,
  BarChart3,
  Lock,
  Unlock,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  credits: number;
  plan: string;
  isActive: boolean;
  createdAt: string;
}

interface ProjectData {
  id: string;
  name: string;
  sourceUrl: string;
  status: string;
  user: { email: string };
  createdAt: string;
}

interface PaymentData {
  id: string;
  amount: number;
  status: string;
  packageName: string;
  user: { email: string };
  createdAt: string;
}

interface PackageData {
  id: string;
  name: string;
  slug: string;
  price: number;
  credits: number;
  isPopular: boolean;
}

export default function SuperAdminPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "projects" | "payments" | "packages">("overview");
  const [users, setUsers] = useState<UserData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [packages, setPackages] = useState<PackageData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, projectsRes, paymentsRes, packagesRes, statsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/projects"),
        fetch("/api/admin/payments"),
        fetch("/api/admin/packages"),
        fetch("/api/admin/stats"),
      ]);

      if (usersRes.ok) setUsers((await usersRes.json()).users);
      if (projectsRes.ok) setProjects((await projectsRes.json()).projects);
      if (paymentsRes.ok) setPayments((await paymentsRes.json()).payments);
      if (packagesRes.ok) setPackages((await packagesRes.json()).packages);
      if (statsRes.ok) setStats((await statsRes.json()));
    } catch (error) {
      toast.error("Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // User Management Functions
  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: !currentStatus } : u));
      toast.success(`Kullanıcı ${!currentStatus ? "aktif" : "pasif"} edildi`);
    } catch (error) {
      toast.error("İşlem başarısız");
    }
  };

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success("Rol güncellendi");
    } catch (error) {
      toast.error("Rol güncellenemedi");
    }
  };

  const addCredits = async (userId: string, amount: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addCredits: amount }),
      });
      if (!res.ok) throw new Error("Failed to add credits");
      const data = await res.json();
      setUsers(users.map(u => u.id === userId ? { ...u, credits: data.user.credits } : u));
      toast.success(`${amount} kredi eklendi`);
    } catch (error) {
      toast.error("Kredi eklenemedi");
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter(u => u.id !== userId));
      toast.success("Kullanıcı silindi");
    } catch (error) {
      toast.error("Kullanıcı silinemedi");
    }
  };

  // Package Management
  const togglePackageStatus = async (pkgId: string, field: string, value: boolean) => {
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pkgId, [field]: value }),
      });
      if (!res.ok) throw new Error("Failed to update package");
      setPackages(packages.map(p => p.slug === pkgId ? { ...p, [field]: value } : p));
      toast.success("Paket güncellendi");
    } catch (error) {
      toast.error("Paket güncellenemedi");
    }
  };

  // Project Management
  const deleteProject = async (projectId: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success("Proje silindi");
    } catch (error) {
      toast.error("Proje silinemedi");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-400" />
          Süper Admin Paneli
        </h1>
        <p className="text-dark-300">Tüm sistem yönetimi tek panelde</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Toplam Kullanıcı" value={stats.totalUsers} icon={Users} color="blue" />
        <StatCard title="Toplam Proje" value={stats.totalProjects} icon={Globe} color="green" />
        <StatCard title="Toplam Gelir" value={`$${stats.totalRevenue}`} icon={DollarSign} color="purple" />
        <StatCard title="Aktif Kullanıcı" value={stats.activeUsers} icon={TrendingUp} color="yellow" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "overview", label: "Genel Bakış", icon: BarChart3 },
          { id: "users", label: "Kullanıcılar", icon: Users },
          { id: "projects", label: "Projeler", icon: Globe },
          { id: "payments", label: "Ödemeler", icon: CreditCard },
          { id: "packages", label: "Paketler", icon: Package },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary-600 text-white"
                : "bg-dark-700 text-dark-300 hover:bg-dark-600"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card">
        {/* Search Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ara..."
              className="input-field pl-12 w-full"
            />
          </div>
          <button onClick={fetchAllData} className="btn-secondary flex items-center gap-2">
            <Loader2 className="w-4 h-4" />
            Yenile
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Kullanıcı</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Rol</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Kredi</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Paket</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Durum</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.email?.includes(searchQuery) || u.name?.includes(searchQuery)).map((user) => (
                  <tr key={user.id} className="border-b border-dark-600/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{user.name || "-"}</p>
                        <p className="text-sm text-dark-300">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole(user.id, e.target.value)}
                        className="bg-dark-700 border border-dark-500 rounded-lg px-2 py-1 text-sm text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-primary-400 font-medium">{user.credits}</span>
                        <button
                          onClick={() => {
                            const amount = prompt("Eklenecek kredi miktarı (çıkarmak için - girin):");
                            if (amount) addCredits(user.id, parseInt(amount));
                          }}
                          className="text-xs bg-primary-600/20 text-primary-400 px-2 py-1 rounded"
                        >
                          +/-
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-white">{user.plan}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive !== false
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {user.isActive !== false ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                        {user.isActive !== false ? "Aktif" : "Pasif"}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.filter(p => p.name?.includes(searchQuery) || p.user?.email?.includes(searchQuery)).map((project) => (
              <div key={project.id} className="bg-dark-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <Globe className="w-8 h-8 text-primary-400" />
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-white font-medium mb-1 truncate">{project.name}</h3>
                <p className="text-sm text-dark-300 mb-2 truncate">{project.sourceUrl}</p>
                <p className="text-xs text-dark-400">{project.user?.email}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                  project.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === "payments" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-500">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Kullanıcı</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Paket</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Tutar</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Durum</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-200">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {payments.filter(p => p.user?.email?.includes(searchQuery)).map((payment) => (
                  <tr key={payment.id} className="border-b border-dark-600/50">
                    <td className="py-3 px-4 text-white">{payment.user?.email}</td>
                    <td className="py-3 px-4 text-white">{payment.packageName}</td>
                    <td className="py-3 px-4 text-green-400 font-medium">${payment.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        payment.status === "completed" ? "bg-green-500/20 text-green-400" :
                        payment.status === "refunded" ? "bg-blue-500/20 text-blue-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-300 text-sm">
                      {new Date(payment.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.filter(p => p.name?.includes(searchQuery)).map((pkg) => (
              <div key={pkg.slug} className="bg-dark-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-8 h-8 text-primary-400" />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-dark-300">Popüler</span>
                    <input
                      type="checkbox"
                      checked={pkg.isPopular}
                      onChange={(e) => togglePackageStatus(pkg.slug, "isPopular", e.target.checked)}
                      className="w-4 h-4 rounded border-dark-500"
                    />
                  </label>
                </div>
                <h3 className="text-white font-medium mb-1">{pkg.name}</h3>
                <p className="text-2xl font-bold text-primary-400 mb-2">${pkg.price}</p>
                <p className="text-sm text-dark-300 mb-4">{pkg.credits} Kredi</p>
                <div className="flex gap-2">
                  <button className="flex-1 btn-primary text-sm py-2">
                    <Edit3 className="w-4 h-4 inline mr-1" />
                    Düzenle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-400" />
                Son Kullanıcılar
              </h3>
              <div className="space-y-2">
                {users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2 border-b border-dark-600/50">
                    <span className="text-white text-sm">{user.email}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.isActive !== false ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {user.isActive !== false ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Son Ödemeler
              </h3>
              <div className="space-y-2">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b border-dark-600/50">
                    <span className="text-white text-sm">{payment.user?.email}</span>
                    <span className="text-green-400 font-medium">${payment.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-600/20 text-blue-400",
    green: "bg-green-600/20 text-green-400",
    purple: "bg-purple-600/20 text-purple-400",
    yellow: "bg-yellow-600/20 text-yellow-400",
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-dark-300 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
