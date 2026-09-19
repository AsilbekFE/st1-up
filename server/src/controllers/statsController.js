import prisma from "../config/prisma.js";

// @desc    Get dashboard statistics
// @route   GET /api/statistics
// @access  Public
export const getStatistics = async (req, res, next) => {
  try {
    const totalUniversities = await prisma.university.count();
    const totalMajors = await prisma.major.count();
    const totalScholarships = await prisma.scholarship.count();
    const totalApplications = await prisma.application.count();

    const davlatCount = await prisma.university.count({ where: { category: "Davlat" } });
    const xalqaroCount = await prisma.university.count({ where: { category: "Xalqaro" } });
    const xususiyCount = await prisma.university.count({ where: { category: "Xususiy" } });

    // Top recommended universities
    const topUniversities = await prisma.university.findMany({
      where: { isFeatured: true },
      take: 3,
      select: {
        id: true,
        name: true,
        category: true,
        city: true,
        specialty: true,
        image: true,
        views: true,
        rankLabel: true,
      },
      orderBy: { views: "desc" },
    });

    res.json({
      success: true,
      data: {
        counts: {
          universities: totalUniversities,
          majors: totalMajors,
          scholarships: totalScholarships,
          applications: totalApplications,
          students: "150,000+",
        },
        categories: {
          davlat: davlatCount,
          xalqaro: xalqaroCount,
          xususiy: xususiyCount,
        },
        scores: {
          minScore: 56.7,
          avgScore: 118.4,
          maxScore: 189.0,
        },
        topRecommendations: topUniversities,
      },
    });
  } catch (error) {
    next(error);
  }
};
