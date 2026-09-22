import { useState, useEffect, useRef, useCallback } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const initialForm = { name: "", email: "", password: "" };
const initialErrors = { name: "", email: "", password: "" };

export default function SignInModal({ isOpen, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const submitInFlight = useRef(false);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !GOOGLE_CLIENT_ID) return;
    const loadGoogle = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          type: "standard", theme: "filled_black", size: "large",
          text: "signin_with", shape: "rectangular", width: "100%",
        });
      }
    };
    if (window.google) { loadGoogle(); }
    else {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true; s.defer = true; s.onload = loadGoogle;
      document.head.appendChild(s);
    }
  }, [isOpen]);

  const handleGoogleResponse = async (response) => {
    setGoogleLoading(true); setSubmitError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Xatolik");
      if (data.data?.token) {
        localStorage.setItem("eduuz_token", data.data.token);
        localStorage.setItem("eduuz_user", JSON.stringify(data.data.user));
        window.dispatchEvent(new Event("eduuz_auth_changed"));
      }
      setIsSuccess(true);
      setTimeout(() => onClose(), 800);
    } catch (err) {
      setSubmitError(err.message || "Google orqali kirishda xatolik.");
    } finally { setGoogleLoading(false); }
  };

  useEffect(() => {
    if (!isOpen) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    submitInFlight.current = false;
    const t = setTimeout(() => firstInputRef.current?.focus(), 100);
    return () => { clearTimeout(t); document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const validate = useCallback(() => {
    const newErrors = { name: "", email: "", password: "" };
    let valid = true;
    if (isSignUp && !form.name.trim()) { newErrors.name = "Ismni kiriting"; valid = false; }
    if (!form.email.trim()) { newErrors.email = "Email kiriting"; valid = false; }
    else if (!EMAIL_REGEX.test(form.email.trim())) { newErrors.email = "Email formati noto'g'ri"; valid = false; }
    if (!form.password) { newErrors.password = "Parol kiriting"; valid = false; }
    else if (form.password.length < 6) { newErrors.password = "Kamida 6 ta belgi"; valid = false; }
    setErrors(newErrors);
    return valid;
  }, [form, isSignUp]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (submitError) setSubmitError("");
    if (isSuccess) setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitInFlight.current || !validate()) return;
    setIsSubmitting(true); submitInFlight.current = true; setSubmitError("");
    try {
      const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";
      const payload = isSignUp
        ? { name: form.name, email: form.email, password: form.password }
        : { email: form.email, password: form.password };
      const res = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Xatolik");
      if (data.data?.token) {
        localStorage.setItem("eduuz_token", data.data.token);
        localStorage.setItem("eduuz_user", JSON.stringify(data.data.user));
        window.dispatchEvent(new Event("eduuz_auth_changed"));
      }
      setIsSuccess(true);
      setTimeout(() => onClose(), 800);
    } catch (err) {
      setSubmitError(err.message || "Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally { setIsSubmitting(false); submitInFlight.current = false; }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111111]/70 backdrop-blur-xs"
      onClick={(e) => { if (e.target === overlayRef.current && !isSubmitting) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-[#ede3cc] border-4 border-[#111111] gazeta-shadow-black">

        {/* Gazeta Blankasi Sarlavhasi (Header) */}
        <div className="bg-[#f4ecd8] border-b-2 border-[#111111] px-5 py-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase newspaper-mono text-[#c1121f] block">
              ★ RASMIY HUJJAT ★
            </span>
            <h3 className="text-base font-black uppercase newspaper-headline text-[#111111]">
              {isSignUp ? "OBUNA BO'LISH VARAQASI" : "O'QUVCHI GUVOHNOMASI"}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 border-2 border-[#111111] bg-[#ede3cc] flex items-center justify-center text-[#111111] font-black hover:bg-[#c1121f] hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Xatolik */}
          {submitError && (
            <div className="border-2 border-[#c1121f] bg-[#c1121f]/10 p-3 mb-4 text-xs font-bold newspaper-mono text-[#c1121f]">
              ⚠ DIQQAT: {submitError}
            </div>
          )}

          {/* Muvaffaqiyat */}
          {isSuccess && (
            <div className="border-2 border-[#111111] bg-[#111111] text-[#f4ecd8] p-3 mb-4 text-xs font-black newspaper-mono text-center">
              ✓ {isSignUp ? "OBUNA MUVAFFAQIYATLI RASMIYLASHTIRILDI" : "TIZIMGA KIRISH TASDIQLANDI"}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {isSignUp && (
              <div>
                <label className="block mb-1 text-xs font-black uppercase newspaper-mono text-[#4b5563]">
                  To'liq Ism-Sharifingiz:
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder="Masalan: Alisher Navoiy"
                  value={form.name}
                  onChange={handleChange("name")}
                  disabled={isSubmitting || isSuccess}
                  className="w-full px-3 py-2.5 text-sm"
                />
                {errors.name && <p className="mt-1 text-[11px] font-bold text-[#c1121f] newspaper-mono">↳ {errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block mb-1 text-xs font-black uppercase newspaper-mono text-[#4b5563]">
                Elektron Pochta (Email):
              </label>
              <input
                ref={!isSignUp ? firstInputRef : null}
                type="email"
                placeholder="talaba@edu.uz"
                value={form.email}
                onChange={handleChange("email")}
                disabled={isSubmitting || isSuccess}
                className="w-full px-3 py-2.5 text-sm"
              />
              {errors.email && <p className="mt-1 text-[11px] font-bold text-[#c1121f] newspaper-mono">↳ {errors.email}</p>}
            </div>

            <div>
              <label className="block mb-1 text-xs font-black uppercase newspaper-mono text-[#4b5563]">
                Maxfiy Parol:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  disabled={isSubmitting || isSuccess}
                  className="w-full px-3 py-2.5 text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isSubmitting || isSuccess}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#4b5563] cursor-pointer newspaper-mono"
                  tabIndex={-1}
                >
                  {showPassword ? "YOPISH" : "KO'RISH"}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] font-bold text-[#c1121f] newspaper-mono">↳ {errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full py-3.5 bg-[#c1121f] text-white font-black text-xs uppercase tracking-widest border-2 border-[#111111] gazeta-shadow-black hover:bg-[#111111] transition-all cursor-pointer newspaper-mono mt-2"
            >
              {isSubmitting ? (
                <span>TEKSHIRILMOQDA...</span>
              ) : isSuccess ? (
                <span>✓ MARHAMAT</span>
              ) : (
                isSignUp ? "OBUNANI TASDIQLASH →" : "TIZIMGA KIRISH →"
              )}
            </button>
          </form>

          {/* Ajratuvchi chiziq */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#111111]/30"></div>
            <span className="text-[10px] newspaper-mono text-[#8b5a2b] font-bold uppercase">YOKI GOOGLE ORQALI</span>
            <div className="flex-1 h-px bg-[#111111]/30"></div>
          </div>

          {/* Google */}
          {GOOGLE_CLIENT_ID ? (
            <div ref={googleBtnRef} className="w-full flex justify-center min-h-[44px]" />
          ) : (
            <button
              type="button"
              onClick={() => setSubmitError("Google autentifikatsiyasi uchun sozlamalar talab qilinadi. Iltimos, email orqali kiring.")}
              disabled={isSubmitting || googleLoading}
              className="w-full flex items-center justify-center gap-2 border-2 border-[#111111] bg-[#f9f5ea] py-2.5 text-xs font-black uppercase newspaper-mono hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
            >
              <span>🌐 Google Tizimi Bilan Kirish</span>
            </button>
          )}

          {/* O'zaro almashtirish */}
          <div className="mt-4 pt-3 border-t border-[#111111]/20 text-center">
            <p className="text-xs font-serif text-[#4b5563]">
              {isSignUp ? "Allaqachon a'zo bo'lganmisiz?" : "Hali ro'yxatdan o'tmaganmisiz?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp((v) => !v)}
                disabled={isSubmitting || isSuccess}
                className="font-bold text-[#c1121f] underline cursor-pointer newspaper-mono ml-1"
              >
                {isSignUp ? "Tizimga Kiring" : "Ro'yxatdan O'ting"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
