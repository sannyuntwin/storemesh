export default function ProductDetailLoading() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="h-80 animate-pulse rounded-3xl bg-slate-200 md:h-[30rem]" />
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}
