import express from "express";
import { createService, getServices, getServicesByUser, searchServices, applyService, saveService, getServiceById, deleteService, getMyApplicants, updateApplicantStatus } from "../controllers/serviceController.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/services",protect, createService);
router.get("/services", getServices);
router.get("/services/user/:id",protect,  getServicesByUser);

//saerch services
router.get("/services/search", searchServices);

//apply for service
router.put("/services/apply/:id", protect, applyService);

//save services and unsave
router.put("/services/save/:id", protect, saveService);

//get service by id 
router.get("/services/:id", protect, getServiceById);

//delete service
router.delete("/services/:id", protect, deleteService);

// Get all applicants for services owned by the logged-in provider
router.get("/my-services/applicants", protect, getMyApplicants);

//update services applicants status
router.put("/services/:id/applicants/:applicantId", protect, updateApplicantStatus);

export default router;