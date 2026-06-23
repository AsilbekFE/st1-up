import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SectionUniversity from "./components/SectionUniversity";

export default function App() {
  return (
    <div className="container mx-auto bg-[#0c1528]">
      <Navbar />
      {/* clone */}
      <main>
        <Home/>
        <SectionUniversity/>
      </main>
      <footer></footer>
    </div>
  )
}
