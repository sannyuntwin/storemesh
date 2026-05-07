import { Product, SellerStat } from "@/types";

interface SellerDashboardChartsProps {
  stats: SellerStat[];
  products: Product[];
}

const toNumber = (value: string): number => {
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const clampPercent = (value: number): number => Math.max(0, Math.min(100, value));

export function SellerDashboardCharts({ stats, products }: SellerDashboardChartsProps) {
  const revenue = toNumber(stats.find((item) => item.label === "Revenue")?.value ?? "0");
  const orders = toNumber(stats.find((item) => item.label === "Orders")?.value ?? "0");

  const monthlyBase = Math.max(6000, revenue / 6);
  const monthlyTrend = [
    Math.round(monthlyBase * 0.74),
    Math.round(monthlyBase * 0.82),
    Math.round(monthlyBase * 0.91),
    Math.round(monthlyBase * 0.96),
    Math.round(monthlyBase * 1.04),
    Math.round(monthlyBase * 1.1)
  ];
  const maxMonthly = Math.max(...monthlyTrend, 1);

  const lowStock = products.filter((product) => product.quantity < 10).length;
  const healthyStock = products.filter((product) => product.quantity >= 10 && product.quantity <= 30).length;
  const highStock = products.filter((product) => product.quantity > 30).length;
  const totalBuckets = Math.max(1, lowStock + healthyStock + highStock);

  const lowPct = clampPercent((lowStock / totalBuckets) * 100);
  const healthyPct = clampPercent((healthyStock / totalBuckets) * 100);
  const highPct = clampPercent((highStock / totalBuckets) * 100);

  const maxQuantity = Math.max(1, ...products.map((product) => product.quantity));

  const topInventory = [...products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map((product) => ({
      ...product,
      ratio: clampPercent((product.quantity / maxQuantity) * 100)
    }));

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="surface-card p-5 xl:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Revenue Trend</p>
            <p className="mt-1 text-xl font-black text-slate-900">Monthly Sales Performance</p>
          </div>
          <span className="rounded-full bg-[#e7eef8] px-3 py-1 text-xs font-bold text-[#0a3f82]">
            {orders.toLocaleString()} orders
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-6">
          {monthlyTrend.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="flex h-36 w-full items-end rounded-lg bg-[#f3f8ff] p-2">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-[#0b4f9f] to-[#73a9e6]"
                  style={{ height: `${clampPercent((value / maxMonthly) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] font-semibold text-slate-500">M{index + 1}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="surface-card p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Inventory Mix</p>
        <p className="mt-1 text-lg font-black text-slate-900">Stock Distribution</p>

        <div className="mt-4 flex items-center justify-center">
          <div
            className="relative h-36 w-36 rounded-full"
            style={{
              background: `conic-gradient(#ef4444 0% ${lowPct}%, #0b4f9f ${lowPct}% ${
                lowPct + healthyPct
              }%, #22c55e ${lowPct + healthyPct}% 100%)`
            }}
          >
            <div className="absolute inset-5 rounded-full bg-white" />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700">
              {products.length} SKUs
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-xs">
          <p className="flex items-center justify-between text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
              Low (&lt;10) · {Math.round(lowPct)}%
            </span>
            <span>{lowStock}</span>
          </p>
          <p className="flex items-center justify-between text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0b4f9f]" />
              Healthy (10-30) · {Math.round(healthyPct)}%
            </span>
            <span>{healthyStock}</span>
          </p>
          <p className="flex items-center justify-between text-slate-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
              High (&gt;30) · {Math.round(highPct)}%
            </span>
            <span>{highStock}</span>
          </p>
        </div>
      </article>

      <article className="surface-card p-5 xl:col-span-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Top Inventory</p>
        <p className="mt-1 text-lg font-black text-slate-900">Highest Stock Products</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {topInventory.map((product) => (
            <div key={product.id} className="rounded-xl border border-[#dce6f5] bg-[#f8fbff] p-3">
              <p className="line-clamp-1 text-sm font-semibold text-slate-900">{product.title}</p>
              <p className="mt-1 text-xs text-slate-500">{product.quantity} units</p>
              <div className="mt-2 h-2 rounded-full bg-[#dce8f7]">
                <div className="h-full rounded-full bg-[#0b4f9f]" style={{ width: `${product.ratio}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
