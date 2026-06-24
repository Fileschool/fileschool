"use client";

import { FC, ReactNode, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { AuthModal } from "@/modals/AuthModal";

interface IRequireAuthProps {
  children: ReactNode;
  title?: string;
  message?: string;
}

export const RequireAuth: FC<IRequireAuthProps> = ({
  children,
  title = "Sign in required",
  message = "You need a Horizon Pro account to access this page.",
}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (isAuthenticated) return <>{children}</>;

  return (
    <>
      <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{message}</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => setIsAuthOpen(true)} className="btn-primary px-6 h-11">
            Sign in or create account
          </button>
          <Link href="/" className="btn-outline px-6 h-11">
            Back to home
          </Link>
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
