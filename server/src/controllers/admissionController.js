import prisma from "../config/prisma.js";

// @desc    Get admission info (steps, required docs, FAQs)
// @route   GET /api/admissions/info
// @access  Public
export const getAdmissionInfo = async (req, res, next) => {
  try {
    const steps = await prisma.admissionStep.findMany({ orderBy: { order: "asc" } });
    const docs = await prisma.admissionDoc.findMany({ orderBy: { order: "asc" } });
    const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });

    res.json({
      success: true,
      data: {
        steps,
        docs,
        faqs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit an admission application
// @route   POST /api/admissions/apply
// @access  Private
export const submitApplication = async (req, res, next) => {
  try {
    const { universityId, programName, fullName, phone, email, notes } = req.body;

    if (!universityId || !fullName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Universitet, ism, telefon va email to'ldirilishi shart.",
      });
    }

    const uni = await prisma.university.findUnique({
      where: { id: parseInt(universityId, 10) },
    });

    if (!uni) {
      return res.status(404).json({
        success: false,
        message: "Ko'rsatilgan universitet topilmadi.",
      });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        universityId: parseInt(universityId, 10),
        programName: programName || uni.specialty,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        notes: notes || "",
        status: "PENDING",
      },
      include: {
        university: {
          select: { id: true, name: true, city: true, image: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Arizangiz muvaffaqiyatli topshirildi!",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's submitted applications
// @route   GET /api/admissions/my-applications
// @access  Private
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: {
        university: {
          select: { id: true, name: true, city: true, image: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/admissions/all
// @access  Private (Admin)
export const getAllApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        university: { select: { id: true, name: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/admissions/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Noto'g'ri status (PENDING, APPROVED, REJECTED bo'lishi kerak)",
      });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: `Ariza holati ${status} ga o'zgartirildi`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};
