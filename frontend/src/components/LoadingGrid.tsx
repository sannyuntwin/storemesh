import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export function LoadingGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="surface-card p-4">
          <LoadingSkeleton className="h-52 w-full" rounded="xl" />
          <LoadingSkeleton className="mt-4 h-4 w-20" />
          <LoadingSkeleton className="mt-3 h-6 w-4/5" />
          <LoadingSkeleton className="mt-2 h-4 w-full" />
          <LoadingSkeleton className="mt-2 h-4 w-3/4" />
          <div className="mt-5 flex items-center justify-between">
            <LoadingSkeleton className="h-7 w-20" />
            <LoadingSkeleton className="h-10 w-28" rounded="xl" />
          </div>
        </div>
      ))}
    </div>
  );
}
