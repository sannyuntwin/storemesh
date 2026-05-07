import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ErrorState } from "@/components/ErrorState";
import { RecordPaymentTool } from "@/components/RecordPaymentTool";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Seller Payments"
};

export default async function SellerPaymentsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/payments");
  }

  try {
    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />
        <section className="space-y-4">
          <article className="surface-card p-6">
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Payments</h1>
            <p className="mt-1 text-sm text-slate-600">Record buyer payments for each sale order.</p>
          </article>
          <RecordPaymentTool />
        </section>
      </div>
    );
  } catch {
    return (
      <ErrorState
        title="Unable to load payment tools"
        description="We could not load seller payment tools right now."
        actionLabel="Go to dashboard"
        actionHref="/seller/dashboard"
      />
    );
  }
}
