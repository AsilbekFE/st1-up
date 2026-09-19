import prisma from "../config/prisma.js";

// @desc    Get all scholarships
// @route   GET /api/scholarships
// @access  Public
export const getAllScholarships = async (req, res, next) => {
  try {
    const { search, badge } = req.query;
    const where = {};

    if (badge && badge !== "Barchasi") {
      where.badge = { contains: badge };
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { desc: { contains: q } },
      ];
    }

    const scholarships = await prisma.scholarship.findMany({
      where,
      orderBy: { id: "asc" },
    });

    // Parse JSON tags and links
    const parsed = scholarships.map((s) => ({
      ...s,
      tags: s.tags ? JSON.parse(s.tags) : [],
      links: s.links ? JSON.parse(s.links) : [],
    }));

    res.json({
      success: true,
      count: parsed.length,
      data: parsed,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
export const getScholarshipById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      return res.status(404).json({ success: false, message: "Grant topilmadi" });
    }

    res.json({
      success: true,
      data: {
        ...scholarship,
        tags: scholarship.tags ? JSON.parse(scholarship.tags) : [],
        links: scholarship.links ? JSON.parse(scholarship.links) : [],
      },
    });
  } catch (error) {
    next(error);
  }
};
