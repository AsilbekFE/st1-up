import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignInModal from "./SignInModal";

export default function Home() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("eduuz_user");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const handleProtectedNavigation = (to) => {
    navigate(to);
  };

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111] pb-20">

      {/* 1. BREAKING NEWS TICKER (YUGURUVCHI GAZETA LENTASI) */}
      <div className="w-full bg-[#111111] text-[#f4ecd8] py-2 border-b-2 border-[#c1121f] overflow-hidden newspaper-mono text-xs font-bold uppercase tracking-wider flex items-center">
        <div className="bg-[#c1121f] text-white px-3 py-1 font-black shrink-0 z-10 flex items-center gap-1 shadow-md">
          <span className="animate-pulse">●</span> TEZKOR XABARLAR:
        </div>
        <div className="overflow-hidden w-full whitespace-nowrap relative">
          <div className="animate-newspaper-ticker inline-block">
            <span className="mx-6">★ 2026-YILGI DAVLAT GRANTLARI KVOTALARI RASMAN TASDIQLANDI</span>
            <span className="mx-6 text-[#c1121f]">■</span>
            <span className="mx-6">★ TOP-10 XUSUSIY VA XALQARO UNIVERSITETLARDA QABUL BOSHLANDI</span>
            <span className="mx-6 text-[#c1121f]">■</span>
            <span className="mx-6">★ "EL-YURT UMIDI" JAMG'ARMASIDAN 100% TO'LIQ STIPENDIYA DASTURI</span>
            <span className="mx-6 text-[#c1121f]">■</span>
            <span className="mx-6">★ SUN'IY INTELLEKT MASLAHATCHISI 24/7 INTERAKTIV REJIMDA ISHLAMOQDA</span>
            <span className="mx-6 text-[#c1121f]">■</span>
            <span className="mx-6">★ 2026-YILGI DAVLAT GRANTLARI KVOTALARI RASMAN TASDIQLANDI</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 mt-4 sm:mt-6">

        {/* 2. ULKAN XUSH KELIBSiZ MUQOVASI (THE GRAND WELCOME FRONT PAGE) */}
        <section className="bg-[#ede3cc] border-2 sm:border-4 border-[#111111] p-4 sm:p-6 md:p-10 gazeta-shadow-black relative overflow-hidden my-4 sm:my-6">
          {/* Orqa fondagi vintage gazeta belgisi */}
          <div className="absolute right-[-20px] top-[-20px] opacity-10 pointer-events-none text-6xl sm:text-9xl font-black newspaper-title text-[#111111]">
            EDUUZ
          </div>

          <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
            {/* Chap tomon: Asosiy Xush Kelibsiz sarlavhasi */}
            <div className="lg:col-span-8 border-b-2 lg:border-b-0 lg:border-r-2 border-[#111111] pr-0 lg:pr-8 pb-5 lg:pb-0">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <span className="gazeta-stamp-red text-[9px] sm:text-xs">
                  ⚡ ASOSIY BOSMA SON
                </span>
                <span className="newspaper-mono text-[10px] sm:text-xs font-bold text-[#8b5a2b] uppercase tracking-widest">
                  [Maxsus Loyiha — 2026 Qabul]
                </span>
              </div>

              <h2 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#111111] leading-[1.05] sm:leading-[0.95] mb-4 sm:mb-6 newspaper-headline">
                XUSH KELIBSiz, <br />
                <span className="text-[#c1121f] underline decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8">ILM VA KELAJAK</span> <br />
                IZLOVCHI TALABGOR!
              </h2>

              <p className="text-xs sm:text-base text-[#374151] leading-relaxed font-serif mb-5 sm:mb-6 text-left sm:text-justify">
                O'zbekiston oliy ta'limining to'liq va xolis solishtirma manbasi. 
                Ushbu sahifada 50 dan ortiq yetakchi davlat, xususiy va xalqaro universitetlar, 
                grant imkoniyatlari, kirish ballari hamda kasbiy yo'nalishlar jamlangan.
              </p>

              {/* Ikki xil ziddiyatli tugma */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={() => handleProtectedNavigation("/universities")}
                  className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-[#c1121f] text-white font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono flex items-center justify-center gap-2"
                >
                  <span>🏛️ OTMlar Katalogi</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => handleProtectedNavigation("/scholarships")}
                  className="w-full sm:w-auto px-5 py-3 sm:px-8 sm:py-4 bg-[#111111] text-white font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-red hover:bg-[#c1121f] transition-all cursor-pointer newspaper-mono flex items-center justify-center gap-2"
                >
                  <span>📜 100% Grantlar</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* O'ng tomon: Gazeta Portreti / Rasmiy Bildirishnoma */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full space-y-3 sm:space-y-4">
              <div className="bg-[#f9f5ea] border-2 border-[#111111] p-3 sm:p-4 gazeta-shadow-wood">
                <div className="flex justify-between items-center border-b border-[#111111] pb-2 mb-2 sm:mb-3">
                  <span className="text-[10px] sm:text-[11px] font-black uppercase newspaper-mono text-[#5c3d2e]">★ Tahririyat Kengashi</span>
                  <span className="text-[9px] sm:text-[10px] text-[#c1121f] font-bold">RASMIY</span>
                </div>
                <p className="text-[11px] sm:text-xs font-serif leading-normal italic text-[#4b5563]">
                  "Bugungi to'g'ri tanlov — ertangi yorqin karyerangizning poydevoridir. Har bir universitet haqidagi ma'lumotlar davlat va xalqaro mezonlar asosida muntazam tekshiriladi."
                </p>
                <div className="mt-2 sm:mt-3 text-right">
                  <span className="text-[10px] sm:text-[11px] font-black newspaper-mono uppercase text-[#111111]">— EduUZ Hay'ati</span>
                </div>
              </div>

              {/* Qisqa Ma'lumot Ustuni (Stats box) */}
              <div className="border-2 border-[#8b5a2b] bg-[#ede3cc] p-3 sm:p-4">
                <div className="text-center font-black text-xl sm:text-2xl text-[#c1121f] newspaper-headline">
                  50+ OTM / 200+ YO'NALISH
                </div>
                <div className="text-center text-[10px] sm:text-[11px] font-bold text-[#5c3d2e] uppercase tracking-widest newspaper-mono mt-1">
                  Yagona milliy ma'lumotlar banki
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. KICHIK REKLAMA VA E'LONLAR LAVHALARI (VINTAGE CLASSIFIEDS) */}
        <div className="my-6 sm:my-8">
          <div className="flex items-center justify-between border-b-2 sm:border-b-4 border-[#111111] pb-2 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-2xl font-black uppercase newspaper-headline text-[#111111] flex items-center gap-1.5 sm:gap-2">
              <span className="text-[#c1121f]">📢</span> TEZKOR GAZETA REKLAMALARI
            </h3>
            <span className="hidden sm:inline newspaper-mono text-xs font-bold text-[#8b5a2b] uppercase">
              // Tavsiyalar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* 1-Reklama: QIZIL BOSMA QIRRALI */}
            <div className="bg-[#f9f5ea] border-2 border-dashed border-[#c1121f] p-4 sm:p-5 gazeta-shadow-red relative coupon-scissors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#c1121f] text-white newspaper-mono">
                    TEZKOR E'LON
                  </span>
                  <span className="text-xs font-bold text-[#c1121f]">№ 01</span>
                </div>
                <h4 className="font-black text-lg uppercase newspaper-headline text-[#111111] mb-2">
                  KIRISH IMTIHONLARISIZ XALQARO GRANTLAR!
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed mb-4">
                  IELTS 6.0+ yoki yuqori akademik ko'rsatkichlarga ega talabgorlar uchun to'liq kontrakt qoplovchi stipendiyalar ro'yxati e'lon qilindi.
                </p>
              </div>
              <button
                onClick={() => handleProtectedNavigation("/scholarships")}
                className="w-full py-2.5 bg-[#c1121f] text-white font-black text-xs uppercase tracking-wider hover:bg-[#111111] transition-colors cursor-pointer newspaper-mono"
              >
                GRANTLARNI KO'RISH →
              </button>
            </div>

            {/* 2-Reklama: QORA VA YOG'OCH BOSMALI */}
            <div className="bg-[#ede3cc] border-2 border-[#111111] p-5 gazeta-shadow-black flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#111111] text-white newspaper-mono">
                    SUN'IY INTELLEKT
                  </span>
                  <span className="text-xs font-bold text-[#8b5a2b]">№ 02</span>
                </div>
                <h4 className="font-black text-lg uppercase newspaper-headline text-[#111111] mb-2">
                  AI YORDAMCHI: MOS YO'NALISHNI ANIQLANG!
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed mb-4">
                  O'zingizning qobiliyatingiz, qiziqishingiz va byudjetingizga to'liq mos tushuvchi OTM va mutaxassislikni 3 daqiqa ichida tanlab oling.
                </p>
              </div>
              <button
                onClick={() => handleProtectedNavigation("/majors")}
                className="w-full py-2.5 bg-[#111111] text-white font-black text-xs uppercase tracking-wider hover:bg-[#8b5a2b] transition-colors cursor-pointer newspaper-mono"
              >
                YO'NALISH TESTINI TOPSHIRISH →
              </button>
            </div>

            {/* 3-Reklama: JIGARRANG VA KULRANG BOSMALI */}
            <div className="bg-[#f9f5ea] border-2 border-[#8b5a2b] p-5 gazeta-shadow-wood flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#5c3d2e] text-white newspaper-mono">
                    MILLIY TAHLIL
                  </span>
                  <span className="text-xs font-bold text-[#5c3d2e]">№ 03</span>
                </div>
                <h4 className="font-black text-lg uppercase newspaper-headline text-[#111111] mb-2">
                  2026 REYTINgi: ENG TALAB QILINGAN KASBLAR!
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed mb-4">
                  Bitiruvchilari eng yuqori oylik oladigan va ish topish ko'rsatkichi 90% dan yuqori bo'lgan oliygohlar tahliliy jadvali taqdim etildi.
                </p>
              </div>
              <button
                onClick={() => handleProtectedNavigation("/statistics")}
                className="w-full py-2.5 bg-[#8b5a2b] text-white font-black text-xs uppercase tracking-wider hover:bg-[#111111] transition-colors cursor-pointer newspaper-mono"
              >
                STATISTIKANI O'QISH →
              </button>
            </div>
          </div>
        </div>

        {/* 4. SCROLL BILAN G'AYRITABIIY INTERAKTIV GAZETA USTUNLARI */}
        <section className="my-12 border-t-4 border-b-4 border-[#111111] py-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="gazeta-stamp-black mb-3">
              ★ GAZETA RUKNLARI ★
            </span>
            <h3 className="text-3xl sm:text-4xl font-black uppercase newspaper-headline text-[#111111] mt-2">
              HAR BIR BO'LIMDA — ANIQ VA ISHONCHLI FAKTLAR
            </h3>
            <p className="text-sm font-serif italic text-[#4b5563] mt-2">
              Barcha ruknlar talabalar va ota-onalar uchun qulay qilib saralangan. Kerakli sahifani tanlang:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Bo'lim 1: Qora */}
            <div
              onClick={() => handleProtectedNavigation("/universities")}
              className="bg-[#f9f5ea] border-2 border-[#111111] p-5 cursor-pointer newspaper-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">🏛️</div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#111111] text-white newspaper-mono inline-block mb-2">
                  1-BO'LIM
                </span>
                <h4 className="text-lg font-black uppercase newspaper-headline mb-2 text-[#111111]">
                  OTMLAR KATALOGI
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed">
                  Davlat, xususiy va xalqaro universitetlarning kontrakt narxi, shahri va shart-sharoitlari.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#111111] text-xs font-black text-[#111111] newspaper-mono flex justify-between items-center">
                <span>O'TISH</span>
                <span>→</span>
              </div>
            </div>

            {/* Bo'lim 2: Qizil */}
            <div
              onClick={() => handleProtectedNavigation("/scholarships")}
              className="bg-[#f9f5ea] border-2 border-[#c1121f] p-5 cursor-pointer newspaper-card-hover-red flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">📜</div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#c1121f] text-white newspaper-mono inline-block mb-2">
                  2-BO'LIM
                </span>
                <h4 className="text-lg font-black uppercase newspaper-headline mb-2 text-[#c1121f]">
                  GRANT DASTURLARI
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed">
                  Prezident grantlari, xususiy fondlar va bepul ta'lim olish imkonini beruvchi to'liq yo'riqnomalar.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c1121f] text-xs font-black text-[#c1121f] newspaper-mono flex justify-between items-center">
                <span>O'TISH</span>
                <span>→</span>
              </div>
            </div>

            {/* Bo'lim 3: Yog'och / Jigarrang */}
            <div
              onClick={() => handleProtectedNavigation("/admissions")}
              className="bg-[#f9f5ea] border-2 border-[#8b5a2b] p-5 cursor-pointer newspaper-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">📋</div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#8b5a2b] text-white newspaper-mono inline-block mb-2">
                  3-BO'LIM
                </span>
                <h4 className="text-lg font-black uppercase newspaper-headline mb-2 text-[#8b5a2b]">
                  QABUL BOSQICHLARI
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed">
                  DTM, xalqaro testlar, hujjat topshirish muddatlari va rasmiy davlat portallari ro'yxati.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#8b5a2b] text-xs font-black text-[#8b5a2b] newspaper-mono flex justify-between items-center">
                <span>O'TISH</span>
                <span>→</span>
              </div>
            </div>

            {/* Bo'lim 4: Qora & Kulrang */}
            <div
              onClick={() => handleProtectedNavigation("/statistics")}
              className="bg-[#f9f5ea] border-2 border-[#111111] p-5 cursor-pointer newspaper-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-2">📊</div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#111111] text-white newspaper-mono inline-block mb-2">
                  4-BO'LIM
                </span>
                <h4 className="text-lg font-black uppercase newspaper-headline mb-2 text-[#111111]">
                  KIRISH BALLARI
                </h4>
                <p className="text-xs font-serif text-[#4b5563] leading-relaxed">
                  O'tgan yillardagi kirish ballari, talab darajasi va eng nufuzli OTMlar taqqoslash jadvali.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#111111] text-xs font-black text-[#111111] newspaper-mono flex justify-between items-center">
                <span>O'TISH</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. RO'YXATDAN O'TISH VA OBUNA CHAQIRIG'I */}
        {!currentUser && (
          <section className="my-8 sm:my-12 bg-[#ede3cc] border-2 sm:border-4 border-[#111111] p-5 sm:p-8 md:p-12 text-center gazeta-shadow-black relative">
            <span className="gazeta-stamp-red mb-3 sm:mb-4 inline-block text-[10px] sm:text-xs">
              ★ GAZETA OBUNASI ★
            </span>
            <h3 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase newspaper-headline text-[#111111] mb-3 sm:mb-4 leading-tight">
              TO'LIQ MA'LUMOTLARNI O'QISH UCHUN RO'YXATDAN O'TING
            </h3>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-serif text-[#4b5563] mb-6 sm:mb-8 leading-relaxed">
              O'zbekiston universitetlarining kontrakt shartnomalari, grant talablari, 
              o'tish ballari va sun'iy intellekt xizmatidan to'liq foydalanish uchun rasmiy a'zo bo'ling. 
              Obuna mutlaqo bepul!
            </p>

            <button
              onClick={() => setIsSignInOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-10 sm:py-4 bg-[#c1121f] text-white font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono inline-flex items-center justify-center gap-2"
            >
              <span>HOZIROQ RO'YXATDAN O'TISH / KIRISH</span>
              <span>→</span>
            </button>
          </section>
        )}

        {/* 6. GAZETA FOOTER (Klassik nashriyot qismi) */}
        <footer className="border-t-4 border-[#111111] pt-8 pb-12 mt-16 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b-2 border-[#111111] pb-8">
            <div className="md:col-span-2">
              <h4 className="text-2xl font-black uppercase newspaper-title text-[#111111] mb-2">
                EDUUZ MATBUOTI
              </h4>
              <p className="text-xs font-serif text-[#4b5563] max-w-md leading-relaxed">
                O'zbekiston Respublikasi oliy ta'lim muassasalari haqidagi rasmiy ma'lumotlar platformasi. 
                Barcha huquqlar qonun bilan himoyalangan.
              </p>
            </div>
            <div>
              <h5 className="text-xs font-black uppercase newspaper-mono mb-3 text-[#111111]">// RUBRIKALAR</h5>
              <ul className="text-xs space-y-2 font-serif text-[#4b5563]">
                <li><button onClick={() => handleProtectedNavigation("/universities")} className="hover:text-[#c1121f]">Universitetlar</button></li>
                <li><button onClick={() => handleProtectedNavigation("/scholarships")} className="hover:text-[#c1121f]">Grantlar</button></li>
                <li><button onClick={() => handleProtectedNavigation("/majors")} className="hover:text-[#c1121f]">Yo'nalishlar</button></li>
                <li><button onClick={() => handleProtectedNavigation("/admissions")} className="hover:text-[#c1121f]">Qabul talablari</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xs font-black uppercase newspaper-mono mb-3 text-[#111111]">// MA'LUMOT</h5>
              <p className="text-xs font-serif text-[#4b5563] leading-relaxed">
                Tahririyat manzili: Toshkent shahri.<br />
                Elektron pochta: info@eduuz.uz<br />
                Telefon: +998 (71) 200-00-00
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-xs font-bold text-[#8b5a2b] newspaper-mono">
            <span>© 2026 EduUZ. O'zbekiston Oliy Ta'lim Gazetasi.</span>
            <span>Nashr etilgan barcha ma'lumotlar tasdiqlangan.</span>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {isSignInOpen && (
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      )}
    </div>
  );
}
