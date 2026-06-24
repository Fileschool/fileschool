"use client";

import { FC, useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { ArrowRight, X, Sparkles } from "lucide-react";
import {
  TOUR_ORDER,
  TourStepId,
  useTourStore,
  useTourHasHydrated,
} from "@/store/tourStore";
import { useAuthStore, useAuthHasHydrated } from "@/store/authStore";

interface ITourStep {
  id: TourStepId;
  selector: string;
  title: string;
  body: string;
  /** If true, the next button is shown so user can advance manually. */
  showNext: boolean;
  /** Anchor placement relative to target. */
  placement: "bottom" | "top" | "right";
  /** Path the user should be on for this step to be valid. */
  requiredPath?: string | RegExp;
}

const STEPS: Record<TourStepId, ITourStep> = {
  signin: {
    id: "signin",
    selector: '[data-tour="signin-button"]',
    title: "Welcome to Horizon Pro",
    body:
      "This is a Filestack demo. Start by signing in — click the user icon. We'll prefill the demo credentials and auto sign you in.",
    showNext: false,
    placement: "bottom",
    requiredPath: "/",
  },
  "list-property": {
    id: "list-property",
    selector: '[data-tour="list-property"]',
    title: "Post your first listing",
    body:
      "Click 'List your property' in the top nav to start creating a new property listing.",
    showNext: false,
    placement: "bottom",
  },
  uploader: {
    id: "uploader",
    selector: '[data-tour="uploader"]',
    title: "Upload property photos",
    body:
      "Drag photos onto this drop zone or click to browse. Each upload goes straight to Filestack's CDN — no server hop, no resizing on your side.",
    showNext: true,
    placement: "bottom",
    requiredPath: /^\/listings\/new/,
  },
  fields: {
    id: "fields",
    selector: '[data-tour="fields"]',
    title: "Fill in the details",
    body:
      "Add a title, description, price, beds, baths, and location. This metadata is what shows up on the listing card and detail page.",
    showNext: true,
    placement: "top",
    requiredPath: /^\/listings\/new/,
  },
  publish: {
    id: "publish",
    selector: '[data-tour="publish"]',
    title: "Publish your listing",
    body:
      "Hit publish and you'll land back on the homepage with your new listing live. The same Filestack handle now powers the card, hero, and gallery.",
    showNext: false,
    placement: "top",
    requiredPath: /^\/listings\/new/,
  },
  "view-listing": {
    id: "view-listing",
    selector: '[data-tour="listing-card"]',
    title: "Open a listing",
    body:
      "Click any property card to open its detail page. You'll see the gallery, documents, and the Filestack transformation playground.",
    showNext: false,
    placement: "bottom",
    requiredPath: "/",
  },
  transformations: {
    id: "transformations",
    selector: '[data-tour="transformations"]',
    title: "Try Filestack transformations",
    body:
      "Resize, crop, convert format, apply filters. Every transformation is just a change to the URL. The image is computed on Filestack's edge and cached globally on first request.",
    showNext: true,
    placement: "top",
    requiredPath: /^\/listings\/[^/]+$/,
  },
  admin: {
    id: "admin",
    selector: '[data-tour="admin-button"]',
    title: "Admin dashboard",
    body:
      "Manage every listing, browse all uploaded images, and review documents from one place. Click to open it and finish the tour.",
    showNext: false,
    placement: "bottom",
  },
};

interface IRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function pathMatches(actual: string, required: string | RegExp | undefined): boolean {
  if (!required) return true;
  if (typeof required === "string") return actual === required;
  return required.test(actual);
}

export const Tour: FC = () => {
  const pathname = usePathname();
  const tourHydrated = useTourHasHydrated();
  const authHydrated = useAuthHasHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isActive, currentStep, hasCompleted, start, goTo, next, dismiss } =
    useTourStore();

  const [rect, setRect] = useState<IRect | null>(null);

  // True on the client after hydration, false on the server. Lets us defer
  // createPortal(document.body) until we actually have a document.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Auto-start on first homepage visit
  useEffect(() => {
    if (!tourHydrated || !authHydrated) return;
    if (hasCompleted || isActive) return;
    if (pathname !== "/") return;
    const t = setTimeout(() => start(), 600);
    return () => clearTimeout(t);
  }, [tourHydrated, authHydrated, hasCompleted, isActive, pathname, start]);

  // Auto-advance from "signin" once authenticated
  useEffect(() => {
    if (!isActive) return;
    if (currentStep === "signin" && isAuthenticated) {
      goTo("list-property");
    }
  }, [isActive, currentStep, isAuthenticated, goTo]);

  // Auto-advance from "list-property" once on the listing form
  useEffect(() => {
    if (!isActive) return;
    if (currentStep === "list-property" && pathname.startsWith("/listings/new")) {
      goTo("uploader");
    }
  }, [isActive, currentStep, pathname, goTo]);

  // Auto-advance from "publish" once the user lands back on home (i.e. published)
  useEffect(() => {
    if (!isActive) return;
    if (currentStep === "publish" && pathname === "/") {
      goTo("view-listing");
    }
  }, [isActive, currentStep, pathname, goTo]);

  // Auto-advance from "view-listing" once on a listing detail page
  useEffect(() => {
    if (!isActive) return;
    const onListingDetail =
      /^\/listings\/[^/]+$/.test(pathname) && pathname !== "/listings/new";
    if (currentStep === "view-listing" && onListingDetail) {
      goTo("transformations");
    }
  }, [isActive, currentStep, pathname, goTo]);

  // Auto-advance from "admin" (final step) once on /admin
  useEffect(() => {
    if (!isActive) return;
    if (currentStep === "admin" && pathname.startsWith("/admin")) {
      next();
    }
  }, [isActive, currentStep, pathname, next]);

  const step = currentStep ? STEPS[currentStep] : null;

  // Recompute target rect when step, pathname, or window changes
  const recompute = useCallback(() => {
    if (!step) {
      setRect(null);
      return;
    }
    if (!pathMatches(pathname, step.requiredPath)) {
      setRect(null);
      return;
    }
    const el = document.querySelector<HTMLElement>(step.selector);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    // scroll target into view if it's offscreen
    if (r.top < 80 || r.bottom > window.innerHeight - 80) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [step, pathname]);

  useEffect(() => {
    if (!isActive || !step) return;

    const raf = window.requestAnimationFrame(recompute);
    const id = window.setInterval(recompute, 500);
    window.addEventListener("resize", recompute);
    window.addEventListener("scroll", recompute, true);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(id);
      window.removeEventListener("resize", recompute);
      window.removeEventListener("scroll", recompute, true);
    };
  }, [isActive, step, recompute]);

  if (!mounted || !isActive || !step) return null;
  if (!pathMatches(pathname, step.requiredPath)) return null;
  if (!rect) return null;

  const stepIndex = TOUR_ORDER.indexOf(step.id);
  const totalSteps = TOUR_ORDER.length;

  const PAD = 8;
  const highlight = {
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  };

  // Tooltip placement
  const TOOLTIP_W = 340;
  const TOOLTIP_OFFSET = 16;
  let tipTop = highlight.top + highlight.height + TOOLTIP_OFFSET;
  let tipLeft = highlight.left + highlight.width / 2 - TOOLTIP_W / 2;

  if (step.placement === "top") {
    tipTop = highlight.top - TOOLTIP_OFFSET - 220;
  } else if (step.placement === "right") {
    tipTop = highlight.top + highlight.height / 2 - 100;
    tipLeft = highlight.left + highlight.width + TOOLTIP_OFFSET;
  }

  // Clamp tooltip to viewport
  if (typeof window !== "undefined") {
    tipLeft = Math.max(12, Math.min(tipLeft, window.innerWidth - TOOLTIP_W - 12));
    tipTop = Math.max(12, Math.min(tipTop, window.innerHeight - 240));
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[200]">
      {/* Backdrop using box-shadow trick — dark everything except the highlight rect */}
      <div
        className="absolute rounded-2xl ring-4 ring-rose-400 transition-all duration-300 ease-out"
        style={{
          top: highlight.top,
          left: highlight.left,
          width: highlight.width,
          height: highlight.height,
          boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.65)",
        }}
      />

      {/* Pulse ring */}
      <div
        className="absolute rounded-2xl ring-2 ring-rose-300/80 animate-pulse"
        style={{
          top: highlight.top - 4,
          left: highlight.left - 4,
          width: highlight.width + 8,
          height: highlight.height + 8,
        }}
      />

      {/* Tooltip */}
      <div
        className="pointer-events-auto absolute rounded-2xl bg-white p-6 shadow-2xl"
        style={{ top: tipTop, left: tipLeft, width: TOOLTIP_W }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600">
            <Sparkles className="h-3 w-3" />
            Getting started · {stepIndex + 1}/{totalSteps}
          </span>
          <button
            onClick={dismiss}
            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h3 className="text-lg font-black tracking-tight text-slate-900">{step.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.body}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={dismiss}
            className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700"
          >
            Skip
          </button>
          {step.showNext && (
            <button
              onClick={next}
              className="btn-primary inline-flex items-center gap-2 h-10 px-5 text-sm"
            >
              {stepIndex === totalSteps - 1 ? "Finish" : "Next"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-1.5">
          {TOUR_ORDER.map((id, i) => (
            <span
              key={id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-rose-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
};
