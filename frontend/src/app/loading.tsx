import { LoadingGrid } from "@/components/LoadingGrid";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-8 w-64" />
      <LoadingSkeleton className="h-24 w-full rounded-3xl" rounded="xl" />
      <LoadingGrid />
    </div>
  );
}
