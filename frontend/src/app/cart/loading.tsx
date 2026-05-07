import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function CartLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <LoadingSkeleton className="h-9 w-44" />
        <LoadingSkeleton className="h-28 w-full" rounded="xl" />
        <LoadingSkeleton className="h-28 w-full" rounded="xl" />
      </section>

      <section className="space-y-3">
        <LoadingSkeleton className="h-44 w-full" rounded="xl" />
        <LoadingSkeleton className="h-10 w-full" rounded="xl" />
      </section>
    </div>
  );
}
