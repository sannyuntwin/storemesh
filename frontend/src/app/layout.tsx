import type { Metadata } from "next";
import { Kanit, Sarabun } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/hooks/useCart";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { AuthBuyerSync } from "@/components/auth/AuthBuyerSync";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DEMO_MODE_COOKIE_NAME, DEMO_MODE_COOKIE_VALUE } from "@/services/fetcher";

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value === "th" ? "th" : "en";
  const demoModeEnabled = cookieStore.get(DEMO_MODE_COOKIE_NAME)?.value === DEMO_MODE_COOKIE_VALUE;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sarabun.variable} ${kanit.variable}`}>
      <body className="min-h-screen bg-app text-slate-900 antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LanguageProvider>
            <ThemeProvider>
              <AuthSessionProvider>
                <AuthBuyerSync />
                <ToastProvider>
                  <CartProvider>
                    <div className="flex min-h-screen flex-col">
                      <Navbar demoModeEnabled={demoModeEnabled} />
                      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 sm:px-6 md:py-8 lg:px-8">{children}</main>
                      <Footer />
                    </div>
                  </CartProvider>
                </ToastProvider>
              </AuthSessionProvider>
            </ThemeProvider>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
