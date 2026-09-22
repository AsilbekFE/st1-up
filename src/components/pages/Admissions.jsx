import { useState, useEffect } from "react";
import { askGemini } from "../../ai/geminiService";
import { findBestAnswer } from "../../ai/chatEngine";

const STEPS = [
  { num: "01", title: "Ro'yxatdan o'tish", desc: "EduUZ gazeta portalida shaxsiy talaba hisobingizni oching." },
  { num: "02", title: "Imtihonlar & Test", desc: "DTM test markazi yoki universitet ichki imtihonlarida qatnashing." },
  { num: "03", title: "Hujjat topshirish", desc: "OTM rasmiy portallariga belgilangan muddatda arizangizni yuboring." },
  { num: "04", title: "Qabul va Tasdiq", desc: "Mandat e'lon qilingach, shartnoma yoki davlat grantiga ega bo'ling." },
];

const DOCS = [
  { icon: "🪪", title: "Pasport yoki ID karta", desc: "O'zbekiston fuqarolik pasporti yoki ID kartasining nusxasi." },
  { icon: "🎓", title: "Attestat yoki Diplom", desc: "Umumiy o'rta yoki o'rta maxsus ta'lim muassasasini bitirganlik hujjati." },
  { icon: "📸", title: "3x4 Fotosurat", desc: "Oq fonda, belgilangan standartlar asosida yaqinda olingan rasm." },
  { icon: "📝", title: "Xalqaro Sertifikatlar", desc: "IELTS, CEFR, SAT yoki xalqaro olimpiada sovrindorlik diplomlari." },
];

const PORTALS = [
  { title: "UzBMS (DTM) Portali", desc: "Davlat test markaziga ro'yxatdan o'tish va test natijalarini tekshirish.", link: "my.dtm.uz" },
  { title: "Yagona Interaktiv Davlat Xizmatlari", desc: "Elektron hujjat topshirish va OTMlarga ariza yo'llash tizimi.", link: "my.gov.uz" },
];

const FAQS_DATA = [
  { q: "Qaysi universitetlarga bir vaqtda ariza topshirish mumkin?", a: "Davlat oliygohlarida DTM tizimi orqali 5 tagacha yo'nalishni tanlash mumkin. Xususiy va xalqaro universitetlarga esa mustaqil ravishda istalgancha hujjat topshirishga ruxsat etiladi." },
  { q: "Hujjatlar qanday shaklda qabul qilinadi?", a: "Barcha hujjatlar elektron shaklda — PDF yoki sifatli JPG ko'rinishida rasmiy portal orqali topshiriladi. Qabul qilingandan so'ng originallari taqdim etiladi." },
  { q: "Grant ballari qachon rasman e'lon qilinadi?", a: "Davlat granti va to'lov-shartnoma asosidagi mandat natijalari har yili avgust oyining oxirida Davlat Test Markazi tomonidan e'lon qilinadi." },
  { q: "IELTS sertifikati uchun qanday imtiyozlar bor?", a: "IELTS 5.5+ yoki B2 darajadagi milliy sertifikatga ega talabgorlarga chet tili fanidan maksimal ball avtomatik ravishda beriladi." },
];

function AIModal({ question, onClose }) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(Boolean(question));
  const [input, setInput] = useState(question || "");

  async function ask(prompt) {
    if (!prompt.trim()) return;
    setLoading(true); setResult("");
    try {
      const { answer, usingFallback } = await askGemini(prompt);
      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(prompt);
        setResult(fallback || "Xatolik yuz berdi.");
      } else { setResult(answer); }
    } catch {
      const { answer: fallback } = findBestAnswer(prompt);
      setResult(fallback || "Xatolik yuz berdi.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!question) return;
    let active = true;
    (async () => {
      try {
        const { answer, usingFallback } = await askGemini(question);
        if (!active) return;
        if (usingFallback || !answer) {
          const { answer: fallback } = findBestAnswer(question);
          setResult(fallback || "Xatolik yuz berdi.");
        } else { setResult(answer); }
      } catch {
        if (!active) return;
        const { answer: fallback } = findBestAnswer(question);
        setResult(fallback || "Xatolik yuz berdi.");
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [question]);

  return (
    <div onClick={onClose} className="fixed inset-0 bg-[#111111]/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div onClick={e => e.stopPropagation()} className="bg-[#ede3cc] border-4 border-[#111111] w-full max-w-lg max-h-[85vh] overflow-y-auto gazeta-shadow-black">
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-[#111111] bg-[#f4ecd8]">
          <h2 className="text-xs font-black uppercase newspaper-mono text-[#c1121f]">★ AI QABUL MASLAHATCHISI</h2>
          <button onClick={onClose} className="w-7 h-7 border-2 border-[#111111] flex items-center justify-center font-black hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && ask(input)}
              placeholder="Qabul bo'yicha savolingizni yozing..."
              className="flex-1 px-3 py-2 text-xs"
            />
            <button onClick={() => ask(input)} className="bg-[#c1121f] text-white px-4 py-2 font-black text-xs newspaper-mono hover:bg-[#111111] transition-colors cursor-pointer">→</button>
          </div>

          <div className="flex flex-col gap-2">
            {["Qabul hujjatlari ro'yxati?", "DTM balli qanday hisoblanadi?", "Xususiy OTMga kirish shartlari qanday?"].map(q => (
              <button key={q} onClick={() => { setInput(q); ask(q); }}
                className="border border-[#111111] bg-[#f9f5ea] px-3 py-2 text-xs text-left hover:bg-[#111111] hover:text-white transition-colors cursor-pointer newspaper-mono">
                ➔ {q}
              </button>
            ))}
          </div>

          {loading && <div className="text-center py-6 text-xs newspaper-mono text-[#8b5a2b]">AI javob tayyorlamoqda...</div>}
          {result && (
            <div className="border-2 border-[#111111] bg-[#f9f5ea] p-4">
              <p className="text-[10px] newspaper-mono text-[#c1121f] mb-2 font-black">★ JAVOB:</p>
              <p className="text-xs font-serif text-[#111111] leading-relaxed whitespace-pre-wrap">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Admissions() {
  const [search, setSearch] = useState("");
  const [docFilter, setDocFilter] = useState("Barchasi");
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [aiQ, setAiQ] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

  const docCategories = { "Barchasi": DOCS, "Majburiy": DOCS.slice(0, 2), "Sertifikatlar": [DOCS[3]] };
  const filteredDocs = (docCategories[docFilter] || DOCS).filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFaqs = FAQS_DATA.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  function openAI(q) { setAiQ(q); setAiOpen(true); }

  return (
    <div className="min-h-screen bg-[#f4ecd8] text-[#111111] pb-12 sm:pb-16">
      {/* Hero */}
      <header className="border-b-2 border-[#111111]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-8 sm:py-12 text-center">
          <span className="gazeta-stamp-red mb-2 sm:mb-3 text-[9px] sm:text-xs">★ RASMIY YO'RIQNOMA ★</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight newspaper-headline mb-3 sm:mb-4">
            OTMLARGA QABUL VA <br />
            <span className="text-[#c1121f] underline decoration-2 sm:decoration-4 underline-offset-4">HUJJAT TOPSHIRISH</span> BOSQICHLARI
          </h1>
          <p className="font-serif text-xs sm:text-sm text-[#4b5563] max-w-lg mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
            Abituriyentlar va ota-onalar uchun qabul talablari, hujjatlar ro'yxati va rasmiy davlat portallari haqida to'liq tushuntirish.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center px-2">
            <button
              onClick={() => openAI("Universitetga hujjat topshirish tartibini to'liq tushuntir")}
              className="w-full sm:w-auto bg-[#c1121f] text-white px-5 py-3 font-black text-xs uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono"
            >
              QABUL TARTIBINI SO'RASH →
            </button>
            <button
              onClick={() => openAI("IELTS sertifikati bilan qanday imtiyozlar olish mumkin?")}
              className="w-full sm:w-auto border-2 border-[#111111] bg-[#f9f5ea] text-[#111111] px-5 py-3 font-black text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-white transition-all cursor-pointer newspaper-mono"
            >
              IMTIYOZLARNI O'RGANISH
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 md:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Bosqichlar */}
        <section className="bg-[#ede3cc] border-2 sm:border-4 border-[#111111] p-4 sm:p-6 md:p-8 gazeta-shadow-black">
          <div className="mb-6">
            <span className="text-xs font-black uppercase text-[#c1121f] newspaper-mono">// KETMA-KETLIK</span>
            <h2 className="text-2xl font-black uppercase newspaper-headline text-[#111111]">QABULNING 4 ASOSIY POG'ONASI</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((s, idx) => {
              const isRed = idx % 2 === 0;
              return (
                <div key={idx} className={`bg-[#f9f5ea] border-2 ${isRed ? "border-[#c1121f]" : "border-[#111111]"} p-4 flex flex-col justify-between`}>
                  <div>
                    <span className={`text-xs font-black px-2 py-0.5 newspaper-mono text-white ${isRed ? "bg-[#c1121f]" : "bg-[#111111]"} inline-block mb-2`}>
                      {s.num}-QADAM
                    </span>
                    <h4 className="font-black uppercase newspaper-headline text-sm mb-1 text-[#111111]">{s.title}</h4>
                    <p className="font-serif text-xs text-[#4b5563] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Hujjatlar va Rasmiy Portallar */}
        <section className="grid md:grid-cols-2 gap-6">
          {/* Hujjatlar */}
          <div className="bg-[#f9f5ea] border-2 border-[#111111] p-6 gazeta-shadow-black">
            <h3 className="font-black uppercase newspaper-headline text-base mb-4 text-[#111111]">
              📋 KERAKLI HUJJATLAR RO'YXATI
            </h3>
            <div className="flex gap-2 mb-4">
              {["Barchasi", "Majburiy", "Sertifikatlar"].map(f => (
                <button
                  key={f}
                  onClick={() => setDocFilter(f)}
                  className={`px-3 py-1 text-xs font-black uppercase newspaper-mono border ${docFilter === f ? "bg-[#111111] text-white border-[#111111]" : "bg-[#ede3cc] text-[#111111] border-[#111111]"}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredDocs.map((d, i) => (
                <div key={i} className="border border-[#111111]/30 bg-[#ede3cc] p-3 flex items-start gap-3">
                  <span className="text-xl">{d.icon}</span>
                  <div>
                    <h5 className="font-black text-xs uppercase newspaper-headline text-[#111111]">{d.title}</h5>
                    <p className="font-serif text-xs text-[#4b5563] mt-0.5">{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portallar */}
          <div className="bg-[#f9f5ea] border-2 border-[#c1121f] p-6 gazeta-shadow-red flex flex-col justify-between">
            <div>
              <h3 className="font-black uppercase newspaper-headline text-base mb-4 text-[#c1121f]">
                🏛️ RASMIY QABUL PORTALLARI
              </h3>
              <div className="space-y-4">
                {PORTALS.map((p, i) => (
                  <div key={i} className="border border-[#111111]/30 bg-[#ede3cc] p-4">
                    <h5 className="font-black text-sm uppercase newspaper-headline text-[#111111]">{p.title}</h5>
                    <p className="font-serif text-xs text-[#4b5563] my-1 leading-relaxed">{p.desc}</p>
                    <a
                      href={`https://${p.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-[#c1121f] underline newspaper-mono"
                    >
                      → {p.link}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#111111]/30 text-center">
              <span className="text-[11px] font-bold text-[#8b5a2b] newspaper-mono">
                Barcha arizalar faqat rasmiy davlat tizimlari orqali tasdiqlanadi.
              </span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-[#ede3cc] border-2 border-[#111111] p-6 sm:p-8">
          <h3 className="text-xl font-black uppercase newspaper-headline text-[#111111] mb-4 text-center">
            KO'P SO'RALADIGAN SAVOLLAR (FAQ)
          </h3>

          <div className="space-y-3">
            {filteredFaqs.map((f, i) => (
              <div key={i} className="bg-[#f9f5ea] border border-[#111111]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left font-black text-xs sm:text-sm uppercase newspaper-headline cursor-pointer hover:text-[#c1121f]"
                >
                  <span>{f.q}</span>
                  <span className="text-base font-bold ml-2">{openFaq === i ? "—" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#111111]/20 font-serif text-xs text-[#4b5563] leading-relaxed">
                    <p>{f.a}</p>
                    <button
                      onClick={() => openAI(f.q)}
                      className="mt-2 text-[11px] font-bold text-[#c1121f] underline newspaper-mono cursor-pointer"
                    >
                      AI dan batafsil so'rash →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {aiOpen && <AIModal question={aiQ} onClose={() => { setAiOpen(false); setAiQ(null); }} />}
    </div>
  );
}