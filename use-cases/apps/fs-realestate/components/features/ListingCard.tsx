"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight, Bed, Bath, Maximize2 } from "lucide-react";
import { formatPrice, formatNumber } from "@/lib/utils";
import { imagePresets } from "@/lib/filestack";
import type { IListingCardProps } from "@/interfaces/listing.interface";

export const ListingCard: FC<IListingCardProps> = ({ listing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const images = listing.images.length > 0 ? listing.images : [{ handle: "FJSDPKz8QKvypYiUXN48", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" }];
  
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      data-tour="listing-card"
      className="card group flex flex-col overflow-hidden bg-white shadow-none transition-all hover:shadow-md border border-slate-100"
    >
      <Link href={`/listings/${listing.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={
              images[currentImageIndex].handle === "external"
                ? images[currentImageIndex].url
                : imagePresets.card(images[currentImageIndex].handle as string)
            }
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="rounded bg-[#001e44] px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              Open House
            </span>
            <span className="rounded bg-rose-600 px-2 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              Virtual Tour
            </span>
          </div>

          {/* Carousel Controls */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={handlePrev} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition-transform hover:scale-110 active:scale-95">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={handleNext} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-sm transition-transform hover:scale-110 active:scale-95">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-900 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
          >
            <Heart className={`h-5 w-5 transition-colors ${isLiked ? "fill-rose-600 text-rose-600" : "text-slate-600"}`} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-4 pt-5">
          <div className="flex items-start justify-between gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {formatPrice(listing.price)}
            </span>
          </div>
          
          <div className="mt-2 space-y-0.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {listing.address}
            </h3>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {listing.city} ({listing.propertyType.toUpperCase()}), {listing.state} {listing.zip}
            </p>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-1.5">
              <Bed className="h-3.5 w-3.5 text-slate-400" />
              {listing.bedrooms}
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="h-3.5 w-3.5 text-slate-400" />
              {listing.bathrooms}
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5 text-slate-400" />
              {formatNumber(listing.sqft)} SQ FT
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="text-[10px] text-slate-400 leading-tight">
              Listing by Horizon Pro Realty Inc. - Agent Name<br />
              MLS® #: W1310319B
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};
