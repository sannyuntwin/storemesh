import type { Metadata } from "next";
import { AddProductForm } from "@/components/AddProductForm";
import { SellerActionBar } from "@/components/SellerActionBar";
import { SellerCatalogInsights } from "@/components/SellerCatalogInsights";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Add Product"
};

export default function AddProductPage() {
  const sidebarMetrics = [
    { label: "Workflow", value: "Catalog setup" },
    { label: "Goal", value: "Publish quality SKUs" },
    { label: "Tip", value: "Use clear product images" }
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <Sidebar metrics={sidebarMetrics} />

      <section className="space-y-4">
        <SellerActionBar />
        <article className="surface-card p-6 md:p-8">
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Add Product</h1>
          <p className="mt-1 text-sm text-slate-600">Create a new listing for your store catalog.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
              High-quality image
            </span>
            <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
              Clear description
            </span>
            <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
              Accurate stock
            </span>
          </div>
          <AddProductForm />
        </article>

        <article className="surface-card p-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Listing Tips</p>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Use descriptive product names buyers can search for.</li>
            <li>Include feature-focused descriptions for better conversion.</li>
            <li>Keep inventory updated to avoid order cancellations.</li>
          </ul>
        </article>

        <SellerCatalogInsights />
      </section>
    </div>
  );
}
