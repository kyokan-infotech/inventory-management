import { z } from "zod";

export const createCategorySchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_jp: z.string().min(1, "Japanese name is required"),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;