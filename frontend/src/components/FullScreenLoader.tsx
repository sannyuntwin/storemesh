import { LoadingIndicator } from "@/components/LoadingIndicator";

interface FullScreenLoaderProps {
  label?: string;
}

export function FullScreenLoader({ label = "Loading..." }: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 px-4 backdrop-blur-sm">
      <div className="surface-card w-full max-w-sm p-5">
        <div className="flex items-center gap-3">
          <LoadingIndicator variant="circle" />
          <p className="text-sm font-semibold text-[#0a3f82]">{label}</p>
        </div>
        <LoadingIndicator className="mt-3" />
      </div>
    </div>
  );
}
