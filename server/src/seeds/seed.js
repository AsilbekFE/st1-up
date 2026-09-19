import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";

async function main() {
  console.log("🌱 Ma'lumotlar bazasini tozalash va ekish boshlandi...");

  // Clear existing
  await prisma.bookmark.deleteMany();
  await prisma.application.deleteMany();
  await prisma.program.deleteMany();
  await prisma.campusFeature.deleteMany();
  await prisma.university.deleteMany();
  await prisma.major.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.admissionStep.deleteMany();
  await prisma.admissionDoc.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.user.deleteMany();

  // 1. Users
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("admin123", salt);
  const userPassword = await bcrypt.hash("user123", salt);

  const admin = await prisma.user.create({
    data: {
      name: "EduUZ Admin",
      email: "admin@edu.uz",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Asilbek Talaba",
      email: "talaba@edu.uz",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("✅ Foydalanuvchilar yaratildi: admin@edu.uz / talaba@edu.uz");

  // 2. Universities
  const universitiesData = [
    {
      name: "INHA Universiteti",
      category: "Davlat",
      badge: "ENG YUQORI REYTING",
      badgeStyle: "bg-[#8af300]/95 text-black",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=85",
      description: "Koreya standartlari asosida Toshkentda IT va logistika sohasidagi yetakchi universitet.",
      rankLabel: "@ IT bo'yicha #1",
      specialty: "IT va Texnologiya",
      city: "Toshkent",
      initial: "I",
      isFeatured: true,
      views: 345,
      phone: "+998 71 246 77 77",
      email: "info@inha.uz",
      address: "Ziyolilar ko'chasi 9, Toshkent 100170",
      founded: "2014",
      students: "5,000+",
      website: "https://inha.uz",
      legacy: "2014-yilda tashkil etilgan INHA Universiteti Koreya va O'zbekiston hamkorligi asosida IT sohasida yetakchi mutaxassislar tayyorlaydi. O'zbekiston Milliy reytingida IT yo'nalishi bo'yicha #1 o'rinda turadi.",
      programs: [
        { icon: "💻", title: "Dasturiy ta'minot", desc: "Zamonaviy dasturlash tillari va texnologiyalar asosida ta'lim." },
        { icon: "📡", title: "Axborot xavfsizligi", desc: "Kiberxavfsizlik, kriptografiya va ma'lumotlarni himoya qilish." },
        { icon: "🤖", title: "Sun'iy intellekt", desc: "Mashina o'rganish, neyron tarmoqlar va AI ilovalari." },
        { icon: "📦", title: "Logistika", desc: "Xalqaro logistics va supply chain menejment." },
      ],
      campusFeatures: [
        { icon: "🖥️", title: "O'quv resurs markazi", desc: "Akademik diplom va metodlarni yoqlovchi markaziy baza." },
        { icon: "⚽", title: "Sport markazi", desc: "Olimp standartidagi sport va sog'lomlashish kompleksi." },
      ],
    },
    {
      name: "WIUT (Vestminster)",
      category: "Xalqaro",
      badge: "GLOBAL HAMKOR",
      badgeStyle: "bg-cyan-500/90 text-white",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=85",
      description: "Toshkentdagi Vestminster xalqaro universiteti Buyuk Britaniyaning nufuzli diplomini taqdim etadi.",
      rankLabel: "@ Biznes bo'yicha #1",
      specialty: "Biznes",
      city: "Toshkent",
      initial: "W",
      isFeatured: true,
      views: 412,
      phone: "+998 71 238 74 00",
      email: "info@wiut.uz",
      address: "Istiqbol ko'chasi 12, Toshkent 100047",
      founded: "2002",
      students: "3,000+",
      website: "https://wiut.uz",
      legacy: "WIUT — Toshkentdagi Vestminster xalqaro universiteti, Buyuk Britaniyaning University of Westminster bilan hamkorlikda xalqaro ta'lim beradi.",
      programs: [
        { icon: "💼", title: "Biznes boshqaruvi", desc: "Zamonaviy menejment, marketing va iqtisodiyot." },
        { icon: "💹", title: "Moliya", desc: "Bank tizimi, investitsiya va moliyaviy boshqaruv." },
        { icon: "📊", title: "Iqtisodiyot", desc: "Makro va mikroiqtisodiyot, jahon bozori tahlili." },
        { icon: "🌐", title: "Tijoriy huquq", desc: "Xalqaro biznes qonunlari, shartnomalar va talashuvlar." },
      ],
      campusFeatures: [
        { icon: "📚", title: "Elektron kutubxona", desc: "Oliy toifadagi ilmiy maqolalar va kitoblar bazasi." },
        { icon: "🏅", title: "Sport markazi", desc: "Zamonaviy sport inshootlari va trenajyor zallari." },
      ],
    },
    {
      name: "Amity Universiteti",
      category: "Xalqaro",
      badge: "YANGI AVLOD",
      badgeStyle: "bg-emerald-400 text-black",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=800&q=85",
      description: "Zamonaviy kampus va xalqaro o'quv dasturlariga ega yetakchi hindiston OTM filiali.",
      rankLabel: "@ Innovatsiya",
      specialty: "IT va Texnologiya",
      city: "Toshkent",
      initial: "A",
      isFeatured: true,
      views: 290,
      phone: "+998 71 207 90 06",
      email: "info@amity.uz",
      address: "Labzak ko'chasi 70, Toshkent",
      founded: "2019",
      students: "2,500+",
      website: "https://amity.uz",
      legacy: "Amity Universiteti Hindistonning eng yirik xususiy ta'lim guruhlaridan biri bo'lib, Toshkentda zamonaviy IT va biznes yo'nalishlarida mutaxassislar tayyorlaydi.",
      programs: [
        { icon: "💻", title: "Computer Science", desc: "Kompyuter ilmlari va dasturlash muhandisligi." },
        { icon: "📊", title: "Biznes tahlili", desc: "Data analytics va boshqaruv qarorlari." },
      ],
      campusFeatures: [
        { icon: "🏛️", title: "Zamonaviy IT Lab", desc: "Yuqori quvvatli kompyuter laboratoriyalari." },
      ],
    },
    {
      name: "TATU (Muhammad al-Xorazmiy)",
      category: "Davlat",
      badge: "@ Texnologiya bo'yicha #2",
      badgeStyle: "bg-blue-600/90 text-white",
      image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=800&q=85",
      description: "Toshkent axborot texnologiyalari universiteti. O'zbekiston texnologik kadrlar markazi.",
      rankLabel: "@ Texnologiya bo'yicha #2",
      specialty: "IT va Texnologiya",
      city: "Toshkent",
      initial: "T",
      isFeatured: false,
      views: 520,
      phone: "+998 71 238 64 89",
      email: "info@tuit.uz",
      address: "Amir Temur shoh ko'chasi 108, Toshkent",
      founded: "1955",
      students: "12,000+",
      website: "https://tuit.uz",
      legacy: "O'zbekistonning eng yirik va nufuzli IT universiteti.",
      programs: [
        { icon: "💻", title: "Dasturiy injiniring", desc: "Dasturlar yaratish va me'morchiligi." },
        { icon: "📡", title: "Telekommunikatsiya", desc: "Aloqa tarmoqlari va simsiz tizimlar." },
      ],
      campusFeatures: [
        { icon: "🏢", title: "Katta yotoqxona", desc: "Talabalar uchun qulay turar joy." },
      ],
    },
    {
      name: "TDTU",
      category: "Davlat",
      badge: "@ Muhandislik bo'yicha #1",
      badgeStyle: "bg-purple-600/90 text-white",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=85",
      description: "Islom Karimov nomidagi Toshkent davlat texnika universiteti.",
      rankLabel: "@ Muhandislik bo'yicha #1",
      specialty: "IT va Texnologiya",
      city: "Toshkent",
      initial: "T",
      isFeatured: false,
      views: 310,
      phone: "+998 71 246 46 00",
      email: "info@tdtu.uz",
      address: "Universitet ko'chasi 2, Toshkent",
      founded: "1920",
      students: "15,000+",
      website: "https://tdtu.uz",
      legacy: "Muhandislik va sanoat sohasidagi yetakchi milliy muassasa.",
    },
    {
      name: "O'zMU (Milliy Universitet)",
      category: "Davlat",
      badge: "@ Tadqiqot bo'yicha #1",
      badgeStyle: "bg-amber-600/90 text-white",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=85",
      description: "Mirzo Ulug'bek nomidagi O'zbekiston Milliy universiteti. Fundamental fanlar markazi.",
      rankLabel: "@ Tadqiqot bo'yicha #1",
      specialty: "Tibbiyot",
      city: "Toshkent",
      initial: "O",
      isFeatured: false,
      views: 380,
      phone: "+998 71 227 12 24",
      email: "info@nuu.uz",
      address: "Universitet ko'chasi 4, Toshkent",
      founded: "1918",
      students: "20,000+",
      website: "https://nuu.uz",
      legacy: "Markaziy Osiyodagi birinchi va eng qadimiy milliy universitet.",
    },
    {
      name: "TDIU (Iqtisodiyot)",
      category: "Davlat",
      badge: "@ Moliya bo'yicha #2",
      badgeStyle: "bg-green-600/90 text-white",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=85",
      description: "Toshkent davlat iqtisodiyot universiteti. Moliyaviy va iqtisodiy kelajak.",
      rankLabel: "@ Moliya bo'yicha #2",
      specialty: "Biznes",
      city: "Toshkent",
      initial: "T",
      isFeatured: false,
      views: 295,
      phone: "+998 71 239 01 49",
      email: "info@tsue.uz",
      address: "Islom Karimov ko'chasi 49, Toshkent",
      founded: "1931",
      students: "16,000+",
      website: "https://tsue.uz",
      legacy: "Mamlakatning bosh iqtisodiyot va moliya ta'lim dargohi.",
    },
    {
      name: "MDIS (Singapur Instituti)",
      category: "Xalqaro",
      badge: "@ Xalqaro #3",
      badgeStyle: "bg-indigo-600/90 text-white",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=85",
      description: "Toshkent shahridagi Singapur menejmentni rivojlantirish instituti.",
      rankLabel: "@ Xalqaro #3",
      specialty: "Biznes",
      city: "Toshkent",
      initial: "M",
      isFeatured: false,
      views: 240,
      phone: "+998 71 271 77 00",
      email: "info@mdis.uz",
      address: "Bunyodkor shoh ko'chasi 28, Toshkent",
      founded: "2007",
      students: "3,500+",
      website: "https://mdis.uz",
      legacy: "Singapur ta'lim modeli asosida xalqaro mutaxassislar tayyorlaydi.",
    },
    {
      name: "SamDU (Samarqand Davlat Universiteti)",
      category: "Davlat",
      badge: "@ Tarixiy Markaz",
      badgeStyle: "bg-rose-600/90 text-white",
      image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=85",
      description: "Sharof Rashidov nomidagi Samarqand davlat universiteti.",
      rankLabel: "@ Samarqand #1",
      specialty: "San'at",
      city: "Samarqand",
      initial: "S",
      isFeatured: false,
      views: 275,
      phone: "+998 66 239 11 40",
      email: "devonxona@samdu.uz",
      address: "Universitet xiyoboni 15, Samarqand",
      founded: "1420",
      students: "22,000+",
      website: "https://samdu.uz",
      legacy: "Ulug'bek madrasasi an'analari asosidagi qadimiy ilm markazi.",
    },
    {
      name: "Toshkent Tibbiyot Akademiyasi (TMA)",
      category: "Davlat",
      badge: "@ Tibbiyot #1",
      badgeStyle: "bg-teal-600/90 text-white",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=85",
      description: "O'zbekistondagi eng yetakchi tibbiyot oliygohi.",
      rankLabel: "@ Tibbiyot #1",
      specialty: "Tibbiyot",
      city: "Toshkent",
      initial: "T",
      isFeatured: false,
      views: 460,
      phone: "+998 71 150 78 25",
      email: "info@tma.uz",
      address: "Farobiy ko'chasi 2, Toshkent",
      founded: "1919",
      students: "9,000+",
      website: "https://tma.uz",
      legacy: "O'zbekistonda yuqori malakali shifokorlar tayyorlovchi asosiy baza.",
    },
  ];

  for (const uniData of universitiesData) {
    const { programs, campusFeatures, ...rest } = uniData;
    await prisma.university.create({
      data: {
        ...rest,
        programs: programs
          ? {
              create: programs,
            }
          : undefined,
        campusFeatures: campusFeatures
          ? {
              create: campusFeatures,
            }
          : undefined,
      },
    });
  }

  console.log(`✅ ${universitiesData.length} ta universitet yaratildi.`);

  // 3. Majors
  const majorsData = [
    {
      icon: "🤖",
      badge: "Top",
      badgeColor: "#00e5a0",
      title: "Sun'iy Intellekt",
      desc: "Mashina o'rganish, neyron tarmoqlar va ma'lumotlarni tahlil qilish chuqur o'rganish.",
      stipendiya: "$1,500+",
      universitetlar: 12,
      accent: "#6366f1",
    },
    {
      icon: "🛡️",
      badge: "Yangi",
      badgeColor: "#f59e0b",
      title: "Kibxavfsizlik",
      desc: "Raqamli biznes tizimlari va axborot xavfsizligi strategiyalarini o'rganing.",
      stipendiya: "$1,000+",
      universitetlar: 8,
      accent: "#8b5cf6",
    },
    {
      icon: "💼",
      badge: "Mashhur",
      badgeColor: "#60a5fa",
      title: "Biznes Boshqaruvi",
      desc: "Zamonaviy menejment, marketing va moliya-boshqaruvni o'rganish.",
      stipendiya: "$800+",
      universitetlar: 45,
      accent: "#06b6d4",
    },
    {
      icon: "🏥",
      badge: null,
      badgeColor: null,
      title: "Pediatriya",
      desc: "Bolalar salomatligi va rivojlanishiga e'tibor qaratuvchi fundamental tibbiyot yo'nalishi.",
      stipendiya: "$600+",
      universitetlar: 15,
      accent: "#10b981",
    },
    {
      icon: "🏛️",
      badge: null,
      badgeColor: null,
      title: "Arxitektura va Dizayn",
      desc: "Shaharsozlik, bino va inshootlar dizayni, 3D modellashtirish san'ati.",
      stipendiya: "$700+",
      universitetlar: 18,
      accent: "#ec4899",
    },
    {
      icon: "🦾",
      badge: "Kelajak",
      badgeColor: "#a855f7",
      title: "Robototexnika va Mexatronika",
      desc: "Avtomatlashtirilgan tizimlar, robotlar yaratish va dasturiy boshqaruv.",
      stipendiya: "$1,200+",
      universitetlar: 7,
      accent: "#3b82f6",
    },
    {
      icon: "🎮",
      badge: null,
      badgeColor: null,
      title: "Game Dizayn va Animatsiya",
      desc: "Kompyuter o'yinlari industriyasi, vizual effektlar va personajlar yaratish.",
      stipendiya: "$900+",
      universitetlar: 5,
      accent: "#f97316",
    },
    {
      icon: "📊",
      badge: "Trend",
      badgeColor: "#22c55e",
      title: "Data Science va Big Data",
      desc: "Katta hajmdagi ma'lumotlar tahlili, bashoratlash algoritmlari va vizualizatsiya.",
      stipendiya: "$1,400+",
      universitetlar: 10,
      accent: "#14b8a6",
    },
  ];

  for (const major of majorsData) {
    await prisma.major.create({ data: major });
  }
  console.log(`✅ ${majorsData.length} ta yo'nalish yaratildi.`);

  // 4. Scholarships
  const scholarshipsData = [
    {
      badge: "100% Qoplash",
      badgeColor: "#00e5a0",
      title: '"El-yurt umidi" jamg\'arma grantlari',
      desc: "Xorijiy davlatlarda tahsil oluvchi, magistratura, doktorantura va stajerlik dasturlarida o'qishni to'liq moliyalashtiradi.",
      tags: JSON.stringify(["100% Qoplash", "50 ta grant", "Xorijiy ta'lim"]),
      links: JSON.stringify(["IELTS 6.5+", "GPA 3.5+"]),
      color: "#1a2340",
      accent: "#00e5a0",
    },
    {
      badge: "Davlat granti",
      badgeColor: "#a78bfa",
      title: "OTMlarga kirish uchun davlat granti",
      desc: "O'zbekistonning barcha davlat oliy ta'lim muassasalari uchun test natijalariga asosan taqdim etiladi.",
      tags: JSON.stringify(["Bakalavr", "Magistratura", "Bepul ta'lim"]),
      links: JSON.stringify(["OTM test natijalari", "DTM ballari"]),
      color: "#1a2340",
      accent: "#a78bfa",
    },
    {
      badge: "Prezident granti",
      badgeColor: "#f59e0b",
      title: "Yangi O'zbekiston universiteti prezident granti",
      desc: "Iqtidorli o'quvchilar uchun o'qish uchun to'liq to'lovni qoplaydigan maxsus prezident granti.",
      tags: JSON.stringify(["To'liq stipendiya", "Tanlangan yo'nalishlar"]),
      links: JSON.stringify(["Olimpiada g'oliblari", "Xalqaro sertifikat"]),
      color: "#1a2340",
      accent: "#f59e0b",
    },
    {
      badge: "100% Qoplash",
      badgeColor: "#00e5a0",
      title: "WIUT Merit-based Scholarship",
      desc: "Eng yuqori akademik ko'rsatkichlarga ega bo'lgan 30 nafar talabaga ajratiladigan to'liq stipendiya dasturi.",
      tags: JSON.stringify(["100% Grant", "Merit Award"]),
      links: JSON.stringify(["Ichki matematika testi", "IELTS 7.0+"]),
      color: "#1a2340",
      accent: "#00e5a0",
    },
    {
      badge: "Ijtimoiy grant",
      badgeColor: "#60a5fa",
      title: "CAU Ijtimoiy grant dasturi",
      desc: "Ijtimoiy himoyaga muhtoj, nogironligi bo'lgan yoki kam ta'minlangan iqtidorli talabalar uchun ta'lim xarajatlarini qoplash dasturi.",
      tags: JSON.stringify(["Ijtimoiy himoya", "Hujjat talab qilinadi"]),
      links: JSON.stringify(["To'liq qoplash", "Shartnoma asosida"]),
      color: "#1a2340",
      accent: "#60a5fa",
    },
  ];

  for (const s of scholarshipsData) {
    await prisma.scholarship.create({ data: s });
  }
  console.log(`✅ ${scholarshipsData.length} ta grant yaratildi.`);

  // 5. Admissions Steps & FAQs
  const stepsData = [
    { order: 1, icon: "📋", title: "Ro'yxatdan o'tish", desc: "EduUZ platformasida ro'yxatdan o'ting va shaxsiy kabinetingizni yarating." },
    { order: 2, icon: "🏛️", title: "Imtihonlar", desc: "DTM yoki universitet test imtihonlarida qatnashing va natijangizni oling." },
    { order: 3, icon: "📁", title: "Hujjat topshirish", desc: "Universitetlarning rasmiy saytiga hujjatlaringizni yuklang va tasdiqlang." },
    { order: 4, icon: "✅", title: "Qabul", desc: "Qabul natijasi e'lon qilinishi bilan kabinet orqali javob olasiz." },
  ];

  for (const step of stepsData) {
    await prisma.admissionStep.create({ data: step });
  }

  const docsData = [
    { order: 1, icon: "🪪", title: "Pasport (ID karta)", desc: "Fuqarolik pasporti yoki ID kartangizning nusxasi talab etiladi." },
    { order: 2, icon: "🎓", title: "Diplom / Attestat", desc: "O'rta maktab yoki kollej diplomingizning tasdiqlangan nusxasi." },
    { order: 3, icon: "📸", title: "3x4 Fotosurat", desc: "Yaqinda olingan, oq fonda 3x4 o'lchamdagi rasm." },
    { order: 4, icon: "📝", title: "Sertifikatlar", desc: "IELTS, SAT yoki boshqa xalqaro sertifikatlar (mavjud bo'lsa)." },
  ];

  for (const doc of docsData) {
    await prisma.admissionDoc.create({ data: doc });
  }

  const faqsData = [
    { order: 1, question: "Qaysi universitetlarga murojaat qilishim mumkin?", answer: "EduUZ platformasi orqali O'zbekistondagi 50+ davlat va xususiy universitetlarga murojaat qilishingiz mumkin. Filtr yordamida shahar, yo'nalish va grant turini tanlang." },
    { order: 2, question: "Hujjatlarni qanday taqdim etish kerak?", answer: "Barcha hujjatlar raqamli shaklda — PDF yoki JPG formatida universitetning rasmiy portali orqali yuklanadi. Originallar qabul paytida taqdim etiladi." },
    { order: 3, question: "Subsidiya va grantlar qachon e'lon qilinadi?", answer: "Davlat granti natijalari odatda har yili Avgust oyida DTM saytida e'lon qilinadi. Xususiy universitetlar esa aprel-may oylarida o'z natijalari haqida xabar beradi." },
    { order: 4, question: "Chet el universiteti uchun qanday murojaat qilish mumkin?", answer: "Xorijiy universitetlarga kirish uchun IELTS/TOEFL, SAT/GRE sertifikatlari talab qilinadi. EduUZ platformasi yordamida to'g'ridan-to'g'ri arizangizni yuboring." },
    { order: 5, question: "Grant uchun minimum ball qancha?", answer: "Grant ballari har yili o'zgarib turadi. Odatda bakalavr uchun 56.7+ ball, magistratura uchun 60+ ball talab etiladi." },
  ];

  for (const faq of faqsData) {
    await prisma.faq.create({ data: faq });
  }

  // 6. Demo Application for demoUser
  const inha = await prisma.university.findFirst({ where: { name: { contains: "INHA" } } });
  if (inha) {
    await prisma.application.create({
      data: {
        userId: demoUser.id,
        universityId: inha.id,
        programName: "Dasturiy ta'minot",
        fullName: demoUser.name,
        phone: "+998 90 123 45 67",
        email: demoUser.email,
        status: "APPROVED",
        notes: "IELTS 7.5 sertifikati mavjud.",
      },
    });

    await prisma.bookmark.create({
      data: {
        userId: demoUser.id,
        targetType: "UNIVERSITY",
        targetId: inha.id,
      },
    });
  }

  console.log("🎉 Baza to'liq ma'lumotlar bilan to'ldirildi!");
}

main()
  .catch((e) => {
    console.error("❌ Xatolik yuz berdi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
