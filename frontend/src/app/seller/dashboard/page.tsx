import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SellerActionBar } from "@/components/SellerActionBar";
import { SellerActionQueue } from "@/components/SellerActionQueue";
import { CreateShipmentTool } from "@/components/CreateShipmentTool";
import { ErrorState } from "@/components/ErrorState";
import { RecordPaymentTool } from "@/components/RecordPaymentTool";
import { SellerDashboardCharts } from "@/components/SellerDashboardCharts";
import { SellerProductsStockTable } from "@/components/SellerProductsStockTable";
import { ShippingLabelPrintTool } from "@/components/ShippingLabelPrintTool";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";

export const metadata: Metadata = {
  title: "Seller Dashboard"
};

export default async function SellerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/dashboard");
  }

  try {
    const [statsResult, productsResult] = await Promise.all([api.getSellerStatsWithMeta(), api.getProductsWithMeta()]);
    const stats = statsResult.data;
    const products = productsResult.data;
    const fallbackEnabled = statsResult.usedFallback || productsResult.usedFallback;
    const lowStockCount = products.filter((product) => product.quantity < 10).length;
    const totalSkus = products.length;
    const catalogValue = products.reduce((sum, product) => sum + product.unitPrice * product.quantity, 0);
    const sidebarMetrics = [
      { label: "SKUs", value: totalSkus.toLocaleString() },
      { label: "Low stock", value: lowStockCount.toString() },
      { label: "Catalog value", value: `฿${Math.round(catalogValue).toLocaleString()}` }
    ];

    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar metrics={sidebarMetrics} />

        <section className="space-y-6">
          {fallbackEnabled ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Dashboard is showing fallback demo data while backend services are unavailable.
            </section>
          ) : null}
          <div>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Seller Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Track sales performance and manage your catalog.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
                Fulfillment workflow
              </span>
              <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
                Payment tracking
              </span>
              <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
                Inventory control
              </span>
            </div>
          </div>

          <SellerActionBar />
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <article key={stat.label} className="surface-card p-5">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
                <p className={["mt-2 text-sm font-semibold", stat.trendDirection === "up" ? "text-emerald-600" : "text-rose-600"].join(" ")}>
                  {stat.trend}
                </p>
              </article>
            ))}
          </div>

          <SellerActionQueue products={products} />
          <SellerDashboardCharts stats={stats} products={products} />
          <div id="shipment" className="scroll-mt-28">
            <CreateShipmentTool />
          </div>
          <ShippingLabelPrintTool />
          <div id="payments" className="scroll-mt-28">
            <RecordPaymentTool />
          </div>
          <div id="inventory" className="scroll-mt-28">
            <SellerProductsStockTable products={products} />
          </div>
        </section>
      </div>
    );
  } catch {
    return (
      <ErrorState
        title="Unable to load dashboard"
        description="We could not fetch seller analytics at the moment."
        actionLabel="Go to shop"
        actionHref="/"
      />
    );
  }
}
