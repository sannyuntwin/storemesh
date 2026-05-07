import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function AddProductLoading() {
  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="surface-card p-4">
        <LoadingSkeleton className="h-3 w-24" />
        <LoadingSkeleton className="mt-3 h-9 w-full" rounded="xl" />
        <LoadingSkeleton className="mt-2 h-9 w-full" rounded="xl" />
      </aside>

      <section className="space-y-4">
        <article className="surface-card p-6 md:p-8">
          <LoadingSkeleton className="h-9 w-56" />
          <LoadingSkeleton className="mt-3 h-4 w-2/3" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <LoadingSkeleton className="h-16 w-full" rounded="xl" />
            <LoadingSkeleton className="h-16 w-full" rounded="xl" />
            <LoadingSkeleton className="h-16 w-full" rounded="xl" />
            <LoadingSkeleton className="h-16 w-full" rounded="xl" />
            <LoadingSkeleton className="h-16 w-full sm:col-span-2" rounded="xl" />
            <LoadingSkeleton className="h-36 w-full sm:col-span-2" rounded="xl" />
            <LoadingSkeleton className="h-10 w-40 sm:col-span-2" rounded="xl" />
          </div>
        </article>
      </section>
    </div>
  );
}
