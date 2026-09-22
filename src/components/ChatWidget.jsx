import { useState, useRef, useEffect, useCallback } from "react";
import { askGemini } from "../ai/geminiService";
import { findBestAnswer } from "../ai/chatEngine";

const suggestions = [
  "Top-5 universitetlar reytingi",
  "100% grantlar ro'yxati va shartlari",
  "DTM kirish ballari tahlili",
  "Eng yuqori oylik to'lanadigan yo'nalishlar",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      text: "Assalomu alaykum! Men EduUZ gazetasining virtual tahririyat muxbiriman. O'zbekiston oliy ta'limi, grantlar, kontrakt narxlari va qabul bo'yicha har qanday savolingizga javob beraman.",
      role: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const addMessage = useCallback((text, role) =>
    setMessages((prev) => [...prev, { id: Date.now() + Math.random(), text, role }]), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const handleSend = useCallback(async (text) => {
    const q = (text || input).trim();
    if (!q || isTyping) return;
    setInput("");
    addMessage(q, "user");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        addMessage(data.answer, "bot");
      } else {
        const { answer, usingFallback } = await askGemini(q);
        if (usingFallback || !answer) {
          const { answer: fallback } = findBestAnswer(q);
          addMessage(fallback, "bot");
        } else {
          addMessage(answer, "bot");
        }
      }
    } catch {
      const { answer, usingFallback } = await askGemini(q);
      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(q);
        addMessage(fallback, "bot");
      } else {
        addMessage(answer, "bot");
      }
    }

    setIsTyping(false);
  }, [input, isTyping, addMessage]);

  return (
    <>
      <div className={isOpen ? "fixed inset-0 z-50 flex flex-col" : "fixed bottom-6 right-6 z-50"}>
        {isOpen ? (
          /* Ochiq chat oynasi */
          <div className="flex flex-col w-full h-full bg-[#ede3cc] border-4 border-[#111111] animate-fade-in text-[#111111]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b-2 border-[#111111] bg-[#f4ecd8]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#c1121f] text-white flex items-center justify-center font-black newspaper-mono text-sm border border-[#111111]">
                  AI
                </div>
                <div>
                  <h3 className="text-sm font-black newspaper-headline uppercase text-[#111111]">EduUZ Virtual Muxbiri</h3>
                  <p className="text-[10px] newspaper-mono text-[#8b5a2b] font-bold">● Jonli tahririyat maslahati</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 border-2 border-[#111111] bg-[#ede3cc] flex items-center justify-center hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer"
                aria-label="Chatni yopish"
              >
                ✕
              </button>
            </div>

            {/* Xabarlar ro'yxati */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f4ecd8]">
              <div className="max-w-2xl mx-auto w-full space-y-3">
                {/* Savol namunalari */}
                {messages.length === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="p-2.5 text-xs font-serif text-left border border-[#111111] bg-[#f9f5ea] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                      >
                        ➔ {s}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] px-4 py-3 text-xs sm:text-sm leading-relaxed border-2 ${
                        msg.role === "user"
                          ? "bg-[#c1121f] text-white border-[#111111] gazeta-shadow-black font-serif"
                          : "bg-[#f9f5ea] text-[#111111] border-[#111111] gazeta-shadow-wood font-serif"
                      }`}
                    >
                      {msg.role === "bot" && (
                        <span className="text-[10px] newspaper-mono text-[#8b5a2b] block mb-1 font-bold">
                          [TAHRIRIYAT MASLAHATI]
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-3 py-2 text-xs border border-[#111111] bg-[#f9f5ea] newspaper-mono text-[#8b5a2b]">
                      ✍️ Tahririyat javob yozmoqda...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input qismi */}
            <div className="border-t-2 border-[#111111] bg-[#ede3cc] p-3">
              <div className="max-w-2xl mx-auto w-full">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Savolingizni yozing..."
                    className="flex-1 px-4 py-2.5 text-xs font-serif bg-[#f9f5ea] border-2 border-[#111111] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="px-5 py-2.5 bg-[#111111] text-white font-black text-xs uppercase newspaper-mono hover:bg-[#c1121f] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    YUBORISH →
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Yopiq Floating Button (Gazeta muhri uslubida) */
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[#c1121f] text-white font-black text-xs uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono"
            aria-label="AI yordamchini ochish"
          >
            <span>🤖 AI MUXBIR</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          </button>
        )}
      </div>
    </>
  );
}
