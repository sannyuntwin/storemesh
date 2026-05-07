import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function ProductDetailLoading() {
  return (
    <div className="space-y-4">
      <LoadingSkeleton className="h-3 w-56" />
      <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
        <div className="surface-card p-3">
          <LoadingSkeleton className="h-80 w-full md:h-[34rem]" rounded="xl" />
        </div>
        <section className="surface-card space-y-5 p-6 md:p-8">
          <LoadingSkeleton className="h-9 w-4/5" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-5/6" />
          <div className="grid grid-cols-2 gap-3">
            <LoadingSkeleton className="h-24 w-full" rounded="xl" />
            <LoadingSkeleton className="h-24 w-full" rounded="xl" />
          </div>
          <div className="flex gap-3">
            <LoadingSkeleton className="h-10 w-36" rounded="xl" />
            <LoadingSkeleton className="h-10 w-36" rounded="xl" />
          </div>
        </section>
      </div>
    </div>
  );
}
