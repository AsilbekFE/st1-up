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
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    icon: "🏥",
    badge: null,
    badgeColor: null,
    title: "Pediatriya",
    desc: "Bolalar salomatligi va rivojlanishiga e'tibor qaratuvchi fundamental tibbiyot yo'nalishi.",
    stipendiya: "$600+",
    universitetlar: 15,
    accent: "#ec4899",
  },
  {
    id: 5,
    icon: "🏗️",
    badge: null,
    badgeColor: null,
    title: "Arxitektura",
    desc: "Zamonaviy shahar dizayni va insoniy qurilish tizimlarini loyihalash.",
    stipendiya: "$750+",
    universitetlar: 10,
    accent: "#f97316",
  },
  {
    id: 6,
    icon: "🦾",
    badge: "Yangi",
    badgeColor: "#00e5a0",
    title: "Robototexnika",
    desc: "Avtomatlashtirilgan tizimlar va texnologik innovatsiyalar sohasida ta'lim.",
    stipendiya: "$1,100+",
    universitetlar: 5,
    accent: "#10b981",
  },
  {
    id: 7,
    icon: "🎮",
    badge: "Top",
    badgeColor: "#f59e0b",
    title: "Game Dizayn",
    desc: "Kompyuter o'yinlari grafika, 3D modellashtirilish va vizual effektlar.",
    stipendiya: "$1,500+",
    universitetlar: 3,
    accent: "#a855f7",
  },
  {
    id: 8,
    icon: "📊",
    badge: null,
    badgeColor: null,
    title: "Data Science",
    desc: "Katta hajmdagi ma'lumotlarni tahlil qilish va prognoz modellar yaratish.",
    stipendiya: "$1,300+",
    universitetlar: 10,
    accent: "#3b82f6",
  },
];

function YonalishCard({ item, onDetails }) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  const showFull = !isMobile || expanded;
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14,
        padding: "18px 16px",
        border: `1px solid ${hovered ? item.accent + "88" : "#1e293b"}`,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: hovered ? `0 6px 28px ${item.accent}33` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {item.badge && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          background: item.badgeColor + "22",
          color: item.badgeColor,
          border: `1px solid ${item.badgeColor}55`,
          borderRadius: 20, padding: "2px 10px",
          fontSize: 10, fontWeight: 700,
        }}>{item.badge}</span>
      )}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: item.accent + "22",
        border: `1px solid ${item.accent}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, marginBottom: 12,
      }}>{item.icon}</div>
      <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>{item.title}</h3>

      {showFull && (
        <>
          <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, margin: "0 0 14px" }}>{item.desc}</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 11 }}>
            <div>
              <div style={{ color: "#64748b" }}>O'RTACHA MAOSH</div>
              <div style={{ color: item.accent, fontWeight: 800, fontSize: 14 }}>{item.stipendiya}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#64748b" }}>UNIVERSITETLAR</div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{item.universitetlar} ta</div>
            </div>
          </div>
        </>
      )}

      {/* AI button - faqat mobilda ochilgan holatda */}
      {isMobile && expanded && (
        <button
          onClick={() => onDetails(item)}
          style={{
            background: "transparent",
            border: `1px solid ${item.accent}`,
            color: item.accent,
            borderRadius: 8, padding: "6px 16px",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
            width: "100%", marginBottom: 8,
          }}
          onMouseEnter={e => e.currentTarget.style.background = item.accent + "22"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >🤖 AI maslahat olish</button>
      )}

      {/* Asosiy tugma: desktopda AI modal, mobilda ochish/yopish */}
      <button
        onClick={() => isMobile ? setExpanded(e => !e) : onDetails(item)}
        style={{
          background: "transparent",
          border: `1px solid ${item.accent}`,
          color: item.accent,
          borderRadius: 8, padding: "6px 16px",
          fontSize: 12, fontWeight: 600, cursor: "pointer",
          transition: "background 0.2s",
          width: "100%",
        }}
        onMouseEnter={e => e.currentTarget.style.background = item.accent + "22"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >{isMobile && expanded ? "Yopish ↑" : "Batafsil →"}</button>
    </div>
  );
}

function AIModal({ item, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [question, setQuestion] = useState("");

  async function ask(prompt) {
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

  const suggestions = item ? [
    `"${item.title}" yo'nalishi bo'yicha O'zbekistonda qaysi universitetlar bor?`,
    `"${item.title}" mutaxassisligi uchun qanday grantlar mavjud?`,
    `"${item.title}" sohasida kelajak imkoniyatlari qanday?`,
  ] : [
    "Men uchun eng mos yo'nalishni toping.",
    "O'zbekistonda eng so'ralayotgan mutaxassisliklar qaysilar?",
    "Xorijda o'qish uchun qaysi yo'nalish yaxshi?",
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#111827", borderRadius: 20, padding: 28,
          maxWidth: 500, width: "100%", border: "1px solid #334155",
          maxHeight: "85vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 800, margin: 0 }}>🤖 AI Maslahatchi</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {item && (
          <div style={{ background: "#1a2340", borderRadius: 10, padding: 12, marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <div>
              <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>Tanlangan yo'nalish</p>
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{item.title}</p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          {suggestions.map(q => (
            <button key={q} onClick={() => ask(q)} style={{
              background: "#1a2340", border: "1px solid #334155",
              color: "#94a3b8", borderRadius: 8, padding: "9px 14px",
              fontSize: 12, cursor: "pointer", textAlign: "left",
              transition: "border-color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#334155"}
            >{q}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && question.trim() && ask(question)}
            placeholder="O'z savolingizni yozing..."
            style={{
              flex: 1, background: "#1a2340", border: "1px solid #334155",
              borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none",
            }}
          />
          <button
            onClick={() => question.trim() && ask(question)}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: 8, padding: "10px 16px",
              color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13,
            }}
          >↵</button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 20, color: "#6366f1" }}>
            <div style={{ fontSize: 28, marginBottom: 8, animation: "spin 1s linear infinite" }}>⟳</div>
            <p style={{ margin: 0, fontSize: 13 }}>AI javob tayyorlamoqda...</p>
          </div>
        )}

        {result && (
          <div style={{ background: "#1a2340", borderRadius: 12, padding: 16, border: "1px solid #6366f133" }}>
            <p style={{ color: "#00e5a0", fontSize: 11, margin: "0 0 8px", fontWeight: 700 }}>🤖 AI JAVOBI</p>
            <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{result}</p>
          </div>
        )}
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
    { q: "Qaysi soha sizni qiziqtiradi?", opts: ["Texnologiya", "Tibbiyot", "Biznes", "San'at va dizayn"] },
    { q: "Qaysi ko'nikma sizga yaqin?", opts: ["Tahlil va mantiq", "Ijodkorlik", "Muloqot", "Texnik ko'nikmalar"] },
    { q: "Kelajakda qayerda ishlashni xohlaysiz?", opts: ["IT kompaniya", "Shifoxona", "Biznes", "Xalqaro tashkilot"] },
    { q: "O'qish davomiyligini qanday ko'rasiz?", opts: ["2 yil", "4 yil", "6 yil+", "Online ta'lim"] },
  ];

  async function getResult() {
    setLoading(true);
    const summary = Object.entries(answers).map(([i, a]) => `${questions[i].q}: ${a}`).join("; ");
    const prompt = `Quyidagi javoblar asosida eng mos 2-3 ta ta'lim yo'nalishini tavsiya qil va qisqa tushuntir:\n${summary}`;
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
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111827", borderRadius: 20, padding: 28, maxWidth: 460, width: "100%", border: "1px solid #334155" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 800, margin: 0 }}>🎯 Yo'nalish Testi</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {!result ? (
          <>
            {/* Progress */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 2,
                  background: i <= step ? "linear-gradient(90deg,#6366f1,#8b5cf6)" : "#1e293b",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>

            <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 8px" }}>Savol {step + 1} / {questions.length}</p>
            <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>{questions[step].q}</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {questions[step].opts.map(opt => (
                <button key={opt} onClick={() => {
                  const newAns = { ...answers, [step]: opt };
                  setAnswers(newAns);
                  if (step < questions.length - 1) {
                    setStep(step + 1);
                  } else {
                    getResult();
                  }
                }} style={{
                  background: "#1a2340", border: "1px solid #334155",
                  color: "#e2e8f0", borderRadius: 10, padding: "12px 16px",
                  fontSize: 13, cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.color = "#e2e8f0"; }}
                >{opt}</button>
              ))}
            </div>
          </>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: 30, color: "#6366f1" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>⟳</div>
            <p style={{ margin: 0 }}>AI tahlil qilmoqda...</p>
          </div>
        ) : (
          <div>
            <div style={{ background: "#1a2340", borderRadius: 12, padding: 16, border: "1px solid #6366f133", marginBottom: 14 }}>
              <p style={{ color: "#00e5a0", fontSize: 11, margin: "0 0 8px", fontWeight: 700 }}>🤖 AI TAVSIYASI</p>
              <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{result}</p>
            </div>
            <button onClick={() => { setStep(0); setAnswers({}); setResult(""); }} style={{
              background: "transparent", border: "1px solid #334155",
              color: "#94a3b8", borderRadius: 8, padding: "8px 16px",
              fontSize: 12, cursor: "pointer", width: "100%",
            }}>Qayta boshlash</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EduUZYonalishlar() {
  const [modal, setModal] = useState(null);
  const [testOpen, setTestOpen] = useState(false);
  const [consultOpen, setConsultOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = YONALISHLAR.filter(y =>
    y.title.toLowerCase().includes(search.toLowerCase()) ||
    y.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", color: "#fff" }}>
      {/* Hero */}
      <header style={{ textAlign: "center", padding: "56px 20px 36px" }}>
        <h1 style={{ fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
          Kelajagingizni Tanlang
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 460, margin: "0 auto 28px", lineHeight: 1.6 }}>
          O'zbekistonning eng yaxshi universitetlaridagi barcha yo'nalishlar, talablar va imkoniyatlar bir joyda.
        </p>

        {/* Search */}
        <div className="max-w-[600px] mx-auto bg-[#111827] border border-[#1e293b] rounded-xl px-4 py-2.5 flex gap-2.5 items-center">
          <span className="text-[#475569] text-[15px]">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Yo'nalish qidiring..."
            className="flex-1 bg-transparent border-none text-white text-[13px] outline-none"
          />
          {/* Tavsiya tugmalari - faqat desktopda */}
          <div className="hidden md:flex gap-1.5">
            {["Bakalavr", "IT", "Biznes", "Tibbiyot"].map(f => (
              <button key={f} onClick={() => setSearch(f)} className="bg-[#1a2340] border border-[#334155] text-[#94a3b8] rounded-full px-3 py-1 text-[11px] cursor-pointer whitespace-nowrap">{f}</button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-4 pb-10">
        {/* Grid - mobilda 2 ustun, desktopda auto-fill */}
        <div className="grid grid-cols-2 gap-3.5 mb-9 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">
          {filtered.map(item => (
            <YonalishCard key={item.id} item={item} onDetails={setModal} />
          ))}
        </div>

        {/* CTA Banner */}
        <div style={{
          borderRadius: 18, padding: "32px 28px",
          border: "1px solid #334155",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 20,
        }}>
          <div style={{ maxWidth: 380 }}>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 8px" }}>
              Qaysi yo'nalish sizga mos?
            </h2>
            <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, margin: 0 }}>
              Bizning sun'iy intellektga asoslangan testni topshiring va qobiliyatingizga eng mos keladigan universitet yo'nalishini aniqlang.
            </p>
          </div>
          <button
            onClick={() => setTestOpen(true)}
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
              border: "none", borderRadius: 12, padding: "13px 28px",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 20px #6366f155",
            }}
          >Testdan o'tish →</button>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1e293b", padding: "20px 16px",
        maxWidth: 860, margin: "0 auto",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>EduUZ</div>
          <p style={{ color: "#475569", fontSize: 11, margin: "4px 0 0" }}>© 2024 EduUZ. Modernizing Uzbek Higher Education.</p>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {["About Us", "Privacy Policy", "Contact Support", "Terms of Service"].map(l => (
            <a key={l} href="#" style={{ color: "#475569", fontSize: 11, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>

      {modal && <AIModal item={modal} onClose={() => setModal(null)} />}
      {testOpen && <TestModal onClose={() => setTestOpen(false)} />}
      {consultOpen && <AIModal item={null} onClose={() => setConsultOpen(false)} />}
    </div>
  );
}