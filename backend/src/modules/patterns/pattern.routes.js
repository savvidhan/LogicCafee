import express from "express";
import { create, getAll, getOne } from "./pattern.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Pattern Routes
 * - Create is protected (admin / future use)
 * - Get routes are public
 */
router.post("/", protect, create);
router.get("/", getAll);
router.get("/:id", getOne);

export default router;
