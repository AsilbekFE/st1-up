import express from "express";
import {
  getAdmissionInfo,
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} from "../controllers/admissionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/info", getAdmissionInfo);
router.post("/apply", protect, submitApplication);
router.get("/my-applications", protect, getMyApplications);

// Admin only
router.get("/all", protect, adminOnly, getAllApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

export default router;
