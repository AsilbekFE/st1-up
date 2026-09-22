import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../config/prisma.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "eduuz_super_secret_jwt_key_2026_secure",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Iltimos, barcha maydonlarni to'ldiring.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Email manzili noto'g'ri formatda.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Parol kamida 6 ta belgidan iborat bo'lishi shart.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Bu email bilan ro'yxatdan o'tilgan. Iltimos, tizimga kiring.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email va parolni kiriting.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email yoki parol noto'g'ri.",
      });
    }

    // Google OAuth orqali ro'yxatdan o'tgan foydalanuvchi parol bilan kira olmaydi
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Bu hisob Google orqali yaratilgan. Iltimos, Google bilan kiring.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email yoki parol noto'g'ri.",
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Tizimga muvaffaqiyatli kirdingiz!",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        applications: {
          include: {
            university: {
              select: { id: true, name: true, image: true, city: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        bookmarks: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth login / register
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google token topilmadi.",
      });
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!GOOGLE_CLIENT_ID) {
      return res.status(501).json({
        success: false,
        message: "Google login hozircha sozlanmagan. Iltimos, email bilan kiring.",
      });
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Foydalanuvchini topish yoki yaratish
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email: email.toLowerCase(),
          password: await bcrypt.hash(googleId + "google_oauth_secret", 10),
          avatar: picture || null,
          role: "USER",
        },
      });
    } else if (picture && !user.avatar) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { avatar: picture },
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Google orqali muvaffaqiyatli kirdingiz!",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Google OAuth error:", error.message);
    res.status(401).json({
      success: false,
      message: "Google orqali kirishda xatolik. Iltimos, email bilan kiring.",
    });
  }
};
