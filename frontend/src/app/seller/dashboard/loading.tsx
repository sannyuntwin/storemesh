import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function SellerDashboardLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="surface-card p-4">
        <LoadingSkeleton className="h-3 w-24" />
        <LoadingSkeleton className="mt-3 h-9 w-full" rounded="xl" />
        <LoadingSkeleton className="mt-2 h-9 w-full" rounded="xl" />
      </aside>

      <section className="space-y-6">
        <LoadingSkeleton className="h-9 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="surface-card p-5">
              <LoadingSkeleton className="h-4 w-24" />
              <LoadingSkeleton className="mt-3 h-8 w-24" />
              <LoadingSkeleton className="mt-3 h-4 w-20" />
            </div>
          ))}
        </div>
        <LoadingSkeleton className="h-44 w-full" rounded="xl" />
        <LoadingSkeleton className="h-44 w-full" rounded="xl" />
      </section>
    </div>
  );
}
