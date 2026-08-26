import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SectionUniversity from "./components/SectionUniversity";
import Majors from "./components/pages/Majors/Majors";
import Scholarships from "./components/pages/Scholarships";
import Admissions from "./components/pages/Admissions";
import Statistics from "./components/pages/Statistics";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="min-h-screen bg-[#1a120b] pt-16">
      <Navbar />
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
    </div>
  );
}
