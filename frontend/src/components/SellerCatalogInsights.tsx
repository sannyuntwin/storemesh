export function SellerCatalogInsights() {
  const checklist = [
    { label: "Product title quality", score: 88 },
    { label: "Image readiness", score: 74 },
    { label: "Price competitiveness", score: 81 },
    { label: "Stock reliability", score: 92 }
  ];

  return (
    <section className="surface-card p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Catalog Insights</p>
      <h2 className="mt-1 text-lg font-black text-slate-900">Listing Quality Snapshot</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Strong listing fundamentals usually improve conversion and reduce post-purchase cancellations.
      </p>

      <div className="mt-4 space-y-3">
        {checklist.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
              <span>{item.label}</span>
              <span className="font-semibold text-[#0a3f82]">{item.score}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#dce8f7]">
              <div className="h-full rounded-full bg-[#0b4f9f]" style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-[#d9e4f3] bg-[#f3f8ff] p-3">
        <p className="text-xs font-semibold text-[#0a3f82]">
          Tip: products with clear photos + updated stock typically rank better in marketplace browsing.
        </p>
      </div>
    </section>
  );
}
