import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CreateShipmentTool } from "@/components/CreateShipmentTool";
import { ErrorState } from "@/components/ErrorState";
import { ShippingLabelPrintTool } from "@/components/ShippingLabelPrintTool";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Seller Shipping"
};

export default async function SellerShippingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/seller/shipping");
  }

  try {
    return (
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Sidebar />
        <section className="space-y-4">
          <article className="surface-card p-6">
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Shipping</h1>
            <p className="mt-1 text-sm text-slate-600">Create shipment records, reduce stock after shipment, and print shipping labels.</p>
          </article>
          <CreateShipmentTool />
          <ShippingLabelPrintTool />
        </section>
      </div>
    );
  } catch {
    return (
      <ErrorState
        title="Unable to load shipping tools"
        description="We could not load seller shipping tools right now."
        actionLabel="Go to dashboard"
        actionHref="/seller/dashboard"
      />
    );
  }
}
