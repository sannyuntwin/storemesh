import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function CartLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <LoadingSkeleton className="h-9 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="surface-card p-4">
              <div className="flex gap-4">
                <LoadingSkeleton className="h-24 w-24 shrink-0" rounded="xl" />
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton className="h-5 w-3/5" />
                  <LoadingSkeleton className="h-4 w-2/5" />
                  <LoadingSkeleton className="h-4 w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="surface-card p-4">
        <LoadingSkeleton className="h-6 w-28" />
        <LoadingSkeleton className="mt-4 h-4 w-full" />
        <LoadingSkeleton className="mt-2 h-4 w-5/6" />
        <LoadingSkeleton className="mt-5 h-10 w-full" rounded="xl" />
      </section>
    </div>
  );
}
