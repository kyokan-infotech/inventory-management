"use client";

import { translations } from "@/lib/translations";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  quantity: number;
  lowStockThreshold: number | null;
  lang?: "en" | "ja";
}

export default function StatusBadge({ status, quantity, lowStockThreshold, lang = "en" }: StatusBadgeProps) {
  const isLowStock = lowStockThreshold !== null && quantity <= lowStockThreshold;

  if (status !== "available") {
    return (
      <Badge variant="destructive" className="uppercase tracking-tight text-[10px] font-bold rounded shadow-none">
        {translations.inventory.statusNotAvailable[lang]}
      </Badge>
    );
  }
  
  if (isLowStock) {
    return (
      <Badge variant="warning" className="uppercase tracking-tight text-[10px] font-bold rounded shadow-none">
        {translations.inventory.statusLowStock[lang]}
      </Badge>
    );
  }
  
  return (
    <Badge variant="success" className="uppercase tracking-tight text-[10px] font-bold rounded shadow-none">
      {translations.inventory.statusAvailable[lang]}
    </Badge>
  );
}
