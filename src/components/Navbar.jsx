import { useState } from "react";
import { NavLink } from "react-router-dom";
import SignInModal from "./SignInModal";

export default function Navbar() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between py-8 bg-[#0c1528] text-white px-3 border-b border-gray-500">
        <h1 className="text-[#2b6676] font-bold text-[30px]">EduUZ</h1>

        <ul className="flex gap-[20px] text-[#9eadb0]">
          <li>
            <NavLink
              to="/universities"
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? "border-[#ad8eff] text-white"
                    : "border-transparent hover:border-gray-400"
                }`
              }
            >
              Universitetlar
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/scholarships"
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? "border-[#ad8eff] text-white"
                    : "border-transparent hover:border-gray-400"
                }`
              }
            >
              Grantlar
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/majors"
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? "border-[#ad8eff] text-white"
                    : "border-transparent hover:border-gray-400"
                }`
              }
            >
              Ta'lim yo‘nalishlari
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admissions"
              className={({ isActive }) =>
                `pb-2 border-b-2 ${
                  isActive
                    ? "border-[#ad8eff] text-white"
                    : "border-transparent hover:border-gray-400"
                }`
              }
            >
              Qabul
            </NavLink>
          </li>
        </ul>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsSignInOpen(true)}
            className="bg-[#ad8eff] px-[20px] py-[8px] rounded-[30px] cursor-pointer hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </div>
      </nav>

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
      />
    </>
  );
}