import { useState, useEffect } from "react";

// University detail data - enriched per university id
const DETAIL_DATA = {
  1: {
    phone: "+998 71 246 77 77",
    email: "info@inha.uz",
    address: "Ziyolilar ko'chasi 9, Toshkent 100170",
    founded: "2014",
    students: "5000+",
    country: "Koreya/Davlat",
    website: "https://inha.uz",
    programs: [
      { icon: "💻", title: "Dasturiy ta'minot", desc: "Zamonaviy dasturlash tillari va texnologiyalar asosida ta'lim." },
      { icon: "📡", title: "Axborot xavfsizligi", desc: "Kiberxavfsizlik, kriptografiya va ma'lumotlarni himoya qilish." },
      { icon: "🤖", title: "Sun'iy intellekt", desc: "Mashina o'rganish, neyron tarmoqlar va AI ilovalari." },
      { icon: "📦", title: "Logistika", desc: "Xalqaro logistics va supply chain menejment." },
    ],
    campus: [
      { icon: "🖥️", title: "O'quv resurs markazi", desc: "Akademik diplom va metodlarni yoqlovchi markaziy baza." },
      { icon: "⚽", title: "Sport markazi", desc: "Olimp standartidagi sport va sog'lomlashish kompleksi." },
    ],
    legacy: "2014-yilda tashkil etilgan INHA Universiteti Koreya va O'zbekiston hamkorligi asosida IT sohasida yetakchi mutaxassislar tayyorlaydi. O'zbekiston Milliy reytingida IT yo'nalishi bo'yicha #1 o'rinda turadi va xorijiy sheriklar bilan keng faoliyat olib boradi.",
  },
  2: {
    phone: "+998 71 238 74 00",
    email: "info@wiut.uz",
    address: "Istiqbol ko'chasi 12, Toshkent 100047",
    founded: "2002",
    students: "3000+",
    country: "Britaniya/Xalqaro",
    website: "https://wiut.uz",
    programs: [
      { icon: "💼", title: "Biznes boshqaruvi", desc: "Zamonaviy menejment, marketing va iqtisodiyot." },
      { icon: "💹", title: "Moliya", desc: "Bank tizimi, investitsiya va moliyaviy boshqaruv." },
      { icon: "📊", title: "Iqtisodiyot", desc: "Makro va mikroiqtisodiyot, jahon bozori tahlili." },
      { icon: "🌐", title: "Tijoriy huquq", desc: "Xalqaro biznes qonunlari, shartnomalar va talashuvlar." },
    ],
    campus: [
      { icon: "📚", title: "Elektronik kutubxona", desc: "Oliy sinfli ilmiy maqolalar va kitoblar bazasi." },
      { icon: "🏅", title: "Sport markazi", desc: "Zamonaviy sport inshootlari va fitnes markazlari." },
    ],
    legacy: "WIUT — Toshkentdagi Vestminster xalqaro universiteti, Buyuk Britaniyaning University of Westminster bilan hamkorlikda ta'lim beradi. Bitiruvchilar xalqaro tan olingan diplom oladilar va dunyo bo'ylab ish qurolaydi.",
  },
};

function getDetail(uni) {
  if (uni.phone || uni.programs?.length) {
    return {
      phone: uni.phone || "+998 71 000 00 00",
      email: uni.email || "info@eduuz.uz",
      address: uni.address || `${uni.city}, O'zbekiston`,
      founded: uni.founded || "N/A",
      students: uni.students || "N/A",
      country: uni.category,
      website: uni.website || "#",
      programs: uni.programs && uni.programs.length > 0 ? uni.programs : [
        { icon: "📘", title: uni.specialty, desc: uni.description }
      ],
      campus: uni.campusFeatures && uni.campusFeatures.length > 0 ? uni.campusFeatures : [
        { icon: "🏛️", title: "Asosiy kampus", desc: "Zamonaviy o'quv binolari va laboratoriyalar mavjud." }
      ],
      legacy: uni.legacy || (uni.description + " Ushbu oliy ta'lim muassasasi O'zbekistonda yetakchi mutaxassislar tayyorlashda muhim o'rin tutadi."),
    };
  }
  return DETAIL_DATA[uni.id] || {
    phone: "+998 71 000 00 00",
    email: "info@eduuz.uz",
    address: `${uni.city}, O'zbekiston`,
    founded: "N/A",
    students: "N/A",
    country: uni.category,
    website: "#",
    programs: [
      { icon: "📘", title: uni.specialty, desc: uni.description },
    ],
    campus: [
      { icon: "🏛️", title: "Asosiy kampus", desc: "Zamonaviy o'quv binolari va laboratoriyalar mavjud." },
    ],
    legacy: uni.description + " Ushbu oliy ta'lim muassasasi O'zbekistonda yetakchi mutaxassislar tayyorlashda muhim o'rin tutadi.",
  };
}

export default function UniversityDetail({ university, onClose }) {
  const detail = getDetail(university);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    programName: detail.programs?.[0]?.title || university.specialty || "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eduuz_user");
      if (stored) {
        const u = JSON.parse(stored);
        setApplyForm((prev) => ({
          ...prev,
          fullName: u.name || "",
          email: u.email || "",
          programName: detail.programs?.[0]?.title || university.specialty || "",
        }));
      }
    } catch {}
  }, [detail, university]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (isApplyOpen) {
          setIsApplyOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, isApplyOpen]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("eduuz_token");
    if (!token) {
      setApplyError("Ariza topshirish uchun avval tizimga kiring.");
      return;
    }

    if (!applyForm.fullName || !applyForm.phone || !applyForm.email) {
      setApplyError("Iltimos, ism, telefon va emailni to'ldiring.");
      return;
    }

    setIsSubmitting(true);
    setApplyError("");

    try {
      const res = await fetch("/api/admissions/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          universityId: university.id,
          programName: applyForm.programName || university.specialty,
          fullName: applyForm.fullName,
          phone: applyForm.phone,
          email: applyForm.email,
          notes: applyForm.notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Arizani topshirishda xatolik yuz berdi");
      }

      setApplySuccess(true);
      setTimeout(() => {
        setIsApplyOpen(false);
        setApplySuccess(false);
      }, 2000);
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#f4ecd8] text-[#111111] overflow-y-auto flex flex-col justify-between">
      <div className="relative w-full bg-[#f4ecd8] flex-1 flex flex-col">

        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-3 left-3 z-20 px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-1.5 bg-[#f9f5ea] border-2 border-[#111111] gazeta-shadow-black hover:bg-[#c1121f] hover:text-white transition-all cursor-pointer text-[10px] sm:text-xs font-black uppercase newspaper-mono"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          ← ORQAGA
        </button>

        {/* Hero Banner */}
        <div className="relative w-full h-64 sm:h-80 md:h-[380px] border-b-2 sm:border-b-4 border-[#111111] bg-[#ede3cc]">
          {university.image ? (
            <img src={university.image} alt={university.name} className="w-full h-full object-cover filter sepia-[0.25] contrast-125" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#ede3cc]">
              <span className="text-7xl sm:text-9xl font-black text-[#111111]/20 newspaper-title">{university.initial}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-[#111111]/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-5 sm:pb-8">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap mb-1.5 sm:mb-2">
                <span className="text-[10px] sm:text-[11px] font-black uppercase px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#c1121f] text-white tracking-wider border border-[#111111] newspaper-mono">
                  {university.category} OTM
                </span>
                <span className="text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 sm:px-3 sm:py-1 bg-[#111111] text-white newspaper-mono border border-white">
                  {university.rankLabel || university.badge}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight newspaper-headline">
                {university.city}DAGI {university.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto w-full px-3 sm:px-6 md:px-12 py-6 sm:py-10">

          {/* LEFT: Main Info */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8 pr-0 lg:pr-8 border-b-2 lg:border-b-0 lg:border-r-2 border-[#111111] pb-6 sm:pb-8 lg:pb-0">

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-[#ede3cc] border-2 border-[#111111] p-2.5 sm:p-4 gazeta-shadow-black">
              {[
                { label: "REYTING", value: (university.rankLabel || university.badge).replace("@ ", "") },
                { label: "TALABALAR", value: detail.students },
                { label: "STATUS", value: detail.country.split("/")[0] },
              ].map((s) => (
                <div key={s.label} className="text-center border-r last:border-r-0 border-[#111111]/30 px-1">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-[#8b5a2b] newspaper-mono block">{s.label}</span>
                  <span className="mt-0.5 sm:mt-1 text-[#111111] font-black text-xs sm:text-base newspaper-mono block truncate">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Akademik meros */}
            <section className="bg-[#f9f5ea] border-2 border-[#111111] p-6 gazeta-shadow-wood">
              <span className="gazeta-stamp-red mb-2 block w-fit">★ TARIX VA NAMOZ ★</span>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#111111] mb-3 newspaper-headline">
                UNIVERSITETNING AKADEMIK NUFUSI
              </h2>
              <p className="font-serif text-sm leading-relaxed text-[#374151] text-justify">
                {detail.legacy}
              </p>
            </section>

            {/* Ta'lim Dasturlari */}
            <section>
              <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-2 mb-4">
                <span className="text-[#c1121f]">■</span>
                <h2 className="text-lg font-black uppercase tracking-tight text-[#111111] newspaper-headline">
                  ASOSIY MUTAXASSISLIKLAR VA FAKULTETLAR
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.programs.map((p, idx) => {
                  const isRed = idx % 2 === 0;
                  return (
                    <div key={p.title} className={`p-4 bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f]" : "border-[#111111]"} gazeta-shadow-black`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{p.icon}</span>
                        <h4 className="font-black text-sm uppercase newspaper-headline text-[#111111]">{p.title}</h4>
                      </div>
                      <p className="font-serif text-xs text-[#4b5563] leading-relaxed">{p.desc}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Kampus Sharoitlari */}
            <section>
              <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-2 mb-4">
                <span className="text-[#8b5a2b]">■</span>
                <h2 className="text-lg font-black uppercase tracking-tight text-[#111111] newspaper-headline">
                  KAMPUS VA TALABALAR HAYOTI
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.campus.map((c) => (
                  <div key={c.title} className="p-4 bg-[#ede3cc] border-2 border-[#111111]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{c.icon}</span>
                      <h4 className="font-black text-sm uppercase newspaper-headline text-[#111111]">{c.title}</h4>
                    </div>
                    <p className="font-serif text-xs text-[#4b5563] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Kontakt va Ariza */}
          <div className="space-y-6">
            <div className="bg-[#ede3cc] border-4 border-[#111111] p-6 gazeta-shadow-black">
              <span className="text-[10px] font-black uppercase text-[#c1121f] newspaper-mono block mb-1">
                ★ RASMIY ALOQA BOG'LAMASI ★
              </span>
              <h3 className="font-black uppercase newspaper-headline text-lg mb-4 text-[#111111]">
                QABUL KOMISSIYASI
              </h3>

              <div className="space-y-3 font-serif text-xs text-[#374151]">
                <div className="border-b border-[#111111]/20 pb-2">
                  <span className="font-black newspaper-mono text-[#8b5a2b] block mb-0.5">MANZIL:</span>
                  <span>{detail.address}</span>
                </div>
                <div className="border-b border-[#111111]/20 pb-2">
                  <span className="font-black newspaper-mono text-[#8b5a2b] block mb-0.5">TELEFON:</span>
                  <a href={`tel:${detail.phone}`} className="underline font-bold text-[#111111]">{detail.phone}</a>
                </div>
                <div className="border-b border-[#111111]/20 pb-2">
                  <span className="font-black newspaper-mono text-[#8b5a2b] block mb-0.5">ELEKTRON POCHTA:</span>
                  <a href={`mailto:${detail.email}`} className="underline text-[#c1121f]">{detail.email}</a>
                </div>
                <div>
                  <span className="font-black newspaper-mono text-[#8b5a2b] block mb-0.5">ASOS SOLINGAN:</span>
                  <span>{detail.founded}-yil</span>
                </div>
              </div>

              <button
                onClick={() => setIsApplyOpen(true)}
                className="w-full py-3.5 mt-6 font-black uppercase tracking-widest text-xs bg-[#c1121f] text-white border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono"
              >
                HUJJAT TOPSHIRISH (ARIZA) →
              </button>

              {detail.website !== "#" && (
                <a
                  href={detail.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs newspaper-mono text-[#8b5a2b] hover:text-[#c1121f] transition mt-3 underline"
                >
                  🌐 Rasmiy Veb-Sayt: {detail.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Online Ariza Modali (Gazeta Anketasi Uslubida) */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-xs" onClick={() => setIsApplyOpen(false)}>
          <div
            className="relative w-full max-w-lg bg-[#ede3cc] border-4 border-[#111111] p-6 md:p-8 text-[#111111] gazeta-shadow-black"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsApplyOpen(false)}
              className="absolute top-4 right-4 font-black w-8 h-8 flex items-center justify-center border-2 border-[#111111] bg-[#f9f5ea] hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[10px] font-black uppercase text-[#c1121f] newspaper-mono block mb-1">
              ★ RASMIY ANKETA BLANKASI ★
            </span>
            <h3 className="text-lg font-black uppercase newspaper-headline mb-1 text-[#111111]">
              {university.name}GA ARIZA TOPSHIRISH
            </h3>
            <p className="font-serif text-xs text-[#4b5563] mb-6">
              Arizangiz to'g'ridan-to'g'ri OTM qabul bo'limiga ro'yxatga kiritiladi.
            </p>

            {applySuccess ? (
              <div className="p-6 border-2 border-[#111111] bg-[#f9f5ea] text-center">
                <p className="text-3xl mb-2">🎉</p>
                <p className="font-black text-base uppercase newspaper-headline text-[#111111]">ARIZANGIZ RASMAN QABUL QILINDI!</p>
                <p className="font-serif text-xs mt-1 text-[#4b5563]">Qabul hay'ati siz bilan tez orada bog'lanadi.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                {applyError && (
                  <div className="p-3 text-xs border-2 border-[#c1121f] bg-[#c1121f]/10 newspaper-mono text-[#c1121f]">
                    {applyError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase newspaper-mono mb-1 text-[#4b5563]">TO'LIQ ISMINGIZ</label>
                  <input
                    type="text"
                    required
                    value={applyForm.fullName}
                    onChange={(e) => setApplyForm({ ...applyForm, fullName: e.target.value })}
                    placeholder="Ism Familiya"
                    className="w-full px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase newspaper-mono mb-1 text-[#4b5563]">TELEFON RAQAM</label>
                    <input
                      type="tel"
                      required
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase newspaper-mono mb-1 text-[#4b5563]">EMAIL MANZIL</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      placeholder="nomi@email.uz"
                      className="w-full px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase newspaper-mono mb-1 text-[#4b5563]">FAKULTET / YO'NALISH</label>
                  <input
                    type="text"
                    value={applyForm.programName}
                    onChange={(e) => setApplyForm({ ...applyForm, programName: e.target.value })}
                    placeholder="Masalan: Dasturiy ta'minot"
                    className="w-full px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase newspaper-mono mb-1 text-[#4b5563]">QO'SHIMCHA MA'LUMOT / DTM BALI</label>
                  <textarea
                    rows={2}
                    value={applyForm.notes}
                    onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                    placeholder="IELTS yoki DTM ballari haqida qisqa izoh..."
                    className="w-full px-3 py-2 text-xs"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyOpen(false)}
                    className="w-1/2 py-2.5 border-2 border-[#111111] bg-[#f9f5ea] text-xs font-black uppercase newspaper-mono hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                  >
                    BEKOR QILISH
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 py-2.5 bg-[#c1121f] text-white border-2 border-[#111111] font-black text-xs uppercase newspaper-mono hover:bg-[#111111] transition-colors disabled:opacity-50 cursor-pointer gazeta-shadow-black"
                  >
                    {isSubmitting ? "YUBORILMOQDA..." : "ARIZANI JO'NATISH →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
