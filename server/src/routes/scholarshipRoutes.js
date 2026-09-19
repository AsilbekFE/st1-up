import express from "express";
import {
  getAllScholarships,
  getScholarshipById,
} from "../controllers/scholarshipController.js";

const router = express.Router();

router.get("/", getAllScholarships);
router.get("/:id", getScholarshipById);

export default router;
