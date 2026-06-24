import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SectionUniversity from "./components/SectionUniversity";
import Majors from "./components/pages/Majors/Majors";
import Scholarships from "./components/pages/Scholarships";
import Admissions from "./components/pages/Admissions";
import ChatWidget from "./components/ChatWidget";

export default function App() {
  return (
    <div className="container mx-auto bg-[#0c1528]">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/universities" element={<SectionUniversity />} />
          <Route path="/majors" element={<Majors />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/admissions" element={<Admissions />} />
        </Routes>
      </main>
      <ChatWidget />
    </div>
  );
}
