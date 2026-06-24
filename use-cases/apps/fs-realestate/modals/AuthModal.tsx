"use client";

import { FC } from "react";
import { X } from "lucide-react";
import { LoginForm } from "@/forms/LoginForm";

interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: FC<IAuthModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">
              Demo sign-in
            </span>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Welcome to Horizon Pro
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-8 pb-10 pt-2">
          <LoginForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};
