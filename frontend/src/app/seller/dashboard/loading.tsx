import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function SellerDashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-36" />
        <LoadingSkeleton className="h-10 w-full" rounded="xl" />
        <LoadingSkeleton className="h-10 w-full" rounded="xl" />
      </div>

      <section className="space-y-5">
        <LoadingSkeleton className="h-10 w-56" />
        <div className="grid gap-4 sm:grid-cols-3">
          <LoadingSkeleton className="h-28 w-full" rounded="xl" />
          <LoadingSkeleton className="h-28 w-full" rounded="xl" />
          <LoadingSkeleton className="h-28 w-full" rounded="xl" />
        </div>
        <LoadingSkeleton className="h-72 w-full" rounded="xl" />
      </section>
    </div>
  );
}
