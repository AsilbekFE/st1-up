import { useState, useEffect, useRef } from "react";

const DEMAND_DATA = [
  { uni: "INHA University", demand: 4850, change: "+12%", color: "#8b5cf6" },
  { uni: "WIUT", demand: 3920, change: "+8%", color: "#3b82f6" },
  { uni: "TATU", demand: 3540, change: "+15%", color: "#06b6d4" },
  { uni: "TDIU", demand: 2980, change: "+5%", color: "#22c55e" },
  { uni: "Webster University", demand: 2650, change: "+10%", color: "#f59e0b" },
  { uni: "UMIT", demand: 2340, change: "+7%", color: "#ef4444" },
];

const ENTRY_SCORES = [
  { uni: "INHA University", min: 62.5, avg: 71.2, max: 95.0, icon: "🏆" },
  { uni: "WIUT", min: 58.3, avg: 67.8, max: 92.5, icon: "🥈" },
  { uni: "TATU", min: 55.0, avg: 64.5, max: 88.0, icon: "🥉" },
  { uni: "TDIU", min: 52.1, avg: 61.3, max: 85.0, icon: "📊" },
  { uni: "Webster University", min: 50.0, avg: 58.7, max: 82.0, icon: "📈" },
  { uni: "UMIT", min: 48.5, avg: 56.2, max: 80.0, icon: "📉" },
];

const INITIAL_STUDENTS = [
  { label: "Jami talabalar", base: 45280, icon: "🎓", baseChange: 3420 },
  { label: "Davlat universitetlari", base: 28150, icon: "🏛️", baseChange: 1890 },
  { label: "Xususiy universitetlar", base: 12730, icon: "🏢", baseChange: 1230 },
  { label: "Xalqaro universitetlar", base: 4400, icon: "🌍", baseChange: 300 },
];

const TOP_RECOMMENDATIONS = [
  {
    rank: 1,
    uni: "INHA University in Tashkent",
    reason: "Yuqori sifatli ta'lim, kuchli IT yo'nalishi va xalqaro diploma",
    score: 9.5,
    tags: ["IT", "Muhandislik", "Grant"],
    color: "#8b5cf6",
  },
  {
    rank: 2,
    uni: "Westminster International University",
    reason: "Xalqaro standartlar, ingliz tilida ta'lim va karyera imkoniyatlari",
    score: 9.2,
    tags: ["Biznes", "Xalqaro", "Diplom"],
    color: "#3b82f6",
  },
  {
    rank: 3,
    uni: "Tashkent University of Information Technologies",
    reason: "IT sohasida yetakchi, arzon narxlar va kuchli kadrlar tayyorlash",
    score: 9.0,
    tags: ["IT", "Texnologiya", "Arzon"],
    color: "#22c55e",
  },
];

function useAnimatedCounter(target, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const startTime = Date.now();
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    }
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);
  return value;
}

function StatCard({ label, base, icon, baseChange }) {
  const value = useAnimatedCounter(base, 2500);
  const change = useAnimatedCounter(baseChange, 2500);
  return (
    <div style={{
      background: "#11192e",
      border: "1px solid #1e293b",
      borderRadius: 16,
      padding: "20px 16px",
      textAlign: "center",
      transition: "all 0.3s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#334155";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#1e293b";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{
        fontSize: 28, fontWeight: 900, color: "#fff",
        fontFamily: "monospace",
      }}>{value.toLocaleString()}</div>
      <div style={{ color: "#64748b", fontSize: 12, marginTop: 4 }}>{label}</div>
      <div style={{
        color: "#22c55e", fontSize: 11, fontWeight: 600, marginTop: 6,
        background: "#22c55e15", padding: "3px 8px", borderRadius: 6,
        display: "inline-block",
      }}>↑ +{change.toLocaleString()} bu yil</div>
    </div>
  );
}

function DemandBar({ item, maxDemand }) {
  const [demand, setDemand] = useState(item.demand);
  useEffect(() => {
    const interval = setInterval(() => {
      setDemand(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const width = (demand / maxDemand) * 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 600 }}>{item.uni}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>
            {demand.toLocaleString()} ta
          </span>
          <span style={{ color: "#22c55e", fontSize: 10, fontWeight: 600 }}>{item.change}</span>
        </div>
      </div>
      <div style={{
        height: 8, background: "#1e293b", borderRadius: 4, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${Math.min(width, 100)}%`,
          background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
          borderRadius: 4,
          transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

function ScoreCard({ item }) {
  return (
    <div style={{
      background: "#11192e",
      border: "1px solid #1e293b",
      borderRadius: 14,
      padding: "16px 14px",
      transition: "all 0.3s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "#334155"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "#1e293b"}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{item.icon}</span>
        <h4 style={{ color: "#fff", fontSize: 13, fontWeight: 700, margin: 0 }}>{item.uni}</h4>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div style={{ flex: 1, textAlign: "center", background: "#0f172a", borderRadius: 8, padding: "10px 6px" }}>
          <div style={{ color: "#64748b", fontSize: 9, marginBottom: 4 }}>MIN</div>
          <div style={{ color: "#ef4444", fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{item.min}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", background: "#0f172a", borderRadius: 8, padding: "10px 6px" }}>
          <div style={{ color: "#64748b", fontSize: 9, marginBottom: 4 }}>ORTACHA</div>
          <div style={{ color: "#f59e0b", fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{item.avg}</div>
        </div>
        <div style={{ flex: 1, textAlign: "center", background: "#0f172a", borderRadius: 8, padding: "10px 6px" }}>
          <div style={{ color: "#64748b", fontSize: 9, marginBottom: 4 }}>MAX</div>
          <div style={{ color: "#22c55e", fontSize: 18, fontWeight: 800, fontFamily: "monospace" }}>{item.max}</div>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ item }) {
  const medalColors = { 1: "#f59e0b", 2: "#94a3b8", 3: "#cd7f32" };
  return (
    <div style={{
      background: "#11192e",
      border: `1px solid ${item.color}44`,
      borderRadius: 16,
      padding: 20,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = item.color;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 8px 30px ${item.color}22`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${item.color}44`;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Rank badge */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        width: 32, height: 32, borderRadius: "50%",
        background: `${medalColors[item.rank]}22`,
        border: `2px solid ${medalColors[item.rank]}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, fontWeight: 900, color: medalColors[item.rank],
      }}>#{item.rank}</div>

      {/* Score */}
      <div style={{
        fontSize: 32, fontWeight: 900, color: item.color,
        fontFamily: "monospace", marginBottom: 8,
      }}>{item.score}<span style={{ fontSize: 16, color: "#64748b" }}>/10</span></div>

      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 800, margin: "0 0 8px", paddingRight: 40 }}>
        {item.uni}
      </h3>

      <p style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.6, margin: "0 0 14px" }}>
        {item.reason}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {item.tags.map(tag => (
          <span key={tag} style={{
            background: `${item.color}15`,
            border: `1px solid ${item.color}44`,
            color: item.color,
            borderRadius: 20,
            padding: "3px 10px",
            fontSize: 10,
            fontWeight: 600,
          }}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("demand");
  const maxDemand = Math.max(...DEMAND_DATA.map(d => d.demand));

  const tabs = [
    { id: "demand", label: "Talablar", icon: "📊" },
    { id: "scores", label: "Kirish ballari", icon: "🎯" },
    { id: "students", label: "Talabalar soni", icon: "🎓" },
  ];

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Inter','Segoe UI',sans-serif", color: "#fff" }}>
      {/* Hero */}
      <header style={{ textAlign: "center", padding: "48px 20px 32px", position: "relative" }}>
        <div style={{
          position: "absolute", top: "0%", right: "-10%",
          width: 400, height: 400, background: "#8b5cf610",
          borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "0%", left: "-10%",
          width: 400, height: 400, background: "#3b82f610",
          borderRadius: "50%", filter: "blur(100px)", pointerEvents: "none",
        }} />
        <h1 style={{
          fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 900,
          margin: "0 0 10px", lineHeight: 1.2, position: "relative",
        }}>
          📊 O'zbekiston Ta'lim Statistikasi
        </h1>
        <p style={{
          color: "#94a3b8", fontSize: 14, maxWidth: 520,
          margin: "0 auto 24px", lineHeight: 1.6, position: "relative",
        }}>
          Universitetlar, kirish ballari va talabalar haqida real vaqtdagi ma'lumotlar.
        </p>

        {/* Tabs */}
        <div style={{
          display: "inline-flex", background: "#11192e",
          border: "1px solid #1e293b", borderRadius: 14, padding: 4,
          position: "relative",
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
                background: activeTab === tab.id ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "transparent",
                color: activeTab === tab.id ? "#fff" : "#64748b",
              }}
            >{tab.icon} {tab.label}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 40px" }}>
        {/* Tab Content */}
        {activeTab === "demand" && (
          <div style={{
            background: "#0c1528",
            border: "1px solid #1e293b",
            borderRadius: 20,
            padding: "24px 20px",
          }}>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>
              🏫 Universitetlar bo'yicha talab
            </h2>
            <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 20px" }}>
              2024-2025 o'quv yili uchun ariza topshirganlar soni
            </p>
            {DEMAND_DATA.map(item => (
              <DemandBar key={item.uni} item={item} maxDemand={maxDemand} />
            ))}
          </div>
        )}

        {activeTab === "scores" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>
              🎯 Kirish ballari
            </h2>
            <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 20px" }}>
              Minimal, o'rtacha va maksimal kirish ballari (100 ballik tizim)
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}>
              {ENTRY_SCORES.map(item => (
                <ScoreCard key={item.uni} item={item} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 800, margin: "0 0 6px" }}>
              🎓 Talabalar soni
            </h2>
            <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 20px" }}>
              O'zbekistondagi jami talabalar statistikasi
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 14,
            }}>
              {INITIAL_STUDENTS.map(item => (
                <StatCard key={item.label} {...item} />
              ))}
            </div>
          </div>
        )}

        {/* Top 3 Recommendations — har doim ko'rinadi */}
        <div style={{ marginTop: 40 }}>
          <h2 style={{
            color: "#fff", fontSize: 20, fontWeight: 800, margin: "0 0 6px",
          }}>
            🏆 Top 3 Tavsiya
          </h2>
          <p style={{ color: "#64748b", fontSize: 12, margin: "0 0 20px" }}>
            EduUZ AI tahlili asosida eng yaxshi universitetlar reytingi
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {TOP_RECOMMENDATIONS.map(item => (
              <RecommendationCard key={item.rank} item={item} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
