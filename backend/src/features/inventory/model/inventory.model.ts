import mongoose, { Document, Schema } from "mongoose";

export type UnitType = "pcs" | "kg" | "box" | "litre" | "set";
export type InventoryStatus = "available" | "not_available";

export interface IInventoryItem extends Document {
  name: string;
  sku: string;
  category_id: mongoose.Types.ObjectId;
  quantity: number;
  unit: UnitType;
  lowStockThreshold: number | null;
  status: InventoryStatus;
  description: string | null;
  deletedAt: Date | null;
}

const inventorySchema = new Schema<IInventoryItem>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    unit: {
      type: String,
      enum: ["pcs", "kg", "box", "litre", "set"],
      required: [true, "Unit is required"],
    },
    lowStockThreshold: {
      type: Number,
      default: null,
      nullable: true,
    },
    status: {
      type: String,
      enum: ["available", "not_available"],
      default: "available",
    },
    description: {
      type: String,
      default: null,
      nullable: true,
    },
    deletedAt: {
      type: Date,
      default: null,
      nullable: true,
    },
  },
  {
    timestamps: true,
  }
);

inventorySchema.index({ name: "text", sku: "text" });

export const InventoryItem = mongoose.model<IInventoryItem>("InventoryItem", inventorySchema);