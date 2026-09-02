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
      ? "border-[#e8e2d8] text-[#f4f1ea]"
      : "border-transparent text-[#c9c3b9] hover:text-[#f4f1ea] hover:border-[#77736d]"
  }`;

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openSignIn = () => setIsSignInOpen(true);
  const closeSignIn = () => setIsSignInOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-[#f4f1ea]/10 bg-[#111111]/80 text-[#f4f1ea] shadow-[0_10px_40px_rgba(0,0,0,0.2)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="text-[#f4f1ea] font-black text-2xl tracking-wide shrink-0">
              EduUZ
            </NavLink>

            <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className={linkClass} onClick={() => setMenuOpen(false)}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button
                onClick={openSignIn}
                className="hidden rounded-full bg-[#f4f1ea] px-5 py-2 text-sm font-extrabold text-[#151515] transition-all hover:bg-[#ded9cf] md:block"
              >
                Kirish
              </button>

              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-xl border border-[#f4f1ea]/15 bg-[#1b1b1b]/80 gap-1.5 cursor-pointer hover:border-[#f4f1ea]/30 transition"
                aria-label="Menyu"
                aria-expanded={menuOpen}
              >
                <span
                  className={`block w-5 h-0.5 bg-[#e4ded4] transition-all duration-300 origin-center ${
                    menuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-[#e4ded4] transition-all duration-300 ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-[#e4ded4] transition-all duration-300 origin-center ${
                    menuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`md:hidden fixed inset-0 z-50 ${
          menuOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#080808]/70 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        <aside
          className={`absolute top-0 right-0 h-full w-72 max-w-[85%] bg-[#161616] border-l border-[#f4f1ea]/10 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f4f1ea]/10">
            <span className="text-lg font-bold text-[#f4f1ea]">Menyu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Yopish"
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-[#f4f1ea]/15 bg-[#202020] cursor-pointer hover:border-[#f4f1ea]/30 transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-[#d7d2c8]">
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
                        ? "bg-[#f4f1ea]/15 text-[#f4f1ea]"
                        : "text-[#c9c3b9] hover:text-[#f4f1ea] hover:bg-[#f4f1ea]/10"
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
                onClick={() => { openSignIn(); setMenuOpen(false); }}
                className="w-full rounded-full bg-[#f4f1ea] py-2.5 text-sm font-extrabold text-[#151515] transition-all hover:bg-[#ded9cf]"
              >
                Kirish
              </button>
            </li>
          </ul>
        </aside>
      </div>

      {isSignInOpen && (
        <SignInModal
          isOpen={isSignInOpen}
          onClose={closeSignIn}
        />
      )}
    </>
  );
}
