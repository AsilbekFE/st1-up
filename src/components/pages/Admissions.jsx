import { useState } from "react";

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
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState(question || "");

  async function ask(prompt) {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: "Siz EduUZ platformasining AI yordamchisisiz. O'zbekistondagi universitetlarga qabul jarayoni, hujjatlar va grantlar haqida maslahat berasiz. Faqat o'zbek tilida, aniq va qisqa javob bering.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setResult(data.content?.map(b => b.text || "").join("") || "Xatolik yuz berdi.");
    } catch {
      setResult("Xatolik: AI bilan aloqa bo'lmadi.");
    }
    setLoading(false);
  }

  useState(() => { if (question) ask(question); }, []);

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
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {STEPS.map((s, i) => <StepCard key={i} step={s} index={i} />)}
          </div>
        </section>

        {/* Docs + Portals */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
          {/* Docs */}
          <div style={{ border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px" }}>Kerakli hujjatlar ro'yxati</h3>

            {/* Search */}
            <div style={{ background: "#111827", border: "1px solid #1e293b", borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#475569" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Hujjat qidirish..." style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: 12, outline: "none" }} />
            </div>

            {/* Filter tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {docFilters.map(f => (
                <button key={f} onClick={() => setDocFilter(f)} style={{
                  background: docFilter === f ? "#6366f122" : "transparent",
                  border: `1px solid ${docFilter === f ? "#6366f1" : "#334155"}`,
                  color: docFilter === f ? "#a78bfa" : "#64748b",
                  borderRadius: 20, padding: "3px 10px", fontSize: 11, cursor: "pointer",
                }}>{f}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredDocs.length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>Hujjat topilmadi.</p>}
              {filteredDocs.map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a2340", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{d.icon}</div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{d.title}</div>
                    <div style={{ color: "#64748b", fontSize: 11, lineHeight: 1.5 }}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portals */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PORTALS.map((p, i) => (
              <div key={i} style={{ border: "1px solid #1e293b", borderRadius: 14, padding: "18px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1a2340", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</div>
                  <a href={`https://${p.link}`} target="_blank" rel="noreferrer" style={{ color: "#6366f1", fontSize: 11, textDecoration: "none" }}>🔗 {p.link}</a>
                </div>
              </div>
            ))}

            {/* News */}
            {NEWS.map((n, i) => (
              <div key={i} style={{ border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden", position: "relative" }}>
                <div style={{ background: "linear-gradient(135deg,#1a2340,#0f172a)", padding: "16px" }}>
                  <span style={{ background: "#00e5a022", color: "#00e5a0", border: "1px solid #00e5a055", borderRadius: 20, padding: "2px 10px", fontSize: 10, fontWeight: 700 }}>{n.badge}</span>
                  <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: "8px 0 4px", lineHeight: 1.4 }}>{n.title}</h4>
                  <span style={{ color: "#475569", fontSize: 11 }}>{n.date}</span>
                  <br />
                  <button onClick={() => openAI(n.title)} style={{ marginTop: 8, background: "transparent", border: "1px solid #6366f155", color: "#a78bfa", borderRadius: 6, padding: "4px 12px", fontSize: 11, cursor: "pointer" }}>Batafsil →</button>
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