import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErrorState } from "@/components/ErrorState";
import { SellerProductsStockTable } from "@/components/SellerProductsStockTable";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";

export const metadata: Metadata = {
  title: "Seller Products"
};

export default async function SellerProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/products");
  }

  try {
    const productsResult = await api.getProductsWithMeta();
    const products = productsResult.data;

    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />

        <section className="space-y-4">
          {productsResult.usedFallback ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Products are showing fallback demo data while backend services are unavailable.
            </section>
          ) : null}

          <article className="surface-card p-6">
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Seller Products</h1>
            <p className="mt-1 text-sm text-slate-600">Manage your product listings and update stock in one place.</p>
          </article>

          <div id="inventory" className="scroll-mt-28">
            <SellerProductsStockTable products={products} />
          </div>
        </section>
      </div>
    );
  } catch {
    return (
      <ErrorState
        title="Unable to load products"
        description="We could not fetch your seller products right now."
        actionLabel="Go to dashboard"
        actionHref="/seller/dashboard"
      />
    );
  }
}
