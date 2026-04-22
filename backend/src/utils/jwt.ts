import jwt from "jsonwebtoken";
import { AdminPayload } from "../types/express.js";

export const generateToken = (payload: AdminPayload): string => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
  
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): AdminPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    return jwt.verify(token, secret) as AdminPayload;
  } catch {
    return null;
  }
};