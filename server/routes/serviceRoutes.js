import express from "express";
import { createService, getServices, getServicesByUser, searchServices } from "../controllers/serviceController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/services",protect, createService);
router.get("/services", getServices);
router.get("/services/user/:id",protect,  getServicesByUser);

router.get("/services/search", searchServices);

export default router;