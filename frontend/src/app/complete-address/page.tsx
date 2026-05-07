import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { CompleteAddressForm } from "@/components/auth/CompleteAddressForm";

interface CompleteAddressPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Complete Address"
};

export default async function CompleteAddressPage({ searchParams }: CompleteAddressPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const resolvedCallbackUrl = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(resolvedCallbackUrl)}`);
  }

  return (
    <section className="mx-auto max-w-xl">
      <div className="surface-card p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Profile Completion</p>
        <h1 className="mt-2 text-2xl font-black text-[#0a3f82]">Complete your address</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Please add your address to complete buyer registration before continuing.
        </p>
        <div className="mt-6">
          <CompleteAddressForm callbackUrl={resolvedCallbackUrl} />
        </div>
      </div>
    </section>
  );
}
