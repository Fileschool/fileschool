import type { Metadata } from "next";
import { ListingForm } from "@/forms/ListingForm";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";
import { RequireAuth } from "@/components/features/RequireAuth";

export const metadata: Metadata = {
  title: "Post a Property — Horizon Pro",
  description: "Create a new property listing with high-quality images and detailed specifications.",
};

export default function NewListingPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500 text-white">
              <Home className="h-6 w-6" />
            </div>
            <span className="text-xs font-black text-rose-600 uppercase tracking-widest">List Your Property</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Create a New Listing</h1>
          <p className="mt-2 text-slate-500">
            Reach thousands of potential buyers by showcasing your property with Horizon Pro.
          </p>
        </div>

        {/* Form Container */}
        <RequireAuth
          title="Sign in to post a listing"
          message="Create a Horizon Pro account or sign in to publish your property listing."
        >
          <div className="bg-white rounded-[32px] p-8 sm:p-10 shadow-sm border border-slate-100">
            <ListingForm />
          </div>
        </RequireAuth>
      </div>
    </div>
  );
}
