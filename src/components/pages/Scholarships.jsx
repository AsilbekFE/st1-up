import { useState, useEffect } from "react";
import { askGemini } from "../../ai/geminiService";
import { findBestAnswer } from "../../ai/chatEngine";

const GRANTS = [
  {
    id: 1,
    badge: "100% Qoplash",
    badgeColor: "#00e5a0",
    title: '"El-yurt umidi" jamg\'arma grantlari',
    desc: "Xorijiy davlatlarda tahsil oluvchi, magistratura, doktorantura va stajerlik dasturlarida o'qishni moliyalashtiradi.",
    tags: ["100% Qoplash", "50 ta grant"],
    links: ["MTM 1.2x", "GPA 0.0x"],
    color: "#1a2340",
    accent: "#00e5a0",
  },
  {
    id: 2,
    badge: "Davlat granti",
    badgeColor: "#a78bfa",
    title: "OTMlarga kirish uchun davlat granti",
    desc: "O'zbekistonning barcha davlat oliy ta'lim muassasalari uchun test natijalariga asosan taqdim etiladi.",
    tags: ["Bakalavr", "Magistratura"],
    links: ["OTM test natijalari", "Akademik ko'rsatkichlar"],
    color: "#1a2340",
    accent: "#a78bfa",
  },
  {
    id: 3,
    badge: "Prezident granti",
    badgeColor: "#f59e0b",
    title: "Yangi O'zbekiston universiteti prezident granti",
    desc: "Iqtidorli o'quvchilar uchun o'qish uchun to'liq to'lovni qoplaydigan maxsus prezident granti.",
    tags: ["To'liq stipendiya", "Tanlangan yo'nalishlar"],
    links: ["Elektronik holat Ma'lumoti", "Sertifikat talab qilinadi"],
    color: "#1a2340",
    accent: "#f59e0b",
  },
  {
    id: 4,
    badge: "100% Qoplash",
    badgeColor: "#00e5a0",
    title: "WIUT Merit-based Scholarship",
    desc: "Eng yuqori o'quvchilarga ega bo'lgan talabalarga ajratiladigan to'liq stipendiya dasturi.",
    tags: ["100% Grant"],
    links: ["Merit Award+"],
    color: "#1a2340",
    accent: "#00e5a0",
  },
  {
    id: 5,
    badge: "Ijtimoiy grant",
    badgeColor: "#60a5fa",
    title: "CAU (ex AKFA) ijtimoiy grant dasturi",
    desc: "Ijtimoiy himoyaga muhtoj talabalar uchun ta'lim xarajatlarini qoplashga yo'naltirilgan grant.",
    tags: ["Muhtoj oilalar", "Hujjat talab qilinadi"],
    links: ["To'liq Qoplash"],
    color: "#1a2340",
    accent: "#60a5fa",
  },
];

const STEPS = [
  { num: 1, title: "Grantni tanlash", desc: "Siz uchun mos grantlarni toping va tanlang." },
  { num: 2, title: "Hujjatni tayyorlash", desc: "Kerakli sertifikatlar va hujjatlaringizni to'plang." },
  { num: 3, title: "Ariza yuborish", desc: "Barcha hujjatlar tayyor bo'lsa, arizangizni yuboring." },
  { num: 4, title: "Natijani kutish", desc: "Natija va javob uchun email/telefon orqali xabar beriladi." },
];

function GrantCard({ grant, onDetails }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #1a2340 0%, #111827 100%)",
      borderRadius: 16,
      padding: "20px",
      border: `1px solid ${grant.accent}33`,
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      position: "relative",
      overflow: "hidden",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${grant.accent}44`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      <span style={{
        background: grant.accent + "22",
        color: grant.accent,
        borderRadius: 20,
        padding: "3px 12px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.5,
        marginBottom: 10,
        display: "inline-block",
        border: `1px solid ${grant.accent}55`,
      }}>{grant.badge}</span>
      <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: "8px 0", lineHeight: 1.4 }}>{grant.title}</h3>
      <p style={{ color: "#94a3b8", fontSize: 12.5, lineHeight: 1.6, margin: "0 0 12px" }}>{grant.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {grant.tags.map(t => (
          <span key={t} style={{ background: "#0f172a", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px", fontSize: 11 }}>✓ {t}</span>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {grant.links.map(l => (
          <span key={l} style={{ color: grant.accent, fontSize: 11 }}>🔗 {l}</span>
        ))}
      </div>
      <button onClick={() => onDetails(grant)} style={{
        background: "transparent",
        border: `1px solid ${grant.accent}`,
        color: grant.accent,
        borderRadius: 8,
        padding: "6px 16px",
        fontSize: 12,
        cursor: "pointer",
        fontWeight: 600,
        transition: "background 0.2s",
      }}
        onMouseEnter={e => e.currentTarget.style.background = grant.accent + "22"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >Batafsil →</button>
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
    <div style={{
      position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: "#111827", borderRadius: 20, padding: 28,
        maxWidth: 520, width: "100%", border: "1px solid #334155",
        maxHeight: "85vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>🤖 AI Maslahatchi</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>

        {grant && (
          <div style={{ background: "#1a2340", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 4px" }}>Tanlangan grant:</p>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>{grant.title}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[
            grant ? `"${grant.title}" granti uchun qanday hujjatlar kerak?` : null,
            grant ? `Bu grantga kimlar murojaat qila oladi?` : null,
            "O'zim uchun eng mos grantni toping.",
          ].filter(Boolean).map(q => (
            <button key={q} onClick={() => askAI(q)} style={{
              background: "#1a2340", border: "1px solid #334155",
              color: "#94a3b8", borderRadius: 8, padding: "8px 14px",
              fontSize: 12, cursor: "pointer", textAlign: "left",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#6366f1"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#334155"}
            >{q}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === "Enter" && question.trim() && askAI(question)}
            placeholder="O'z savolingizni yozing..."
            style={{
              flex: 1, background: "#1a2340", border: "1px solid #334155",
              borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 13,
              outline: "none",
            }}
          />
          <button onClick={() => question.trim() && askAI(question)} style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", borderRadius: 8, padding: "10px 16px",
            color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>Yuborish</button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "#6366f1", padding: 20 }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⟳</div>
            <p style={{ margin: 0, fontSize: 13 }}>AI javob tayyorlamoqda...</p>
          </div>
        )}

        {result && (
          <div style={{
            background: "#1a2340", borderRadius: 12, padding: 16,
            border: "1px solid #6366f133",
          }}>
            <p style={{ color: "#00e5a0", fontSize: 11, margin: "0 0 8px", fontWeight: 700 }}>🤖 AI JAVOBI</p>
            <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsletterAI() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    if (!email.includes("@")) { setMsg("To'g'ri email kiriting."); return; }
    setLoading(true);
    const prompt = `${email} emailiga obuna bo'lish tasdiqlandi. Qisqa, iliq xush kelibsiz xabari yoz.`;
    try {
      const { answer, usingFallback } = await askGemini(prompt);
      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(prompt);
        setMsg(fallback || "Obuna bo'ldingiz! Tez orada yangiliklar kelib turadi. 🎉");
      } else {
        setMsg(answer);
      }
      setEmail("");
    } catch {
      setMsg("Obuna bo'ldingiz! Tez orada yangiliklar kelib turadi. 🎉");
    }
    setLoading(false);
  }

  return (
    <section style={{
      background: "linear-gradient(135deg, #1a2340 0%, #0f172a 100%)",
      borderRadius: 20, padding: "40px 32px", margin: "0 0 40px",
      border: "1px solid #334155", textAlign: "center",
    }}>
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>Yangilardan qolib ketmang</h2>
      <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 20px" }}>Birinchi bo'lib grantlar haqida xabar oling va kelajagingizni rejalashtiring.</p>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && subscribe()}
          placeholder="Email manzilingiz"
          style={{
            background: "#0f172a", border: "1px solid #334155",
            borderRadius: 10, padding: "12px 18px", color: "#fff",
            fontSize: 14, minWidth: 240, outline: "none",
          }}
        />
        <button onClick={subscribe} disabled={loading} style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none", borderRadius: 10, padding: "12px 24px",
          color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}>{loading ? "..." : "Obuna bo'lish"}</button>
      </div>
      {msg && <p style={{ color: "#00e5a0", marginTop: 14, fontSize: 13 }}>{msg}</p>}
    </section>
  );
}

export default function EduUZ() {
  const [grants, setGrants] = useState(GRANTS);
  const [modal, setModal] = useState(null);
  const [consultModal, setConsultModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Barcha grantlar");

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

  const filters = ["Bakalavr", "Magistratura", "Doktorantura", "Xorijiy"];

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#fff",
    }}>
      {/* Hero */}
      <header style={{
        padding: "60px 24px 48px",
        textAlign: "center",
        borderBottom: "1px solid #1e293b",
      }}>
        <div style={{
          display: "inline-block",
          background: "#6366f122",
          border: "1px solid #6366f155",
          borderRadius: 20,
          padding: "4px 14px",
          fontSize: 11,
          color: "#a78bfa",
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 18,
        }}>⭐ SIZNING KELAJAGINGIZ UCHUN</div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, margin: "0 0 8px", lineHeight: 1.2 }}>
          O'zbekistonda ta'lim<br />
          <span style={{ background: "linear-gradient(135deg, #6366f1, #00e5a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            uchun grantlar
          </span>
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 15, maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.6 }}>
          Kelajagingizni bugundan quring. Davlat, xalqaro va universitet grantlari bilan imkoniyatingiz cheksiz.
        </p>

        {/* Search bar */}
        <div style={{
          background: "#111827",
          borderRadius: 16,
          padding: "16px 20px",
          maxWidth: 700,
          margin: "0 auto",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          border: "1px solid #1e293b",
        }}>
          <input placeholder="🔍 Grant turi..." style={{ flex: 1, minWidth: 100, background: "#1a2340", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
          <input placeholder="📍 Davlat..." style={{ flex: 1, minWidth: 100, background: "#1a2340", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }} />
          <select style={{ flex: 1, minWidth: 100, background: "#1a2340", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#94a3b8", fontSize: 13, outline: "none" }}>
            <option>Barcha grantlar</option>
            <option>Bakalavr</option>
            <option>Magistratura</option>
          </select>
          <button style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "none", borderRadius: 8, padding: "8px 20px",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>🔎 Izlash</button>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
          {["Bakalavr", "Magistratura", "Xorijiy", "Davlat", "Xususiy"].map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              background: activeFilter === f ? "#6366f122" : "transparent",
              border: `1px solid ${activeFilter === f ? "#6366f1" : "#334155"}`,
              color: activeFilter === f ? "#a78bfa" : "#64748b",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              cursor: "pointer",
            }}>{f}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 16px" }}>
        {/* Top Grants */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>Top Grantlar</h2>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Hozirgi vaqtda taqdim etilayotgan eng yaxshi grantlar</p>
          </div>
          <span style={{ color: "#6366f1", fontSize: 13, fontWeight: 600 }}>Jami: 45 ta grant</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 24 }}>
          {grants.map(g => <GrantCard key={g.id} grant={g} onDetails={setModal} />)}

          {/* AI Consult Card */}
          <div style={{
            background: "linear-gradient(135deg, #1a1a3e 0%, #0f0f2d 100%)",
            borderRadius: 16, padding: 20,
            border: "1px dashed #6366f166",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", gap: 10,
          }}>
            <div style={{ fontSize: 36 }}>🤖</div>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, margin: 0 }}>O'zingizga mos grant topoldingizmi?</h3>
            <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
              Munosabatingizga qarab sizga eng mos grantni AI yordamida topamiz.
            </p>
            <button onClick={() => setConsultModal(true)} style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none", borderRadius: 10, padding: "10px 20px",
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>Konsultatsiya Olish</button>
          </div>
        </div>

        {/* Process Steps */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>Grantga topshirish jarayoni</h2>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: "0 0 28px" }}>Oddiy 4 qadamda muvaffaqiyatga erishing</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{
                background: "#111827",
                borderRadius: 14,
                padding: "20px 16px",
                border: "1px solid #1e293b",
                textAlign: "center",
                position: "relative",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 800, margin: "0 auto 12px",
                }}>{s.num}</div>
                <h4 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>{s.title}</h4>
                <p style={{ color: "#64748b", fontSize: 12, lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", right: -8, top: "50%",
                    transform: "translateY(-50%)",
                    color: "#334155", fontSize: 18, display: "none",
                  }}>→</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <NewsletterAI />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #1e293b",
        padding: "24px 16px",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
        maxWidth: 900,
        margin: "0 auto",
      }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>EduUZ</div>
          <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>O'zbekistonning ilg'or ta'lim va muassasalari.</p>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          {["About Us", "Privacy Policy", "Contact Support", "Terms of Service"].map(l => (
            <a key={l} href="#" style={{ color: "#64748b", fontSize: 12, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <p style={{ color: "#334155", fontSize: 11, alignSelf: "center", margin: 0 }}>© 2026 EduUZ. Modernizing Uzbek Higher Education.</p>
      </footer>

      {/* Grant Detail + AI Modal */}
      {modal && <AIModal grant={modal} onClose={() => setModal(null)} />}
      {consultModal && <AIModal grant={null} onClose={() => setConsultModal(false)} />}
    </div>
  );
}