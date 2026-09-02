import { Link } from "react-router-dom";

const stats = [
  { number: "50+", label: "Universitet ma'lumotlari" },
  { number: "200+", label: "Ta'lim yo'nalishlari" },
  { number: "24/7", label: "AI yordamchi" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#111111] text-[#f4f1ea]">
      <section className="relative flex flex-col items-center justify-center px-4 py-24 text-center md:py-32">
        <div className="absolute top-[-18%] right-[-10%] w-[560px] h-[560px] rounded-full bg-[#f4f1ea]/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-12%] w-[520px] h-[520px] rounded-full bg-[#3a3a3a]/40 blur-[140px] pointer-events-none" />
        <div className="absolute inset-x-4 top-10 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-[#f4f1ea]/25 to-transparent" />

        <span className="relative mb-5 inline-flex items-center rounded-full border border-[#f4f1ea]/15 bg-[#f4f1ea]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-[#d7d2c8]">
          EduUZ — oliy ta'lim yo'riqnomasi
        </span>

        <h1 className="relative max-w-5xl text-4xl font-black leading-[1.05] tracking-tight text-[#f4f1ea] md:text-6xl lg:text-7xl">
          Kelajagingiz uchun mos universitetni{" "}
          <span className="block text-transparent bg-gradient-to-r from-[#f4f1ea] via-[#c7c3ba] to-[#88847d] bg-clip-text">
            EduUZ bilan toping
          </span>
        </h1>

        <p className="relative max-w-2xl mt-6 text-base leading-8 text-[#bbb6ad] md:text-lg">
          Universitetlar, yo'nalishlar, grantlar va qabul jarayonini bir joyda
          solishtiring. Minimal, tushunarli va ishonchli ma'lumotlar orqali
          tanlovingizni osonlashtiring.
        </p>

        <div className="relative flex flex-col w-full max-w-md gap-4 mt-10 sm:w-auto sm:max-w-none sm:flex-row">
          <Link
            to="/universities"
            className="rounded-2xl bg-[#f4f1ea] px-8 py-4 font-extrabold text-[#151515] shadow-[0_20px_60px_rgba(244,241,234,0.12)] transition-all hover:-translate-y-0.5 hover:bg-[#ded9cf]"
          >
            Universitetlarni ko'rish
          </Link>
          <Link
            to="/majors"
            className="rounded-2xl border border-[#f4f1ea]/20 bg-[#1b1b1b]/80 px-8 py-4 font-bold text-[#e4ded4] transition-all hover:-translate-y-0.5 hover:border-[#f4f1ea]/40 hover:bg-[#222222]"
          >
            Yo'nalishlarni tanlash
          </Link>
        </div>
      </section>

      <section className="relative max-w-6xl px-4 pb-20 mx-auto md:pb-28">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-[#f4f1ea]/10 bg-[#181818]/80 p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur transition-all hover:-translate-y-1 hover:border-[#f4f1ea]/25 hover:bg-[#202020]"
            >
              <div className="text-4xl font-black text-transparent bg-gradient-to-r from-[#f4f1ea] to-[#9b978f] bg-clip-text">
                {stat.number}
              </div>
              <div className="mt-3 text-sm font-semibold tracking-wide text-[#b8b2a8]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
