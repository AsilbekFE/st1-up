import { useState, useEffect } from "react";
import { askGemini } from "../../ai/geminiService";
import { findBestAnswer } from "../../ai/chatEngine";

const GRANTS = [
  {
    id: 1,
    badge: "100% QOPLASH",
    title: '"El-yurt umidi" jamg\'arma grantlari',
    desc: "Xorijiy davlatlarda magistratura, doktorantura va stajirovka dasturlarini to'liq moliyalashtirish bo'yicha davlat dasturi.",
    tags: ["Xorijda Ta'lim", "50+ Grant", "To'liq Stipendiya"],
    links: ["Bakalavr/Magistr", "IELTS 6.5+"],
  },
  {
    id: 2,
    badge: "DAVLAT GRANTI",
    title: "OTMlarga kirish uchun davlat byudjeti granti",
    desc: "O'zbekistonning barcha davlat oliy ta'lim muassasalari uchun DTM test natijalariga asosan ajratiladigan 100% bepul o'qish.",
    tags: ["Bakalavr", "DTM Imtihon", "Davlat Kengashi"],
    links: ["Bepul Ta'lim", "Oylik Stipendiya"],
  },
  {
    id: 3,
    badge: "PREZIDENT GRANTI",
    title: "Yangi O'zbekiston universiteti prezident stipendiyasi",
    desc: "Respublika iqtidorli o'quvchilari uchun o'qish xarajatlarini to'liq qoplaydigan maxsus prezidentlik mukofot dasturi.",
    tags: ["Prezident Granti", "Muhandislik", "Maxsus Kengash"],
    links: ["Diplom Tan Olinadi", "Xalqaro Mezon"],
  },
  {
    id: 4,
    badge: "XUSUSIY GRANT",
    title: "WIUT Merit-based Academic Scholarship",
    desc: "Vestminster xalqaro universitetida eng yuqori imtihon ballari to'plagan talabalar uchun yillik 100% grant dasturi.",
    tags: ["100% Kontrakt", "Ingliz Tilida", "WIUT"],
    links: ["Merit Award", "Xalqaro Diplom"],
  },
  {
    id: 5,
    badge: "IJTIMOIY GRANT",
    title: "Ijtimoiy himoyaga muhtoj yoshlar uchun stipendiyalar",
    desc: "Ijtimoiy himoyaga muhtoj va iqtidorli oila farzandlari uchun OTM kontrakt pullarini to'liq qoplab berish maxsus loyihasi.",
    tags: ["Ijtimoiy Ko'mak", "Hujjatli Qabul", "Fond"],
    links: ["To'liq Qoplash", "Yotoqxona Bepul"],
  },
];

const STEPS = [
  { num: "I", title: "GRANTNI TANLASH", desc: "Sizning mutaxassisligingiz va mezonlaringizga mos grantni saralash." },
  { num: "II", title: "HUJJAT TO'PLASH", desc: "Sertifikatlar, tavsiyanomalar va diplom nusxalarini tayyorlash." },
  { num: "III", title: "ARIZA TOPSHIRISH", desc: "Gazeta portalida ko'rsatilgan rasmiy havola orqali ro'yxatdan o'tish." },
  { num: "IV", title: "NATIJANI QABUL QILISH", desc: "Ekspertlar hay'ati xulosasi va stipendiya tasdiqnomasini olish." },
];

function GrantCard({ grant, onDetails, idx }) {
  const isRed = idx % 2 === 0;
  return (
    <div
      className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f] gazeta-shadow-red" : "border-[#111111] gazeta-shadow-black"} p-5 flex flex-col justify-between cursor-pointer transition-transform hover:-translate-y-1`}
      onClick={() => onDetails(grant)}
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 newspaper-mono text-white ${isRed ? "bg-[#c1121f]" : "bg-[#111111]"}`}>
            {grant.badge}
          </span>
          <span className="text-xs font-bold text-[#8b5a2b] newspaper-mono">№ 0{idx + 1}</span>
        </div>
        <h3 className="font-black text-base uppercase newspaper-headline leading-snug mb-2 text-[#111111]">{grant.title}</h3>
        <p className="font-serif text-xs leading-relaxed mb-4 text-[#4b5563]">{grant.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {grant.tags.map(t => (
            <span key={t} className="border border-[#111111]/40 px-2 py-0.5 text-[10px] font-bold uppercase newspaper-mono bg-[#ede3cc] text-[#111111]">
              ✓ {t}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#111111]/30 flex justify-between items-center mt-3">
        <span className="text-[11px] font-bold text-[#8b5a2b] newspaper-mono">{grant.links[0]}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onDetails(grant); }}
          className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white ${isRed ? "bg-[#c1121f] hover:bg-[#111111]" : "bg-[#111111] hover:bg-[#c1121f]"} transition-colors newspaper-mono`}
        >
          BATAFSIL →
        </button>
      </div>
    </div>
  );
}

function AIModal({ grant, onClose }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");

  async function askAI(prompt) {
    setLoading(true);
    setResult("");
    try {
      const { answer, usingFallback } = await askGemini(prompt);
      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(prompt);
        setResult(fallback || "Xatolik yuz berdi.");
      } else {
        setResult(answer);
      }
    } catch {
      const { answer: fallback } = findBestAnswer(prompt);
      setResult(fallback || "Xatolik yuz berdi.");
    }
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 bg-[#111111]/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-[#ede3cc] border-4 border-[#111111] w-full max-w-lg p-6 md:p-8 gazeta-shadow-black"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b-2 border-[#111111] pb-3 mb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-[#c1121f] newspaper-mono block">★ TAHLILIY AXBOROT ★</span>
            <h2 className="font-black uppercase tracking-widest text-base newspaper-headline">GRANT BO'YICHA AI MASLAHAT</h2>
          </div>
          <button onClick={onClose} className="border-2 border-[#111111] w-7 h-7 flex items-center justify-center font-black hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer">✕</button>
        </div>

        {grant && (
          <div className="bg-[#f9f5ea] border-2 border-[#111111] p-3 mb-4">
            <p className="newspaper-mono text-[10px] font-black uppercase tracking-widest mb-1 text-[#8b5a2b]">TANLANGAN GRANT DASTURI:</p>
            <p className="font-black text-sm uppercase newspaper-headline text-[#111111]">{grant.title}</p>
          </div>
        )}

        <div className="flex flex-col gap-2 mb-4">
          {[
            grant ? `"${grant.title}" granti uchun qanday hujjatlar kerak?` : null,
            grant ? `Bu grantga kimlar murojaat qila oladi?` : null,
            "O'zim uchun eng mos grantni toping.",
          ].filter(Boolean).map(q => (
            <button
              key={q}
              onClick={() => askAI(q)}
              className="bg-[#f9f5ea] border border-[#111111] text-[#111111] px-3 py-2 text-xs font-bold text-left hover:bg-[#111111] hover:text-white transition-colors cursor-pointer newspaper-mono"
            >
              ➔ {q}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && question.trim() && askAI(question)}
            placeholder="O'z savolingizni yozing..."
            className="flex-1 px-3 py-2 text-xs text-[#111111]"
          />
          <button
            onClick={() => question.trim() && askAI(question)}
            className="bg-[#c1121f] text-white border-2 border-[#111111] px-4 font-black text-xs uppercase tracking-widest hover:bg-[#111111] transition-colors cursor-pointer newspaper-mono"
          >
            SO'RASH
          </button>
        </div>

        {loading && (
          <div className="text-center py-6 border-2 border-dashed border-[#111111] bg-[#f9f5ea]">
            <span className="gazeta-stamp-red">AI JAVOB TAYYORLAMOQDA...</span>
          </div>
        )}

        {result && (
          <div className="bg-[#f9f5ea] border-2 border-[#111111] p-4">
            <p className="font-black text-[10px] uppercase tracking-widest mb-2 text-[#c1121f] newspaper-mono">★ AI EKSPERT JAVOBI:</p>
            <p className="font-serif text-xs leading-relaxed text-[#111111] whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Scholarships() {
  const [grants, setGrants] = useState(GRANTS);
  const [modal, setModal] = useState(null);
  const [consultModal, setConsultModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/scholarships")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setGrants(resData.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = grants.filter(g =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111] pb-12 sm:pb-16">
      {/* Header */}
      <header className="px-3 pt-6 pb-6 sm:pt-10 sm:pb-8 text-center max-w-5xl mx-auto border-b-2 border-[#111111]">
        <span className="gazeta-stamp-red mb-2 sm:mb-3 text-[9px] sm:text-xs">★ MAXSUS GRANTLAR RUKNI ★</span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 sm:mb-3 leading-tight newspaper-headline">
          100% BEPUL TA'LIM VA <br />
          <span className="text-[#c1121f] underline decoration-2 sm:decoration-4 underline-offset-4">DAVLAT STIPENDIYALARI</span>
        </h1>
        <p className="font-serif text-xs sm:text-sm text-[#4b5563] max-w-xl mx-auto mb-4 sm:mb-6 leading-relaxed px-2">
          Iqtidorli va faol talabalar uchun O'zbekiston hamda xorijiy OTMlarda bepul ta'lim olishga yo'naltirilgan rasmiy grant dasturlari to'plami.
        </p>

        {/* Qidiruv qutisi */}
        <div className="max-w-xl mx-auto flex gap-2 border-2 border-[#111111] p-1.5 sm:p-2 bg-[#f9f5ea] gazeta-shadow-black">
          <input
            type="text"
            placeholder="Grant nomi yoki kalit so'z..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs font-serif min-w-0"
          />
          <button
            onClick={() => setConsultModal(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#c1121f] text-white font-black text-[10px] sm:text-xs uppercase newspaper-mono hover:bg-[#111111] transition-colors cursor-pointer shrink-0"
          >
            AI MASLAHAT
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Ro'yxat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {filtered.map((g, idx) => (
            <GrantCard key={g.id || idx} grant={g} onDetails={setModal} idx={idx} />
          ))}
        </div>

        {/* Jarayon Bosqichlari */}
        <section className="bg-[#ede3cc] border-4 border-[#111111] p-6 sm:p-8 gazeta-shadow-black mb-8">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase text-[#c1121f] newspaper-mono">// YO'RIQNOMA</span>
            <h2 className="text-2xl font-black uppercase newspaper-headline text-[#111111]">
              GRANT YUTISHNING 4 ASOSIY QADAMI
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s) => (
              <div key={s.num} className="bg-[#f9f5ea] border-2 border-[#111111] p-4 text-center">
                <div className="w-8 h-8 bg-[#111111] text-white font-black newspaper-mono flex items-center justify-center mx-auto mb-2 text-sm">
                  {s.num}
                </div>
                <h4 className="font-black text-xs uppercase newspaper-headline mb-1 text-[#111111]">{s.title}</h4>
                <p className="font-serif text-xs text-[#4b5563] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {modal && <AIModal grant={modal} onClose={() => setModal(null)} />}
      {consultModal && <AIModal grant={null} onClose={() => setConsultModal(false)} />}
    </div>
  );
}