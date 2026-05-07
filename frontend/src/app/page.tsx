import type { Metadata } from "next";
import { ErrorState } from "@/components/ErrorState";
import { ProductGrid } from "@/components/ProductGrid";
import { api } from "@/services/api";

export const metadata: Metadata = {
  title: "Shop"
};

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;
  const searchQuery = q?.trim().toLowerCase() ?? "";
  const selectedCategory = category?.trim().toLowerCase() ?? "all";

  const categoryMatchers: Record<string, string[]> = {
    all: [],
    new: [],
    electronics: ["headphone", "keyboard", "watch", "smartwatch", "laptop", "tech", "wireless"],
    fashion: ["shoe", "sneaker", "fashion", "wear"],
    home: ["home", "living", "desk", "stand"]
  };

  try {
    const { data: products, usedFallback } = await api.getProductsWithMeta();
    const categoryKeywords = categoryMatchers[selectedCategory] ?? [];
    const productsByCategory =
      categoryKeywords.length === 0
        ? products
        : products.filter((product) => {
            const haystack = `${product.title} ${product.description}`.toLowerCase();
            return categoryKeywords.some((keyword) => haystack.includes(keyword));
          });

    const filteredProducts =
      searchQuery.length === 0
        ? productsByCategory
        : productsByCategory.filter((product) => {
            const haystack = `${product.title} ${product.description}`.toLowerCase();
            return haystack.includes(searchQuery);
          });

    return (
      <div className="space-y-7">
        {usedFallback ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Showing mock products because backend API is currently unavailable.
          </section>
        ) : null}

        <section className="surface-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#0b4f9f]/10 blur-2xl" />
          <div className="absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
          <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Featured Drop</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-black leading-tight text-slate-900 md:text-5xl">
            Discover premium essentials built for modern work and life.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            Shop curated products from trusted sellers with fast checkout and clean product browsing.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Free shipping over ฿50", "Fast dispatch", "Secure checkout"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d9e4f3] bg-white px-3 py-1 text-xs font-semibold text-[#0a3f82]"
              >
                {tag}
              </span>
            ))}
          </div>
          {searchQuery ? (
            <p className="mt-4 text-sm font-semibold text-[#0b4f9f]">
              Search results for: <span className="text-slate-900">{q}</span>
            </p>
          ) : null}
          {selectedCategory !== "all" ? (
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Category: {selectedCategory}
            </p>
          ) : null}
        </section>

        <ProductGrid products={filteredProducts} />
      </div>
    );
  } catch {
    return <ErrorState title="Unable to load products" description="Please check your API connection and try again." />;
  }
}
