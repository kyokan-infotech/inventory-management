import { Router } from "express";
import { getAllInventory, getInventoryById, createInventory, updateInventory, deleteInventory, toggleStatus } from "../controller/inventory.controller.js";
import { validate } from "../../middlewares/validate.js";
import { protect } from "../../middlewares/auth.js";
import { createInventorySchema, updateInventorySchema, toggleStatusSchema } from "../schema/inventory.schema.js";

const router = Router();

router.use(protect);

router.get("/", getAllInventory);
router.get("/:id", getInventoryById);
router.post("/", validate(createInventorySchema), createInventory);
router.patch("/:id", validate(updateInventorySchema), updateInventory);
router.delete("/:id", deleteInventory);
router.patch("/:id/toggle-status", validate(toggleStatusSchema), toggleStatus);

export default router;