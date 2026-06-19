import Home from "./components/Home";
import Navbar from "./components/Navbar";
import SectionUniversity from "./components/SectionUniversity";

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Home/>
        <SectionUniversity/>
      </main>
      <footer>footer</footer>
    </div>
  )
}
