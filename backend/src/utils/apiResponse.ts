import { Response } from "express";

export interface ApiResponseData {
  [key: string]: unknown;
}

export const sendSuccess = (res: Response, message: string, data: ApiResponseData | null = null): void => {
  res.status(200).json({ success: true, message, data });
};

export const sendCreated = (res: Response, message: string, data: ApiResponseData | null = null): void => {
  res.status(201).json({ success: true, message, data });
};

export const sendError = (res: Response, message: string, errors?: string[]): void => {
  res.status(400).json({ success: false, message, errors });
};

export const sendBadRequest = (res: Response, message: string, errors?: string[]): void => {
  res.status(400).json({ success: false, message, errors });
};

export const sendUnauthorized = (res: Response, message: string): void => {
  res.status(401).json({ success: false, message });
};

export const sendForbidden = (res: Response, message: string): void => {
  res.status(403).json({ success: false, message });
};

export const sendNotFound = (res: Response, message: string): void => {
  res.status(404).json({ success: false, message });
};

export const sendConflict = (res: Response, message: string, errors?: string[]): void => {
  res.status(409).json({ success: false, message, errors });
};

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const sendPaginated = (
  res: Response,
  message: string,
  data: ApiResponseData | ApiResponseData[],
  meta: PaginationMeta
): void => {
  res.status(200).json({ success: true, message, data, meta });
};