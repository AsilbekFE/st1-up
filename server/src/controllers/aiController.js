import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are EduUZ AI, an intelligent university and education assistant for the EduUZ platform.
Your primary purpose is to help users find information about universities, scholarships, majors, admissions, tuition fees, requirements, deadlines, and student life in Uzbekistan.
Respond accurately, friendly, and in the same language as the user (mainly Uzbek).
If data is not available, state politely that information is not available.`;

const KNOWLEDGE_BASE_FALLBACK = [
  {
    keywords: ["salom", "assalomu", "qalaysiz"],
    response: "Assalomu alaykum! EduUZ platformasining AI maslahatchisiman. Sizga O'zbekistondagi universitetlar, grantlar va yo'nalishlar bo'yicha qanday yordam bera olaman?",
  },
  {
    keywords: ["inha", "it", "koreya"],
    response: "INHA Universiteti Toshkentda joylashgan yetakchi IT universiteti bo'lib, Janubiy Koreya dasturlari asosida o'qitiladi. Kontrakt narxi taxminan 25 mln so'm/yil.",
  },
  {
    keywords: ["wiut", "westminster", "biznes"],
    response: "WIUT (Vestminster) Toshkentdagi eng nufuzli xalqaro universitetlardan biri bo'lib, biznes, moliya va axborot texnologiyalari yo'nalishlarida Buyuk Britaniya diplomi beriladi.",
  },
  {
    keywords: ["grant", "stipendiya", "el-yurt"],
    response: "O'zbekistonda eng mashhur grant dasturlari: 'El-yurt umidi' jamg'armasi grantlari, Prezident stipendiyasi hamda OTMlarga kirish uchun 100% davlat grantlari mavjud.",
  },
  {
    keywords: ["qabul", "hujjat", "imtihon"],
    response: "Qabul odatda DTM (UzBMS) portali va OTMlarning o'z rasmiy sayti orqali amalga oshiriladi. Asosiy hujjatlar: Pasport (ID), attestat/diplom, 3x4 rasm va til sertifikatlari.",
  },
];

export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Xabar kiritilishi shart." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== "" && apiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-lite",
          systemInstruction: SYSTEM_PROMPT,
        });

        const chat = model.startChat({
          history: history.slice(-8).map((msg) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.text || msg.content || "" }],
          })),
        });

        const result = await chat.sendMessage(message);
        const answer = result.response.text();

        return res.json({
          success: true,
          answer,
          source: "gemini",
        });
      } catch (geminiError) {
        console.warn("Gemini API error, using fallback knowledge base:", geminiError.message);
      }
    }

    // Fallback response from knowledge base
    const lower = message.toLowerCase();
    const matched = KNOWLEDGE_BASE_FALLBACK.find((item) =>
      item.keywords.some((kw) => lower.includes(kw))
    );

    const fallbackAnswer = matched
      ? matched.response
      : "EduUZ AI: Savolingiz uchun rahmat! Universitetlar, grantlar va ta'lim yo'nalishlari haqida batafsil ma'lumotni yuqoridagi menyulardan ko'rishingiz yoki maxsus so'rov berishingiz mumkin.";

    res.json({
      success: true,
      answer: fallbackAnswer,
      source: "fallback",
    });
  } catch (error) {
    next(error);
  }
};
