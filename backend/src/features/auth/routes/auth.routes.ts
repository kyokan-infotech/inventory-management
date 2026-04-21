import { Router } from "express";
import { login, logout, getMe, register } from "../controller/auth.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { protect } from "../../../middlewares/auth.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;