import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/features/Navbar";
import { Footer } from "@/components/features/Footer";
import { Tour } from "@/components/features/Tour";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Horizon Pro — Premium Real Estate Listings",
  description: "Experience the future of real estate listings with Filestack's powerful image delivery system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <div className="flex h-5 items-center justify-center gap-2 bg-slate-900 px-3 text-[10px] font-medium tracking-wider text-white/90">
          <span className="uppercase opacity-80">
            <span className="hidden sm:inline">GDPR Notice:&nbsp;</span>
            Filestack demo
          </span>
          <span className="hidden text-white/30 sm:inline">·</span>
          <span className="hidden sm:inline">Built on the Filestack File API</span>
          <span className="text-white/30">·</span>
          <a
            href="https://www.filestack.com/signup/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold uppercase text-orange-300 hover:text-orange-200 hover:underline"
          >
            Get your API key →
          </a>
          <span className="text-white/30">·</span>
          <a
            href="https://github.com/filestack"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold uppercase text-white/80 hover:text-white hover:underline"
          >
            <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            Try on GitHub
          </a>
        </div>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Tour />
      </body>
    </html>
  );
}
