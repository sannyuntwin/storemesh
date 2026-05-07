import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function ProductDetailLoading() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <LoadingSkeleton className="h-80 rounded-3xl md:h-[34rem]" rounded="xl" />
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-8 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-2 gap-3">
          <LoadingSkeleton className="h-20" />
          <LoadingSkeleton className="h-20" />
        </div>
      </div>
    </div>
  );
}
