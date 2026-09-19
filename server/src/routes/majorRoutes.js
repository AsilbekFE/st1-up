import express from "express";
import {
  getAllMajors,
  getMajorById,
  recommendMajor,
} from "../controllers/majorController.js";

const router = express.Router();

router.get("/", getAllMajors);
router.get("/:id", getMajorById);
router.post("/recommend", recommendMajor);

export default router;
