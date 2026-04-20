import { Router } from "express";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controller/category.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { protect } from "../../../middlewares/auth.js";
import { createCategorySchema, updateCategorySchema } from "../schema/category.schema.js";

const router = Router();

router.use(protect);

router.get("/", getAllCategories);
router.post("/", validate(createCategorySchema), createCategory);
router.patch("/:id", validate(updateCategorySchema), updateCategory);
router.delete("/:id", deleteCategory);

export default router;