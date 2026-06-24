import type { Metadata } from "next";
import { User } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "Find an Agent — Horizon Pro",
  description: "Connect with experienced real estate agents in your city.",
};

const AGENTS = [
  { name: "Amara Okafor", city: "Toronto, ON", focus: "Downtown condos & lofts", years: 8 },
  { name: "Liam Becker", city: "Vancouver, BC", focus: "Waterfront properties", years: 12 },
  { name: "Priya Sharma", city: "Calgary, AB", focus: "Family homes & relocation", years: 6 },
  { name: "Daniel Tremblay", city: "Montréal, QC", focus: "Heritage & character homes", years: 15 },
  { name: "Sara Nakamura", city: "Ottawa, ON", focus: "First-time buyers", years: 4 },
  { name: "Marcus Bell", city: "Halifax, NS", focus: "Investment properties", years: 10 },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Agents"
        title="Find an agent who knows your market."
        subtitle="Browse certified agents specialising in your city and property type."
      />

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent) => (
            <div key={agent.name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{agent.name}</h3>
                  <p className="text-xs text-slate-500">{agent.city}</p>
                </div>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Focus</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{agent.focus}</p>
                <p className="mt-3 text-xs text-slate-500">{agent.years} years of experience</p>
              </div>
              <button className="btn-outline mt-5 w-full">Contact agent</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
