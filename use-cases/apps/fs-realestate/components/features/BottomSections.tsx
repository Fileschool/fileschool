import { FC } from "react";
import { Building2, DoorOpen, Layout, GraduationCap, Home } from "lucide-react";

export const BrowseByPropertyType: FC = () => {
  const types = [
    { label: "Apartments", icon: Building2 },
    { label: "Rooms", icon: DoorOpen },
    { label: "Studios", icon: Layout },
    { label: "Student apartments", icon: GraduationCap },
    { label: "All homes for rent", icon: Home },
  ];

  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Browse rental properties by type
      </h2>
      <div className="flex flex-wrap gap-4">
        {types.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-xl bg-white border border-slate-100 px-6 py-4 shadow-sm transition-all hover:shadow-md hover:border-slate-100 group"
          >
            <item.icon className="h-6 w-6 text-brand-800 transition-transform group-hover:scale-110" />
            <span className="text-[15px] font-bold text-slate-900">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const PopularCities: FC = () => {
  const cities = [
    "Toronto", "Mississauga", "Brampton", "Vancouver",
    "Montreal", "Hamilton", "Oakville", "Windsor",
    "Gatineau", "Ottawa", "Calgary", "Kitchener",
    "Quebec"
  ];

  return (
    <div className="mt-16 space-y-6">
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        Popular cities to rent in
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cities.map((city) => (
          <button
            key={city}
            className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-400 hover:text-slate-900 text-left"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
