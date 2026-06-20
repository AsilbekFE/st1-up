
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-8 bg-slate-400">
      <h1>Logo</h1>
      <ul className="flex items-center gap-5">
        <li>About</li>
        <li>Home</li>
        <li>News</li>
      </ul>
      <button>
        Like
      </button>
    </nav>
  )
}
