import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/hooks/useCart";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"]
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: {
    default: "Storemesh | Modern E-Commerce Demo",
    template: "%s | Storemesh"
  },
  description: "Clean full-stack e-commerce portfolio project built with Next.js and Express.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-app text-slate-900 antialiased">
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen">
              <Navbar />
              <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 md:py-8 lg:px-8">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
