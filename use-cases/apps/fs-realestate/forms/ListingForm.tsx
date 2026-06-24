"use client";

import { FC, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X, PlusCircle, FileText } from "lucide-react";
import { FilestackUploader } from "@/components/features/FilestackUploader";
import { imagePresets } from "@/lib/filestack";
import { formatFileSize } from "@/lib/utils";
import { useListingStore } from "@/store/listingStore";
import { useAuthStore } from "@/store/authStore";
import { PROPERTY_TYPES } from "@/interfaces/listing.interface";
import type { IUploadedImage, IUploadedDocument } from "@/interfaces/listing.interface";

interface IDocumentEntry extends IUploadedDocument {
  label: string;
}

export const ListingForm: FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<IUploadedImage[]>([]);
  const [documents, setDocuments] = useState<IDocumentEntry[]>([]);

  const handleUpload = useCallback((files: IUploadedImage[]) => {
    setImages((prev) => [...prev, ...files]);
  }, []);

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDocumentUpload = useCallback((files: IUploadedDocument[]) => {
    setDocuments((prev) => [
      ...prev,
      ...files.map((f) => ({ ...f, label: f.filename })),
    ]);
  }, []);

  const updateDocumentLabel = useCallback((index: number, label: string) => {
    setDocuments((prev) => prev.map((d, i) => (i === index ? { ...d, label } : d)));
  }, []);

  const removeDocument = useCallback((index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addListing = useListingStore((state) => state.addListing);
  const user = useAuthStore((state) => state.user);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(e.currentTarget);

    try {
      const listingData = {
        ownerId: user?.id || "guest",
        title: form.get("title") as string,
        description: form.get("description") as string,
        price: parseInt(form.get("price") as string, 10),
        bedrooms: parseInt(form.get("bedrooms") as string, 10),
        bathrooms: parseInt(form.get("bathrooms") as string, 10),
        sqft: parseInt(form.get("sqft") as string, 10),
        address: form.get("address") as string,
        city: form.get("city") as string,
        state: form.get("state") as string,
        zip: form.get("zip") as string,
        propertyType: form.get("propertyType") as string,
        status: "active" as const,
        images: images.map((img, idx) => ({
          id: `local-${img.handle}-${idx}`,
          listingId: "", // Will be set by store/id
          handle: img.handle,
          url: img.url,
          filename: img.filename,
          mimetype: img.mimetype,
          size: img.size,
          order: idx,
          createdAt: Date.now(),
        })),
        documents: documents.map((doc, idx) => ({
          id: `local-doc-${doc.handle}-${idx}`,
          listingId: "",
          handle: doc.handle,
          url: doc.url,
          filename: doc.filename,
          mimetype: doc.mimetype,
          size: doc.size,
          label: doc.label || doc.filename,
          order: idx,
          createdAt: Date.now(),
        })),
      };

      addListing(listingData);
      
      // Since it's local, we don't know the ID yet unless we generate it here
      // But addListing will unshift to listings[0], so we can just redirect to home or handle it
      router.push("/");
    } catch (err) {
      console.error("Failed to create listing:", err);
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-rose-500 focus:bg-white focus:ring-4 focus:ring-rose-500/10";

  const labelClass = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Image Upload */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Property Photos</h3>
            <p className="text-sm text-slate-500">Add up to 10 high-resolution photos — select multiple files at once.</p>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {images.length} / 10
          </span>
        </div>

        {images.length < 10 && (
          <div
            data-tour="uploader"
            className="p-1 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <FilestackUploader onUploadDone={handleUpload} maxFiles={10 - images.length} />
          </div>
        )}

        {/* Image previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((img, idx) => (
              <div key={img.handle} className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                <img
                  src={imagePresets.galleryThumb(img.handle)}
                  alt={img.filename}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity backdrop-blur-sm group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-2 left-2 rounded-lg bg-rose-600 px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="h-[1px] w-full bg-slate-100" />

      {/* Documents Upload */}
      <div className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Property Documents</h3>
            <p className="text-sm text-slate-500">
              Optional: inspection reports, floor plans, HOA docs — anything buyers might want to see.
            </p>
          </div>
          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {documents.length} file{documents.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-1 bg-slate-50 rounded-2xl border border-slate-100">
          <FilestackUploader
            onUploadDone={handleDocumentUpload}
            maxFiles={10}
            mode="document"
          />
        </div>

        {documents.length > 0 && (
          <ul className="space-y-2">
            {documents.map((doc, idx) => (
              <li
                key={doc.handle}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <input
                    type="text"
                    value={doc.label}
                    onChange={(e) => updateDocumentLabel(idx, e.target.value)}
                    placeholder="e.g. Inspection Report"
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none focus:bg-slate-50 rounded px-1 -mx-1"
                  />
                  <p className="truncate text-xs text-slate-500">
                    {doc.filename} · {formatFileSize(doc.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(idx)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                  aria-label="Remove document"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-[1px] w-full bg-slate-100" />

      {/* Basic Info */}
      <div data-tour="fields" className="space-y-6">
        <h3 className="text-xl font-black text-slate-900">General Information</h3>

        <div>
          <label htmlFor="title" className={labelClass}>Listing Title</label>
          <input id="title" name="title" required placeholder="e.g. Modern Downtown Loft with City Views" className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Detailed Description</label>
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Tell potential buyers what makes this property special..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <label htmlFor="price" className={labelClass}>Price ($)</label>
            <input id="price" name="price" type="number" step="1" required placeholder="450000" className={inputClass} />
          </div>
          <div>
            <label htmlFor="bedrooms" className={labelClass}>Bedrooms</label>
            <input id="bedrooms" name="bedrooms" type="number" required placeholder="3" className={inputClass} />
          </div>
          <div>
            <label htmlFor="bathrooms" className={labelClass}>Bathrooms</label>
            <input id="bathrooms" name="bathrooms" type="number" required placeholder="2" className={inputClass} />
          </div>
          <div>
            <label htmlFor="sqft" className={labelClass}>Square Feet</label>
            <input id="sqft" name="sqft" type="number" required placeholder="1800" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="propertyType" className={labelClass}>Property Type</label>
          <div className="relative">
            <select id="propertyType" name="propertyType" required className={`${inputClass} appearance-none`}>
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>{pt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <PlusCircle className="h-4 w-4 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-100" />

      {/* Location */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-slate-900">Property Location</h3>

        <div>
          <label htmlFor="address" className={labelClass}>Street Address</label>
          <input id="address" name="address" required placeholder="e.g. 123 Luxury Lane" className={inputClass} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="city" className={labelClass}>City</label>
            <input id="city" name="city" required placeholder="e.g. Toronto" className={inputClass} />
          </div>
          <div>
            <label htmlFor="state" className={labelClass}>Province / State</label>
            <input id="state" name="state" required placeholder="e.g. ON" className={inputClass} />
          </div>
          <div>
            <label htmlFor="zip" className={labelClass}>Postal / ZIP Code</label>
            <input id="zip" name="zip" required placeholder="e.g. M5V 2L7" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6">
        <button
          type="submit"
          data-tour="publish"
          disabled={isSubmitting || images.length === 0}
          className="btn-primary px-10 h-14 text-base shadow-lg shadow-rose-500/20"
        >
          {isSubmitting ? "Publishing Listing..." : "Publish to Horizon Pro"}
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
          <div className={`h-2 w-2 rounded-full ${images.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span className="text-xs font-bold text-slate-600">
            {images.length} property photo{images.length !== 1 ? "s" : ""} uploaded
          </span>
        </div>
      </div>
    </form>
  );
};
