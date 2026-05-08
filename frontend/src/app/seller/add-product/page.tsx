import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AddProductForm } from "@/components/AddProductForm";
import { Sidebar } from "@/components/Sidebar";
import { isDemoModeEnabled } from "@/services/fetcher";
import { canAccessSellerPortal } from "@/utils/authz";

export const metadata: Metadata = {
  title: "Add Product"
};

export default async function AddProductPage() {
  const [session, demoModeEnabled] = await Promise.all([auth(), isDemoModeEnabled()]);

  if (!demoModeEnabled) {
    if (!session?.user) {
      redirect("/login?callbackUrl=/seller/add-product");
    }

    if (!canAccessSellerPortal(session.user)) {
      redirect("/");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <Sidebar />

      <section className="space-y-4">
        <article className="surface-card p-6 md:p-8">
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Add Product</h1>
          <p className="mt-1 text-sm text-slate-600">Fill only the required product information.</p>
          <AddProductForm />
        </article>
      </section>
    </div>
  );
}
