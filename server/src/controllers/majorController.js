import prisma from "../config/prisma.js";

// @desc    Get all majors
// @route   GET /api/majors
// @access  Public
export const getAllMajors = async (req, res, next) => {
  try {
    const majors = await prisma.major.findMany({
      orderBy: { id: "asc" },
    });

    res.json({
      success: true,
      count: majors.length,
      data: majors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get major by ID
// @route   GET /api/majors/:id
// @access  Public
export const getMajorById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const major = await prisma.major.findUnique({
      where: { id },
    });

    if (!major) {
      return res.status(404).json({ success: false, message: "Yo'nalish topilmadi" });
    }

    // Find related universities
    const relatedUniversities = await prisma.university.findMany({
      where: {
        specialty: {
          contains: major.title.split(" ")[0],
        },
      },
      select: {
        id: true,
        name: true,
        city: true,
        category: true,
        image: true,
      },
      take: 6,
    });

    res.json({
      success: true,
      data: {
        ...major,
        relatedUniversities,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recommend major based on quiz answers
// @route   POST /api/majors/recommend
// @access  Public
export const recommendMajor = async (req, res, next) => {
  try {
    const { answers } = req.body;
    // answers can be an array of selected options, e.g. ["technology", "logical", "high_salary"]
    
    // Default fallback recommendation logic
    const allMajors = await prisma.major.findMany();

    let recommended = allMajors[0];
    let matchScore = 95;

    if (answers && Array.isArray(answers)) {
      const answersText = answers.join(" ").toLowerCase();
      if (answersText.includes("kiber") || answersText.includes("xavfsizlik") || answersText.includes("security")) {
        recommended = allMajors.find((m) => m.title.toLowerCase().includes("kibxavfsizlik")) || recommended;
      } else if (answersText.includes("biznes") || answersText.includes("menejment") || answersText.includes("iqtisod")) {
        recommended = allMajors.find((m) => m.title.toLowerCase().includes("biznes")) || recommended;
      } else if (answersText.includes("tibbiyot") || answersText.includes("shifokor") || answersText.includes("pediatriya")) {
        recommended = allMajors.find((m) => m.title.toLowerCase().includes("pediatriya") || m.title.toLowerCase().includes("tibbiyot")) || recommended;
      } else if (answersText.includes("sun'iy") || answersText.includes("ai") || answersText.includes("dasturlash")) {
        recommended = allMajors.find((m) => m.title.toLowerCase().includes("sun'iy")) || recommended;
      }
    }

    res.json({
      success: true,
      data: {
        major: recommended,
        matchScore: `${matchScore}%`,
        advice: `${recommended.title} sohasida O'zbekistonda va xalqaro miqyosda yuqori talab mavjud. O'rtacha stipendiya va maosh: ${recommended.stipendiya}.`,
      },
    });
  } catch (error) {
    next(error);
  }
};
