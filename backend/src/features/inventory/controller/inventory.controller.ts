import { Request, Response } from "express";
import mongoose from "mongoose";
import { InventoryItem } from "../model/inventory.model.js";
import { createInventorySchema, updateInventorySchema, toggleStatusSchema, listQuerySchema, ToggleStatusInput } from "../schema/inventory.schema.js";
import { ActivityLog } from "../../activityLog/model/activityLog.model.js";
import { sendSuccess, sendNotFound, sendConflict, sendBadRequest, sendPaginated, PaginationMeta } from "../../../utils/apiResponse.js";

export const getAllInventory = async (req: Request, res: Response): Promise<void> => {
  const query = listQuerySchema.safeParse(req.query);
  if (!query.success) {
    const errors = query.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    sendBadRequest(res, "Invalid query parameters", errors);
    return;
  }

  const { page, limit, search, status, category, sortBy, order } = query.data;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { deletedAt: null };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  if (status && status !== "all") {
    filter.status = status;
  }

  if (category) {
    filter.category_id = category;
  }

  const sort: Record<string, 1 | -1> = { [sortBy]: order === "asc" ? 1 : -1 };

  const [items, total] = await Promise.all([
    InventoryItem.find(filter as any).sort(sort).skip(skip).limit(limit).populate("category_id"),
    InventoryItem.countDocuments(filter as any),
  ]);

  const totalPages = Math.ceil(total / limit);

  const meta: PaginationMeta = { page, limit, total, totalPages };
  sendPaginated(res, "Items fetched", items, meta);
};

export const getInventoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    sendNotFound(res, "Item not found");
    return;
  }

  const item = await InventoryItem.findOne({ _id: id, deletedAt: null }).populate("category_id");

  if (!item) {
    sendNotFound(res, "Item not found");
    return;
  }

  sendSuccess(res, "Item fetched", item);
};

export const createInventory = async (req: Request, res: Response): Promise<void> => {
  const result = createInventorySchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    sendBadRequest(res, "Validation failed", errors);
    return;
  }

  const { name, sku, category_id, quantity, unit, lowStockThreshold, status, description } = result.data;

  const existing = await InventoryItem.findOne({ sku: sku.toUpperCase() });
  if (existing) {
    sendConflict(res, "SKU already exists");
    return;
  }

  const item = await InventoryItem.create({
    name,
    sku: sku.toUpperCase(),
    category_id,
    quantity,
    unit,
    lowStockThreshold: lowStockThreshold ?? null,
    status: status || "available",
    description: description || null,
  });

  await ActivityLog.create({
    action: "created",
    item_id: item._id,
    item_name: item.name,
    performed_by: req.admin?.email || "admin",
  });

  await item.populate("category_id");
  sendSuccess(res, "Item created", item);
};

export const updateInventory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = updateInventorySchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    sendBadRequest(res, "Validation failed", errors);
    return;
  }

  const { name, sku, category_id, quantity, unit, lowStockThreshold, status, description } = result.data;

  const item = await InventoryItem.findOne({ _id: id, deletedAt: null });
  if (!item) {
    sendNotFound(res, "Item not found");
    return;
  }

  if (sku && sku.toUpperCase() !== item.sku) {
    const existing = await InventoryItem.findOne({ sku: sku.toUpperCase() });
    if (existing) {
      sendConflict(res, "SKU already exists");
      return;
    }
    item.sku = sku.toUpperCase();
  }

  if (name) item.name = name;
  if (category_id) item.category_id = new mongoose.Types.ObjectId(category_id);
  if (quantity !== undefined) item.quantity = quantity;
  if (unit) item.unit = unit;
  if (lowStockThreshold !== undefined) item.lowStockThreshold = lowStockThreshold ?? null;
  if (status) item.status = status;
  if (description !== undefined) item.description = description || null;

  await item.save();

  await ActivityLog.create({
    action: "updated",
    item_id: item._id,
    item_name: item.name,
    performed_by: req.admin?.email || "admin",
  });

  await item.populate("category_id");
  sendSuccess(res, "Item updated", item);
};

export const deleteInventory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const item = await InventoryItem.findOne({ _id: id, deletedAt: null });
  if (!item) {
    sendNotFound(res, "Item not found");
    return;
  }

  item.deletedAt = new Date();
  await item.save();

  await ActivityLog.create({
    action: "deleted",
    item_id: item._id,
    item_name: item.name,
    performed_by: req.admin?.email || "admin",
  });

  sendSuccess(res, "Item deleted", null);
};

export const toggleStatus = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = toggleStatusSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    sendBadRequest(res, "Validation failed", errors);
    return;
  }

  const { status } = result.data as ToggleStatusInput;

  const item = await InventoryItem.findOne({ _id: id, deletedAt: null });
  if (!item) {
    sendNotFound(res, "Item not found");
    return;
  }

  item.status = status;
  await item.save();

  await ActivityLog.create({
    action: "updated",
    item_id: item._id,
    item_name: item.name,
    performed_by: req.admin?.email || "admin",
  });

  await item.populate("category_id");
  sendSuccess(res, "Status updated", item);
};