"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Download,
  ExternalLink,
  FileText,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import { ImageGallery } from "@/components/features/ImageGallery";
import { TransformPlayground } from "@/components/features/TransformPlayground";
import { formatPrice, formatNumber, formatFileSize } from "@/lib/utils";
import { useListingStore, useHasHydrated } from "@/store/listingStore";
import type { IListingDocument } from "@/interfaces/listing.interface";

function iconForDocument(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.includes("spreadsheet") || mime.includes("excel") || mime.includes("csv")) {
    return FileSpreadsheet;
  }
  return FileText;
}

function downloadUrl(doc: IListingDocument): string {
  // Filestack supports ?dl=true to force a Content-Disposition: attachment response.
  const sep = doc.url.includes("?") ? "&" : "?";
  return `${doc.url}${sep}dl=true`;
}

interface IListingPageProps {
  params: Promise<{ id: string }>;
}

export default function ListingDetailPage({ params }: IListingPageProps) {
  const { id } = use(params);
  const hasHydrated = useHasHydrated();
  const listing = useListingStore((state) => state.listings.find((l) => l.id === id));

  if (!hasHydrated) {
    return (
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-3xl px-4 py-32 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Listing not found</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            This listing may have been removed, or its URL is incorrect.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-flex h-11 px-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          {/* Gallery — left column */}
          <div className="lg:col-span-3 space-y-8">
            <ImageGallery images={listing.images} />

            {/* Filestack Transformation Playground */}
            <TransformPlayground images={listing.images} />

            {/* Documents */}
            {listing.documents && listing.documents.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-black tracking-tight text-slate-900">
                    Documents & disclosures
                  </h2>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {listing.documents.length} file{listing.documents.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <ul className="space-y-2">
                  {listing.documents.map((doc) => {
                    const Icon = iconForDocument(doc.mimetype);
                    return (
                      <li
                        key={doc.id}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {doc.label || doc.filename}
                          </p>
                          <p className="truncate text-xs text-slate-500">
                            {doc.filename} · {formatFileSize(doc.size)}
                          </p>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </a>
                        <a
                          href={downloadUrl(doc)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          {/* Details — right column */}
          <div className="w-full shrink-0 lg:w-[400px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {listing.status.toUpperCase()}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 uppercase">
                  {listing.propertyType}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                {listing.title}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {listing.address}, {listing.city}, {listing.state} {listing.zip}
              </p>

              <div className="mt-8 rounded-xl bg-slate-50 p-6">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Asking Price</p>
                <p className="mt-1 text-4xl font-black text-slate-900">
                  {formatPrice(listing.price)}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                  <p className="text-xl font-black text-slate-900">{listing.bedrooms}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Beds</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                  <p className="text-xl font-black text-slate-900">{listing.bathrooms}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Baths</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
                  <p className="text-xl font-black text-slate-900">{formatNumber(listing.sqft)}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Sq Ft</p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">About</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {listing.description}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6 text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="h-3.5 w-3.5" />
                  Listed {new Date(listing.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Camera className="h-3.5 w-3.5" />
                  {listing.images.length} photos
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Images uploaded & delivered via <span className="text-rose-500">Filestack</span>
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                CDN transforms: resize, crop, format conversion, quality optimization
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
