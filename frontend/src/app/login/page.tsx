import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { CredentialsSignInForm } from "@/components/auth/CredentialsSignInForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { formatThaiBahtNoDecimal } from "@/utils/formatCurrency";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Login"
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const t = await getTranslations();
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const resolvedCallbackUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/seller/dashboard";

  if (session?.user) {
    redirect(resolvedCallbackUrl);
  }

  const featuredProducts = [
    {
      title: "Studio Headphones",
      price: formatThaiBahtNoDecimal(129),
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
      title: "Urban Sneakers",
      price: formatThaiBahtNoDecimal(74),
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
      title: "Smartwatch Pro",
      price: formatThaiBahtNoDecimal(149),
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    }
  ];

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#dbe7f6] bg-[#f8fbff]">
      <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#0b4f9f]/12 blur-3xl" />
      <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-[#c9dbf2]/45 blur-3xl" />

      <div className="relative grid lg:grid-cols-[1fr_1.03fr]">
        <article className="flex items-center justify-center px-5 py-10 md:px-10 lg:px-14 lg:py-14">
          <div className="w-full max-w-[470px] rounded-3xl border border-[#dbe7f6] bg-white px-7 py-8 shadow-[0_28px_70px_-52px_rgba(15,23,42,0.55)] md:px-10 md:py-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0b4f9f]">Storemesh Marketplace</p>
            <h1 className="mt-4 text-[2.7rem] font-black leading-[1.02] tracking-tight text-slate-900">{t("auth.loginPage.title")}</h1>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
              {t("auth.loginPage.description")}
            </p>

            <div className="mt-8">
              <CredentialsSignInForm callbackUrl={resolvedCallbackUrl} />
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#d9e4f3]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{t("auth.loginPage.or")}</span>
              <div className="h-px flex-1 bg-[#d9e4f3]" />
            </div>

            <GoogleSignInButton callbackUrl={resolvedCallbackUrl} />

            <p className="mt-7 rounded-xl border border-[#dbe7f6] bg-[#f2f7fd] px-3 py-2 text-xs text-slate-500">
              {t("auth.loginPage.demoCredentials")}
              <span className="ml-2 font-semibold text-slate-700">seller@storemesh.local / storemesh123</span>
            </p>

            <a
              href="/demo?next=/seller/dashboard"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-[#d7e3f3] bg-white px-4 py-2 text-xs font-semibold tracking-[0.08em] text-slate-700 transition hover:bg-[#f3f7fc]"
            >
              LIVE DEMO
            </a>
          </div>
        </article>

        <article className="relative hidden overflow-hidden border-l border-[#dbe7f6] bg-[#eef4fb] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(11,79,159,0.2),transparent_45%),radial-gradient(circle_at_80%_90%,rgba(28,35,55,0.12),transparent_40%)]" />

          <div className="absolute inset-0 px-10 py-12">
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#dbe7f6] bg-white/85 p-5 backdrop-blur">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0b4f9f]">{t("auth.loginPage.storefront")}</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{t("auth.loginPage.liveCampaignPerformance")}</p>
                <p className="mt-1 text-3xl font-black text-slate-900">{formatThaiBahtNoDecimal(42350)}</p>
                <p className="mt-2 text-xs font-medium text-emerald-700">{t("auth.loginPage.growthThisWeek")}</p>
              </div>

              <div className="rounded-2xl border border-[#dbe7f6] bg-white/80 p-5 backdrop-blur">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">{t("auth.loginPage.trendingProducts")}</p>
                  <span className="rounded-full bg-[#e7eef8] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0a3f82]">
                    {t("auth.loginPage.updated")}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {featuredProducts.map((item) => (
                    <article key={item.title} className="overflow-hidden rounded-xl border border-[#d9e6f6] bg-white">
                      <div className="relative h-24 w-full">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="160px"
                        />
                      </div>
                      <div className="p-2">
                        <p className="line-clamp-1 text-[11px] font-semibold text-slate-800">{item.title}</p>
                        <p className="mt-0.5 text-[11px] font-bold text-[#0b4f9f]">{item.price}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#dbe7f6] bg-white/78 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-slate-800">{t("auth.loginPage.commerceTrustSignals")}</p>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#dbe7f6] bg-[#f2f7fd] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0b4f9f]">{t("auth.loginPage.shipping")}</p>
                    <p className="mt-1 text-xs text-slate-600">{t("auth.loginPage.shippingSupport")}</p>
                  </div>
                  <div className="rounded-xl border border-[#dbe7f6] bg-[#f2f7fd] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0b4f9f]">{t("auth.loginPage.payments")}</p>
                    <p className="mt-1 text-xs text-slate-600">{t("auth.loginPage.paymentsSupport")}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  {t("auth.loginPage.trustDescription")}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
