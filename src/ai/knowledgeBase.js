const universities = [
  { name: "INHA Universiteti", category: "Davlat", specialty: "IT va Texnologiya", city: "Toshkent", fee: "~25 000 000 so'm/yil", ranking: "IT bo'yicha #1", info: "Koreya standartlari asosida IT va logistika sohasidagi yetakchi universitet." },
  { name: "WIUT (Westminster)", category: "Xalqaro", specialty: "Biznes", city: "Toshkent", fee: "~35 000 000 so'm/yil", ranking: "Biznes bo'yicha #1", info: "Buyuk Britaniya dasturlari asosida biznes yo'nalishidagi xalqaro universitet." },
  { name: "Amity Universiteti", category: "Xalqaro", specialty: "IT va Texnologiya", city: "Toshkent", fee: "~30 000 000 so'm/yil", ranking: "Innovatsiya", info: "Hindistonning yirik xususiy universiteti, innovatsion dasturlar va zamonaviy kampus." },
  { name: "TATU", category: "Davlat", specialty: "IT va Texnologiya", city: "Toshkent", fee: "~7 000 000 so'm/yil", ranking: "Texnologiya bo'yicha #2", info: "Toshkent axborot texnologiyalari universiteti." },
  { name: "TDTU", category: "Davlat", specialty: "IT va Texnologiya", city: "Toshkent", fee: "~6 500 000 so'm/yil", ranking: "Muhandislik bo'yicha #1", info: "Islom Karimov nomidagi Toshkent davlat texnika universiteti." },
  { name: "O'zMU", category: "Davlat", specialty: "Tibbiyot", city: "Toshkent", fee: "~7 500 000 so'm/yil", ranking: "Tadqiqot bo'yicha #1", info: "O'zbekiston Milliy universiteti." },
  { name: "TDIU", category: "Davlat", specialty: "Biznes", city: "Toshkent", fee: "~7 000 000 so'm/yil", ranking: "Moliya bo'yicha #2", info: "Toshkent davlat iqtisodiyot universiteti." },
  { name: "MDIS", category: "Xalqaro", specialty: "Biznes", city: "Toshkent", fee: "~28 000 000 so'm/yil", ranking: "Xalqaro #3", info: "Singapur menejmentni rivojlantirish instituti." },
  { name: "Kimyo Xalqaro", category: "Xususiy", specialty: "Tibbiyot", city: "Toshkent", fee: "~20 000 000 so'm/yil", ranking: "Xususiy #1", info: "Ko'p tarmoqli xususiy universitet." },
  { name: "Turin Politexnika", category: "Davlat", specialty: "IT va Texnologiya", city: "Toshkent", fee: "~12 000 000 so'm/yil", ranking: "Muhandislik bo'yicha #2", info: "Avtomobilsozlik va mashinasozlik bo'yicha yuqori darajadagi ta'lim." },
  { name: "SamDU", category: "Davlat", specialty: "San'at", city: "Samarqand", fee: "~5 500 000 so'm/yil", ranking: "Tarixiy #1", info: "Samarqand davlat universiteti." },
  { name: "TMA", category: "Davlat", specialty: "Tibbiyot", city: "Toshkent", fee: "~8 000 000 so'm/yil", ranking: "Tibbiyot bo'yicha #1", info: "Toshkent tibbiyot akademiyasi." },
];

const scholarships = [
  { name: "Prezident stipendiyasi", amount: "3 000 000 so'm/oy", type: "Davlat", req: "O'rtacha ball 90+", desc: "A'lo baholarga o'qiyotgan va ilmiy faoliyat bilan shug'ullanuvchi talabalar uchun." },
  { name: "El-yurt umidi stipendiyasi", amount: "2 500 000 so'm/oy", type: "Davlat", req: "IELTS 6.0+ yoki TOEFL 80+", desc: "Xorijiy tillarni biladigan iqtidorli talabalar uchun." },
  { name: "IT ta'lim granti", amount: "To'liq qoplash", type: "Xususiy", req: "IT fanlaridan yuqori ball", desc: "IT sohasida o'qishni istaydigan yoshlar uchun." },
  { name: "Xalqaro almashinuv dasturi", amount: "10 000$ gacha", type: "Xalqaro", req: "GPA 3.5+ va til sertifikati", desc: "Chet el universitetlarida bir semestr o'qish imkoniyati." },
  { name: "Mahalliy hokimlik stipendiyasi", amount: "1 500 000 so'm/oy", type: "Davlat", req: "O'rtacha ball 80+", desc: "Viloyat va tuman hokimliklari tomonidan ajratiladigan stipendiyalar." },
  { name: "Korporativ ta'lim granti", amount: "To'liq qoplash", type: "Xususiy", req: "Tanlov asosida", desc: "Yirik kompaniyalar tomonidan taklif qilinadigan grantlar." },
];

const admissions = [
  "Yo'nalishni tanlang — o'zingizga mos keladigan ta'lim yo'nalishini aniqlang.",
  "Universitetni toping — tanlagan yo'nalishingiz bo'yicha eng yaxshi universitetlarni qiyoslang.",
  "Hujjatlarni tayyorlang — pasport, diplom, til sertifikati va boshqa zarur hujjatlarni to'plang.",
  "Ariza topshiring — tanlangan universitetga onlayn yoki oflayn tarzda ariza topshiring.",
  "Imtihonlarni topshiring — kirish imtihonlari va suhbatlarda qatnashing.",
  "Ro'yxatdan o'ting — muvaffaqiyatli o'tganingizdan so'ng, talabalar safiga qo'shiling.",
];

function uniEntry(u) {
  return {
    keywords: [u.name.toLowerCase(), ...u.name.toLowerCase().split(/[\s()]+/), ...u.specialty.toLowerCase().split(/[\s]+/)],
    category: "universitet",
    answer: `📚 ${u.name}\n🏛 Turi: ${u.category}\n📍 Manzil: ${u.city}\n📖 Yo'nalish: ${u.specialty}\n💰 To'lov: ${u.fee}\n⭐ Reyting: ${u.ranking}\nℹ ${u.info}`,
    priority: 2,
  };
}

export const knowledgeEntries = [
  ...universities.map(uniEntry),

  // ---- BY CATEGORY ----
  { keywords: ["davlat", "davlat universitetlari", "davlat otm"], category: "universitet", answer: `Davlat universitetlari:\n${universities.filter((u) => u.category === "Davlat").map((u) => `• ${u.name}`).join("\n")}`, priority: 1 },
  { keywords: ["xususiy", "xususiy universitet", "private"], category: "universitet", answer: `Xususiy universitetlar:\n${universities.filter((u) => u.category === "Xususiy").map((u) => `• ${u.name}`).join("\n")}`, priority: 1 },
  { keywords: ["xalqaro", "xalqaro universitet", "international"], category: "universitet", answer: `Xalqaro universitetlar:\n${universities.filter((u) => u.category === "Xalqaro").map((u) => `• ${u.name}`).join("\n")}`, priority: 1 },

  // ---- BY SPECIALTY ----
  ...[
    { spec: "IT va Texnologiya", extras: ["it", "texnologiya", "dasturlash", "kompyuter", "programming", "tex"] },
    { spec: "Biznes", extras: ["biznes", "iqtisod", "moliya", "marketing", "business", "economy"] },
    { spec: "Tibbiyot", extras: ["tibbiyot", "meditsina", "shifokor", "doktor", "medical", "medicine"] },
    { spec: "San'at", extras: ["san'at", "sanat", "dizayn", "arxitektura", "art", "design"] },
  ].map(({ spec, extras }) => ({
    keywords: [...spec.toLowerCase().split(/[\s]+/), spec.toLowerCase(), ...extras],
    category: "universitet",
    answer: `${spec} yo'nalishidagi universitetlar:\n${universities.filter((u) => u.specialty === spec).map((u) => `• ${u.name} (${u.fee}) — ${u.city}`).join("\n")}`,
    priority: 1,
  })),

  // ---- BY CITY ----
  ...["Toshkent", "Samarqand"].map((city) => ({
    keywords: [city.toLowerCase(), `${city.toLowerCase()} universitetlari`, `${city.toLowerCase()}dagi universitetlar`],
    category: "universitet",
    answer: `${city} shahridagi universitetlar:\n${universities.filter((u) => u.city === city).map((u) => `• ${u.name} — ${u.specialty}`).join("\n")}`,
    priority: 1,
  })),

  // ---- ALL ----
  { keywords: ["barcha universitetlar", "hamma universitetlar", "universitetlar royxati", "ro'yxat", "lista", "all universities"], category: "universitet", answer: `Platformada ${universities.length} ta universitet mavjud:\n${universities.map((u) => `• ${u.name} (${u.specialty}, ${u.city})`).join("\n")}`, priority: 1 },

  // ---- TUITION FEES ----
  { keywords: ["to'lov", "tolov", "kontrakt", "tuition", "fee", "narx", "narxi", "baho", "qancha"], category: "tolov", answer: `Universitetlar bo'yicha to'lov miqdorlari:\n${universities.map((u) => `• ${u.name}: ${u.fee}`).join("\n")}\n\nEng arzon: SamDU (~5 500 000 so'm/yil)\nEng qimmat: WIUT (~35 000 000 so'm/yil)`, priority: 1 },

  // ---- RANKINGS ----
  { keywords: ["reyting", "reytinglar", "ranking", "rank", "eng yaxshi", "top", "best"], category: "reyting", answer: `🏆 Reytinglar:\n• INHA — IT bo'yicha #1\n• WIUT — Biznes bo'yicha #1\n• TMA — Tibbiyot bo'yicha #1\n• SamDU — Tarixiy #1\n• TDTU — Muhandislik bo'yicha #1\n• O'zMU — Tadqiqot bo'yicha #1\n• TDIU — Moliya bo'yicha #2\n• TATU — Texnologiya bo'yicha #2\n• Turin Politexnika — Muhandislik bo'yicha #2`, priority: 1 },

  // ---- COMPARISON ----
  { keywords: ["solishtir", "taqqosla", "comparison", "compare", "farq", "qaysi yaxshi"], category: "taqqoslash", answer: `Universitetlarni solishtirish:\n\nINHA (IT #1) vs TATU (IT #2):\n• INHA: ~25 mln so'm/yil, Xalqaro standart, Koreya dasturi\n• TATU: ~7 mln so'm/yil, Davlat, mahalliy dastur\n\nWIUT vs TDIU (Biznes):\n• WIUT: ~35 mln so'm/yil, Buyuk Britaniya diplomi\n• TDIU: ~7 mln so'm/yil, Davlat, arzon\n\nTMA vs O'zMU (Tibbiyot):\n• TMA: ~8 mln so'm/yil, Tibbiyot #1\n• O'zMU: ~7.5 mln so'm/yil, ko'p tarmoqli`, priority: 1 },

  // ---- WHICH UNIVERSITY TO CHOOSE ----
  { keywords: ["qaysi universitet", "tanla", "tanlash", "choose", "which university", "tavsiya", "maslahat"], category: "tanlov", answer: `To'g'ri universitet tanlash uchun quyidagilarni bilishingiz kerak:\n\n1. Qaysi yo'nalish sizni qiziqtiradi? (IT, Biznes, Tibbiyot, San'at)\n2. Byudjetingiz qancha? (5-35 mln so'm/yil)\n3. Davlat, xususiy yoki xalqaro universitet?\n4. Qaysi shaharda o'qishni xohlaysiz?\n5. O'rtacha ball yoki GPA qancha?\n\nIltimos, yuqoridagi savollarga javob bering, men sizga eng mos universitetni topishda yordam beraman.`, priority: 1 },

  // ---- INTERNATIONAL EDUCATION ----
  { keywords: ["xalqaro talim", "chet el", "abroad", "international education", "xorij", "overseas", "global"], category: "xalqaro", answer: `Xalqaro ta'lim imkoniyatlari:\n\nO'zbekistondagi xalqaro universitetlar:\n• WIUT (Westminster) — Britaniya dasturi\n• Amity — Hindiston dasturi\n• MDIS — Singapur dasturi\n\nXalqaro almashinuv dasturlari:\n• Xalqaro almashinuv dasturi — 10 000$ gacha grant\n• Talab: GPA 3.5+ va til sertifikati\n\nChet elda o'qish uchun:\n• IELTS 6.0+ yoki TOEFL 80+\n• O'rtacha ball yuqori bo'lishi kerak`, priority: 1 },

  // ---- STUDENT LIFE ----
  { keywords: ["student life", "talaba hayoti", "student", "yotoqxona", "kampus", "stipendiya", "turmush"], category: "talaba", answer: `O'zbekistonda talaba hayoti:\n\n🏠 Yotoqxona: Ko'pchilik davlat universitetlari yotoqxona bilan ta'minlaydi\n💰 Stipendiyalar: Prezident (3 mln), El-yurt umidi (2.5 mln), hokimlik (1.5 mln)\n📚 Kutubxona: Barcha universitetlarda zamonaviy kutubxonalar mavjud\n🍽 Ovqatlanish: Universitetlarda oshxona va bufetlar mavjud\n🚍 Transport: Talabalar uchun imtiyozli transport kartalari`, priority: 1 },

  // ---- ACADEMIC REQUIREMENTS ----
  { keywords: ["talab", "shart", "requirement", "qabul shartlari", "ball", "gpa", "sertifikat", "hujjat", "imtihon"], category: "talab", answer: `Qabul uchun umumiy talablar:\n\n📄 Hujjatlar: Pasport, shahodatnoma, 6 dona 3x4 foto, tibbiy ma'lumotnoma (086), til sertifikati\n📊 O'rtacha ball: Kamida 70+ (davlat), 80+ (xalqaro)\n🌐 Til sertifikati: IELTS 6.0+ / TOEFL 80+ (xalqaro universitetlar uchun)\n✍ Kirish imtihonlari: Tanlangan yo'nalishga qarab\n🗓 Deadline: Qabul odatda iyul-avgust oylarida`, priority: 1 },

  // ---- DEADLINES ----
  { keywords: ["deadline", "muddat", "oxirgi kun", "qabul qachon", "qachon", "vaqt", "sana"], category: "muddat", answer: `Qabul muddatlari:\n\n📅 Davlat universitetlari: Iyul — Avgust\n📅 Xalqaro universitetlar: Iyun — Sentyabr\n📅 Xususiy universitetlar: Iyul — Sentyabr\n\nAniq muddatlar universitetga qarab farq qilishi mumkin. Batafsil ma'lumot uchun universitetning rasmiy saytiga murojaat qiling.`, priority: 1 },

  // ---- SCHOLARSHIPS ----
  ...scholarships.map((s) => ({
    keywords: [s.name.toLowerCase(), ...s.name.toLowerCase().split(/[\s]+/), "stipendiya", "grant"],
    category: "stipendiya",
    answer: `💰 ${s.name}\nMiqdor: ${s.amount}\nTuri: ${s.type}\nTalab: ${s.req}\n${s.desc}`,
    priority: 2,
  })),
  { keywords: ["barcha stipendiyalar", "stipendiyalar", "grantlar", "hamma stipendiyalar", "mavjud stipendiyalar"], category: "stipendiya", answer: `Mavjud stipendiya va grantlar:\n${scholarships.map((s) => `• ${s.name} — ${s.amount} (${s.type})`).join("\n")}`, priority: 1 },
  { keywords: ["davlat stipendiyasi", "davlat granti"], category: "stipendiya", answer: `Davlat stipendiyalari:\n${scholarships.filter((s) => s.type === "Davlat").map((s) => `• ${s.name} — ${s.amount}\n  Talab: ${s.req}`).join("\n")}`, priority: 1 },

  // ---- ADMISSIONS ----
  ...admissions.map((step, i) => ({
    keywords: [...step.toLowerCase().split(/[\s]+/).filter((w) => w.length > 3), `qadam ${i + 1}`, `step ${i + 1}`],
    category: "qabul",
    answer: `📋 Qabul jarayoni ${i + 1}-qadam: ${step}`,
    priority: 2,
  })),
  { keywords: ["qabul", "qabul jarayoni", "qanday topshirish", "hujjat topshirish", "ariza", "royxatdan otish"], category: "qabul", answer: `📋 Qabul jarayoni 6 qadam:\n${admissions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nBatafsil ma'lumotni Universities va Majors sahifalarida olishingiz mumkin.`, priority: 1 },
  { keywords: ["hujjat", "kerakli hujjatlar", "qanday hujjat", "docs", "documents"], category: "qabul", answer: "Kerakli hujjatlar:\n1. Pasport nusxasi\n2. O'rta ma'lumot shahodatnomasi\n3. 6 dona 3x4 fotosurat\n4. Tibbiy ma'lumotnoma (forma 086)\n5. Til sertifikati (agar kerak bo'lsa)", priority: 1 },

  // ---- MAJORS ----
  ...["IT va Texnologiya", "Biznes va Menejment", "Tibbiyot", "San'at va Dizayn", "Huquqshunoslik", "Pedagogika"].map((m) => ({
    keywords: [m.toLowerCase(), ...m.toLowerCase().split(/[\s]+/)],
    category: "yonalish",
    answer: `📖 ${m} yo'nalishi mavjud. Universitetlar sahifasida har bir yo'nalish bo'yicha batafsil ma'lumot olishingiz mumkin.`,
    priority: 1,
  })),
  { keywords: ["yonalish", "yonalishlar", "barcha yonalishlar", "qanday yonalishlar", "majors", "mutaxassislik", "program"], category: "yonalish", answer: "Mavjud yo'nalishlar:\n• IT va Texnologiya\n• Biznes va Menejment\n• Tibbiyot\n• San'at va Dizayn\n• Huquqshunoslik\n• Pedagogika\n\nHar bir yo'nalish haqida batafsil ma'lumotni Majors sahifasida olishingiz mumkin.", priority: 1 },

  // ---- FAQ / PLATFORM ----
  { keywords: ["eduuz", "platforma", "bu nima", "sayt haqida", "loyiha", "about"], category: "umumiy", answer: "EduUZ — O'zbekiston universitetlari, yo'nalishlari, stipendiyalari va qabul jarayoni haqida to'liq ma'lumot beruvchi platforma. Universitetlarni qiyoslash, filtrlash va batafsil ko'rish imkoniyati mavjud.", priority: 1 },
  { keywords: ["salom", "assalom", "hayr", "hello", "hi", "hey", "assalomu", "vaalaykum"], category: "umumiy", answer: "Salom! 👋 EduUZ AI yordamchisiga xush kelibsiz! Menga O'zbekiston universitetlari, yo'nalishlar, stipendiyalar, qabul jarayoni, to'lovlar, reytinglar va talaba hayoti haqida savol berishingiz mumkin.", priority: 3 },
  { keywords: ["kim yaratdi", "kim yasadi", "creator", "muallif", "kim"], category: "umumiy", answer: "EduUZ loyihasi O'zbekistonlik yosh dasturchilar jamoasi tomonidan yaratilgan.", priority: 1 },
  { keywords: ["rahmat", "thanks", "thank", "tashakkur"], category: "umumiy", answer: "Arzimaydi! 😊 Yana savollaringiz bo'lsa, so'rashingiz mumkin. O'qishingizda omad!", priority: 3 },
  { keywords: ["xayr", "goodbye", "bye", "sog", "boling"], category: "umumiy", answer: "Xayr! 🎓 O'qishingizda muvaffaqiyat tilayman. Yana savolingiz bo'lsa, biz bilan bog'laning.", priority: 3 },
];
