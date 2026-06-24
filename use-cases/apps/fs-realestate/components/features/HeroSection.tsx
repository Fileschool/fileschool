import { FC } from "react";
import Link from "next/link";
import { Search, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export const HeroSection: FC = () => {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
          alt="Modern Home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Top Navy Bar (RE/MAX Style) */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-[#001e44] hidden md:flex items-center justify-center gap-4 px-4 z-20">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <span className="text-[10px] font-bold text-[#001e44]">H</span>
          </div>
          <span className="text-white text-sm font-bold tracking-wide">Showing Your Home?</span>
        </div>
        <div className="h-6 w-[1px] bg-white/20 mx-4" />
        <span className="text-white/80 text-[10px] max-w-[200px] leading-tight">
          Common Seller Mistakes &gt;
        </span>
      </div>

      {/* Floating Secondary Nav & Search */}
      <div className="absolute top-14 left-0 right-0 z-10 px-4 md:px-8 pt-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-4">
          {/* Logo & Nav Bar */}
          <div className="flex bg-white rounded-lg shadow-xl overflow-hidden h-14 items-center px-6 gap-8">
            <Link href="/" className="flex items-center gap-1 font-black text-2xl tracking-tighter uppercase">
              <span className="text-slate-900">HORIZON PRO</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
              <Link href="/buy" className="hover:text-rose-600">Buy</Link>
              <Link href="/sell" className="hover:text-rose-600">Sell</Link>
              <Link href="/agents" className="hover:text-rose-600">Find an Agent</Link>
              <Link href="/advice" className="hover:text-rose-600">Advice</Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 w-full bg-white rounded-lg shadow-xl h-14 flex items-center px-4 gap-3">
            <Search className="h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by City, Address, or MLS® #"
              className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 placeholder-slate-400 font-medium"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
