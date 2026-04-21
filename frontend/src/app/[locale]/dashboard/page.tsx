"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ArrowRight, 
  Box, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown,
  FileText,
  History,
  LayoutDashboard,
  BoxSelect
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalItems: number;
  availableItems: number;
  outOfStockItems: number;
  lowStockItems: number;
}

interface InventoryItem {
  _id: string;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  status: "available" | "not_available";
  updatedAt: string;
}

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = React.use(params);
  const locale = (localeParam || 'en') as 'en' | 'ja';
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = translations.dashboard;
  const common = translations.common;
  const inv = translations.inventory;

  useEffect(() => {
    const token = localStorage.getItem("stockmate_token");
    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          apiGet<DashboardStats>("/inventory/stats/summary"),
          apiGet<InventoryItem[]>("/inventory?limit=5&sortBy=updatedAt&order=desc")
        ]);

        if (statsRes.success && statsRes.data) {
          setStats(statsRes.data);
        }
        if (itemsRes.success && itemsRes.data) {
          setRecentItems(itemsRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [router, locale]);

  if (loading) {
    return (
      <div className="container py-10 space-y-8 max-w-7xl animate-in fade-in duration-500">
        <div className="flex justify-between items-end gap-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-11 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-7">
          <Skeleton className="h-96 md:col-span-4" />
          <Skeleton className="h-96 md:col-span-3" />
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: t.totalItems[locale],
      value: stats?.totalItems || 0,
      icon: Box,
      description: "Total tracked inventory",
      color: "text-primary",
      bg: "bg-muted/50"
    },
    {
      label: t.available[locale],
      value: stats?.availableItems || 0,
      icon: CheckCircle2,
      description: "In stock and ready",
      color: "text-primary",
      bg: "bg-muted/50"
    },
    {
      label: t.lowStock[locale],
      value: stats?.lowStockItems || 0,
      icon: TrendingDown,
      description: "Below threshold",
      color: "text-primary",
      bg: "bg-muted/50"
    },
    {
      label: t.notAvailable[locale],
      value: stats?.outOfStockItems || 0,
      icon: AlertCircle,
      description: "Out of stock / Hidden",
      color: "text-primary",
      bg: "bg-muted/50"
    }
  ];

  const chartData = [
    { name: 'Available', value: stats?.availableItems || 0, color: 'hsl(var(--primary))' },
    { name: 'Low Stock', value: stats?.lowStockItems || 0, color: 'hsl(var(--muted-foreground))' },
    { name: 'Not Available', value: stats?.outOfStockItems || 0, color: 'hsl(var(--destructive))' },
  ].filter(d => d.value > 0);

  const chartConfig = {
    available: { label: "Available", color: "hsl(var(--chart-2))" },
    lowStock: { label: "Low Stock", color: "hsl(var(--chart-3))" },
    notAvailable: { label: "Not Available", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

  return (
    <div className="container py-8 space-y-8 max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <LayoutDashboard className="size-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Inventory Hub</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t.title[locale]}
          </h1>
          <p className="text-muted-foreground font-medium">
            {t.subtitle[locale]}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border shadow-none h-11" asChild>
            <Link href={`/${locale}/inventory`}>
              <BoxSelect className="mr-2 size-4" />
              {inv.viewAll[locale]}
            </Link>
          </Button>
          <Button asChild className="shadow-none h-11 px-6 font-semibold">
            <Link href={`/${locale}/inventory/new`}>
              <Plus className="mr-2 size-4" />
              {inv.addItem[locale]}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <Card key={idx} className="border-border shadow-none rounded-none first:rounded-l-lg last:rounded-r-lg md:border-r-0 md:last:border-r">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{card.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium truncate">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Recent Items Table */}
        <Card className="md:col-span-4 border-border shadow-none rounded-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <History className="size-5 text-primary" />
                {inv.recentActivity[locale]}
              </CardTitle>
              <CardDescription>Most recent inventory updates</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-bold" asChild>
              <Link href={`/${locale}/inventory`}>{inv.viewAll[locale]} <ArrowRight className="ml-1 size-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">{inv.itemName[locale]}</TableHead>
                  <TableHead className="hidden sm:table-cell">{inv.sku[locale]}</TableHead>
                  <TableHead>{inv.quantity[locale]}</TableHead>
                  <TableHead>{inv.status[locale]}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentItems.length > 0 ? (
                  recentItems.map((item) => (
                    <TableRow key={item._id} className="group hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => router.push(`/${locale}/inventory/${item._id}`)}>
                      <TableCell className="pl-6 font-semibold py-4">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          <span className="text-[10px] text-muted-foreground sm:hidden">{item.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-4 font-mono text-xs">{item.sku}</TableCell>
                      <TableCell className="py-4 font-bold">
                        {item.quantity} <span className="text-[10px] font-normal text-muted-foreground uppercase">{item.unit}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn(
                          "rounded px-2 py-0.5 font-semibold text-[10px] uppercase shadow-none",
                          item.status === 'available' ? "border-emerald-500/20 bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700 border-red-500/20"
                        )}>
                          {item.status === 'available' ? inv.statusAvailable[locale] : inv.statusNotAvailable[locale]}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                        <Box className="size-10 opacity-20" />
                        <p className="text-sm font-medium">{common.noData[locale]}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stock Chart */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border-border shadow-none rounded-lg overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BoxSelect className="size-5 text-muted-foreground" />
                {inv.stockDistribution[locale]}
              </CardTitle>
              <CardDescription>Overall inventory health ratio</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 flex flex-col justify-center min-h-[250px]">
              {stats?.totalItems ? (
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px]">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      strokeWidth={2}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground h-[200px]">
                  <TrendingDown className="size-10 opacity-20 mb-2" />
                  <p className="text-xs font-semibold">NO STATS DATA</p>
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pb-6 pt-4">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs font-bold text-muted-foreground uppercase">{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t flex flex-col gap-1 p-4">
              <div className="flex justify-between w-full text-xs font-semibold">
                <span className="text-muted-foreground uppercase">{inv.lastUpdated[locale]}</span>
                <span className="tabular-nums font-mono">{new Date().toLocaleString()}</span>
              </div>
            </CardFooter>
          </Card>
          
          {/* Quick Actions (Mini Card) */}
          <Card className="border-border shadow-none rounded-lg bg-muted/20">
            <CardHeader className="pb-3 border-b border-border/50 bg-muted/30">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                {inv.quickActions[locale]}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-4">
              <Button variant="outline" size="sm" className="h-9 text-xs font-bold shadow-none">
                <Plus className="mr-2 size-3" /> {inv.addItem[locale]}
              </Button>
              <Button variant="outline" size="sm" className="h-9 text-xs font-bold shadow-none">
                <FileText className="mr-2 size-3" /> {inv.exportCSV[locale]}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}