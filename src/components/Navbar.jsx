import { useState } from "react";
import { NavLink } from "react-router-dom";
import SignInModal from "./SignInModal";

const links = [
  { to: "/universities", label: "Universitetlar" },
  { to: "/scholarships", label: "Grantlar" },
  { to: "/majors", label: "Ta'lim yo'nalishlari" },
  { to: "/admissions", label: "Qabul" },
];

const linkClass = ({ isActive }) =>
  `block py-2 md:py-0 md:pb-2 border-b-2 transition-colors ${
    isActive
      ? "border-[#ad8eff] text-white"
      : "border-transparent text-[#9eadb0] hover:text-white hover:border-gray-400"
  }`;

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-[#0c1528] text-white border-b border-gray-700/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <NavLink to="/" className="text-[#2b6676] font-bold text-2xl tracking-wide shrink-0">
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

        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-96 border-t border-slate-800/80" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-6 py-4 gap-1 bg-[#0c1528]">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-3">
              <button
                onClick={() => { setIsSignInOpen(true); setMenuOpen(false); }}
                className="w-full bg-[#ad8eff] py-2.5 rounded-full text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
              >
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
}