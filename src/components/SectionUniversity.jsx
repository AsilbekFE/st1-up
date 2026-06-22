import { useState, useEffect } from "react";

// Icons as inline SVG components to avoid dependencies
const SlidersIcon = () => (
  <svg className="w-5 h-5 mr-2 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6 text-slate-400 hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SectionUniversity() {
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [activeCategory, setActiveCategory] = useState(null); // 'Davlat', 'Xususiy', 'Xalqaro'
  const [activeCity, setActiveCity] = useState("Barcha shaharlar");
  const [activeSpecialty, setActiveSpecialty] = useState(null); // String

  // Interactive details modal
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [viewsCount, setViewsCount] = useState({});

  useEffect(() => {
    // Apply dynamic page-level theme wrapper
    const originalBg = document.body.style.backgroundColor;
    const originalColor = document.body.style.color;
    document.body.style.backgroundColor = "#080d1a";
    document.body.style.color = "#ffffff";
    
    // Fetch mock API data
    fetch("/api/universities.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("API-dan ma'lumot yuklab bo'lmadi");
        }
        return res.json();
      })
      .then((data) => {
        setUniversities(data);
        setFilteredUniversities(data);
        // Initialize mock views
        const initialViews = {};
        data.forEach((u) => {
          initialViews[u.id] = Math.floor(Math.random() * 250) + 120;
        });
        setViewsCount(initialViews);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    return () => {
      document.body.style.backgroundColor = originalBg;
      document.body.style.color = originalColor;
    };
  }, []);

  // Filter application trigger
  const applyFilters = () => {
    let result = universities;

    // Filter by Category
    if (activeCategory) {
      result = result.filter((u) => u.category === activeCategory);
    }

    // Filter by City
    if (activeCity !== "Barcha shaharlar") {
      result = result.filter((u) => u.city === activeCity);
    }

    // Filter by Specialty
    if (activeSpecialty) {
      result = result.filter((u) => u.specialty === activeSpecialty);
    }

    setFilteredUniversities(result);
  };

  // Run filters automatically when states change for smooth modern reactive UX
  useEffect(() => {
    if (universities.length > 0) {
      applyFilters();
    }
  }, [activeCategory, activeCity, activeSpecialty, universities]);

  const clearFilters = () => {
    setActiveCategory(null);
    setActiveCity("Barcha shaharlar");
    setActiveSpecialty(null);
  };

  const handleUniversityClick = (uni) => {
    // Increment mock view count on click
    setViewsCount(prev => ({
      ...prev,
      [uni.id]: (prev[uni.id] || 0) + 1
    }));
    setSelectedUniversity(uni);
  };

  // Split universities into featured and regular for visual representation
  const featuredUnis = filteredUniversities.filter((u) => u.isFeatured);
  const regularUnis = filteredUniversities.filter((u) => !u.isFeatured);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-cyan-400">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
        <p className="text-slate-400 text-sm">Universitetlar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-400">
        <p className="text-lg font-semibold mb-2 font-mono">Xatolik yuz berdi</p>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    );
  }

  // List of unique cities from current database
  const cities = ["Barcha shaharlar", ...new Set(universities.map((u) => u.city))];

  return (
    <section className="py-12 bg-[#080d1a] px-4 md:px-8 max-w-7xl mx-auto rounded-3xl border border-slate-900/60 shadow-2xl relative overflow-hidden my-6">
      {/* Background radial highlight glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Filters Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 self-start bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-slate-700/60">
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-5">
            <h3 className="font-bold text-lg text-slate-100 flex items-center tracking-wide">
              <SlidersIcon />
              Filtrlar
            </h3>
            {(activeCategory || activeCity !== "Barcha shaharlar" || activeSpecialty) && (
              <button 
                onClick={clearFilters}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium cursor-pointer"
              >
                Tozalash
              </button>
            )}
          </div>

          {/* Kategoriya */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Kategoriya</h4>
            <div className="space-y-2">
              {[
                { name: "Davlat", label: "Davlat" },
                { name: "Xususiy", label: "Xususiy" },
                { name: "Xalqaro", label: "Xalqaro" },
              ].map((cat) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(isActive ? null : cat.name)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center cursor-pointer ${
                      isActive
                        ? "bg-[#00f5ff] text-black shadow-[0_0_20px_rgba(0,245,255,0.35)] scale-[1.02]"
                        : "bg-slate-900/60 text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full mr-3 ${isActive ? "bg-black" : "bg-cyan-500"}`}></span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manzil (City selection) */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Manzil</h4>
            <div className="relative">
              <select
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="w-full bg-slate-900/60 text-slate-200 border border-slate-800/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer font-medium"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Mutaxassislik */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Mutaxassislik</h4>
            <div className="flex flex-wrap gap-2">
              {["IT va Texnologiya", "Biznes", "Tibbiyot", "San'at"].map((spec) => {
                const isActive = activeSpecialty === spec;
                return (
                  <button
                    key={spec}
                    onClick={() => setActiveSpecialty(isActive ? null : spec)}
                    className={`text-xs font-semibold px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer border ${
                      isActive
                        ? "bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                        : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            className="w-full py-3 bg-[#0d1e3a] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 rounded-xl font-bold text-sm shadow-md cursor-pointer hover:shadow-cyan-500/5 active:scale-[0.98]"
          >
            Filtrni qo'llash
          </button>
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-12">
          {/* Featured universities */}
          {featuredUnis.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                <span className="h-1 w-8 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"></span>
                Saralangan universitetlar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredUnis.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => handleUniversityClick(uni)}
                    className="group bg-[#11192e] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-slate-700/60 flex flex-col justify-between h-full cursor-pointer hover:translate-y-[-4px]"
                  >
                    <div>
                      {/* Image section with premium hover effect and badge overlay */}
                      <div className="relative h-44 w-full overflow-hidden">
                        <img
                          src={uni.image}
                          alt={uni.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#11192e] via-transparent to-transparent opacity-80" />
                        <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-md tracking-wider ${uni.badgeStyle}`}>
                          {uni.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
                          {uni.name}
                        </h3>
                        <p className="text-slate-400 text-sm mt-2 line-clamp-3 font-normal leading-relaxed">
                          {uni.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs font-semibold text-slate-300">
                      <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded">
                        {uni.rankLabel}
                      </span>
                      <span className="text-slate-400 group-hover:text-white flex items-center gap-1 group-hover:translate-x-1 transition-all duration-300">
                        Batafsil ko'rish
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular universities list */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="h-1 w-6 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"></span>
                Ko'proq ma'lumot
              </h2>
              <span className="text-xs font-medium text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {filteredUniversities.length} ta universitet ko'rsatilmoqda
              </span>
            </div>

            {filteredUniversities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#11192e]/40 border border-slate-800/60 rounded-2xl text-center">
                <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-slate-400 font-medium">Bunday shartlarga mos universitet topilmadi</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 text-xs text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {regularUnis.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => handleUniversityClick(uni)}
                    className="group bg-[#11192e]/60 border border-slate-900 rounded-2xl p-5 relative shadow-md hover:shadow-xl transition-all duration-300 hover:border-slate-800 hover:translate-y-[-2px] flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-black flex items-center justify-center text-lg shadow-sm">
                          {uni.initial}
                        </div>
                        <span className="text-[9px] font-extrabold tracking-wider border border-slate-800 px-2 py-0.5 rounded text-slate-400 bg-slate-900/60 uppercase">
                          {uni.category}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="mt-4">
                        <h3 className="font-bold text-base text-slate-100 group-hover:text-cyan-400 transition-colors duration-300">
                          {uni.name}
                        </h3>
                        <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {uni.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded">
                        {uni.badge}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                        <EyeIcon />
                        <span>{viewsCount[uni.id] || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Detail Modal Dialog */}
      {selectedUniversity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-scale-in">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedUniversity(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur border border-slate-800 flex items-center justify-center cursor-pointer shadow-md"
            >
              <CloseIcon />
            </button>

            {/* University image / decorative banner */}
            <div className="h-60 w-full relative">
              {selectedUniversity.image ? (
                <img 
                  src={selectedUniversity.image} 
                  alt={selectedUniversity.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-950 to-violet-950 flex items-center justify-center">
                  <span className="text-6xl font-black text-cyan-500/20">{selectedUniversity.initial}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-cyan-400 text-black shadow-md tracking-wider">
                  {selectedUniversity.category} OTM
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-2 drop-shadow-md">
                  {selectedUniversity.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Detailed parameters */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Shahar</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1 block">{selectedUniversity.city}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Yo'nalish</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1 block truncate" title={selectedUniversity.specialty}>{selectedUniversity.specialty}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Reyting / Status</span>
                  <span className="text-sm font-semibold text-cyan-400 mt-1 block truncate">{selectedUniversity.badge.replace("@ ", "")}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Muassasa haqida</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedUniversity.description} Ushbu oliy ta'lim muassasasi O'zbekistonda yoshlarga jahon andozalari darajasida bilim berish va kelajak mutaxassislarini tayyorlashda salmoqli hissa qo'shib kelmoqda.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Talabalar uchun keng imkoniyatlar, zamonaviy laboratoriyalar va xalqaro o'quv dasturlari mavjud.
                </p>
              </div>

              {/* Call to action */}
              <div className="pt-4 flex gap-4 border-t border-slate-800/60">
                <button 
                  onClick={() => setSelectedUniversity(null)}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-bold transition-all border border-slate-800 cursor-pointer"
                >
                  Yopish
                </button>
                <button 
                  onClick={() => alert(`${selectedUniversity.name}-ga hujjat topshirish simulyatsiyasi muvaffaqiyatli ishga tushdi!`)}
                  className="flex-1 py-3.5 bg-[#00f5ff] hover:bg-cyan-400 text-black rounded-xl text-sm font-extrabold tracking-wide transition-all shadow-[0_0_20px_rgba(0,245,255,0.25)] hover:shadow-[0_0_25px_rgba(0,245,255,0.4)] cursor-pointer"
                >
                  Hujjat topshirish
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
