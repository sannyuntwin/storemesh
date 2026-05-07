import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "@/components/ErrorState";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";

export const metadata: Metadata = {
  title: "Seller Dashboard"
};

export default async function SellerDashboardPage() {
  try {
    const [statsResult, productsResult] = await Promise.all([api.getSellerStatsWithMeta(), api.getProductsWithMeta()]);
    const stats = statsResult.data;
    const products = productsResult.data;
    const fallbackEnabled = statsResult.usedFallback || productsResult.usedFallback;

    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />

        <section className="space-y-6">
          {fallbackEnabled ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Dashboard is showing fallback demo data while backend services are unavailable.
            </section>
          ) : null}
          <div>
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Seller Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">Track sales performance and manage your catalog.</p>
          </div>

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

          <section className="surface-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Products</h2>
              <Link
                href="/seller/add-product"
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
              >
                Add Product
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-3 py-3 font-semibold">Product</th>
                    <th className="px-3 py-3 font-semibold">Quantity</th>
                    <th className="px-3 py-3 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-6 text-center text-sm text-slate-500">
                        No products yet. Add your first listing to get started.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100 last:border-0">
                        <td className="px-3 py-3 font-medium text-slate-900">{product.title}</td>
                        <td className="px-3 py-3 text-slate-600">{product.quantity}</td>
                        <td className="px-3 py-3 text-slate-600">${product.unitPrice.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
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
