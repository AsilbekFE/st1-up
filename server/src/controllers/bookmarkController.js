import prisma from "../config/prisma.js";

// @desc    Toggle bookmark (add if not exists, remove if exists)
// @route   POST /api/bookmarks/toggle
// @access  Private
export const toggleBookmark = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.body;
    const userId = req.user.id;

    if (!targetType || !targetId || !["UNIVERSITY", "SCHOLARSHIP"].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "targetType ('UNIVERSITY' yoki 'SCHOLARSHIP') va targetId ko'rsatilishi shart.",
      });
    }

    const numericId = parseInt(targetId, 10);

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType,
          targetId: numericId,
        },
      },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return res.json({
        success: true,
        bookmarked: false,
        message: "Saqlanganlardan olib tashlandi",
      });
    } else {
      const created = await prisma.bookmark.create({
        data: {
          userId,
          targetType,
          targetId: numericId,
        },
      });
      return res.status(201).json({
        success: true,
        bookmarked: true,
        message: "Saqlanganlarga qo'shildi",
        data: created,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarks
// @route   GET /api/bookmarks
// @access  Private
export const getMyBookmarks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Enrich bookmarks
    const universityIds = bookmarks
      .filter((b) => b.targetType === "UNIVERSITY")
      .map((b) => b.targetId);

    const scholarshipIds = bookmarks
      .filter((b) => b.targetType === "SCHOLARSHIP")
      .map((b) => b.targetId);

    const universities = await prisma.university.findMany({
      where: { id: { in: universityIds } },
    });

    const scholarships = await prisma.scholarship.findMany({
      where: { id: { in: scholarshipIds } },
    });

    res.json({
      success: true,
      data: {
        bookmarks,
        universities,
        scholarships,
      },
    });
  } catch (error) {
    next(error);
  }
};
