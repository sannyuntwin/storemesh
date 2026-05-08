import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ErrorState } from "@/components/ErrorState";
import { ProductDetail } from "@/components/ProductDetail";
import { api } from "@/services/api";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Product Details"
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  let result: Awaited<ReturnType<typeof api.getProductByIdWithMeta>> | null = null;

  try {
    result = await api.getProductByIdWithMeta(id);
  } catch {
    return (
      <ErrorState
        title="Unable to load product"
        description="This product detail could not be loaded right now."
        actionLabel="Back to products"
        actionHref="/"
      />
    );
  }

  const product = result.data;

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-4">
      {result.usedFallback ? (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Front-end Developer Test Demo mode is active. Showing mock product data.
        </section>
      ) : null}
      <ProductDetail product={product} />
    </div>
  );
}
