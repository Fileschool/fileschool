"use client";

import { FC, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, ExternalLink, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IListingImage } from "@/interfaces/listing.interface";

const CDN_BASE = "https://cdn.filestackcontent.com";

interface ITransform {
  id: string;
  label: string;
  task: string;
}

const SIZES: ITransform[] = [
  { id: "sz-original", label: "Original", task: "" },
  { id: "sz-400", label: "400px wide", task: "resize=width:400" },
  { id: "sz-800", label: "800px wide", task: "resize=width:800" },
  { id: "sz-1200", label: "1200px wide", task: "resize=width:1200" },
  { id: "sz-sq", label: "Square crop", task: "resize=width:600,height:600,fit:crop" },
];

const FORMATS: ITransform[] = [
  { id: "fmt-original", label: "Original", task: "" },
  { id: "fmt-webp", label: "WebP", task: "output=format:webp" },
  { id: "fmt-jpg", label: "JPG", task: "output=format:jpg" },
  { id: "fmt-png", label: "PNG", task: "output=format:png" },
];

const FILTERS: ITransform[] = [
  { id: "grayscale", label: "Grayscale", task: "monochrome" },
  { id: "sepia", label: "Sepia", task: "sepia=tone:80" },
  { id: "blur", label: "Blur", task: "blur=amount:8" },
  { id: "negative", label: "Negative", task: "negative" },
  { id: "oil", label: "Oil paint", task: "oil_paint=amount:5" },
  { id: "polaroid", label: "Polaroid", task: "polaroid" },
  { id: "pixelate", label: "Pixelate", task: "pixelate=amount:8" },
  { id: "rounded", label: "Rounded corners", task: "rounded_corners=radius:30" },
  { id: "rotate", label: "Rotate 90°", task: "rotate=deg:90" },
];

interface ITransformPlaygroundProps {
  images: IListingImage[];
}

export const TransformPlayground: FC<ITransformPlaygroundProps> = ({ images }) => {
  const params = useSearchParams();
  const filestackImages = useMemo(
    () => images.filter((img) => img.handle && img.handle !== "external"),
    [images],
  );

  const initialHandle =
    params.get("img") &&
    filestackImages.find((i) => i.handle === params.get("img"))?.handle;

  const [selectedHandle, setSelectedHandle] = useState<string | null>(
    initialHandle || filestackImages[0]?.handle || null,
  );
  const [sizeId, setSizeId] = useState<string>("sz-original");
  const [formatId, setFormatId] = useState<string>("fmt-original");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  if (filestackImages.length === 0) {
    return (
      <section
        id="transformations"
        data-tour="transformations"
        className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center"
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Wand2 className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">
          Transformations unavailable for this listing
        </h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Filestack transformations work on images uploaded through Filestack. This
          listing&apos;s images are external URLs.
        </p>
      </section>
    );
  }

  if (!selectedHandle) return null;

  const tasks: string[] = [];
  const sizeTask = SIZES.find((s) => s.id === sizeId)?.task;
  const formatTask = FORMATS.find((f) => f.id === formatId)?.task;
  if (sizeTask) tasks.push(sizeTask);
  FILTERS.forEach((f) => {
    if (activeFilters.has(f.id)) tasks.push(f.task);
  });
  if (formatTask) tasks.push(formatTask);

  const transformedUrl =
    tasks.length === 0
      ? `${CDN_BASE}/${selectedHandle}`
      : `${CDN_BASE}/${tasks.join("/")}/${selectedHandle}`;

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const reset = () => {
    setSizeId("sz-original");
    setFormatId("fmt-original");
    setActiveFilters(new Set());
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(transformedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <section
      id="transformations"
      data-tour="transformations"
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
    >
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-br from-rose-50 to-orange-50 px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600">
              <Sparkles className="h-3 w-3" />
              Filestack Processing API
            </span>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Transform this image
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Every transformation is just a change to the URL. The image is computed on
              Filestack&apos;s edge and cached globally on first request.
            </p>
          </div>
          <button
            onClick={reset}
            className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-5">
        {/* Preview */}
        <div className="lg:col-span-3 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img
              src={transformedUrl}
              alt="Transformed preview"
              className="h-auto w-full"
            />
          </div>

          {filestackImages.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {filestackImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedHandle(img.handle)}
                  className={cn(
                    "h-16 w-20 overflow-hidden rounded-lg border-2 transition-all",
                    selectedHandle === img.handle
                      ? "border-rose-500 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={`${CDN_BASE}/resize=width:160,height:120,fit:crop/${img.handle}`}
                    alt={img.filename}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* URL bar */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Generated URL
            </p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate text-xs text-slate-700">
                {transformedUrl}
              </code>
              <button
                onClick={copy}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition-colors",
                  copied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-900 text-white hover:bg-slate-800",
                )}
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </button>
              <a
                href={transformedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-2 space-y-5">
          <ControlGroup label="Size">
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <Pill
                  key={s.id}
                  active={sizeId === s.id}
                  onClick={() => setSizeId(s.id)}
                >
                  {s.label}
                </Pill>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Filters (combine any)">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <Pill
                  key={f.id}
                  active={activeFilters.has(f.id)}
                  onClick={() => toggleFilter(f.id)}
                >
                  {f.label}
                </Pill>
              ))}
            </div>
          </ControlGroup>

          <ControlGroup label="Output format">
            <div className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <Pill
                  key={f.id}
                  active={formatId === f.id}
                  onClick={() => setFormatId(f.id)}
                >
                  {f.label}
                </Pill>
              ))}
            </div>
          </ControlGroup>

          <div className="rounded-xl bg-slate-50 p-4 text-[11px] leading-relaxed text-slate-500">
            All transformations chain in the URL itself.{" "}
            <a
              href="https://www.filestack.com/docs/api/processing/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-rose-600 hover:underline"
            >
              See the full Processing API reference →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

function ControlGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-xs font-bold transition-colors",
        active
          ? "bg-slate-900 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300",
      )}
    >
      {children}
    </button>
  );
}
