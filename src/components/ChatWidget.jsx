import { useState, useRef, useEffect, useCallback } from "react";
import { askGemini } from "../ai/geminiService";
import { findBestAnswer } from "../ai/chatEngine";

const suggestions = [
  "Eng yaxshi universitetlar reytingi",
  "Stipendiyalar ro'yxati",
  "Qabul jarayoni va talablar",
  "Universitetlar to'lovlari",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      text: "Salom! 👋 EduUZ AI yordamchisiga xush kelibsiz! Men O'zbekiston universitetlari, yo'nalishlar, stipendiyalar, qabul jarayoni, to'lovlar va talaba hayoti haqida savollaringizga javob beraman.",
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
      const { answer, usingFallback } = await askGemini(q);

      if (usingFallback || !answer) {
        const { answer: fallback } = findBestAnswer(q);
        addMessage(fallback, "bot");
      } else {
        addMessage(answer, "bot");
      }
    } catch {
      const { answer: fallback } = findBestAnswer(q);
      addMessage(fallback, "bot");
    }

    setIsTyping(false);
  }, [input, isTyping, addMessage]);

  return (
    <>
      <div className={isOpen ? "fixed inset-0 z-50 flex flex-col" : "fixed bottom-6 right-6 z-50"}>
        {isOpen ? (
          <div className="flex flex-col w-full h-full bg-[#0f172a] overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-[#11192e]">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-800/30">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">EduUZ AI</h3>
                  <p className="text-[10px] text-emerald-400">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-7 h-7 border rounded-lg cursor-pointer bg-slate-900/80 border-slate-700 hover:border-slate-500 transition-colors"
                aria-label="Chatni yopish"
              >
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto scroll-smooth chat-scroll">
              <div className="max-w-3xl mx-auto w-full p-4 space-y-3">
                {messages.length === 1 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="px-3 py-2 text-[11px] font-medium text-left transition-all border rounded-xl text-slate-300 border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white rounded-2xl rounded-br-md"
                          : "bg-slate-900/60 border border-slate-800/60 text-slate-200 rounded-2xl rounded-bl-md"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="px-4 py-3 text-sm bg-slate-900/60 border border-slate-800/60 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 border-t border-slate-800/80 max-w-3xl mx-auto w-full">
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
                  className="flex-1 px-4 py-2.5 text-sm text-white placeholder-slate-500 bg-slate-900/60 border border-slate-800/80 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex items-center justify-center w-11 h-11 transition-all bg-gradient-to-r from-cyan-400 to-violet-500 rounded-xl disabled:opacity-40 hover:from-cyan-300 hover:to-violet-400"
                >
                  <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center w-14 h-14 transition-all shadow-lg cursor-pointer bg-gradient-to-r from-cyan-400 to-violet-500 rounded-2xl hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] hover:scale-105 animate-fade-in"
            aria-label="AI yordamchini ochish"
          >
            <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
}
