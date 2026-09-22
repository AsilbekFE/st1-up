import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SignInModal from "./SignInModal";

const links = [
  { to: "/universities", label: "Universitetlar" },
  { to: "/scholarships", label: "Grantlar & Stipendiyalar" },
  { to: "/majors", label: "Ta'lim Yo'nalishlari" },
  { to: "/admissions", label: "Qabul Jarayoni" },
  { to: "/statistics", label: "Milliy Statistika" },
];

export default function Navbar({ onRequireAuth }) {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const checkUser = () => {
    try {
      const stored = localStorage.getItem("eduuz_user");
      setCurrentUser(stored ? JSON.parse(stored) : null);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    const handler = () => checkUser();
    window.addEventListener("eduuz_auth_changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("eduuz_auth_changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eduuz_token");
    localStorage.removeItem("eduuz_user");
    setCurrentUser(null);
    window.dispatchEvent(new Event("eduuz_auth_changed"));
    navigate("/");
  };

  const handleNavLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className="w-full bg-[#f4ecd8] border-b-4 border-[#111111] text-[#111111] z-40 relative">
        {/* Yuqori Gazeta Tasmachasi (Dateline) */}
        <div className="border-b border-[#111111] px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase newspaper-mono flex flex-wrap items-center justify-between bg-[#ede3cc] text-[#4b5563]">
          <div className="flex items-center gap-3">
            <span>📍 Toshkent, O'zbekiston</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">📅 2026-yil, Sentyabr</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">🌤️ Havo: +24°C, Ochiq</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#c1121f] font-black">NASHIR: № 284</span>
            <span>|</span>
            <span>TARQATISH: BEPUL</span>
          </div>
        </div>

        {/* Asosiy Gazeta Masthead (Sarlavhasi) */}
        <div className="max-w-7xl mx-auto px-3 py-3 md:py-6 flex flex-row items-center justify-between gap-2 md:gap-4 border-b-2 border-[#111111]">
          {/* Chap shtamp - QIZIL (Faqat katta ekranda) */}
          <div className="hidden lg:flex flex-col items-center">
            <span className="gazeta-stamp-red">
              ★ RASMIY NASHR ★
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-[#5c3d2e] newspaper-mono">
              Oliy Ta'lim Axborotnomasi
            </span>
          </div>

          {/* Markaziy Gazeta Nomi */}
          <div className="text-left md:text-center flex-1">
            <NavLink to="/" className="inline-block group">
              <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#111111] uppercase newspaper-title transition-transform group-hover:scale-[1.01] leading-none">
                EDUUZ <span className="text-[#c1121f]">XABARCHISI</span>
              </h1>
            </NavLink>
            <p className="hidden sm:block text-[11px] md:text-xs font-serif italic text-[#4b5563] mt-1 tracking-wide">
              "Kelajak yo'lingizni ilm va to'g'ri tanlov bilan yoriting" — O'zbekiston OTMlari yagona portali
            </p>
          </div>

          {/* O'ng taraf - Tugmalar */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex flex-col items-end">
              <span className="gazeta-stamp-black">
                № 1 TALABA QO'LLANMASI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest mt-1 text-[#8b5a2b] newspaper-mono">
                Akademik Reytinglar
              </span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-1.5 border-2 border-[#111111] bg-[#f9f5ea] p-1 gazeta-shadow-black">
                <div className="w-6 h-6 bg-[#c1121f] text-white font-black flex items-center justify-center text-[10px] newspaper-mono">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left px-1">
                  <p className="text-[11px] font-black truncate max-w-[80px]">{currentUser.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 bg-[#111111] text-white text-[9px] font-black uppercase hover:bg-[#c1121f] transition-colors cursor-pointer"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="px-2.5 py-2 sm:px-4 sm:py-2 bg-[#c1121f] text-white font-black text-[10px] sm:text-xs uppercase tracking-wider border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] hover:text-white transition-all cursor-pointer newspaper-mono"
              >
                KIRISH
              </button>
            )}

            {/* Mobil Menyu Tugmasi */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-1.5 border-2 border-[#111111] bg-[#ede3cc] text-[#111111] cursor-pointer"
              aria-label="Gazeta Menyu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Gazeta Navigatsiya Chizig'i (Klassik bo'limlar) */}
        <nav className="hidden md:block max-w-7xl mx-auto px-4 py-2">
          <ul className="flex items-center justify-between text-xs font-black uppercase tracking-widest newspaper-mono divide-x-2 divide-[#111111]">
            <li className="px-3 first:pl-0">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `hover:text-[#c1121f] transition-colors ${isActive ? "text-[#c1121f] underline decoration-2 underline-offset-4 font-black" : "text-[#111111]"}`
                }
              >
                📰 Bosh Sahifa
              </NavLink>
            </li>
            {links.map((link) => (
              <li key={link.to} className="px-4">
                <NavLink
                  to={link.to}
                  onClick={(e) => handleNavLinkClick(e, link.to)}
                  className={({ isActive }) =>
                    `hover:text-[#c1121f] transition-colors ${isActive ? "text-[#c1121f] underline decoration-2 underline-offset-4 font-black" : "text-[#111111]"}`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="px-3 last:pr-0">
              <span className="text-[#8b5a2b] font-bold">★ 2026-QABUL</span>
            </li>
          </ul>
        </nav>

        {/* Mobil Menyu Ochilganda */}
        {menuOpen && (
          <div className="md:hidden border-t-2 border-[#111111] bg-[#ede3cc] px-5 py-4 space-y-3">
            <p className="text-xs font-black uppercase text-[#4b5563] newspaper-mono">// GAZETA BO'LIMLARI</p>
            <NavLink
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block py-2 font-black text-sm border-b border-[#111111]/20 hover:text-[#c1121f]"
            >
              📰 Bosh Sahifa
            </NavLink>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block py-2 font-black text-sm border-b border-[#111111]/20 hover:text-[#c1121f]"
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* SignIn Modal */}
      {isSignInOpen && (
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      )}
    </>
  );
}
