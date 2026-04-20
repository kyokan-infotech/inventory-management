"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiDelete, apiPatch } from "@/lib/api";
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
}

interface Category {
  _id: string;
  name_en: string;
  name_jp: string;
}

export default function InventoryListPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("stockmate_token");
    if (!token) {
      router.push("/en/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [itemsRes, catRes] = await Promise.all([
          apiGet("/inventory?limit=100"),
          apiGet("/categories"),
        ]);
        if (itemsRes.success) setItems(itemsRes.data);
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm(translations.inventory.confirmDelete.en)) return;
    await apiDelete(`/inventory/${id}`);
    const res = await apiGet("/inventory?limit=100");
    if (res.success) setItems(res.data);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "not_available" : "available";
    await apiPatch(`/inventory/${id}/toggle-status`, { status: newStatus });
    const res = await apiGet("/inventory?limit=100");
    if (res.success) setItems(res.data);
  };

  const filteredItems = items.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) return false;
    return true;
  });

  if (loading) return <div className="p-8">{translations.common.loading}</div>;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{translations.inventory.listTitle.en}</h1>
        <button onClick={() => {
          localStorage.removeItem("stockmate_token");
          router.push("/en/login");
        }} className="text-sm text-red-500">
          {translations.common.logout}
        </button>
      </header>

      <main className="p-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder={translations.inventory.itemName.en}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">{translations.inventory.listTitle.en}</option>
            <option value="available">{translations.inventory.statusAvailable.en}</option>
            <option value="not_available">{translations.inventory.statusNotAvailable.en}</option>
          </select>
          <a href="/en/inventory/new">
            <button className="bg-black text-white px-4 py-2 rounded">
              {translations.inventory.addItem.en}
            </button>
          </a>
        </div>

        <table className="w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">{translations.inventory.itemName.en}</th>
              <th className="p-3 text-left">{translations.inventory.sku.en}</th>
              <th className="p-3 text-left">{translations.inventory.category.en}</th>
              <th className="p-3 text-left">{translations.inventory.quantity.en}</th>
              <th className="p-3 text-left">{translations.inventory.status.en}</th>
              <th className="p-3 text-left">{translations.inventory.actions.en}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  {translations.common.noData}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.sku}</td>
                  <td className="p-3">
                    {item.category_id?.name_en || "-"}
                  </td>
                  <td className="p-3">{item.quantity} {item.unit}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggleStatus(item._id, item.status)}
                      className={`px-2 py-1 rounded text-xs mr-2 ${
                        item.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status === "available"
                        ? translations.inventory.statusAvailable.en
                        : translations.inventory.statusNotAvailable.en}
                    </button>
                  </td>
                  <td className="p-3">
                    <a href={`/en/inventory/${item._id}/edit`} className="text-blue-500 mr-3">
                      {translations.common.edit}
                    </a>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500"
                    >
                      {translations.common.delete}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}