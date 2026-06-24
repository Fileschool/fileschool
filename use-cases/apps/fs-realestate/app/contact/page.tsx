import type { Metadata } from "next";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { PageHero } from "@/components/features/PageHero";

export const metadata: Metadata = {
  title: "Contact — Horizon Pro",
  description: "Get in touch with the Horizon Pro team.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Contact"
        title="Get in touch."
        subtitle="This is a Filestack demonstration site. Use the details below to reach the Filestack team for product questions."
      />

      <section className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Email</h3>
            <p className="mt-2 text-sm text-slate-500">Product questions, support, partnerships.</p>
            <a href="https://www.filestack.com/contact/" className="mt-3 inline-block text-sm font-bold text-rose-600 hover:underline">
              filestack.com/contact
            </a>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Docs & Community</h3>
            <p className="mt-2 text-sm text-slate-500">API references, SDK examples, and guides.</p>
            <a href="https://www.filestack.com/docs/" className="mt-3 inline-block text-sm font-bold text-rose-600 hover:underline">
              filestack.com/docs
            </a>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">About this demo</h3>
            <p className="mt-2 text-sm text-slate-500">No real listings or transactions are processed on this site.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
