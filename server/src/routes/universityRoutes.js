import express from "express";
import {
  getAllUniversities,
  getUniversityById,
  incrementView,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../controllers/universityController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllUniversities);
router.get("/:id", getUniversityById);
router.post("/:id/view", incrementView);

// Admin only routes
router.post("/", protect, adminOnly, createUniversity);
router.put("/:id", protect, adminOnly, updateUniversity);
router.delete("/:id", protect, adminOnly, deleteUniversity);

export default router;
