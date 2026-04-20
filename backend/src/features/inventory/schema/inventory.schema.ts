import { z } from "zod";

export const createInventorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category_id: z.string().min(1, "Category is required"),
  quantity: z.number().int().min(0, "Quantity cannot be negative"),
  unit: z.enum(["pcs", "kg", "box", "litre", "set"]),
  lowStockThreshold: z.number().int().min(0).nullable().optional(),
  status: z.enum(["available", "not_available"]).optional(),
  description: z.string().optional().nullable(),
});

export const updateInventorySchema = createInventorySchema.partial();

export const toggleStatusSchema = z.object({
  status: z.enum(["available", "not_available"]),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  status: z.enum(["available", "not_available", "all"]).default("all"),
  category: z.string().optional(),
  sortBy: z.enum(["name", "quantity", "updatedAt"]).default("updatedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type ToggleStatusInput = z.infer<typeof toggleStatusSchema>;
export type ListQueryInput = z.infer<typeof listQuerySchema>;