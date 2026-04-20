"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { translations } from "@/lib/translations";

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  category_id: any;
  quantity: number;
  unit: string;
  status: string;
  lowStockThreshold: number | null;
  updatedAt: string;
}

interface Stats {
  total: number;
  available: number;
  notAvailable: number;
  lowStock: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, available: 0, notAvailable: 0, lowStock: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("stockmate_token");
    if (!token) {
      router.push("/en/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await apiGet("/inventory?limit=100");
        if (res.success && res.data) {
          setItems(res.data);
          const data = res.data;
          const total = data.length;
          const available = data.filter((i: any) => i.status === "available").length;
          const notAvailable = data.filter((i: any) => i.status === "not_available").length;
          const lowStock = data.filter((i: any) => 
            i.lowStockThreshold && i.quantity <= i.lowStockThreshold && i.status === "available"
          ).length;
          setStats({ total, available, notAvailable, lowStock });
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("stockmate_token");
    router.push("/en/login");
  };

  if (loading) {
    return <div className="p-8">{translations.common.loading}</div>;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{translations.dashboard.title.en}</h1>
        <button onClick={handleLogout} className="text-sm text-red-500">
          {translations.common.logout}
        </button>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">{translations.dashboard.totalItems.en}</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">{translations.dashboard.available.en}</div>
            <div className="text-2xl font-bold">{stats.available}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">{translations.dashboard.notAvailable.en}</div>
            <div className="text-2xl font-bold">{stats.notAvailable}</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">{translations.dashboard.lowStock.en}</div>
            <div className="text-2xl font-bold">{stats.lowStock}</div>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4">{translations.inventory.listTitle.en}</h2>
        
        <a href="/en/inventory/new" className="inline-block mb-4">
          <button className="bg-black text-white px-4 py-2 rounded">
            {translations.inventory.addItem.en}
          </button>
        </a>

        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm">{translations.inventory.itemName.en}</th>
                <th className="p-3 text-left text-sm">{translations.inventory.sku.en}</th>
                <th className="p-3 text-left text-sm">{translations.inventory.category.en}</th>
                <th className="p-3 text-left text-sm">{translations.inventory.quantity.en}</th>
                <th className="p-3 text-left text-sm">{translations.inventory.status.en}</th>
                <th className="p-3 text-left text-sm">{translations.inventory.actions.en}</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    {translations.common.noData}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.sku}</td>
                    <td className="p-3">
                      {item.category_id?.name_en || item.category_id?.name_jp || "-"}
                    </td>
                    <td className="p-3">{item.quantity} {item.unit}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === "available" 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.status === "available" 
                          ? translations.inventory.statusAvailable.en
                          : translations.inventory.statusNotAvailable.en}
                      </span>
                    </td>
                    <td className="p-3">
                      <a href={`/en/inventory/${item._id}/edit`} className="text-blue-500 hover:underline">
                        {translations.common.edit}
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}