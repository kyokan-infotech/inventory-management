import { Request, Response } from "express";
import { ActivityLog } from "../model/activityLog.model.js";
import { sendSuccess } from "../../../utils/apiResponse.js";

export const getActivityLogs = async (_req: Request, res: Response): Promise<void> => {
  const logs = await ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("item_id", "name sku");

  sendSuccess(res, "Activity logs fetched", logs);
};