"use client";

import { FC, useState } from "react";
import { Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { imagePresets } from "@/lib/filestack";
import { IImageGalleryProps } from "@/interfaces/listing.interface";

export const ImageGallery: FC<IImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-slate-100 flex items-center justify-center">
        <p className="text-slate-400 font-medium">No images available</p>
      </div>
    );
  }

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group relative aspect-[3/2] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
        <img
          src={
            images[activeIndex].handle === "external"
              ? images[activeIndex].url
              : imagePresets.hero(images[activeIndex].handle)
          }
          alt="Property"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg transition-transform hover:scale-110 active:scale-95"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

        {/* Counter */}
        <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Fullscreen icon */}
        <button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-slate-900 shadow-lg transition-transform hover:scale-110 active:scale-95">
          <Maximize2 className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative aspect-square overflow-hidden rounded-xl transition-all ${
                activeIndex === idx
                  ? "ring-2 ring-rose-500 ring-offset-2"
                  : "opacity-60 hover:opacity-100 hover:ring-2 hover:ring-slate-300 hover:ring-offset-2"
              }`}
            >
              <img
                src={img.handle === "external" ? img.url : imagePresets.galleryThumb(img.handle)}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
