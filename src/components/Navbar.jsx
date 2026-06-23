export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-8 bg-[#0c1528] text-white px-3 border-b border-gray-500">
      <h1 className="text-[#2b6676] font-bold text-[30px] ">EduUZ</h1>
      <ul className="flex gap-[20px] text-[#9eadb0] cursor-pointer">
        <li className=" hover:opacity-60">Universities</li>
        <li className=" hover:opacity-60">Scholarships</li>
        <li className=" hover:opacity-60">Majors</li>
        <li className=" hover:opacity-60">Admissions</li>
      </ul>
      <div className="flex items-center gap-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-search-icon lucide-search"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <button className="bg-[#ad8eff] px-[20px] py-[8px] rounded-[30px] "> Sign In</button>
      </div>
    </nav>
  );
}
