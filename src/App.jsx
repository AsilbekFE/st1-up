import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SectionUniversity from "./components/SectionUniversity";
import Majors from "./components/pages/Majors/Majors";
import Scholarships from "./components/pages/Scholarships";
import Admissions from "./components/pages/Admissions";
import Statistics from "./components/pages/Statistics";
import ChatWidget from "./components/ChatWidget";
import SignInModal from "./components/SignInModal";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111]">
      <Navbar onOpenAuth={() => setIsSignInOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/universities" element={<SectionUniversity />} />
          <Route path="/majors" element={<Majors />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/admissions" element={<Admissions />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </main>
      <ChatWidget />

      {isSignInOpen && (
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      )}
    </div>
  );
}
