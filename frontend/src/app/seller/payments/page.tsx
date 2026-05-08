import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErrorState } from "@/components/ErrorState";
import { RecordPaymentTool } from "@/components/RecordPaymentTool";
import { Sidebar } from "@/components/Sidebar";
import { isDemoModeEnabled } from "@/services/fetcher";
import { canAccessSellerPortal } from "@/utils/authz";
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Seller Payments"
};

export default async function SellerPaymentsPage() {
  const [session, demoModeEnabled, t] = await Promise.all([
    auth(), 
    isDemoModeEnabled(),
    getTranslations('seller.payments')
  ]);

  if (!demoModeEnabled) {
    if (!session?.user) {
      redirect("/login?callbackUrl=/seller/payments");
    }

    if (!canAccessSellerPortal(session.user)) {
      redirect("/");
    }
  }

  try {
    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />
        <section className="space-y-4">
          <article className="surface-card p-6">
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{t("title")}</h1>
            <p className="mt-1 text-sm text-slate-600">{t("description")}</p>
          </article>
          <RecordPaymentTool />
        </section>
      </div>
    );
  } catch {
    return (
      <ErrorState
        title={t("error.unableToLoad")}
        description={t("error.description")}
        actionLabel={t("error.goToDashboard")}
        actionHref="/seller/dashboard"
      />
    );
  }
}
