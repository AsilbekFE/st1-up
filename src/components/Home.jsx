import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[150px] pointer-events-none" />
        <h1 className="relative text-4xl font-black tracking-tight text-white md:text-6xl">
          O'zbekistondagi eng yaxshi
          <span className="block text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text">
            oliy ta'lim muassasalari
          </span>
        </h1>
        <p className="relative max-w-2xl mt-6 text-lg text-slate-400">
          EduUZ orqali O'zbekiston universitetlari, yo'nalishlari va
          stipendiyalari haqida to'liq ma'lumot oling.
        </p>
        <div className="relative flex gap-4 mt-10">
          <Link
            to="/universities"
            className="px-8 py-4 font-bold text-black transition-all bg-cyan-400 rounded-xl hover:bg-cyan-300 shadow-[0_0_30px_rgba(0,245,255,0.3)]"
          >
            Universitetlarni ko'rish
          </Link>
          <Link
            to="/majors"
            className="px-8 py-4 font-bold transition-all border rounded-xl text-slate-300 border-slate-700 hover:border-slate-500"
          >
            Yo'nalishlar
          </Link>
        </div>
      </section>

      <section className="max-w-6xl px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { number: "50+", label: "Universitetlar" },
            { number: "200+", label: "Yo'nalishlar" },
            { number: "1000+", label: "Talabalar" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-8 text-center border rounded-2xl bg-[#11192e]/60 border-slate-800/80"
            >
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text">
                {stat.number}
              </div>
              <div className="mt-2 text-sm font-medium text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
