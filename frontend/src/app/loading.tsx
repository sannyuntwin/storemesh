import { LoadingGrid } from "@/components/LoadingGrid";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="space-y-7">
      <section className="surface-card p-6 md:p-8">
        <LoadingSkeleton className="h-3 w-28" />
        <LoadingSkeleton className="mt-4 h-10 w-3/4" />
        <LoadingSkeleton className="mt-3 h-4 w-2/3" />
        <div className="mt-5 flex gap-2">
          <LoadingSkeleton className="h-7 w-32" rounded="full" />
          <LoadingSkeleton className="h-7 w-28" rounded="full" />
          <LoadingSkeleton className="h-7 w-24" rounded="full" />
        </div>
      </section>
      <LoadingGrid />
    </div>
  );
}
