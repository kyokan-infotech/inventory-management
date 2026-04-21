"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPatch } from "@/lib/api";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { 
  Field, 
  FieldLabel, 
  FieldError, 
  FieldGroup,
  FieldDescription
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  ChevronLeft, 
  Loader2, 
  Save, 
  Hash,
  Tag,
  Package,
  Layers,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const inventorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  sku: z.string().min(3, "SKU must be at least 3 characters"),
  category_id: z.string().min(1, "Please select a category"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unit: z.string().min(1, "Please select a unit"),
  lowStockThreshold: z.coerce.number().min(0, "Threshold cannot be negative").nullable().optional(),
  description: z.string().nullable().optional().transform(val => val === null ? "" : val),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;


interface Category {
  _id: string;
  name_en: string;
  name_jp: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  category_id: { _id: string; name_en: string; name_jp: string } | null;
  quantity: number;
  unit: string;
  status: string;
  lowStockThreshold: number | null;
  description: string | null;
}

export default function EditInventoryPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = use(params);
  const router = useRouter();
  const lang = locale === "ja" ? "ja" : "en";
  const t = translations.inventory;
  const common = translations.common;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<InventoryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(inventorySchema) as any,
    defaultValues: {
      name: "",
      sku: "",
      category_id: "",
      quantity: 0,
      unit: "pcs",
      lowStockThreshold: 0,
      description: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("stockmate_token");
    if (!token) {
      router.push(`/${lang}/login`);
      return;
    }

    const fetchData = async () => {
      try {
        const [itemRes, catRes] = await Promise.all([
          apiGet<InventoryItem>(`/inventory/${id}`),
          apiGet<Category[]>("/categories")
        ]);
        
        if (itemRes.success && itemRes.data) {
          const data = itemRes.data;
          form.reset({
            name: data.name,
            sku: data.sku,
            category_id: data.category_id?._id || "",
            quantity: data.quantity,
            unit: data.unit,
            lowStockThreshold: data.lowStockThreshold || 0,
            description: data.description || "",
          });
        }
        
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        toast.error("Failed to load item details");
      }
      setLoading(false);
    };

    fetchData();
  }, [router, id, lang, form]);

  const onSubmit = async (values: InventoryFormValues) => {
    setSaving(true);
    try {
      const res = await apiPatch(`/inventory/${id}`, {
        ...values,
        lowStockThreshold: values.lowStockThreshold ?? null,
        description: values.description || null,
      });

      if (res.success) {
        toast.success(t.successEdit?.[lang] || "Item updated successfully");
        router.push(`/${lang}/inventory`);
      } else {
        toast.error(res.message || "Error updating item");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error updating item");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading item details...</p>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl space-y-8 animate-linear animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${lang}/dashboard`}>{translations.dashboard.title[lang]}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${lang}/inventory`}>{t.listTitle[lang]}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{common.edit[lang]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t.editItem[lang]}
          </h1>
          <p className="text-muted-foreground font-medium">
            Edit stock details for item <span className="text-foreground font-bold">{form.getValues("sku")}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" asChild className="shadow-none">
          <Link href={`/${lang}/inventory`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t.backToInventory?.[lang] || "Back"}
          </Link>
        </Button>
      </div>

      <Card className="border-border shadow-none rounded-lg overflow-hidden">
        <CardHeader className="bg-muted/10 border-b border-border/50">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            General Information
          </CardTitle>
          <CardDescription>Update basic product identification and categorization.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form id="edit-inventory-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {t.itemName[lang]}
                </FieldLabel>
                <Input 
                  {...form.register("name")}
                  className="h-10 shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="e.g. Office Desk"
                />
                <FieldError errors={[form.formState.errors.name]} />
              </Field>

              {/* SKU */}
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  {t.sku[lang]}
                </FieldLabel>
                <Input 
                  {...form.register("sku")}
                  className="h-10 font-mono font-bold uppercase shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="SKU-001"
                />
                <FieldError errors={[form.formState.errors.sku]} />
              </Field>

              {/* Category */}
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {t.category[lang]}
                </FieldLabel>
                <Select
                  // eslint-disable-next-line react-hooks/incompatible-library
                  value={form.watch("category_id")}
                  onValueChange={(val) => form.setValue("category_id", val ?? "", { shouldValidate: true })}
                >
                  <SelectTrigger className="h-10 shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary w-full">
                    <SelectValue placeholder={t.selectCategory[lang]} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {lang === 'ja' ? cat.name_jp : cat.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.category_id]} />
              </Field>

              {/* Unit */}
              <Field>
                <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  {t.unit[lang]}
                </FieldLabel>
                <Select
                  value={form.watch("unit")}
                  onValueChange={(val) => form.setValue("unit", val ?? "pcs", { shouldValidate: true })}
                >
                  <SelectTrigger className="h-10 shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pcs">pcs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="box">box</SelectItem>
                    <SelectItem value="litre">litre</SelectItem>
                    <SelectItem value="set">set</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.unit]} />
              </Field>
            </FieldGroup>

            <Separator className="bg-border/50" />

            {/* Inventory Controls */}
            <div className="space-y-4">
               <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                 Inventory Controls
               </h3>
               <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field>
                  <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t.quantity[lang]}
                  </FieldLabel>
                  <Input 
                    type="number"
                    {...form.register("quantity")}
                    className="h-10 tabular-nums font-bold shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <FieldError errors={[form.formState.errors.quantity]} />
                </Field>

                <Field>
                  <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    {t.lowStockThreshold[lang]}
                  </FieldLabel>
                  <Input 
                    type="number"
                    {...form.register("lowStockThreshold")}
                    className="h-10 tabular-nums font-medium shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary"
                  />
                  <FieldDescription className="text-[10px] mt-1.5 uppercase font-bold text-muted-foreground/60 leading-none">
                    {t.thresholdHelp[lang]}
                  </FieldDescription>
                  <FieldError errors={[form.formState.errors.lowStockThreshold]} />
                </Field>
               </FieldGroup>
            </div>

            <Separator className="bg-border/50" />

            {/* Description */}
            <Field>
              <FieldLabel className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                {t.description[lang]}
              </FieldLabel>
              <Textarea 
                {...form.register("description")}
                className="min-h-[120px] shadow-none border-border focus-visible:ring-1 focus-visible:ring-primary resize-none p-3"
                placeholder="Detailed item description..."
              />
              <FieldError errors={[form.formState.errors.description]} />
            </Field>
          </form>
        </CardContent>
        <CardFooter className="bg-muted/5 border-t border-border/50 p-6 flex justify-between items-center">
           <Button variant="ghost" asChild className="h-10 text-muted-foreground hover:text-foreground">
             <Link href={`/${lang}/inventory`}>
               {common.cancel[lang]}
             </Link>
           </Button>
           <Button 
            form="edit-inventory-form"
            type="submit" 
            disabled={saving}
            className="h-10 px-8 shadow-none font-bold min-w-[140px]"
           >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {common.updating?.[lang] || "Saving..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {common.save[lang]}
              </>
            )}
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}