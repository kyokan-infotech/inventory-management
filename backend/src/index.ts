import dotenv from "dotenv";
const result = dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
if (result.error) {
  console.error("Error loading .env file:", result.error);
}
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { connectDB } from "./config/database.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import authRoutes from "./features/auth/routes/auth.routes.js";
import categoryRoutes from "./features/category/routes/category.routes.js";
import inventoryRoutes from "./features/inventory/routes/inventory.routes.js";
import activityLogRoutes from "./features/activityLog/routes/activityLog.routes.js";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "StockMate API",
      version: "1.0.0",
      description: "Bilingual Inventory Management API",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests" },
});
app.use("/api", limiter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "StockMate API running", env: process.env.NODE_ENV });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const startServer = async (): Promise<void> => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();

export default app;