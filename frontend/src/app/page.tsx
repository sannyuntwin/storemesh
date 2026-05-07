import type { Metadata } from "next";
import { ErrorState } from "@/components/ErrorState";
import { ProductGrid } from "@/components/ProductGrid";
import { api } from "@/services/api";

export const metadata: Metadata = {
  title: "Shop"
};

export default async function HomePage() {
  try {
    const { data: products, usedFallback } = await api.getProductsWithMeta();

    return (
      <div className="space-y-7">
        {usedFallback ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing mock products because backend API is currently unavailable.
          </section>
        ) : null}

        <section className="surface-card p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Featured Drop</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-slate-900 md:text-5xl">
            Discover premium essentials built for modern work and life.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Shop curated products from trusted sellers with fast checkout and clean product browsing.
          </p>
        </section>

        <ProductGrid products={products} />
      </div>
    );
  } catch {
    return <ErrorState title="Unable to load products" description="Please check your API connection and try again." />;
  }
}
