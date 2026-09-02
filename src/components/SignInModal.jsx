import { useState, useEffect, useRef, useCallback } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);
  const submitInFlight = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    submitInFlight.current = false;
    const focusTimer = setTimeout(() => firstInputRef.current?.focus(), 100);

    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = overlayRef.current?.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const validate = useCallback(() => {
    const newErrors = { name: "", email: "", password: "" };
    let valid = true;

    if (isSignUp && !form.name.trim()) {
      newErrors.name = "To'liq ismni kiriting";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email maydonini to'ldiring";
      valid = false;
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      newErrors.email = "Email noto'g'ri formatda";
      valid = false;
    }

    if (!form.password) {
      newErrors.password = "Parol maydonini to'ldiring";
      valid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
      valid = false;
    } else if (form.password.length > 128) {
      newErrors.password = "Parol 128 belgidan oshmasligi kerak";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [form, isSignUp]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (submitError) setSubmitError("");
    if (isSuccess) setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitInFlight.current) return;

    if (!validate()) return;

    setIsSubmitting(true);
    submitInFlight.current = true;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 800);
    } catch {
      setSubmitError("Tizimda xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
      submitInFlight.current = false;
    }
  };

  if (!isOpen) return null;

  const inputClass = (field) =>
    `w-full px-4 py-3 text-sm text-white placeholder-slate-500 bg-slate-900/60 border rounded-xl focus:outline-none focus:ring-1 transition-all ${
      errors[field]
        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/30"
        : "border-slate-800/80 focus:border-cyan-500 focus:ring-cyan-500/30"
    }`;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={isSignUp ? "Hisob yaratish" : "Kirish"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current && !isSubmitting) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800/80 rounded-3xl shadow-2xl shadow-slate-900/50 animate-scale-in overflow-hidden">
        <div className="absolute top-[-40%] right-[-30%] w-[300px] h-[300px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-40%] left-[-30%] w-[300px] h-[300px] bg-violet-900/10 rounded-full blur-[100px] pointer-events-none" />

        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 border rounded-full cursor-pointer bg-slate-900/80 backdrop-blur border-slate-700 hover:border-slate-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Yopish"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative p-8">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-800/30">
              {isSuccess ? (
                <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <h2 className="text-2xl font-black text-white">
              {isSuccess ? "Muvaffaqiyatli!" : isSignUp ? "Hisob yaratish" : "Kirish"}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {isSuccess
                ? isSignUp ? "Hisobingiz yaratildi" : "Tizimga kirdingiz"
                : isSignUp
                  ? "EduUZ platformasiga ro'yxatdan o'ting"
                  : "Davom etish uchun hisobingizga kiring"}
            </p>
          </div>

          {submitError && (
            <div className="px-4 py-3 mb-4 text-sm text-red-400 border rounded-xl bg-red-950/30 border-red-800/40" role="alert">
              {submitError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {isSignUp && (
              <div>
                <label htmlFor="si-name" className="block mb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                  To'liq ism
                </label>
                <input
                  ref={firstInputRef}
                  id="si-name"
                  type="text"
                  placeholder="Aliyev Alisher"
                  value={form.name}
                  onChange={handleChange("name")}
                  disabled={isSubmitting || isSuccess}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "si-name-error" : undefined}
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p id="si-name-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.name}</p>
                )}
              </div>
            )}
            <div>
              <label htmlFor="si-email" className="block mb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Email
              </label>
              <input
                ref={!isSignUp ? firstInputRef : null}
                id="si-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange("email")}
                disabled={isSubmitting || isSuccess}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "si-email-error" : undefined}
                className={inputClass("email")}
              />
              {errors.email && (
                <p id="si-email-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="si-password" className="block mb-1.5 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                Parol
              </label>
              <div className="relative">
                <input
                  id="si-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  disabled={isSubmitting || isSuccess}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "si-password-error" : undefined}
                  className={inputClass("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isSubmitting || isSuccess}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer disabled:opacity-50"
                  aria-label={showPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="si-password-error" className="mt-1.5 text-xs text-red-400" role="alert">{errors.password}</p>
              )}
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" disabled={isSubmitting} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50">
                  Parolni unutdingizmi?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full py-3.5 font-extrabold text-black transition-all bg-gradient-to-r from-cyan-400 to-violet-500 rounded-xl hover:from-cyan-300 hover:to-violet-400 shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:shadow-[0_0_30px_rgba(0,245,255,0.35)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isSignUp ? "Ro'yxatdan o'tkazilmoqda..." : "Kirish..."}
                </>
              ) : isSuccess ? (
                "Muvaffaqiyatli"
              ) : (
                isSignUp ? "Ro'yxatdan o'tish" : "Kirish"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs text-slate-500 bg-[#0f172a]">yoki</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all border rounded-xl text-slate-300 border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all border rounded-xl text-slate-300 border-slate-800/80 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="mt-6 text-sm text-center text-slate-400">
            {isSignUp ? "Hisobingiz bormi?" : "Hisobingiz yo'qmi?"}
            <button
              type="button"
              onClick={() => setIsSignUp((v) => !v)}
              disabled={isSubmitting || isSuccess}
              className="ml-1 font-bold text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
            >
              {isSignUp ? "Kiring" : "Ro'yxatdan o'ting"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
