"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Globe, Menu, User, PlusCircle, Shield } from "lucide-react";
import { FC, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { AuthModal } from "@/modals/AuthModal";
import { HorizonProLogoCompact } from "@/components/features/HorizonProLogo";

export const Navbar: FC = () => {
  const router = useRouter();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/search?city=${encodeURIComponent(q)}` : "/search");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 group transition-transform hover:scale-[1.02]">
            <HorizonProLogoCompact />
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative hidden max-w-md flex-1 md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 h-10"
              placeholder="Search location, city or area"
            />
          </form>

          {/* Nav links */}
          <div className="flex items-center gap-2 sm:gap-6">
            {isAuthenticated ? (
              <Link
                href="/listings/new"
                data-tour="list-property"
                className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-rose-500"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">List your property</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                data-tour="list-property"
                className="flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-rose-500"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">List your property</span>
              </button>
            )}

            {isAuthenticated && (
              <Link
                href="/admin"
                data-tour="admin-button"
                className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white sm:inline-flex"
              >
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}

            <button className="hidden text-slate-600 hover:text-slate-900 sm:block">
              <Globe className="h-5 w-5" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-black text-slate-900 leading-tight">{user?.name}</span>
                  <div className="flex items-center gap-2">
                    <Link 
                      href="/dashboard"
                      className="text-[10px] font-black text-slate-400 uppercase tracking-wider hover:text-slate-900"
                    >
                      Dashboard
                    </Link>
                    <span className="text-slate-200">|</span>
                    <button 
                      onClick={logout}
                      className="text-[10px] font-bold text-rose-500 uppercase tracking-wider hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <User className="h-5 w-5" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                data-tour="signin-button"
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 transition-shadow hover:shadow-md"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <Menu className="h-4 w-4" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-600 text-white">
                  <User className="h-4 w-4" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};
