import { useState, useEffect, useMemo } from "react";

// Icons as inline SVG components to avoid dependencies
const SlidersIcon = () => (
  <svg className="w-5 h-5 mr-2 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 ml-1 pointer-events-none text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4 transition-colors text-slate-400 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6 transition-colors text-slate-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function SectionUniversity() {
  const [universities, setUniversities] = useState([]);
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

  // Derive filtered universities from state
  const filteredUniversities = useMemo(() => {
    let result = universities;

    if (activeCategory) {
      result = result.filter((u) => u.category === activeCategory);
    }

    if (activeCity !== "Barcha shaharlar") {
      result = result.filter((u) => u.city === activeCity);
    }

    if (activeSpecialty) {
      result = result.filter((u) => u.specialty === activeSpecialty);
    }

    return result;
  }, [universities, activeCategory, activeCity, activeSpecialty]);

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
        <div className="w-12 h-12 mb-4 border-t-2 border-b-2 rounded-full animate-spin border-cyan-400"></div>
        <p className="text-sm text-slate-400">Universitetlar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-400">
        <p className="mb-2 font-mono text-lg font-semibold">Xatolik yuz berdi</p>
        <p className="text-sm text-slate-400">{error}</p>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sticky Filters Sidebar */}
        <aside className="lg:col-span-1 lg:sticky lg:top-8 self-start bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-slate-700/60">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-800/80">
            <h3 className="flex items-center text-lg font-bold tracking-wide text-slate-100">
              <SlidersIcon />
              Filtrlar
            </h3>
            {(activeCategory || activeCity !== "Barcha shaharlar" || activeSpecialty) && (
              <button 
                onClick={clearFilters}
                className="text-xs font-medium transition-colors cursor-pointer text-rose-400 hover:text-rose-300"
              >
                Tozalash
              </button>
            )}
          </div>

          {/* Kategoriya */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-bold tracking-wider uppercase text-slate-400">Kategoriya</h4>
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
            <h4 className="mb-3 text-xs font-bold tracking-wider uppercase text-slate-400">Manzil</h4>
            <div className="relative">
              <select
                value={activeCity}
                onChange={(e) => setActiveCity(e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium transition-colors border appearance-none cursor-pointer bg-slate-900/60 text-slate-200 border-slate-800/80 rounded-xl focus:outline-none focus:border-cyan-400"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-slate-900 text-slate-200">
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 flex items-center pointer-events-none right-3">
                <ChevronDownIcon />
              </div>
            </div>
          </div>

          {/* Mutaxassislik */}
          <div className="mb-6">
            <h4 className="mb-3 text-xs font-bold tracking-wider uppercase text-slate-400">Mutaxassislik</h4>
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

        </aside>

        {/* Main Content Area */}
        <div className="space-y-12 lg:col-span-3">
          {/* Featured universities */}
          {featuredUnis.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold tracking-tight text-white">
                <span className="w-8 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"></span>
                Saralangan universitetlar
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {featuredUnis.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => handleUniversityClick(uni)}
                    className="group bg-[#11192e] border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:border-slate-700/60 flex flex-col justify-between h-full cursor-pointer hover:translate-y-[-4px]"
                  >
                    <div>
                      {/* Image section with premium hover effect and badge overlay */}
                      <div className="relative w-full overflow-hidden h-44">
                        <img
                          src={uni.image}
                          alt={uni.name}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#11192e] via-transparent to-transparent opacity-80" />
                        <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded shadow-md tracking-wider ${uni.badgeStyle}`}>
                          {uni.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold transition-colors duration-300 text-slate-100 group-hover:text-cyan-400">
                          {uni.name}
                        </h3>
                        <p className="mt-2 text-sm font-normal leading-relaxed text-slate-400 line-clamp-3">
                          {uni.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-5 text-xs font-semibold border-t border-slate-800/40 text-slate-300">
                      <span className="px-2 py-1 border rounded text-cyan-400 bg-cyan-950/40 border-cyan-800/30">
                        {uni.rankLabel}
                      </span>
                      <span className="flex items-center gap-1 transition-all duration-300 text-slate-400 group-hover:text-white group-hover:translate-x-1">
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
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/60">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                <span className="w-6 h-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"></span>
                Ko'proq ma'lumot
              </h2>
              <span className="px-3 py-1 font-mono text-xs font-medium border rounded-full text-slate-500 bg-slate-900 border-slate-800">
                {filteredUniversities.length} ta universitet ko'rsatilmoqda
              </span>
            </div>

            {filteredUniversities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-[#11192e]/40 border border-slate-800/60 rounded-2xl text-center">
                <svg className="w-12 h-12 mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="font-medium text-slate-400">Bunday shartlarga mos universitet topilmadi</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 text-xs font-bold underline cursor-pointer text-cyan-400 hover:text-cyan-300"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {regularUnis.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => handleUniversityClick(uni)}
                    className="group bg-[#11192e]/60 border border-slate-900 rounded-2xl p-5 relative shadow-md hover:shadow-xl transition-all duration-300 hover:border-slate-800 hover:translate-y-[-2px] flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center justify-center w-10 h-10 text-lg font-black border shadow-sm rounded-xl bg-cyan-950/60 border-cyan-800/40 text-cyan-400">
                          {uni.initial}
                        </div>
                        <span className="text-[9px] font-extrabold tracking-wider border border-slate-800 px-2 py-0.5 rounded text-slate-400 bg-slate-900/60 uppercase">
                          {uni.category}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="mt-4">
                        <h3 className="text-base font-bold transition-colors duration-300 text-slate-100 group-hover:text-cyan-400">
                          {uni.name}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-scale-in">
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedUniversity(null)}
              className="absolute z-10 flex items-center justify-center w-8 h-8 border rounded-full shadow-md cursor-pointer top-4 right-4 bg-slate-900/80 backdrop-blur border-slate-800"
            >
              <CloseIcon />
            </button>

            {/* University image / decorative banner */}
            <div className="relative w-full h-60">
              {selectedUniversity.image ? (
                <img 
                  src={selectedUniversity.image} 
                  alt={selectedUniversity.name} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-950 to-violet-950">
                  <span className="text-6xl font-black text-cyan-500/20">{selectedUniversity.initial}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-cyan-400 text-black shadow-md tracking-wider">
                  {selectedUniversity.category} OTM
                </span>
                <h2 className="mt-2 text-2xl font-black text-white md:text-3xl drop-shadow-md">
                  {selectedUniversity.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 md:p-8">
              {/* Detailed parameters */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Shahar</span>
                  <span className="block mt-1 text-sm font-semibold text-slate-200">{selectedUniversity.city}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Yo'nalish</span>
                  <span className="block mt-1 text-sm font-semibold truncate text-slate-200" title={selectedUniversity.specialty}>{selectedUniversity.specialty}</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Reyting / Status</span>
                  <span className="block mt-1 text-sm font-semibold truncate text-cyan-400">{selectedUniversity.badge.replace("@ ", "")}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold tracking-wider uppercase text-slate-400">Muassasa haqida</h4>
                <p className="text-sm leading-relaxed text-slate-300">
                  {selectedUniversity.description} Ushbu oliy ta'lim muassasasi O'zbekistonda yoshlarga jahon andozalari darajasida bilim berish va kelajak mutaxassislarini tayyorlashda salmoqli hissa qo'shib kelmoqda.
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  Talabalar uchun keng imkoniyatlar, zamonaviy laboratoriyalar va xalqaro o'quv dasturlari mavjud.
                </p>
              </div>

              {/* Call to action */}
              <div className="flex gap-4 pt-4 border-t border-slate-800/60">
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