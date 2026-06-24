import { useEffect } from "react";

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

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-[#0c1528] overflow-y-auto flex flex-col justify-between animate-fade-in">
      <div className="relative w-full text-white bg-[#0c1528] flex-1 flex flex-col">

        {/* Floating Back Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 z-20 px-4 py-2 flex items-center gap-2 rounded-xl bg-slate-900/80 backdrop-blur border border-slate-700 hover:border-slate-400 transition-all cursor-pointer text-sm font-semibold text-slate-200"
        >
          <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Orqaga
        </button>

        {/* Hero Banner */}
        <div className="relative w-full h-80 md:h-[400px]">
          {/* IMAGE JOYLASHTIRILGAN JOY: Universitet bosh rasmi */}
          {university.image ? (
            <img src={university.image} alt={university.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-950 to-violet-950">
              <span className="text-9xl font-black text-cyan-400/20">{university.initial}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1528] via-[#0c1528]/50 to-transparent" />
          <div className="absolute bottom-0 inset-x-0">
            <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase px-3 py-1 rounded-lg bg-cyan-400 text-black tracking-wider shadow">
                  {university.category} OTM
                </span>
                <span className="text-[11px] font-bold px-3 py-1 rounded-lg border border-cyan-700/60 bg-cyan-900/30 text-cyan-300">
                  {university.rankLabel || university.badge}
                </span>
              </div>
              <h1 className="mt-3 text-4xl md:text-6xl font-black text-white drop-shadow-xl leading-tight">
                {university.city}dagi {university.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-6 md:px-12 py-10">

          {/* LEFT: Main Info */}
          <div className="lg:col-span-2 p-8 md:p-10 space-y-10 border-r border-slate-800/50">

            {/* Stats Row */}
            <div className="flex gap-6 flex-wrap">
              {[
                { label: "Reyting", value: (university.rankLabel || university.badge).replace("@ ", "") },
                { label: "Talabalar soni", value: detail.students },
                { label: detail.country.includes("/") ? detail.country.split("/")[1] : detail.country, value: detail.country.split("/")[0] },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{s.label}</span>
                  <span className="mt-1 text-cyan-400 font-extrabold text-base">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Akademik meros */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <span className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black text-xs font-black">✦</span>
                Akademik meros
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">{detail.legacy}</p>
            </section>

            {/* Akademik dasturlar */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-5">
                <span className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black text-xs font-black">✦</span>
                Akademik dasturlar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {detail.programs.map((p) => (
                  <div
                    key={p.title}
                    className="group flex flex-col gap-2 p-5 rounded-2xl bg-[#111827] border border-slate-800/70 hover:border-cyan-700/50 transition-all"
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <h3 className="text-sm font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                    <button className="mt-2 text-xs font-semibold text-cyan-400 border border-cyan-700/40 bg-cyan-900/20 rounded-lg px-3 py-1.5 self-start hover:bg-cyan-900/40 transition cursor-pointer">
                      Batafsil →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Kampus */}
            <section>
              <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-5">
                <span className="w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-black text-xs font-black">✦</span>
                Kampus va innovatsiyalar
              </h2>
              {/* IMAGE JOYLASHTIRILGAN JOY: Kampus/innovatsiya rasmi */}
              {university.image && (
                <div className="rounded-2xl overflow-hidden h-40 mb-4">
                  <img src={university.image} alt="Kampus" className="w-full h-full object-cover opacity-60" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {detail.campus.map((c) => (
                  <div key={c.title} className="flex gap-3 items-start p-4 rounded-xl bg-[#111827] border border-slate-800/60">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{c.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Banner */}
            <section className="rounded-2xl p-8 bg-gradient-to-br from-[#0f1e42] to-[#0a1124] border border-slate-800/60 text-center">
              <h2 className="text-2xl font-black text-white mb-2">{university.name}ga qo'shilishga tayyormisiz?</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
                Kelgusi yilga oid diplom va nazariy ismi biriktirilganda barcha zarur talablar yetarlicha qoniqarli jamki birlikda qimmatli qaror amalda ustivorlik bilan qoplanadi.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button className="px-6 py-3 font-bold text-black bg-gradient-to-r from-cyan-400 to-violet-400 rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(0,245,255,0.25)] cursor-pointer">
                  Prezentatsiya yuklab olish
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 font-bold text-slate-300 bg-[#1a2340] border border-slate-700 rounded-xl hover:border-slate-500 transition cursor-pointer"
                >
                  Orqaga
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="p-8 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Asosiy ma'lumotlar</h3>

            <div className="space-y-4 text-sm">
              {[
                {
                  icon: (
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  label: "Manzil", value: detail.address,
                },
                {
                  icon: (
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  ),
                  label: "Telefon", value: detail.phone,
                },
                {
                  icon: (
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "Email", value: detail.email,
                },
                {
                  icon: (
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                  label: "Tashkil etilgan", value: detail.founded,
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 items-start">
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-slate-500 text-xs">{item.label}</p>
                    <p className="text-slate-200 font-medium mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-3">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Hujjat topshirish</h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✔</span>
                  <span>Pasport yoki ID karta nusxasi talab etiladi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✔</span>
                  <span>Maktab attestati yoki kollej diplomi.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✔</span>
                  <span>3×4 formatidagi 6 ta rasm.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✔</span>
                  <span>Tibbiy ma'lumotnoma (086 shakli).</span>
                </div>
              </div>

              <button
                onClick={() => alert(`${university.name}ga hujjat topshirish simulyatsiyasi ishga tushdi!`)}
                className="w-full py-3.5 mt-3 font-extrabold text-black bg-gradient-to-r from-cyan-400 to-violet-400 rounded-xl hover:opacity-90 transition shadow-[0_0_20px_rgba(0,245,255,0.25)] cursor-pointer text-sm"
              >
                Hujjat topshirish →
              </button>

              {detail.website !== "#" && (
                <a
                  href={detail.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-xs text-cyan-400 hover:text-cyan-300 transition mt-2"
                >
                  🔗 {detail.website}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
