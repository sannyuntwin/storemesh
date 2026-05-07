import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/hooks/useCart";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { AuthBuyerSync } from "@/components/auth/AuthBuyerSync";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"]
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"]
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
    <html lang="en" className={`${sarabun.variable} ${kanit.variable}`}>
      <body className="min-h-screen bg-app text-slate-900 antialiased">
        <AuthSessionProvider>
          <AuthBuyerSync />
          <ToastProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 md:py-8 lg:px-8">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </ToastProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
