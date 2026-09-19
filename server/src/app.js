import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import majorRoutes from "./routes/majorRoutes.js";
import scholarshipRoutes from "./routes/scholarshipRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "*", // allow frontend Vite dev server or production build
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "EduUZ Backend API muvaffaqiyatli ishlayapti",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/universities", universityRoutes);
app.use("/api/majors", majorRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/admissions", admissionRoutes);
app.use("/api/statistics", statsRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/ai", aiRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
