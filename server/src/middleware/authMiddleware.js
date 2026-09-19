import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "eduuz_super_secret_jwt_key_2026_secure"
      );

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true, avatar: true },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Foydalanuvchi topilmadi. Token yaroqsiz.",
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Avtorizatsiyadan o'tilmagan yoki token muddati o'tgan.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token taqdim etilmagan, ruxsat berilmadi.",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Bu amalni faqat administrator bajara oladi.",
    });
  }
};
