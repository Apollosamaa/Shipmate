import express from "express";
import { createService } from "../controllers/serviceController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/services",protect, createService);

export default router;