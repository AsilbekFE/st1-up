import { useState, useEffect, useRef } from "react";

const DEMAND_DATA = [
  { uni: "INHA University", demand: 4850, change: "+12%" },
  { uni: "WIUT", demand: 3920, change: "+8%" },
  { uni: "TATU", demand: 3540, change: "+15%" },
  { uni: "TDIU", demand: 2980, change: "+5%" },
  { uni: "Webster University", demand: 2650, change: "+10%" },
  { uni: "Yangi O'zbekiston Universiteti", demand: 2340, change: "+18%" },
];

const ENTRY_SCORES = [
  { uni: "INHA University", min: 62.5, avg: 71.2, max: 95.0, icon: "🥇" },
  { uni: "WIUT", min: 58.3, avg: 67.8, max: 92.5, icon: "🥈" },
  { uni: "TATU", min: 55.0, avg: 64.5, max: 88.0, icon: "🥉" },
  { uni: "TDIU", min: 52.1, avg: 61.3, max: 85.0, icon: "📊" },
  { uni: "Webster University", min: 50.0, avg: 58.7, max: 82.0, icon: "📈" },
  { uni: "Yangi O'zbekiston Universiteti", min: 65.0, avg: 78.5, max: 98.0, icon: "⭐" },
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
    reason: "Yuqori sifatli koreys ta'lim dasturi, kuchli IT yo'nalishi va 92% bitiruvchilarning ish bilan ta'minlanishi.",
    score: 9.8,
    tags: ["IT & Dasturlash", "Muhandislik", "Grant Dasturlari"],
  },
  {
    rank: 2,
    uni: "Westminster International University",
    reason: "Britaniya diplomi, biznes boshqaruvi va moliya sohasida xalqaro nufuz.",
    score: 9.5,
    tags: ["Biznes", "Moliya", "Xalqaro Ta'lim"],
  },
  {
    rank: 3,
    uni: "Toshkent Axborot Texnologiyalari Universiteti (TATU)",
    reason: "Davlat IT kadrlarining asosiy bazasi, telekommunikatsiya va sun'iy intellekt laboratoriyalari.",
    score: 9.2,
    tags: ["Davlat Granti", "Dasturlash", "Arzon Kontrakt"],
  },
];

function useAnimatedCounter(target, duration = 1500) {
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

function StatCard({ label, base, icon, baseChange, idx }) {
  const value = useAnimatedCounter(base, 2000);
  const change = useAnimatedCounter(baseChange, 2000);
  const isRed = idx % 2 === 0;

  return (
    <div
      className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f] gazeta-shadow-red" : "border-[#111111] gazeta-shadow-black"} p-5 text-center`}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-3xl font-black newspaper-headline ${isRed ? "text-[#c1121f]" : "text-[#111111]"}`}>
        {value.toLocaleString()}
      </div>
      <div className="text-xs uppercase tracking-widest font-black mt-2 text-[#4b5563] newspaper-mono">{label}</div>
      <div className="newspaper-mono text-[10px] font-black mt-3 border border-[#111111] px-2 py-0.5 inline-block bg-[#ede3cc] text-[#111111]">
        ↑ +{change.toLocaleString()} bu yil
      </div>
    </div>
  );
}

function DemandBar({ item, maxDemand, idx }) {
  const [demand, setDemand] = useState(item.demand);
  const isRed = idx % 2 === 1;

  const width = (demand / maxDemand) * 100;
  return (
    <div className="mb-4 bg-[#f9f5ea] border border-[#111111] p-3">
      <div className="flex justify-between mb-1.5 items-center">
        <span className="text-[#111111] text-xs font-black uppercase newspaper-headline">{item.uni}</span>
        <div className="flex items-center gap-3">
          <span className="newspaper-mono text-[#111111] text-xs font-black">{demand.toLocaleString()} ARIZA</span>
          <span className={`newspaper-mono text-white text-[10px] font-black px-1.5 py-0.5 ${isRed ? "bg-[#c1121f]" : "bg-[#111111]"}`}>
            {item.change}
          </span>
        </div>
      </div>
      <div className="h-3 bg-[#ede3cc] border border-[#111111] overflow-hidden">
        <div
          className={`h-full ${isRed ? "bg-[#c1121f]" : "bg-[#111111]"} transition-all duration-700`}
          style={{ width: `${Math.min(width, 100)}%` }}
        />
      </div>
    </div>
  );
}

function ScoreCard({ item, idx }) {
  const isRed = idx % 2 === 0;
  return (
    <div
      className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f] gazeta-shadow-red" : "border-[#111111] gazeta-shadow-black"} p-4`}
    >
      <div className="flex items-center gap-2 mb-3 border-b border-[#111111]/20 pb-2">
        <span className="text-xl">{item.icon}</span>
        <h4 className="font-black uppercase newspaper-headline text-xs leading-tight text-[#111111]">{item.uni}</h4>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="border border-[#111111] p-2 bg-[#ede3cc]">
          <div className="text-[9px] font-black uppercase text-[#4b5563] newspaper-mono mb-0.5">MIN</div>
          <div className="text-base font-black newspaper-mono text-[#111111]">{item.min}</div>
        </div>
        <div className="border border-[#111111] p-2 bg-[#ede3cc]">
          <div className="text-[9px] font-black uppercase text-[#4b5563] newspaper-mono mb-0.5">O'RTA</div>
          <div className="text-base font-black newspaper-mono text-[#c1121f]">{item.avg}</div>
        </div>
        <div className="border border-[#111111] p-2 bg-[#ede3cc]">
          <div className="text-[9px] font-black uppercase text-[#4b5563] newspaper-mono mb-0.5">MAX</div>
          <div className="text-base font-black newspaper-mono text-[#111111]">{item.max}</div>
        </div>
      </div>
    </div>
  );
}

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("demand");
  const maxDemand = Math.max(...DEMAND_DATA.map(d => d.demand));

  const tabs = [
    { id: "demand", label: "OTMLAR TALABI" },
    { id: "scores", label: "KIRISH BALLARI" },
    { id: "students", label: "TALABALAR SONI" },
  ];

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111] pb-12 sm:pb-16">
      {/* Header */}
      <header className="text-center px-3 pt-6 pb-6 sm:pt-10 sm:pb-8 max-w-5xl mx-auto border-b-2 border-[#111111]">
        <span className="gazeta-stamp-red mb-2 sm:mb-3 text-[9px] sm:text-xs">★ STATISTIKA VA REYTING ★</span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-2 sm:mb-3 leading-tight newspaper-headline">
          O'ZBEKISTON OLIY TA'LIM <br />
          <span className="text-[#c1121f] underline decoration-2 sm:decoration-4 underline-offset-4">MILLIY STATISTIKASI</span>
        </h1>
        <p className="font-serif text-xs sm:text-sm text-[#4b5563] max-w-lg mx-auto mb-4 sm:mb-6 leading-relaxed px-2">
          Rasmiy hisobotlar asosida shakllantirilgan statistik jadvallar, o'tish ballari va talabalar kontingenti.
        </p>

        {/* Tablar */}
        <div className="inline-flex flex-wrap justify-center border-2 border-[#111111] gazeta-shadow-black bg-[#ede3cc] max-w-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-colors cursor-pointer border-r border-b sm:border-b-0 border-[#111111] last:border-r-0 newspaper-mono ${
                activeTab === tab.id
                  ? "bg-[#c1121f] text-white"
                  : "bg-[#ede3cc] text-[#111111] hover:bg-[#111111] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Tab tarkibi */}
        {activeTab === "demand" && (
          <div className="bg-[#ede3cc] border-2 sm:border-4 border-[#111111] p-4 sm:p-6 mb-8 sm:mb-10 gazeta-shadow-black">
            <h2 className="font-black uppercase tracking-widest text-lg mb-1 newspaper-headline">
              OTMLAR BO'YICHA TALAB DARAJASI (ARIZALAR SONI)
            </h2>
            <p className="font-serif text-xs text-[#4b5563] mb-6">
              2025/2026 o'quv yili uchun eng ko'p hujjat topshirilgan OTMlar dinamikasi
            </p>
            {DEMAND_DATA.map((item, idx) => (
              <DemandBar key={item.uni} item={item} maxDemand={maxDemand} idx={idx} />
            ))}
          </div>
        )}

        {activeTab === "scores" && (
          <div className="mb-10">
            <h2 className="font-black uppercase tracking-widest text-lg mb-1 newspaper-headline">
              KIRISH BALLARI (100 BALLIK VA DTM MEZONI)
            </h2>
            <p className="font-serif text-xs text-[#4b5563] mb-6">
              O'tgan yillardagi minimal, o'rtacha va eng yuqori kirish ko'rsatkichlari
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ENTRY_SCORES.map((item, idx) => (
                <ScoreCard key={item.uni} item={item} idx={idx} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "students" && (
          <div className="mb-10">
            <h2 className="font-black uppercase tracking-widest text-lg mb-1 newspaper-headline">
              TALABALAR TAQSIMOTI
            </h2>
            <p className="font-serif text-xs text-[#4b5563] mb-6">
              Davlat, xususiy va xalqaro universitetlarda tahsil olayotgan yoshlar
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {INITIAL_STUDENTS.map((item, idx) => (
                <StatCard key={item.label} {...item} idx={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Top 3 Tavsiyalar */}
        <div className="mt-8 border-t-4 border-[#111111] pt-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="gazeta-stamp-red">★ EKSPERT TAVSIYASI ★</span>
            <h2 className="font-black uppercase tracking-tight text-xl sm:text-2xl newspaper-headline text-[#111111]">
              ENG YUQORI TA'LIM SIFATIGA EGA TOP 3 OTM
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TOP_RECOMMENDATIONS.map((item, idx) => {
              const isRed = idx === 0;
              return (
                <div
                  key={item.rank}
                  className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f] gazeta-shadow-red" : "border-[#111111] gazeta-shadow-black"} p-5 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`w-8 h-8 flex items-center justify-center font-black newspaper-mono text-sm ${isRed ? "bg-[#c1121f] text-white" : "bg-[#111111] text-white"}`}>
                        #{item.rank}
                      </span>
                      <span className="text-xl font-black newspaper-mono text-[#8b5a2b]">{item.score}/10</span>
                    </div>
                    <h4 className="font-black text-base uppercase newspaper-headline text-[#111111] mb-2">{item.uni}</h4>
                    <p className="font-serif text-xs text-[#4b5563] leading-relaxed mb-4">{item.reason}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 border-t border-[#111111]/20 pt-3">
                    {item.tags.map(t => (
                      <span key={t} className="text-[10px] font-bold newspaper-mono px-2 py-0.5 bg-[#ede3cc] text-[#111111]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
