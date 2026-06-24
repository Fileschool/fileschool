import { FC } from "react";
import { Map, Search, ChevronDown } from "lucide-react";

// Toronto bbox — west, south, east, north
const OSM_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=-79.55%2C43.58%2C-79.21%2C43.75&layer=mapnik";
const OSM_VIEW_URL = "https://www.openstreetmap.org/#map=11/43.6532/-79.3832";

export const Sidebar: FC = () => {
  return (
    <aside className="w-full shrink-0 space-y-8 lg:w-[320px]">
      {/* Map Preview — OpenStreetMap */}
      <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
        <iframe
          title="Map of Toronto"
          src={OSM_EMBED_URL}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
        <a
          href={OSM_VIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <Map className="h-4 w-4" />
          View on OpenStreetMap
        </a>
        <span className="absolute bottom-1 right-1 rounded bg-white/80 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 backdrop-blur-sm">
          © OpenStreetMap contributors
        </span>
      </div>

      {/* Location Search */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Location</h3>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search location, city or area"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Property Type</h3>
        <div className="flex flex-wrap gap-2">
          {["Room", "House", "Apartment", "Studio", "Student apartment"].map((type) => (
            <button
              key={type}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                type === "House"
                  ? "bg-brand-800 text-white"
                  : "bg-white border border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Total Rent */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Total Rent</h3>
        <div className="flex items-center gap-3">
          <input type="text" className="input" placeholder="Min" />
          <input type="text" className="input" placeholder="Max" />
        </div>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Size (m²)</h3>
        <div className="flex items-center gap-3">
          <input type="text" className="input" placeholder="Min" />
          <input type="text" className="input" placeholder="Max" />
        </div>
      </div>

      {/* Number of Rooms */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Number of Rooms</h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <select className="input appearance-none pr-8">
              <option>Min</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="relative flex-1">
            <select className="input appearance-none pr-8">
              <option>Max</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Features</h3>
        <div className="flex flex-wrap gap-2">
          {["Condos", "Detached Homes", "Family Homes"].map((feature) => (
            <button
              key={feature}
              className="rounded-lg border border-slate-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              {feature}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
