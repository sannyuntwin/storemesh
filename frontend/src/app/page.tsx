import { ProductGrid } from "@/components/ProductGrid";
import { api } from "@/services/api";

export default async function HomePage() {
  const products = await api.getProducts();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">New Collection</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-slate-900 md:text-4xl">
          Discover modern gear for your everyday workspace and lifestyle.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
          Browse curated products from independent sellers with clean design and trusted quality.
        </p>
      </section>

      <ProductGrid products={products} />
    </div>
  );
}
