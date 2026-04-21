import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { Category } from "../features/category/model/category.model.js";
import { InventoryItem } from "../features/inventory/model/inventory.model.js";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.development") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/inventory-management";

const categories = [
  { name_en: "Electronics", name_jp: "電化製品" },
  { name_en: "Furniture", name_jp: "家具" },
  { name_en: "Food & Beverage", name_jp: "飲食物" },
  { name_en: "Office Supplies", name_jp: "オフィス用品" },
  { name_en: "Textiles", name_jp: "繊維製品" },
];

const units = ["pcs", "kg", "box", "litre", "set"];

const items = [
  { name: "MacBook Pro M2", sku: "LAP-MBP-01", quantity: 15, unit: "pcs", lowStockThreshold: 5, description: "Apple MacBook Pro M2 Space Gray" },
  { name: "Ergonomic Chair", sku: "FUR-CHR-02", quantity: 8, unit: "pcs", lowStockThreshold: 3, description: "Black mesh ergonomic desk chair" },
  { name: "Organic Green Tea", sku: "FNB-TEA-03", quantity: 50, unit: "box", lowStockThreshold: 10, description: "Premium Japanese green tea bags" },
  { name: "A4 Printing Paper", sku: "OFF-PAP-04", quantity: 200, unit: "box", lowStockThreshold: 20, description: "High-quality white A4 paper" },
  { name: "Cotton T-Shirt Blue", sku: "TEX-TSH-05", quantity: 0, unit: "pcs", lowStockThreshold: 15, status: "not_available", description: "Blue 100% cotton large t-shirt" },
  { name: "Wireless Mouse", sku: "ACC-MOU-06", quantity: 4, unit: "pcs", lowStockThreshold: 10, description: "Silent wireless mouse" }, // Low stock
  { name: "Coffee Beans 1kg", sku: "FNB-COF-07", quantity: 12, unit: "kg", lowStockThreshold: 5, description: "Roasted Arabica coffee beans" },
  { name: "LED Monitor 27\"", sku: "LAP-MON-08", quantity: 0, unit: "pcs", lowStockThreshold: 5, status: "not_available", description: "4K LED Monitor 27 inch" }, // Out of stock
  { name: "Desk Mat", sku: "OFF-MAT-09", quantity: 25, unit: "pcs", lowStockThreshold: 5, description: "Large felt desk mat" },
  { name: "Standing Desk", sku: "FUR-DSK-10", quantity: 3, unit: "pcs", lowStockThreshold: 5, description: "Electric adjustable standing desk" }, // Low stock
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Clear existing data (optional, but requested implicitly by "seed database so we can list them")
    // We'll clear to ensure a predictable state for the UI demonstration
    console.log("Clearing existing inventory and categories...");
    await InventoryItem.deleteMany({});
    await Category.deleteMany({});

    console.log("Seeding categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories.`);

    console.log("Seeding inventory items...");
    const itemsToInsert = items.map((item, index) => {
      // Assign categories cyclically for demonstration
      const category = createdCategories[index % createdCategories.length];
      return {
        ...item,
        category_id: category._id,
      };
    });

    const createdItems = await InventoryItem.insertMany(itemsToInsert);
    console.log(`Seeded ${createdItems.length} items.`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
