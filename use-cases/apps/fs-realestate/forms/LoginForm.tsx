"use client";

import { FC, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface ILoginFormProps {
  onSuccess?: () => void;
}

const DEMO_NAME = "Alex Demo";
const DEMO_EMAIL = "alex@horizonpro.com";
const AUTO_LOGIN_SECONDS = 5;

export const LoginForm: FC<ILoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [name, setName] = useState(DEMO_NAME);
  const [countdown, setCountdown] = useState(AUTO_LOGIN_SECONDS);
  const [autoEnabled, setAutoEnabled] = useState(true);
  const submittedRef = useRef(false);
  const login = useAuthStore((s) => s.login);

  const submit = () => {
    if (submittedRef.current) return;
    if (!email || !name) return;
    submittedRef.current = true;
    login(email, name);
    onSuccess?.();
  };

  useEffect(() => {
    if (!autoEnabled) return;
    if (countdown <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, autoEnabled]);

  const handleFieldEdit = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setAutoEnabled(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAutoEnabled(false);
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800">
        Demo mode. Credentials are prefilled and will auto sign in.
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Name</label>
        <input
          type="text"
          className="input"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => handleFieldEdit(setName)(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700">Email</label>
        <input
          type="email"
          className="input"
          placeholder="jane@example.com"
          value={email}
          onChange={(e) => handleFieldEdit(setEmail)(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary relative w-full h-12 mt-2 overflow-hidden"
        data-tour-anchor="login-submit"
      >
        {autoEnabled && countdown > 0 && (
          <span
            className="pointer-events-none absolute inset-y-0 left-0 bg-rose-900/30 transition-all duration-1000 ease-linear"
            style={{
              width: `${((AUTO_LOGIN_SECONDS - countdown) / AUTO_LOGIN_SECONDS) * 100}%`,
            }}
          />
        )}
        <span className="relative z-10">
          {autoEnabled && countdown > 0
            ? `Signing in automatically in ${countdown}…`
            : "Sign In"}
        </span>
      </button>

      {autoEnabled && countdown > 0 && (
        <button
          type="button"
          onClick={() => setAutoEnabled(false)}
          className="block w-full text-center text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600"
        >
          Cancel auto sign-in
        </button>
      )}

      <p className="text-center text-[10px] text-slate-400 mt-4">
        Everything happens locally. No data is sent to any server.
      </p>
    </form>
  );
};
