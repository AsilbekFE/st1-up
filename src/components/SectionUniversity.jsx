import { useState, useEffect, useMemo } from "react";
import UniversityDetail from "./UniversityDetail";

// Icons as inline SVG components
const SlidersIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318a2.5 2.5 0 11.758 1.517l-4.636 2.318a2.5 2.5 0 11-.758-1.517z" />
  </svg>
);

export default function SectionUniversity() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCity, setActiveCity] = useState("Barcha shaharlar");
  const [activeSpecialty, setActiveSpecialty] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(null);

  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [viewsCount, setViewsCount] = useState({});

  useEffect(() => {
    fetch("/api/universities")
      .then((res) => {
        if (!res.ok) throw new Error("API-dan ma'lumot yuklab bo'lmadi");
        return res.json();
      })
      .then((resData) => {
        const data = Array.isArray(resData) ? resData : (resData.data || []);
        setUniversities(data);
        const initialViews = {};
        data.forEach((u) => { initialViews[u.id] = u.views || 0; });
        setViewsCount(initialViews);
        setLoading(false);
      })
      .catch(() => {
        fetch("/api/universities.json")
          .then((res) => res.json())
          .then((data) => {
            setUniversities(data);
            const initialViews = {};
            data.forEach((u) => { initialViews[u.id] = Math.floor(Math.random() * 250) + 120; });
            setViewsCount(initialViews);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      });
  }, []);

  const filteredUniversities = useMemo(() => {
    let result = universities;
    if (activeCategory) result = result.filter((u) => u.category === activeCategory);
    if (activeCity !== "Barcha shaharlar") result = result.filter((u) => u.city === activeCity);
    if (activeSpecialty) result = result.filter((u) => u.specialty === activeSpecialty);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.specialty.toLowerCase().includes(q) ||
          u.city.toLowerCase().includes(q) ||
          (u.description && u.description.toLowerCase().includes(q))
      );
    }
    return result;
  }, [universities, activeCategory, activeCity, activeSpecialty, searchQuery]);

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveCity("Barcha shaharlar");
    setActiveSpecialty(null);
    setSearchQuery("");
  };

  const handleUniversityClick = (uni) => {
    setViewsCount(prev => ({ ...prev, [uni.id]: (prev[uni.id] || 0) + 1 }));
    fetch(`/api/universities/${uni.id}/view`, { method: "POST" }).catch(() => {});
    setSelectedUniversity(uni);
  };

  const featuredUnis = filteredUniversities.filter((u) => u.isFeatured);
  const regularUnis = filteredUniversities.filter((u) => !u.isFeatured);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#f4ecd8] text-[#111111]">
        <span className="gazeta-stamp-red mb-3">★ YUKLANMOQDA ★</span>
        <p className="newspaper-mono text-sm">OTMlar ro'yxati matbaadan olinmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-[#f4ecd8] text-[#111111]">
        <span className="gazeta-stamp-black mb-3">⚠ XATOLIK</span>
        <p className="text-sm font-serif">{error}</p>
      </div>
    );
  }

  const cities = ["Barcha shaharlar", ...new Set(universities.map((u) => u.city))];

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111] flex flex-col justify-between pb-12">
      {/* Hero */}
      <header className="flex flex-col items-center justify-center px-3 pt-6 pb-6 text-center max-w-5xl mx-auto w-full">
        <span className="gazeta-stamp-red mb-2 sm:mb-3 text-[9px] sm:text-xs">
          ★ OTM BO'LIMI ★
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight uppercase text-[#111111] leading-tight newspaper-headline">
          O'ZBEKISTONNING <br />
          <span className="text-[#c1121f] underline decoration-2 sm:decoration-4 underline-offset-4">YETAKCHI OTMlari</span> KATALOGI
        </h1>

        <p className="max-w-3xl mt-3 sm:mt-4 text-xs sm:text-base text-[#4b5563] leading-relaxed font-serif px-2">
          Respublikadagi davlat, xususiy va xalqaro universitetlar bo'yicha to'liq va tasdiqlangan ma'lumotlar to'plami.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-4 sm:mt-6 w-full sm:w-auto max-w-md sm:max-w-none px-2">
          <button
            onClick={() => document.getElementById("filters-section")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 text-xs font-black uppercase tracking-widest bg-[#c1121f] text-white border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono"
          >
            OTMLARNI SARALASH ↓
          </button>
          <button
            onClick={() => alert("EduUZ orqali universitetlarni qidirish, solishtirish va ariza topshirish juda oson!")}
            className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 text-xs font-black uppercase tracking-widest border-2 border-[#111111] bg-[#f9f5ea] text-[#111111] gazeta-shadow-wood hover:bg-[#111111] hover:text-white transition-all cursor-pointer newspaper-mono"
          >
            <PlayIcon />
            QO'LLANMA
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-3xl mt-6 px-2 sm:px-4">
          <div
            className="flex items-center gap-2 sm:gap-3 bg-[#f9f5ea] border-2 border-[#111111] p-2 sm:p-3 gazeta-shadow-black"
          >
            <div className="pl-1 sm:pl-2 shrink-0">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Universitet, mutaxassislik yoki shahar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm font-serif bg-transparent border-none outline-none text-[#111111] placeholder:text-[#4b5563]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1 text-[11px] font-black text-[#c1121f] hover:underline cursor-pointer newspaper-mono shrink-0"
              >
                TOZALASH
              </button>
            )}
            <button
              onClick={() => document.getElementById("filters-section")?.scrollIntoView({ behavior: "smooth" })}
              className="px-3 sm:px-5 py-1.5 sm:py-2 font-black text-[11px] sm:text-xs uppercase tracking-wider bg-[#111111] text-white border-2 border-[#111111] hover:bg-[#c1121f] transition-colors cursor-pointer newspaper-mono shrink-0"
            >
              QIDIRISH
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <section id="filters-section" className="py-4 sm:py-8 bg-[#ede3cc] px-3 sm:px-6 md:px-8 max-w-7xl mx-auto border-2 sm:border-4 border-[#111111] gazeta-shadow-black my-4 sm:my-6 w-full">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1 lg:sticky lg:top-8 self-start bg-[#f9f5ea] border-2 border-[#111111] p-4 sm:p-6 gazeta-shadow-black">
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="w-full flex items-center justify-between pb-4 border-b-2 border-[#111111] cursor-pointer"
              aria-expanded={filtersOpen}
            >
              <h3 className="flex items-center text-sm md:text-base font-black uppercase tracking-widest newspaper-headline text-[#111111]">
                <SlidersIcon />
                SARALASH
                {(activeCategory || activeCity !== "Barcha shaharlar" || activeSpecialty) && (
                  <span className="ml-2 flex items-center justify-center w-5 h-5 text-[10px] font-black border border-[#111111] bg-[#c1121f] text-white">
                    {[activeCategory, activeCity !== "Barcha shaharlar", activeSpecialty].filter(Boolean).length}
                  </span>
                )}
              </h3>
              <svg
                className={`w-4 h-4 shrink-0 transition-transform duration-300 text-[#111111] ${filtersOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${filtersOpen ? "max-h-[800px] opacity-100 mt-5" : "max-h-0 opacity-0"}`}>
              {filtersOpen && (activeCategory || activeCity !== "Barcha shaharlar" || activeSpecialty) && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={clearFilters}
                    className="text-xs font-black uppercase tracking-widest text-[#c1121f] underline cursor-pointer hover:no-underline newspaper-mono"
                  >
                    TOZALASH
                  </button>
                </div>
              )}

              {/* Kategoriya */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-black tracking-widest uppercase border-b border-[#111111]/30 pb-1 newspaper-mono text-[#5c3d2e]">KATEGORIYA</h4>
                <div className="space-y-2">
                  {[
                    { name: "Davlat", label: "DAVLAT" },
                    { name: "Xususiy", label: "XUSUSIY" },
                    { name: "Xalqaro", label: "XALQARO" },
                  ].map((cat) => {
                    const isActive = activeCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(isActive ? null : cat.name)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest border-2 transition-colors cursor-pointer flex items-center newspaper-mono ${
                          isActive
                            ? "bg-[#c1121f] text-white border-[#111111]"
                            : "bg-[#ede3cc] text-[#111111] border-[#111111] hover:bg-[#111111] hover:text-white"
                        }`}
                      >
                        <span className={`w-2 h-2 mr-3 border border-[#111111] ${isActive ? "bg-white" : "bg-[#111111]"}`}></span>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Manzil */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-black tracking-widest uppercase border-b border-[#111111]/30 pb-1 newspaper-mono text-[#5c3d2e]">SHAHAR / VILOYAT</h4>
                <div className="relative">
                  <select
                    value={activeCity}
                    onChange={(e) => setActiveCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-black uppercase tracking-widest appearance-none cursor-pointer bg-[#ede3cc] text-[#111111] border-2 border-[#111111] focus:outline-none"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city} className="bg-[#ede3cc] text-[#111111]">{city}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 flex items-center pointer-events-none right-3 text-[#111111]">
                    <ChevronDownIcon />
                  </div>
                </div>
              </div>

              {/* Mutaxassislik */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-black tracking-widest uppercase border-b border-[#111111]/30 pb-1 newspaper-mono text-[#5c3d2e]">ASOSIY YO'NALISH</h4>
                <div className="flex flex-wrap gap-2">
                  {["IT va Texnologiya", "Biznes", "Tibbiyot", "San'at"].map((spec) => {
                    const isActive = activeSpecialty === spec;
                    return (
                      <button
                        key={spec}
                        onClick={() => setActiveSpecialty(isActive ? null : spec)}
                        className={`text-[11px] font-black px-3 py-1.5 uppercase tracking-widest cursor-pointer border-2 transition-colors newspaper-mono ${
                          isActive
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[#ede3cc] text-[#111111] border-[#111111] hover:bg-[#c1121f] hover:text-white"
                        }`}
                      >
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-12 lg:col-span-3">
            {/* Featured universities */}
            {featuredUnis.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4 md:mb-6 border-b-2 border-[#111111] pb-2">
                  <span className="gazeta-stamp-red">
                    ★ TAVSIYA ETILGANLAR
                  </span>
                  <h2 className="text-sm md:text-xl font-black uppercase tracking-widest text-[#111111] newspaper-headline">
                    BOSHQARMA TANLOVIDAGI TOP OTMLAR
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {featuredUnis.map((uni, idx) => {
                    // Random / alternatsiya: bitta qizil, bitta qora hoshiya
                    const isRedTheme = idx % 2 === 0;
                    return (
                      <div
                        key={uni.id}
                        onClick={() => handleUniversityClick(uni)}
                        className={`group bg-[#f9f5ea] border-2 ${isRedTheme ? "border-[#c1121f] newspaper-card-hover-red" : "border-[#111111] newspaper-card-hover"} overflow-hidden flex flex-col justify-between h-full cursor-pointer transition-all`}
                        style={{ boxShadow: isRedTheme ? '4px 4px 0 #c1121f' : '4px 4px 0 #111111' }}
                      >
                        <div>
                          <div className="relative w-full overflow-hidden h-36 md:h-44 border-b-2 border-[#111111]">
                            <img
                              src={uni.image}
                              alt={uni.name}
                              className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 filter sepia-[0.25] contrast-125"
                            />
                            <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 tracking-widest ${isRedTheme ? "bg-[#c1121f] text-white" : "bg-[#111111] text-white"} newspaper-mono border border-[#111111]`}>
                              {uni.badge}
                            </span>
                          </div>

                          <div className="p-4">
                            <h3 className="text-sm md:text-base font-black leading-tight uppercase tracking-tight newspaper-headline text-[#111111] line-clamp-2">
                              {uni.name}
                            </h3>
                            <p className="mt-2 text-xs font-serif text-[#4b5563] leading-relaxed line-clamp-3">
                              {uni.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 text-xs font-black border-t-2 border-[#111111] bg-[#ede3cc] newspaper-mono">
                          <span className="truncate text-[#8b5a2b]">
                            {uni.rankLabel}
                          </span>
                          <span className={`${isRedTheme ? "text-[#c1121f]" : "text-[#111111]"} font-black`}>
                            BATAFSIL →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular universities */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-[#111111]">
                <h2 className="flex items-center gap-2 text-sm md:text-xl font-black uppercase tracking-widest text-[#111111] newspaper-headline">
                  <span className="text-[#c1121f]">■</span>
                  BARCHA UNIVERSITETLAR RO'YXATI
                </h2>
                <span className="px-2.5 py-1 newspaper-mono text-xs font-black bg-[#111111] text-white">
                  {filteredUniversities.length} TA OTM
                </span>
              </div>

              {filteredUniversities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-[#f9f5ea] border-2 border-[#111111] text-center gazeta-shadow-black">
                  <p className="text-xs md:text-sm font-black uppercase tracking-widest mb-3 newspaper-mono text-[#c1121f]">
                    BUNDAY SHARTLARGA MOS OTM TOPILMADI
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-xs font-black uppercase tracking-widest border-2 border-[#111111] px-4 py-2 bg-[#111111] text-white hover:bg-[#c1121f] transition-colors cursor-pointer newspaper-mono"
                  >
                    SARALASHNI TOZALASH
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {regularUnis.map((uni, idx) => {
                    const isRed = idx % 2 === 1;
                    return (
                      <div
                        key={uni.id}
                        onClick={() => handleUniversityClick(uni)}
                        className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f] newspaper-card-hover-red" : "border-[#111111] newspaper-card-hover"} p-4 relative cursor-pointer flex flex-col justify-between transition-all`}
                        style={{ boxShadow: isRed ? '3px 3px 0 #c1121f' : '3px 3px 0 #111111' }}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3 border-b border-[#111111]/20 pb-2">
                            <div className="flex items-center justify-center w-8 h-8 text-sm font-black border-2 border-[#111111] bg-[#ede3cc] newspaper-mono text-[#111111]">
                              {uni.initial}
                            </div>
                            <span className="text-[10px] font-black tracking-widest px-2 py-0.5 uppercase bg-[#ede3cc] text-[#5c3d2e] border border-[#111111] newspaper-mono">
                              {uni.category}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-sm font-black leading-snug uppercase newspaper-headline text-[#111111] line-clamp-2">
                              {uni.name}
                            </h3>
                            <p className="mt-2 text-xs font-serif text-[#4b5563] leading-relaxed line-clamp-3">
                              {uni.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-2 border-t border-[#111111] flex items-center justify-between text-[11px] font-black uppercase newspaper-mono">
                          <span className="text-[#8b5a2b]">{uni.city}</span>
                          <span className={`${isRed ? "text-[#c1121f]" : "text-[#111111]"} font-black`}>BATAFSIL →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedUniversity && (
          <UniversityDetail
            university={selectedUniversity}
            onClose={() => setSelectedUniversity(null)}
          />
        )}
      </section>

      {/* Footer */}
      <footer className="w-full border-t-2 border-white bg-black py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-base md:text-xl font-black uppercase tracking-widest text-white">EDUUZ</h2>
            <p className="mono text-[10px] md:text-xs text-white/50 mt-1">© 2024 EduUZ. O'zbekiston kelajagini yuksalatiramiz.</p>
          </div>

          <ul className="flex flex-wrap justify-center gap-6 text-sm text-white/60 font-black uppercase tracking-widest">
            <li><a href="#" className="hover:text-white transition-colors">BIZ HAQIMIZDA</a></li>
            <li><a href="#" className="hover:text-white transition-colors">ALOQA</a></li>
            <li><a href="#" className="hover:text-white transition-colors">MAXFIYLIK</a></li>
            <li><a href="#" className="hover:text-white transition-colors">SHARTLAR</a></li>
          </ul>

          <div className="flex gap-3">
            <button className="flex items-center justify-center w-10 h-10 bg-black border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer" aria-label="Web sayt">
              <GlobeIcon />
            </button>
            <button className="flex items-center justify-center w-10 h-10 bg-black border-2 border-white hover:bg-white hover:text-black transition-colors cursor-pointer" aria-label="Ulashish">
              <ShareIcon />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}