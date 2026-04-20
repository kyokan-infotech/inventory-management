import mongoose, { Document, Schema } from "mongoose";

export type ActivityAction = "created" | "updated" | "deleted";

export interface IActivityLog extends Document {
  action: ActivityAction;
  item_id: mongoose.Types.ObjectId;
  item_name: string;
  performed_by: string;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      enum: ["created", "updated", "deleted"],
      required: true,
    },
    item_id: {
      type: Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    item_name: {
      type: String,
      required: true,
    },
    performed_by: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);