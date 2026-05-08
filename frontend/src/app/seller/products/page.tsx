import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErrorState } from "@/components/ErrorState";
import { SellerProductsStockTable } from "@/components/SellerProductsStockTable";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";
import { isDemoModeEnabled } from "@/services/fetcher";
import { canAccessSellerPortal } from "@/utils/authz";
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Seller Products"
};

export default async function SellerProductsPage() {
  const [session, demoModeEnabled, t] = await Promise.all([
    auth(), 
    isDemoModeEnabled(),
    getTranslations('seller.products')
  ]);

  if (!demoModeEnabled) {
    if (!session?.user) {
      redirect("/login?callbackUrl=/seller/products");
    }

    if (!canAccessSellerPortal(session.user)) {
      redirect("/");
    }
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
              โหมดทดสอบสาธิตกำลังทำงาน สินค้าผู้ขายกำลังใช้ข้อมูลจำลอง
            </section>
          ) : null}

          <article className="surface-card p-6">
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{t("title")}</h1>
            <p className="mt-1 text-sm text-slate-600">{t("manageProducts")}</p>
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
