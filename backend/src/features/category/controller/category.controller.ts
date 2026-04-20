import { Request, Response } from "express";
import { Category } from "../model/category.model.js";
import { sendSuccess, sendNotFound, sendConflict } from "../../../utils/apiResponse.js";

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  const categories = await Category.find().sort({ name_en: 1 });
  sendSuccess(res, "Categories fetched", categories);
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name_en, name_jp } = req.body;

  const existing = await Category.findOne({ name_en });
  if (existing) {
    sendConflict(res, "Category with this English name already exists");
    return;
  }

  const category = await Category.create({ name_en, name_jp });
  sendSuccess(res, "Category created", category);
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name_en, name_jp } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    sendNotFound(res, "Category not found");
    return;
  }

  if (name_en && name_en !== category.name_en) {
    const existing = await Category.findOne({ name_en });
    if (existing) {
      sendConflict(res, "Category with this English name already exists");
      return;
    }
    category.name_en = name_en;
  }

  if (name_jp) {
    category.name_jp = name_jp;
  }

  await category.save();
  sendSuccess(res, "Category updated", category);
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    sendNotFound(res, "Category not found");
    return;
  }

  await category.deleteOne();
  sendSuccess(res, "Category deleted", null);
};