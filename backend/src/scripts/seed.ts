import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../features/category/model/category.model";
import { InventoryItem } from "../features/inventory/model/inventory.model";

dotenv.config({ path: ".env.development" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.development");
  process.exit(1);
}

const categories = [
  { name_en: "Electronics", name_jp: "電化製品" },
  { name_en: "Office Supplies", name_jp: "オフィス用品" },
  { name_en: "Furniture", name_jp: "家具" },
  { name_en: "Kitchenware", name_jp: "キッチン用品" },
  { name_en: "Stationery", name_jp: "文房具" },
];

const getSampleItems = (categoryIds: string[]) => [
  {
    name: "MacBook Pro M3",
    sku: "ELEC-MBP-001",
    category_id: categoryIds[0],
    quantity: 15,
    unit: "pcs",
    lowStockThreshold: 5,
    status: "available",
    description: "Latest MacBook Pro with M3 chip",
  },
  {
    name: "Ergonomic Chair",
    sku: "FURN-CHR-002",
    category_id: categoryIds[2],
    quantity: 25,
    unit: "pcs",
    lowStockThreshold: 10,
    status: "available",
    description: "High-back mesh ergonomic office chair",
  },
  {
    name: "A4 Paper Bundle",
    sku: "OFFC-PPR-003",
    category_id: categoryIds[1],
    quantity: 100,
    unit: "box",
    lowStockThreshold: 20,
    status: "available",
    description: "80gsm high-quality A4 office paper",
  },
  {
    name: "Coffee Machine",
    sku: "KTCH-CFE-004",
    category_id: categoryIds[3],
    quantity: 8,
    unit: "pcs",
    lowStockThreshold: 3,
    status: "available",
    description: "Automatic espresso and coffee maker",
  },
  {
    name: "Gel Pens (Blue)",
    sku: "STAT-PEN-005",
    category_id: categoryIds[4],
    quantity: 500,
    unit: "pcs",
    lowStockThreshold: 50,
    status: "available",
    description: "Smooth writing blue gel pens, 0.5mm",
  },
  {
    name: "Monitor 27-inch 4K",
    sku: "ELEC-MON-006",
    category_id: categoryIds[0],
    quantity: 2,
    unit: "pcs",
    lowStockThreshold: 5,
    status: "available",
    description: "High-resolution 4K monitor for professionals",
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected successfully!");

    // Clear existing data
    console.log("Clearing existing data...");
    await InventoryItem.deleteMany({});
    await Category.deleteMany({});
    console.log("Data cleared.");

    // Seed categories
    console.log("Seeding categories...");
    const createdCategories = await Category.insertMany(categories);
    const categoryIds = createdCategories.map((c) => (c._id as any).toString());
    console.log(`${createdCategories.length} categories created.`);

    // Seed inventory
    console.log("Seeding inventory items...");
    const sampleItems = getSampleItems(categoryIds);
    const createdItems = await InventoryItem.insertMany(sampleItems);
    console.log(`${createdItems.length} inventory items created.`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seed();
