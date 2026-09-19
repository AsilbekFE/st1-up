import prisma from "../config/prisma.js";

// @desc    Get all universities with filtering & search
// @route   GET /api/universities
// @access  Public
export const getAllUniversities = async (req, res, next) => {
  try {
    const { category, city, specialty, search, featured } = req.query;

    const where = {};

    if (category && category !== "Barchasi") {
      where.category = category;
    }

    if (city && city !== "Barcha shaharlar") {
      where.city = { contains: city };
    }

    if (specialty && specialty !== "Barcha yo'nalishlar") {
      where.specialty = { contains: specialty };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { specialty: { contains: q } },
        { city: { contains: q } },
      ];
    }

    const universities = await prisma.university.findMany({
      where,
      include: {
        programs: true,
        campusFeatures: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { views: "desc" },
        { id: "asc" },
      ],
    });

    res.json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get university details by ID
// @route   GET /api/universities/:id
// @access  Public
export const getUniversityById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Noto'g'ri ID ko'rsatildi" });
    }

    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        programs: true,
        campusFeatures: true,
      },
    });

    if (!university) {
      return res.status(404).json({
        success: false,
        message: "Universitet topilmadi",
      });
    }

    res.json({
      success: true,
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment university views count
// @route   POST /api/universities/:id/view
// @access  Public
export const incrementView = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: "Noto'g'ri ID" });
    }

    const updated = await prisma.university.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
      select: { id: true, views: true },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new university (Admin)
// @route   POST /api/universities
// @access  Private (Admin)
export const createUniversity = async (req, res, next) => {
  try {
    const {
      name,
      category,
      badge,
      badgeStyle,
      image,
      description,
      rankLabel,
      specialty,
      city,
      initial,
      isFeatured,
      phone,
      email,
      address,
      founded,
      students,
      website,
      legacy,
      programs,
      campusFeatures,
    } = req.body;

    if (!name || !category || !specialty || !city || !description) {
      return res.status(400).json({
        success: false,
        message: "Nom, kategoriya, yo'nalish, shahar va tavsif to'ldirilishi shart.",
      });
    }

    const university = await prisma.university.create({
      data: {
        name,
        category,
        badge,
        badgeStyle,
        image,
        description,
        rankLabel,
        specialty,
        city,
        initial: initial || name.charAt(0).toUpperCase(),
        isFeatured: Boolean(isFeatured),
        phone,
        email,
        address,
        founded,
        students,
        website,
        legacy,
        programs: programs && Array.isArray(programs) ? {
          create: programs.map((p) => ({
            icon: p.icon || "📘",
            title: p.title,
            desc: p.desc,
          })),
        } : undefined,
        campusFeatures: campusFeatures && Array.isArray(campusFeatures) ? {
          create: campusFeatures.map((c) => ({
            icon: c.icon || "🏛️",
            title: c.title,
            desc: c.desc,
          })),
        } : undefined,
      },
      include: {
        programs: true,
        campusFeatures: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Universitet muvaffaqiyatli qo'shildi!",
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a university (Admin)
// @route   PUT /api/universities/:id
// @access  Private (Admin)
export const updateUniversity = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = { ...req.body };
    delete data.id;
    delete data.programs;
    delete data.campusFeatures;

    const university = await prisma.university.update({
      where: { id },
      data,
    });

    res.json({
      success: true,
      message: "Universitet ma'lumotlari yangilandi!",
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a university (Admin)
// @route   DELETE /api/universities/:id
// @access  Private (Admin)
export const deleteUniversity = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    await prisma.university.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Universitet o'chirildi.",
    });
  } catch (error) {
    next(error);
  }
};
