import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function AddProductLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-36" />
        <LoadingSkeleton className="h-10 w-full" rounded="xl" />
        <LoadingSkeleton className="h-10 w-full" rounded="xl" />
      </div>

      <section className="space-y-4">
        <LoadingSkeleton className="h-10 w-44" />
        <LoadingSkeleton className="h-24 w-full" rounded="xl" />
        <LoadingSkeleton className="h-24 w-full" rounded="xl" />
        <LoadingSkeleton className="h-40 w-full" rounded="xl" />
      </section>
    </div>
  );
}
