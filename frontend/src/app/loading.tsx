import { LoadingGrid } from "@/components/LoadingGrid";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-52 animate-pulse rounded bg-slate-200" />
      <LoadingGrid />
    </div>
  );
}
