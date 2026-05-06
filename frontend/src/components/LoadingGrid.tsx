export function LoadingGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="h-44 rounded-xl bg-slate-200" />
          <div className="mt-4 h-4 w-2/3 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-full rounded bg-slate-100" />
          <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
          <div className="mt-4 h-9 w-28 rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
