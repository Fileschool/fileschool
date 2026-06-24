import { FC } from "react";
import { Home, DollarSign, MapPin } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import type { IListingWithImages } from "@/interfaces/listing.interface";

interface IStatsBarProps {
  listings: IListingWithImages[];
}

export const StatsBar: FC<IStatsBarProps> = ({ listings }) => {
  const totalListings = listings.length;
  const avgPrice =
    totalListings > 0
      ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / totalListings)
      : 0;
  const cities = new Set(listings.map((l) => l.city)).size;

  const stats = [
    {
      icon: Home,
      label: "Active Listings",
      value: formatNumber(totalListings),
    },
    {
      icon: DollarSign,
      label: "Avg. Price",
      value: totalListings > 0 ? formatPrice(avgPrice) : "—",
    },
    {
      icon: MapPin,
      label: "Cities",
      value: formatNumber(cities),
    },
  ];

  return (
    <div className="glass-light rounded-2xl p-1">
      <div className="grid grid-cols-3 divide-x divide-navy-700/50">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-center gap-3 px-6 py-4">
            <stat.icon className="h-5 w-5 text-gold-400 shrink-0" />
            <div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
