import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    res.status(400).json({
      success: false,
      message: "Validation error",
      errors,
    });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      message: "Duplicate key error",
      errors: ["A record with this value already exists"],
    });
    return;
  }

  if (process.env.NODE_ENV === "production") {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } else {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: [err.stack],
    });
  }
};