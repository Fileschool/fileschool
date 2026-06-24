"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  FileText,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useListingStore, useHasHydrated } from "@/store/listingStore";
import { imagePresets } from "@/lib/filestack";
import { formatFileSize, formatPrice } from "@/lib/utils";
import { RequireAuth } from "@/components/features/RequireAuth";
import { cn } from "@/lib/utils";

type Tab = "listings" | "images" | "documents";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <RequireAuth
          title="Admin access required"
          message="Sign in to manage listings, images, and documents."
        >
          <AdminView />
        </RequireAuth>
      </div>
    </div>
  );
}

function AdminView() {
  const hydrated = useHasHydrated();
  const listings = useListingStore((s) => s.listings);
  const removeListing = useListingStore((s) => s.removeListing);
  const [tab, setTab] = useState<Tab>("listings");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const allImages = useMemo(
    () => listings.flatMap((l) => l.images.map((img) => ({ ...img, listing: l }))),
    [listings],
  );

  const allDocuments = useMemo(
    () =>
      listings.flatMap((l) =>
        (l.documents ?? []).map((doc) => ({ ...doc, listing: l })),
      ),
    [listings],
  );

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof Home; count: number }[] = [
    { id: "listings", label: "Listings", icon: Home, count: listings.length },
    { id: "images", label: "All Images", icon: ImageIcon, count: allImages.length },
    { id: "documents", label: "All Documents", icon: FileText, count: allDocuments.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">
              Admin
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            Manage everything
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View and remove listings, images, and documents across the entire site.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 md:flex md:gap-4">
          <Stat icon={Home} label="Listings" value={listings.length} />
          <Stat icon={Camera} label="Images" value={allImages.length} />
          <Stat icon={FileText} label="Docs" value={allDocuments.length} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors",
              tab === id
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-900",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-black",
                tab === id ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600",
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Panels */}
      {tab === "listings" && (
        <ListingsPanel
          listings={listings}
          confirmId={confirmId}
          onConfirm={setConfirmId}
          onDelete={(id) => {
            removeListing(id);
            setConfirmId(null);
          }}
        />
      )}

      {tab === "images" && <ImagesPanel images={allImages} />}

      {tab === "documents" && <DocumentsPanel documents={allDocuments} />}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Home;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center md:px-5">
      <div className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-lg font-black text-slate-900">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  );
}

function ListingsPanel({
  listings,
  confirmId,
  onConfirm,
  onDelete,
}: {
  listings: ReturnType<typeof useListingStore.getState>["listings"];
  confirmId: string | null;
  onConfirm: (id: string | null) => void;
  onDelete: (id: string) => void;
}) {
  if (listings.length === 0) {
    return (
      <EmptyState
        icon={Home}
        title="No listings yet"
        body="When users publish properties they'll show up here for you to manage."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Beds/Baths</th>
            <th className="px-4 py-3">Media</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {listings.map((l) => {
            const cover = l.images[0];
            return (
              <tr key={l.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {cover && (
                      <img
                        src={
                          cover.handle === "external"
                            ? cover.url
                            : imagePresets.galleryThumb(cover.handle)
                        }
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{l.title}</p>
                      <p className="text-xs text-slate-400">{l.propertyType}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {l.city}, {l.state}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">
                  {formatPrice(l.price)}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {l.bedrooms} / {l.bathrooms}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Camera className="h-3 w-3" />
                    {l.images.length}
                  </span>
                  <span className="ml-3 inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {l.documents?.length ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 truncate max-w-[100px]">
                  {l.ownerId}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/listings/${l.id}`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </Link>
                    {confirmId === l.id ? (
                      <>
                        <button
                          onClick={() => onDelete(l.id)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg bg-rose-600 px-2.5 text-xs font-bold text-white hover:bg-rose-700"
                        >
                          Confirm delete
                        </button>
                        <button
                          onClick={() => onConfirm(null)}
                          className="inline-flex h-8 items-center rounded-lg px-2 text-xs font-bold text-slate-500 hover:text-slate-900"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => onConfirm(l.id)}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-rose-200 px-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ImagesPanel({
  images,
}: {
  images: Array<{
    handle: string;
    url: string;
    filename: string;
    size: number;
    listing: { id: string; title: string };
  }>;
}) {
  if (images.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No images uploaded"
        body="Images uploaded to any listing will appear here."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {images.map((img, i) => (
        <Link
          key={`${img.handle}-${i}`}
          href={`/listings/${img.listing.id}?img=${img.handle}#transformations`}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm transition-all hover:shadow-md"
        >
          <img
            src={
              img.handle === "external" ? img.url : imagePresets.galleryThumb(img.handle)
            }
            alt={img.filename}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <p className="truncate text-[11px] font-bold text-white">{img.listing.title}</p>
            <p className="text-[10px] text-white/70">{formatFileSize(img.size)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

function DocumentsPanel({
  documents,
}: {
  documents: Array<{
    id: string;
    handle: string;
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    label?: string;
    listing: { id: string; title: string };
  }>;
}) {
  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents uploaded"
        body="When sellers attach inspection reports, floor plans, or other documents to their listings, you'll see them here."
      />
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
            <FileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              {doc.label || doc.filename}
            </p>
            <p className="truncate text-xs text-slate-500">
              {doc.filename} · {formatFileSize(doc.size)} ·{" "}
              <Link href={`/listings/${doc.listing.id}`} className="hover:text-rose-600">
                {doc.listing.title}
              </Link>
            </p>
          </div>
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </a>
        </li>
      ))}
    </ul>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Home;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">{body}</p>
    </div>
  );
}
