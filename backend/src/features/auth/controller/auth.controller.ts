import { Request, Response } from "express";
import { Admin } from "../model/admin.model.js";
import { sendSuccess, sendUnauthorized, sendError } from "../../utils/apiResponse.js";
import { generateToken } from "../../utils/jwt.js";
import { loginSchema } from "../schema/auth.schema.js";

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`);
    sendError(res, "Validation failed", errors);
    return;
  }

  const { email, password } = result.data;

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin) {
    sendUnauthorized(res, "Invalid email or password");
    return;
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    sendUnauthorized(res, "Invalid email or password");
    return;
  }

  const token = generateToken({ id: admin._id.toString(), email: admin.email });

  sendSuccess(res, "Login successful", {
    token,
    admin: { id: admin._id, email: admin.email },
  });
};

export const logout = (_req: Request, res: Response): void => {
  sendSuccess(res, "Logged out successfully", null);
};

export const getMe = (req: Request, res: Response): void => {
  sendSuccess(res, "Admin fetched", { id: req.admin?.id, email: req.admin?.email });
};