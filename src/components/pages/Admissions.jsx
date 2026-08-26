import { useState, useEffect } from "react";
import { askGemini } from "../../ai/geminiService";
import { findBestAnswer } from "../../ai/chatEngine";

const STEPS = [
  { icon: "📋", title: "Ro'yxatdan o'tish", desc: "EduUZ platformasida ro'yxatdan o'ting va shaxsiy kabinetingizni yarating." },
  { icon: "🏛️", title: "Imtihonlar", desc: "DTM yoki universitet test imtihonlarida qatnashing va natijangizni oling." },
  { icon: "📁", title: "Hujjat topshirish", desc: "Universitetlarning rasmiy saytiga hujjatlaringizni yuklang va tasdiqlang." },
  { icon: "✅", title: "Qabul", desc: "Qabul natijasi e'lon qilinishi bilan kabinet orqali javob olasiz." },
];

const DOCS = [
  { icon: "🪪", title: "Pasport (ID karta)", desc: "Fuqarolik pasporti yoki ID kartangizning nusxasi talab etiladi." },
  { icon: "🎓", title: "Diplom / Attestat", desc: "O'rta maktab yoki kollej diplomingizning tasdiqlangan nusxasi." },
  { icon: "📸", title: "3x4 Fotosurat", desc: "Yaqinda olingan, oq fonda 3x4 o'lchamdagi rasm." },
  { icon: "📝", title: "Sertifikatlar", desc: "IELTS, SAT yoki boshqa xalqaro sertifikatlar (ixtiyoriy)." },
];

const PORTALS = [
  { icon: "🏫", title: "UzBMS (DTM) Portali", desc: "Davlat test markaziga ro'yxatdan o'tish va natijalarni ko'rish.", link: "uzbms.dtm.uz" },
  { icon: "🏛️", title: "My.gov.uz", desc: "Rasmiy davlat xizmatlari portali orqali hujjat tasdiqlash.", link: "my.gov.uz" },
];

const NEWS = [
  { badge: "Yangilik", title: "O'zbekistonning Top 10 universiteti 2024 yilgi qabul uchun kvotalarni e'lon qildi", date: "15 May 2024" },
];

const FAQS_DATA = [
  { q: "Qaysi universitetlarga murojaat qilishim mumkin?", a: "EduUZ platformasi orqali O'zbekistondagi 50+ davlat va xususiy universitetlarga murojaat qilishingiz mumkin. Filtr yordamida shahar, yo'nalish va grant turini tanlang." },
  { q: "Hujjatlarni qanday taqdim etish kerak?", a: "Barcha hujjatlar raqamli shaklda — PDF yoki JPG formatida universitetning rasmiy portali orqali yuklanadi. Originallar qabul paytida taqdim etiladi." },
  { q: "Subsidiya qachon e'lon qilinadi?", a: "Davlat granti natijalari odatda har yili Avgust oyida DTM saytida e'lon qilinadi. Xususiy universitetlar esa aprel-may oylarida o'z natijalari haqida xabar beradi." },
  { q: "Chet el universiteti uchun qanday murojaat qilish mumkin?", a: "Xorijiy universitetlarga kirish uchun IELTS/TOEFL, SAT/GRE sertifikatlari talab qilinadi. EduUZ platformasi yordamida to'g'ridan-to'g'ri arizangizni yuboring." },
  { q: "Grant uchun minimum ball qancha?", a: "Grant ballari har yili o'zgarib turadi. Odatda bakalavr uchun 56.7+ ball, magistratura uchun 60+ ball talab etiladi." },
  { q: "Ariza topshirish muddati qachon tugaydi?", a: "DTM imtihonlari uchun ro'yxatdan o'tish odatda Mart-Aprel oylarida tugaydi. Xususiy universitetlar esa yil davomida qabul qilishi mumkin." },
];

function StepCard({ step, index }) {
  return (
    <div style={{
      flex: "1 1 160px",
      borderRadius: 14,
      padding: "20px 16px",
      border: "1px solid #1e293b",
      textAlign: "center",
      position: "relative",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, margin: "0 auto 12px",
      }}>{step.icon}</div>
      <div style={{
        position: "absolute", top: 12, right: 14,
        width: 22, height: 22, borderRadius: "50%",
        background: "#1e293b", color: "#6366f1",
        fontSize: 11, fontWeight: 800,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{index + 1}</div>
      <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>{step.title}</h4>
      <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
    </div>
  );
}

function FAQItem({ faq, isOpen, onToggle, onAsk }) {
  return (
    <div style={{
      border: "1px solid #1e293b",
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "16px 18px", cursor: "pointer", textAlign: "left", gap: 12,
        }}
      >
        <span style={{ color: "#e2e8f0", fontSize: 14, fontWeight: 600 }}>{faq.q}</span>
        <span style={{ color: "#6366f1", fontSize: 18, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>⌄</span>
      </button>
      {isOpen && (
        <div style={{ padding: "0 18px 16px" }}>
          <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: "0 0 10px" }}>{faq.a}</p>
          <button onClick={() => onAsk(faq.q)} style={{
            background: "transparent", border: "1px solid #6366f155",
            color: "#a78bfa", borderRadius: 6, padding: "4px 12px",
            fontSize: 11, cursor: "pointer",
          }}>🤖 AI dan batafsil so'rash</button>
        </div>
      )}
    </div>
  );
}

function AIModal({ question, onClose }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(Boolean(question));
  const [input, setInput] = useState(question || "");

  async function ask(prompt) {
    if (!prompt.trim()) return;
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

  useEffect(() => {
    if (!question) return undefined;
    let active = true;
    (async () => {
      try {
        const { answer, usingFallback } = await askGemini(question);
        if (!active) return;
        if (usingFallback || !answer) {
          const { answer: fallback } = findBestAnswer(question);
          setResult(fallback || "Xatolik yuz berdi.");
        } else {
          setResult(answer);
        }
      } catch {
        if (!active) return;
        const { answer: fallback } = findBestAnswer(question);
        setResult(fallback || "Xatolik yuz berdi.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [question]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111827", borderRadius: 20, padding: 28, maxWidth: 500, width: "100%", border: "1px solid #334155", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#fff", fontSize: 17, fontWeight: 800, margin: 0 }}>🤖 AI Maslahatchi</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask(input)}
            placeholder="Savolingizni yozing..."
            style={{ flex: 1, background: "#1a2340", border: "1px solid #334155", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13, outline: "none" }}
          />
          <button onClick={() => ask(input)} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, padding: "10px 16px", color: "#fff", cursor: "pointer", fontWeight: 700 }}>↵</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
          {["Qabul hujjatlari ro'yxati?", "DTM balli qancha bo'lishi kerak?", "Xorijga o'qishga ketish uchun nima kerak?"].map(q => (
            <button key={q} onClick={() => { setInput(q); ask(q); }} style={{ background: "#1a2340", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "9px 14px", fontSize: 12, cursor: "pointer", textAlign: "left" }}>{q}</button>
          ))}
        </div>

        {loading && <div style={{ textAlign: "center", color: "#6366f1", padding: 20 }}><div style={{ fontSize: 28 }}>⟳</div><p style={{ margin: "8px 0 0", fontSize: 13 }}>AI javob tayyorlamoqda...</p></div>}
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

export default function EduUZQabul() {
  const [search, setSearch] = useState("");
  const [docFilter, setDocFilter] = useState("Barchasi");
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [aiQ, setAiQ] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  const docFilters = ["Barchasi", "Majburiy", "Sertifikatlar", "Rasmiy"];
  const docCategories = { "Barchasi": DOCS, "Majburiy": DOCS.slice(0, 2), "Sertifikatlar": [DOCS[3]], "Rasmiy": [DOCS[0], DOCS[1]] };

  const filteredDocs = (docCategories[docFilter] || DOCS).filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaqs = FAQS_DATA.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  function openAI(q) { setAiQ(q); setAiOpen(true); }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", color: "#fff" }}>

      {/* Hero */}
      <header style={{ textAlign: "center", padding: "56px 20px 44px" }}>
        <div style={{ display: "inline-block", background: "#6366f122", border: "1px solid #6366f144", borderRadius: 20, padding: "3px 14px", fontSize: 11, color: "#a78bfa", fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>
          EduUZ BILAN BIRGALIKDA
        </div>
        <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2 }}>
          O'qishga kirish jarayoni va{" "}
          <span style={{ background: "linear-gradient(135deg,#6366f1,#00e5a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>qabul</span>
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 14, maxWidth: 500, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Kelajagingizni bir qadam oldinda quring. EduUZ orqali O'zbekistonning eng yaxshi universitetlarida hujjat topshirishni boshlang.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => openAI("Universitetga hujjat topshirish jarayonini tushuntir")} style={{
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            border: "none", borderRadius: 10, padding: "12px 24px",
            color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}>Ariza topshirish →</button>
          <button onClick={() => openAI("EduUZ platformasi qanday ishlaydi?")} style={{
            background: "transparent", border: "1px solid #334155",
            borderRadius: 10, padding: "12px 24px",
            color: "#94a3b8", fontSize: 14, cursor: "pointer",
          }}>Platformani tushunish</button>
        </div>
      </header>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "0 16px 48px" }}>

        {/* Steps */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Qabul bosqichlari</h2>
            <span style={{ color: "#64748b", fontSize: 12 }}>4 ta oson qadam orqali universitetga kiring.</span>
          </div>
          <div className="grid grid-cols-2 gap-3 md:flex md:gap-3">
            {STEPS.map((s, i) => <StepCard key={i} step={s} index={i} />)}
          </div>
        </section>

        {/* Docs (collapsible on mobile) + Portals */}
        <section className="grid grid-cols-2 gap-5 mb-10 items-start">
          {/* Docs - collapsible card (mobile only) */}
          <div className="col-span-2 md:col-span-1 border border-[#1e293b] rounded-2xl p-5">
            {/* Mobile toggle */}
            <button
              onClick={() => setDocsOpen(o => !o)}
              className="w-full flex justify-between items-center cursor-pointer md:hidden"
            >
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: docsOpen ? "#a78bfa" : "#fff" }}>Kerakli hujjatlar ro'yxati</h3>
              <span style={{ color: "#6366f1", fontSize: 18, transition: "transform 0.2s", transform: docsOpen ? "rotate(180deg)" : "none" }}>⌄</span>
            </button>

            {/* Desktop heading (always visible) */}
            <h3 className="hidden md:block" style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>Kerakli hujjatlar ro'yxati</h3>

            <div className={`${docsOpen ? "block" : "hidden"} md:block`}>
              {/* Search */}
              <div className="bg-[#111827] border border-[#1e293b] rounded-lg px-3 py-[7px] flex items-center gap-2 mt-3.5 md:mt-3.5 mb-2.5">
                <span className="text-[#475569]">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hujjat qidirish..." className="flex-1 bg-transparent border-none text-white text-xs outline-none" />
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1.5 mb-3.5 flex-wrap">
                {docFilters.map(f => (
                  <button key={f} onClick={() => setDocFilter(f)} className={`rounded-full px-2.5 py-[3px] text-[11px] cursor-pointer ${docFilter === f ? "bg-[#6366f122] border border-[#6366f1] text-[#a78bfa]" : "bg-transparent border border-[#334155] text-[#64748b]"}`}>{f}</button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {filteredDocs.length === 0 && <p className="text-[#475569] text-[13px]">Hujjat topilmadi.</p>}
                {filteredDocs.map((d, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <div className="w-8 h-8 rounded-lg bg-[#1a2340] flex items-center justify-center text-base shrink-0">{d.icon}</div>
                    <div>
                      <div className="text-white text-[13px] font-semibold">{d.title}</div>
                      <div className="text-[#64748b] text-[11px] leading-normal">{d.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Portals + News: mobile = 2 per row & full-width news; desktop = stacked right column */}
          <div className="contents md:flex md:flex-col md:gap-3.5">
            {PORTALS.map((p, i) => (
              <div key={i} className="h-full border border-[#1e293b] rounded-xl px-4 py-[18px] flex flex-col md:flex-row gap-3 items-center md:items-start text-center md:text-left">
                <div className="w-10 h-10 rounded-[10px] bg-[#1a2340] flex items-center justify-center text-xl shrink-0">{p.icon}</div>
                <div className="flex flex-col items-center md:items-start">
                  <div className="text-white text-sm font-bold mb-1">{p.title}</div>
                  <p className="hidden md:block text-[#64748b] text-xs leading-normal mb-2">{p.desc}</p>
                  <a href={`https://${p.link}`} target="_blank" rel="noreferrer" className="text-[#6366f1] text-[11px] no-underline">🔗 {p.link}</a>
                </div>
              </div>
            ))}

            {/* News - full width on mobile, normal on desktop */}
            {NEWS.map((n, i) => (
              <div key={i} className="col-span-2 border border-[#1e293b] rounded-xl overflow-hidden relative">
                <div className="bg-gradient-to-br from-[#1a2340] to-[#0f172a] p-4">
                  <span className="bg-[#00e5a022] text-[#00e5a0] border border-[#00e5a055] rounded-full px-2.5 py-[2px] text-[10px] font-bold">{n.badge}</span>
                  <h4 className="text-white text-[13px] font-bold mt-2 mb-1 leading-snug">{n.title}</h4>
                  <span className="text-[#475569] text-[11px]">{n.date}</span>
                  <button onClick={() => openAI(n.title)} className="block w-full md:w-auto md:inline-block mt-2 bg-transparent border border-[#6366f155] text-[#a78bfa] rounded-md px-3 py-1.5 text-[11px] cursor-pointer text-center">Batafsil →</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ textAlign: "center", fontSize: 20, fontWeight: 800, margin: "0 0 6px" }}>Tez-tez so'raladigan savollar</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 20px" }}>Savolingizni toping yoki AI dan so'rang.</p>

          {/* FAQ search */}
          <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 10, padding: "9px 16px", display: "flex", alignItems: "center", gap: 8, marginBottom: 14, maxWidth: 500, margin: "0 auto 14px" }}>
            <span style={{ color: "#475569" }}>🔍</span>
            <input value={faqSearch} onChange={e => setFaqSearch(e.target.value)} placeholder="Savol qidirish..." style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 13, outline: "none" }} />
            {faqSearch && <button onClick={() => setFaqSearch("")} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16 }}>✕</button>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredFaqs.length === 0 && (
              <div style={{ textAlign: "center", padding: 24 }}>
                <p style={{ color: "#475569", fontSize: 14, margin: "0 0 12px" }}>Savol topilmadi. AI dan so'raysizmi?</p>
                <button onClick={() => openAI(faqSearch)} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 700 }}>🤖 AI dan so'rash</button>
              </div>
            )}
            {filteredFaqs.map((f, i) => (
              <FAQItem key={i} faq={f} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} onAsk={openAI} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => openAI("Universitetga kirish haqida savolim bor")} style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none", borderRadius: 10, padding: "12px 28px",
              color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>🤖 AI Maslahatchi bilan gaplashing</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e293b", padding: "20px 16px", maxWidth: 880, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>EduUZ</div>
          <p style={{ color: "#475569", fontSize: 11, margin: "4px 0 0" }}>O'zbekistonning ilg'or ta'lim muassasalari.</p>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          {["About Us", "Privacy Policy", "Contact Support", "Terms of Service"].map(l => (
            <a key={l} href="#" style={{ color: "#475569", fontSize: 11, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>

      {aiOpen && <AIModal question={aiQ} onClose={() => { setAiOpen(false); setAiQ(null); }} />}
    </div>
  );
}