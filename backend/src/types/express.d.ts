import { Request } from "express";

export interface AdminPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}