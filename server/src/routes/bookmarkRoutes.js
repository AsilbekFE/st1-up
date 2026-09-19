import express from "express";
import { toggleBookmark, getMyBookmarks } from "../controllers/bookmarkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/toggle", protect, toggleBookmark);
router.get("/", protect, getMyBookmarks);

export default router;
