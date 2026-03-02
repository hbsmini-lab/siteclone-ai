"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  CreditCard,
  Search,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
} from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  packageName: string;
  credits: number;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/payments");
      if (!res.ok) throw new Error("Failed to load payments");
      const data = await res.json();
      setPayments(data.payments || []);
    } catch (error) {
      toast.error("Ödemeler yüklenemedi");
    } finally {
      setLoading(false);
    }
  };

  const refundPayment = async (id: string) => {
    if (!confirm("Bu ödemeyi iade etmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/payments/${id}/refund`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to refund");
      toast.success("Ödeme iade edildi");
      fetchPayments();
    } catch (error) {
      toast.error("İade işlemi başarısız");
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.user.email.toLowerCase().includes(search.toLowerCase()) ||
      p.packageName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

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
          <h1 className="text-2xl font-bold text-white">Ödemeler</h1>
          <p className="text-dark-200 mt-1">Tüm ödeme işlemleri</p>
        </div>
        <div className="card bg-green-500/10 border-green-500/20">
          <p className="text-sm text-green-400">Toplam Gelir</p>
          <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
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
            placeholder="Kullanıcı veya paket ara..."
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
            <option value="completed">Tamamlandı</option>
            <option value="pending">Bekliyor</option>
            <option value="failed">Başarısız</option>
            <option value="refunded">İade Edildi</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-500">
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Kullanıcı</th>
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Paket</th>
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Tutar</th>
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Kredi</th>
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Durum</th>
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">Tarih</th>
              <th className="text-left text-xs font-semibold text-dark-200 uppercase tracking-wider px-6 py-4">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b border-dark-600/50 hover:bg-dark-700/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-dark-300" />
                    <span className="text-white text-sm">{payment.user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-white text-sm">{payment.packageName}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-green-400">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">{payment.amount}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-primary-400 text-sm">+{payment.credits}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      payment.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : payment.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : payment.status === "refunded"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {payment.status === "completed" && <CheckCircle className="w-3 h-3" />}
                    {payment.status === "failed" && <XCircle className="w-3 h-3" />}
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-dark-300 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(payment.createdAt).toLocaleDateString("tr-TR")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {payment.status === "completed" && (
                    <button
                      onClick={() => refundPayment(payment.id)}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      İade Et
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPayments.length === 0 && (
          <div className="text-center py-10">
            <CreditCard className="w-12 h-12 text-dark-400 mx-auto mb-3" />
            <p className="text-dark-300">Ödeme bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
