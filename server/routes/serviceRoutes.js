import express from "express";
import { createService, getServices, getServicesByUser, searchServices, applyService } from "../controllers/serviceController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/services",protect, createService);
router.get("/services", getServices);
router.get("/services/user/:id",protect,  getServicesByUser);

//saerch services
router.get("/services/search", searchServices);

//apply for service
router.put("/services/apply/:id", protect, applyService);

export default router;