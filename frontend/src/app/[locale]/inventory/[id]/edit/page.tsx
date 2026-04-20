"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { translations } from "@/lib/translations";

interface Category {
  _id: string;
  name_en: string;
  name_jp: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  category_id: any;
  quantity: number;
  unit: string;
  status: string;
  lowStockThreshold: number | null;
  description: string | null;
}

export default function EditInventoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("pcs");
  const [lowStockThreshold, setLowStockThreshold] = useState<number | "">("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("stockmate_token");
    if (!token) {
      router.push("/en/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          apiGet(`/inventory/${id}`),
          apiGet("/categories"),
        ]);
        if (itemRes.success && itemRes.data) {
          setItem(itemRes.data);
          setName(itemRes.data.name);
          setSku(itemRes.data.sku);
          setCategoryId(itemRes.data.category_id?._id || "");
          setQuantity(itemRes.data.quantity);
          setUnit(itemRes.data.unit);
          setLowStockThreshold(itemRes.data.lowStockThreshold || "");
          setDescription(itemRes.data.description || "");
        }
        if (catRes.success) setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [router, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await apiPatch(`/inventory/${id}`, {
        name,
        sku,
        category_id,
        quantity,
        unit,
        lowStockThreshold: lowStockThreshold || null,
        description: description || null,
      });

      if (res.success) {
        router.push("/en/dashboard");
      } else {
        alert(res.message || "Error");
      }
    } catch (err) {
      alert("Error");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">{translations.common.loading}</div>;
  if (!item) return <div className="p-8">Item not found</div>;

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-bold">{translations.inventory.editItem?.en || "Edit Item"}</h1>
      </header>

      <main className="p-6">
        <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {translations.inventory.itemName.en}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {translations.inventory.sku.en}
            </label>
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {translations.inventory.category.en}
            </label>
            <select
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">--</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {translations.inventory.quantity.en}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {translations.inventory.unit.en}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
                <option value="box">box</option>
                <option value="litre">litre</option>
                <option value="set">set</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {translations.inventory.lowStockThreshold.en}
            </label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value ? parseInt(e.target.value) : "")}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {saving ? translations.common.loading : translations.common.save}
            </button>
            <button
              type="button"
              onClick={() => router.push("/en/dashboard")}
              className="border px-6 py-2 rounded"
            >
              {translations.common.cancel}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}