import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErrorState } from "@/components/ErrorState";
import { SellerDashboardCharts } from "@/components/SellerDashboardCharts";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";
import { isDemoModeEnabled } from "@/services/fetcher";
import { formatThaiBahtNoDecimal } from "@/utils/formatCurrency";
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Seller Dashboard"
};

const toNumber = (value: string): number => {
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default async function SellerDashboardPage() {
  const [session, demoModeEnabled, t] = await Promise.all([
    auth(), 
    isDemoModeEnabled(),
    getTranslations('seller.dashboard')
  ]);

  if (!session?.user && !demoModeEnabled) {
    redirect("/login?callbackUrl=/seller/dashboard");
  }

  try {
    const [statsResult, productsResult] = await Promise.all([api.getSellerStatsWithMeta(), api.getProductsWithMeta()]);
    const stats = statsResult.data;
    const products = productsResult.data;
    const fallbackEnabled = statsResult.usedFallback || productsResult.usedFallback;
    const lowStockCount = products.filter((product) => product.quantity < 10).length;
    const outOfStockCount = products.filter((product) => product.quantity <= 0).length;
    const totalSkus = products.length;
    const pendingShipmentCount = Math.max(0, Math.round(totalSkus * 0.25));
    const revenue = toNumber(stats.find((item) => item.label === "Revenue")?.value ?? "0");
    const orders = toNumber(stats.find((item) => item.label === "Orders")?.value ?? "0");
    const revenueStat = stats.find((item) => item.label === "Revenue");
    const ordersStat = stats.find((item) => item.label === "Orders");
    const kpis = [
      {
        label: t("stats.revenue"),
        value: formatThaiBahtNoDecimal(revenue),
        trend: revenueStat?.trend ?? t("overview")
      },
      {
        label: t("stats.orders"),
        value: orders.toLocaleString(),
        trend: ordersStat?.trend ?? t("overview")
      },
      {
        label: t("stats.lowStock"),
        value: lowStockCount.toLocaleString(),
        trend: outOfStockCount > 0 ? `${outOfStockCount} ${t("stats.outOfStock")}` : t("stats.noStockout")
      },
      {
        label: t("stats.pendingShipment"),
        value: pendingShipmentCount.toLocaleString(),
        trend: t("stats.needsFulfillment")
      }
    ];
    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          {fallbackEnabled ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {t("demoModeActive")}
            </section>
          ) : null}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{t("title")}</h1>
              <p className="mt-1 text-sm text-slate-600">{t("welcome")}</p>
            </div>
            <span className="rounded-lg border border-[#d7e3f3] bg-white px-3 py-2 text-xs font-semibold text-slate-600">{t("overview")}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((item) => (
              <article key={item.label} className="surface-card p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{item.value}</p>
                <p className="mt-1 text-xs text-slate-500">{item.trend}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <SellerDashboardCharts stats={stats} products={products} />
            <article className="surface-card p-5">
              <h2 className="text-base font-bold text-slate-900">{t("actionNeeded")}</h2>
              <div className="mt-3 space-y-2 text-sm">
                <a href="/seller/products" className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <span>◍ {t("lowStockItems")}</span>
                  <span className="font-semibold text-[#0b4f9f]">{lowStockCount}</span>
                </a>
                <a href="/seller/shipping" className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <span>↗ {t("pendingShipment")}</span>
                  <span className="font-semibold text-[#0b4f9f]">{pendingShipmentCount}</span>
                </a>
                <a href="/seller/payments" className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <span>฿ {t("paymentUpdates")}</span>
                  <span className="font-semibold text-[#0b4f9f]">{Math.max(1, Math.round(orders * 0.2))}</span>
                </a>
              </div>
            </article>
          </div>
        </section>
      </div>
    );
  } catch {
    return (
      <ErrorState
        title={"Unable to load dashboard"}
        description={"We could not fetch seller analytics at the moment."}
        actionLabel={"Go to shop"}
        actionHref="/"
      />
    );
  }
}
