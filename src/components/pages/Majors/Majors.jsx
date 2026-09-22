import { useState, useEffect } from "react";
import { askGemini } from "../../../ai/geminiService";
import { findBestAnswer } from "../../../ai/chatEngine";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = e => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
}

const YONALISHLAR = [
  { id: 1, icon: "🤖", badge: "Top Kasb", title: "Sun'iy Intellekt va Data", desc: "Mashina o'rganish, neyron tarmoqlar va katta ma'lumotlar tahlili mutaxassislari.", stipendiya: "$1,500+", universitetlar: 12 },
  { id: 2, icon: "🛡️", badge: "Yangi", title: "Kiberxavfsizlik", desc: "Bank, biznes va davlat axborot infratuzilmasini himoya qilish tizimlari.", stipendiya: "$1,200+", universitetlar: 8 },
  { id: 3, icon: "💼", badge: "Ommabop", title: "Biznes Boshqaruvi (BBA)", desc: "Zamonaviy korporativ menejment, marketing, investitsiya va moliyaviy audit.", stipendiya: "$900+", universitetlar: 45 },
  { id: 4, icon: "🏥", badge: "Amaliy", title: "Davolash va Pediatriya", desc: "Inson salomatligi, ilg'or jarrohlik texnologiyalari va klinik biotibbiyot.", stipendiya: "$700+", universitetlar: 15 },
  { id: 5, icon: "🏗️", badge: "Nufuzli", title: "Arxitektura va Shaharsozlik", desc: "Bino va inshootlar loyihalash, zamonaviy shahar urbanistikasi va dizayn.", stipendiya: "$850+", universitetlar: 10 },
  { id: 6, icon: "🦾", badge: "Kelajak", title: "Robototexnika va Mexatronika", desc: "Sanoat avtomatizatsiyasi, sensor tizimlar va robotik mexanizmlar.", stipendiya: "$1,100+", universitetlar: 5 },
  { id: 7, icon: "🎮", badge: "Ijodiy", title: "Game Dizayn va 3D Grafika", desc: "O'yin industriyasi, raqamli animatsiya va vizual effektlar yaratish.", stipendiya: "$1,400+", universitetlar: 3 },
  { id: 8, icon: "📊", badge: "Moliya", title: "Xalqaro Iqtisodiyot", desc: "Jahon moliyaviy bozorlari, xalqaro savdo va makroiqtisodiy tahlil.", stipendiya: "$1,000+", universitetlar: 20 },
];

function YonalishCard({ item, onDetails, idx }) {
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const showFull = !isMobile || expanded;
  const isRed = idx % 2 === 0;

  return (
    <div
      className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f] gazeta-shadow-red" : "border-[#111111] gazeta-shadow-black"} p-5 flex flex-col justify-between transition-transform hover:-translate-y-1`}
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl">{item.icon}</span>
          {item.badge && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 newspaper-mono text-white ${isRed ? "bg-[#c1121f]" : "bg-[#111111]"}`}>
              {item.badge}
            </span>
          )}
        </div>
        <h3 className="font-black text-base uppercase newspaper-headline text-[#111111] mb-2 leading-snug">{item.title}</h3>

        {showFull && (
          <>
            <p className="font-serif text-xs text-[#4b5563] leading-relaxed mb-4">{item.desc}</p>
            <div className="grid grid-cols-2 gap-2 mb-4 bg-[#ede3cc] p-2 border border-[#111111]/20">
              <div>
                <div className="text-[#8b5a2b] uppercase tracking-widest text-[9px] newspaper-mono font-bold">O'rtacha Maosh</div>
                <div className="font-black text-xs newspaper-mono text-[#111111]">{item.stipendiya}</div>
              </div>
              <div className="text-right">
                <div className="text-[#8b5a2b] uppercase tracking-widest text-[9px] newspaper-mono font-bold">OTMlar</div>
                <div className="font-black text-xs newspaper-mono text-[#111111]">{item.universitetlar} ta</div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="pt-2 border-t border-[#111111]/30 flex flex-col gap-1.5">
        {isMobile && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full py-1 text-[11px] font-bold text-[#4b5563] underline newspaper-mono cursor-pointer"
          >
            {expanded ? "Yopish ↑" : "Batafsil ma'lumot ↓"}
          </button>
        )}
        <button
          onClick={() => onDetails(item)}
          className={`w-full py-2 text-xs font-black uppercase tracking-wider text-white ${isRed ? "bg-[#c1121f] hover:bg-[#111111]" : "bg-[#111111] hover:bg-[#c1121f]"} transition-colors cursor-pointer newspaper-mono`}
        >
          AI MASLAHAT →
        </button>
      </div>
    </div>
  );
}

function AIModal({ item, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");

  async function ask(prompt) {
    setLoading(true); setResult("");
    try {
      const { answer, usingFallback } = await askGemini(prompt);
      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(prompt);
        setResult(fallback || "Xatolik yuz berdi.");
      } else { setResult(answer); }
    } catch {
      const { answer: fallback } = findBestAnswer(prompt);
      setResult(fallback || "Xatolik yuz berdi.");
    }
    setLoading(false);
  }

  const suggestions = item ? [
    `"${item.title}" yo'nalishi bo'yicha O'zbekistonda qaysi universitetlar bor?`,
    `"${item.title}" sohasi bo'yicha grantlar va kontrakt narxlari qanday?`,
    `"${item.title}" mutaxassislari qayerlarda ishlaydi?`,
  ] : [
    "Men uchun eng mos yo'nalishni toping.",
    "O'zbekistonda kelgusi 5 yilda eng talabgir kasblar qaysilar?",
  ];

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[#111111]/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div onClick={e => e.stopPropagation()} className="bg-[#ede3cc] border-4 border-[#111111] w-full max-w-lg max-h-[85vh] overflow-y-auto gazeta-shadow-black">
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-[#111111] bg-[#f4ecd8]">
          <h2 className="text-xs font-black uppercase newspaper-mono text-[#c1121f]">★ AI MUTAXASSISLIK MASLAHATCHISI</h2>
          <button onClick={onClose} className="w-7 h-7 border-2 border-[#111111] flex items-center justify-center font-black hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-3">
          {item && (
            <div className="bg-[#f9f5ea] border border-[#111111] p-3 flex gap-3 items-center">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-[10px] newspaper-mono uppercase font-bold text-[#8b5a2b]">Tanlangan Yo'nalish:</p>
                <p className="font-black text-sm uppercase newspaper-headline text-[#111111]">{item.title}</p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {suggestions.map(q => (
              <button key={q} onClick={() => ask(q)}
                className="w-full bg-[#f9f5ea] border border-[#111111] text-[#111111] px-3 py-2 text-xs text-left hover:bg-[#111111] hover:text-white transition-colors cursor-pointer newspaper-mono">
                ➔ {q}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === "Enter" && question.trim() && ask(question)}
              placeholder="O'z savolingizni yozing..."
              className="flex-1 px-3 py-2 text-xs"
            />
            <button onClick={() => question.trim() && ask(question)}
              className="bg-[#c1121f] text-white px-4 font-black text-xs newspaper-mono hover:bg-[#111111] transition-colors cursor-pointer">→</button>
          </div>

          {loading && <div className="text-center py-6 text-xs newspaper-mono text-[#8b5a2b]">AI tahlil qilmoqda...</div>}
          {result && (
            <div className="border-2 border-[#111111] bg-[#f9f5ea] p-4">
              <p className="text-[10px] newspaper-mono text-[#c1121f] mb-2 font-black">★ AI TAVSIYASI:</p>
              <p className="font-serif text-xs leading-relaxed text-[#111111] whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TestModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    { q: "Qaysi soha sizga ko'proq zavq beradi?", opts: ["Texnologiya va Dasturlash", "Tibbiyot va Inson Salomatligi", "Moliya va Biznes Boshqaruvi", "San'at, Grafika va Dizayn"] },
    { q: "Qaysi xarakter sizga yaqinroq?", opts: ["Mantiqiy tahlil va kod yozish", "Odamlarga yordam berish va hamdardlik", "Muzokara olib borish va yetakchilik", "Ijodiy fikrlash va tasavvur"] },
    { q: "Kelajakda qayerda ishlashni orzu qilasiz?", opts: ["Xalqaro IT gigantida", "Zamonaviy shifoxona yoki laboratoriyada", "O'z shaxsiy biznesingizda", "Xalqaro tashkilotlarda"] },
    { q: "O'qish tili va formati qanday bo'lishi ma'qul?", opts: ["Ingliz tilida, xalqaro diplom", "O'zbek tilida, davlat universiteti", "Amaliy va tezkor kurslar bilan"] },
  ];

  async function getResult() {
    setLoading(true);
    const summary = Object.entries(answers).map(([i, a]) => `${questions[i].q}: ${a}`).join("; ");
    const prompt = `Quyidagi javoblar asosida abituriyentga eng mos 2-3 ta OTM yo'nalishini tavsiya qil va nima uchun mosligini qisqa tushuntir:\n${summary}`;
    try {
      const { answer, usingFallback } = await askGemini(prompt);
      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(prompt);
        setResult(fallback || "Xatolik yuz berdi.");
      } else { setResult(answer); }
    } catch {
      const { answer: fallback } = findBestAnswer(prompt);
      setResult(fallback || "Xatolik yuz berdi.");
    }
    setLoading(false);
  }

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[#111111]/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div onClick={e => e.stopPropagation()} className="bg-[#ede3cc] border-4 border-[#111111] w-full max-w-md gazeta-shadow-black p-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111] mb-4">
          <h2 className="text-xs font-black uppercase newspaper-mono text-[#c1121f]">★ KASBGA YO'NALTIRISH TESTI</h2>
          <button onClick={onClose} className="w-7 h-7 border-2 border-[#111111] flex items-center justify-center font-black hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>

        {!result ? (
          <>
            <div className="flex gap-1 mb-4">
              {questions.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 ${i <= step ? "bg-[#c1121f]" : "bg-[#111111]/20"}`} />
              ))}
            </div>
            <p className="newspaper-mono text-[10px] font-bold text-[#8b5a2b] uppercase mb-1">Savol {step + 1} / {questions.length}</p>
            <h3 className="font-black text-sm uppercase newspaper-headline text-[#111111] mb-4">{questions[step].q}</h3>
            <div className="space-y-2">
              {questions[step].opts.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    const newAns = { ...answers, [step]: opt };
                    setAnswers(newAns);
                    if (step < questions.length - 1) { setStep(step + 1); }
                    else { getResult(); }
                  }}
                  className="w-full bg-[#f9f5ea] border border-[#111111] p-2.5 text-xs text-left font-serif hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : loading ? (
          <div className="text-center py-8 newspaper-mono text-xs text-[#8b5a2b]">AI tahlil qilmoqda...</div>
        ) : (
          <div className="space-y-4">
            <div className="bg-[#f9f5ea] border-2 border-[#111111] p-4">
              <p className="text-[10px] newspaper-mono text-[#c1121f] mb-2 font-black">★ TEST XULOSASI:</p>
              <p className="font-serif text-xs leading-relaxed text-[#111111] whitespace-pre-wrap">{result}</p>
            </div>
            <button
              onClick={() => { setStep(0); setAnswers({}); setResult(""); }}
              className="w-full py-2 bg-[#111111] text-white font-black text-xs uppercase newspaper-mono hover:bg-[#c1121f] transition-colors cursor-pointer"
            >
              Qayta Boshlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Majors() {
  const [majorsList, setMajorsList] = useState(YONALISHLAR);
  const [modal, setModal] = useState(null);
  const [testOpen, setTestOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/majors")
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          setMajorsList(resData.data);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = majorsList.filter(y =>
    y.title.toLowerCase().includes(search.toLowerCase()) ||
    y.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111] pb-12 sm:pb-16">
      {/* Header */}
      <header className="border-b-2 border-[#111111] max-w-5xl mx-auto px-3 pt-6 pb-6 sm:pt-10 sm:pb-8 text-center">
        <span className="gazeta-stamp-red mb-2 sm:mb-3 text-[9px] sm:text-xs">★ MUTAXASSISLIKLAR BO'LIMI ★</span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 sm:mb-3 leading-tight newspaper-headline">
          TALAB YUQORI BO'LGAN <br />
          <span className="text-[#c1121f] underline decoration-2 sm:decoration-4 underline-offset-4">TA'LIM YO'NALISHLARI</span>
        </h1>
        <p className="font-serif text-xs sm:text-sm text-[#4b5563] max-w-lg mx-auto mb-4 sm:mb-6 leading-relaxed px-2">
          O'zbekiston mehnat bozorida yuqori maoshli va kafolatlangan karyera taklif qiluvchi sohalar tahlili.
        </p>

        {/* Qidiruv */}
        <div className="max-w-xl mx-auto flex gap-2 border-2 border-[#111111] p-1.5 sm:p-2 bg-[#f9f5ea] gazeta-shadow-black">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Yo'nalish nomi bo'yicha..."
            className="flex-1 bg-transparent border-none outline-none text-xs font-serif min-w-0"
          />
          <button
            onClick={() => setTestOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#111111] text-white font-black text-[10px] sm:text-xs uppercase newspaper-mono hover:bg-[#c1121f] transition-colors cursor-pointer shrink-0"
          >
            🎯 KASB TESTI
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {filtered.map((item, idx) => (
            <YonalishCard key={item.id} item={item} onDetails={setModal} idx={idx} />
          ))}
        </div>

        {/* Banner */}
        <div className="bg-[#ede3cc] border-4 border-[#111111] p-6 sm:p-8 gazeta-shadow-black flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="text-xs font-black uppercase text-[#c1121f] newspaper-mono">// INTERAKTIV XIZMAT</span>
            <h3 className="text-xl font-black uppercase newspaper-headline text-[#111111] mt-1 mb-2">
              QAYSI YO'NALISH SIZGA MOSLIGINI BILMAYAPSIZMI?
            </h3>
            <p className="font-serif text-xs text-[#4b5563] leading-relaxed">
              Sun'iy intellekt asosidagi qisqa 4 ta savolli testni topshiring va shaxsiy qobiliyatingizga mos yo'nalishlarni aniqlang.
            </p>
          </div>
          <button
            onClick={() => setTestOpen(true)}
            className="px-6 py-3.5 bg-[#c1121f] text-white font-black text-xs uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono shrink-0"
          >
            TESTNI TOPSHIRISH →
          </button>
        </div>
      </main>

      {modal && <AIModal item={modal} onClose={() => setModal(null)} />}
      {testOpen && <TestModal onClose={() => setTestOpen(false)} />}
    </div>
  );
}