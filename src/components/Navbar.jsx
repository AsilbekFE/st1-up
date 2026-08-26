import { useState } from "react";
import { NavLink } from "react-router-dom";
import SignInModal from "./SignInModal";

const links = [
  { to: "/universities", label: "Universitetlar" },
  { to: "/scholarships", label: "Grantlar" },
  { to: "/majors", label: "Ta'lim yo'nalishlari" },
  { to: "/admissions", label: "Qabul" },
  { to: "/statistics", label: "Statistika" },
];

const linkClass = ({ isActive }) =>
  `block py-2 md:py-0 md:pb-2 border-b-2 transition-colors ${
    isActive
      ? "border-[#ad8eff] text-white"
      : "border-transparent text-white hover:text-gray-300 hover:border-gray-400"
  }`;

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-white/5 backdrop-blur-md text-white border-b border-white/15 fixed top-0 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink to="/" className="text-white font-bold text-2xl tracking-wide shrink-0">
              EduUZ
            </NavLink>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className={linkClass} onClick={() => setMenuOpen(false)}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSignInOpen(true)}
                className="hidden md:block bg-[#ad8eff] px-5 py-2 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border border-slate-700 bg-slate-900/60 gap-1.5 cursor-pointer hover:border-slate-500 transition"
                aria-label="Menyu"
              >
                <span
                  className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-slate-300 transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

      </nav>

      {/* Mobile drawer (right side) */}
      <div
        className={`md:hidden fixed inset-0 z-50 ${
          menuOpen ? "" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Right panel */}
        <aside
          className={`absolute top-0 right-0 h-full w-72 max-w-[85%] bg-[#11192e] border-l border-slate-800/80 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
            <span className="text-lg font-bold text-white">Menyu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Yopish"
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-700 bg-slate-900/60 cursor-pointer hover:border-slate-500 transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-slate-300">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <ul className="flex flex-col px-6 py-4 gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `block py-3 text-sm font-medium rounded-xl px-3 transition-colors ${
                      isActive
                        ? "bg-[#ad8eff]/15 text-white"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-4">
              <button
                onClick={() => { setIsSignInOpen(true); setMenuOpen(false); }}
                className="w-full bg-[#ad8eff] py-2.5 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </li>
          </ul>
        </aside>
      </div>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
}