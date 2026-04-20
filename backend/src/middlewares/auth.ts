import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendUnauthorized } from "../utils/apiResponse.js";

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendUnauthorized(res, "No token provided");
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string; email: string };
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    sendUnauthorized(res, "Invalid or expired token");
  }
};