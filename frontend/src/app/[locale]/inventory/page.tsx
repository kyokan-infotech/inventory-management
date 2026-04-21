"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiDelete, apiPatch } from "@/lib/api";
import { translations } from "@/lib/translations";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Loader2,
  RefreshCcw
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  _id: string;
  name_en: string;
  name_jp: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  category_id: Category | null;
  quantity: number;
  unit: string;
  status: string;
  lowStockThreshold: number | null;
}

export default function InventoryListPage({ params }: { params: Promise<{ locale: string }> }) {
  const router = useRouter();
  const { locale: localeParam } = React.use(params);
  const locale = (localeParam || 'en') as 'en' | 'ja';
  
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const t = translations.inventory;
  const common = translations.common;

  useEffect(() => {
    const token = localStorage.getItem("stockmate_token");
    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await apiGet<InventoryItem[]>("/inventory");
        if (res.success && res.data) {
          setItems(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch items", err);
        toast.error("Failed to load inventory");
      }
      setLoading(false);
    };

    fetchItems();
  }, [router, locale]);

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const handleDelete = async (id: string) => {
    if (!confirm(t.confirmDelete[locale])) return;

    try {
      const res = await apiDelete(`/inventory/${id}`);
      if (res.success) {
        setItems(items.filter((item) => item._id !== id));
        toast.success(t.deleteSuccess[locale]);
      } else {
        toast.error(t.deleteError[locale]);
      }
    } catch {
      toast.error(t.deleteError[locale]);
    }
  };

  const toggleStatus = async (item: InventoryItem) => {
    const newStatus = item.status === "available" ? "not_available" : "available";
    try {
      const res = await apiPatch(`/inventory/${item._id}`, { status: newStatus });
      if (res.success) {
        setItems(items.map((i) => (i._id === item._id ? { ...i, status: newStatus } : i)));
        toast.success(t.toggleSuccess[locale]);
      } else {
        toast.error(t.toggleError[locale]);
      }
    } catch {
      toast.error(t.toggleError[locale]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t.listTitle[locale]}</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Manage and track your product catalog in real-time.
          </p>
        </div>
        <Button asChild className="shadow-none h-10 px-5 font-semibold">
          <Link href={`/${locale}/inventory/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t.addItem[locale]}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 py-2 border-y border-border/50 bg-muted/5 px-2">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder[locale]}
            className="pl-9 h-9 border-border bg-background focus-visible:ring-1 focus-visible:ring-primary shadow-none"
          />
        </div>
        <div className="ml-auto text-[11px] font-bold text-muted-foreground bg-muted border border-border px-3 py-1 rounded uppercase tracking-wider tabular-nums">
          {filteredItems.length} {t.totalItemsCount[locale]}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background shadow-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="font-bold uppercase tracking-wider text-[10px] w-[350px] h-11">
                {t.itemName[locale]} / {t.sku[locale]}
              </TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px] h-11">
                {t.category[locale]}
              </TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px] h-11">
                {t.quantity[locale]}
              </TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px] h-11">
                {t.status[locale]}
              </TableHead>
              <TableHead className="text-right font-bold uppercase tracking-wider text-[10px] h-11 px-6">
                {t.actions[locale]}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item._id} className="group transition-colors hover:bg-muted/20">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-foreground">{item.name}</span>
                      <span className="text-[10px] font-mono font-bold text-muted-foreground px-1.5 py-0.5 bg-muted rounded w-fit border border-border/40">
                        {item.sku}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-muted-foreground">
                    {item.category_id ? (locale === "ja" ? item.category_id.name_jp : item.category_id.name_en) : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 tabular-nums">
                      <span className="font-bold">{item.quantity}</span>
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-tight">
                        {item.unit}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleStatus(item)}
                      className="hover:opacity-80 transition-opacity active:scale-95"
                    >
                      <StatusBadge 
                        status={item.status} 
                        quantity={item.quantity} 
                        lowStockThreshold={item.lowStockThreshold}
                        lang={locale}
                      />
                    </button>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-1">
                       <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-muted">
                         <Link href={`/${locale}/inventory/${item._id}/edit`}>
                           <Edit className="h-3.5 w-3.5" />
                         </Link>
                       </Button>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:bg-destructive/5 hover:text-destructive"
                        onClick={() => handleDelete(item._id)}
                       >
                         <Trash2 className="h-3.5 w-3.5" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-muted/40 text-muted-foreground/40 ring-1 ring-border/20">
                       <Package className="h-10 w-10" />
                    </div>
                    <p className="text-muted-foreground font-medium italic">
                      {common.noData[locale]}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setSearch("")}>
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Clear search
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}