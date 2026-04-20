import jwt from "jsonwebtoken";
import { AdminPayload } from "../types/express.js";

export const generateToken = (payload: AdminPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token: string): AdminPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "") as AdminPayload;
  } catch {
    return null;
  }
};