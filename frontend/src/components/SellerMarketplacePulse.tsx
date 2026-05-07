import { formatThaiBahtNoDecimal } from "@/utils/formatCurrency";

interface SellerMarketplacePulseProps {
  revenue: number;
  orders: number;
  lowStockCount: number;
  skuCount: number;
}

const clampPercent = (value: number): number => Math.max(0, Math.min(100, value));

export function SellerMarketplacePulse({ revenue, orders, lowStockCount, skuCount }: SellerMarketplacePulseProps) {
  const sessions = Math.max(orders * 21, 200);
  const addedToCart = Math.round(sessions * 0.29);
  const checkout = Math.round(addedToCart * 0.58);
  const paid = Math.max(orders, Math.round(checkout * 0.7));
  const conversionRate = sessions > 0 ? (paid / sessions) * 100 : 0;

  const trafficChannels = [
    { label: "Marketplace Search", percent: 44, color: "bg-[#0b4f9f]" },
    { label: "Ads / Campaigns", percent: 27, color: "bg-[#1d77de]" },
    { label: "Direct / Followers", percent: 18, color: "bg-[#3f93f0]" },
    { label: "Social Referrals", percent: 11, color: "bg-[#77b0ee]" }
  ];

  const campaignCards = [
    {
      title: "Weekend Flash Deal",
      detail: "Top 5 items eligible for boosted placement",
      value: "+12% CTR"
    },
    {
      title: "Free Shipping Threshold",
      detail: "Recommended at ฿499 to increase basket size",
      value: "+฿78 AOV"
    }
  ];

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="surface-card p-5 xl:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Growth Hub</p>
            <h2 className="mt-1 text-xl font-black text-slate-900">Campaign And Traffic Pulse</h2>
            <p className="mt-1 text-sm text-slate-600">Shopee-style promotions with Shopify-like analytics clarity.</p>
          </div>
          <span className="rounded-full border border-[#cfe1f8] bg-[#edf4ff] px-3 py-1 text-xs font-bold text-[#0a3f82]">
            CVR {conversionRate.toFixed(2)}%
          </span>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {campaignCards.map((card) => (
            <article key={card.title} className="rounded-xl border border-[#d6e4f5] bg-[#f8fbff] p-4">
              <p className="text-sm font-bold text-slate-900">{card.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{card.detail}</p>
              <p className="mt-2 text-sm font-semibold text-[#0b4f9f]">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {trafficChannels.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                <span>{item.label}</span>
                <span className="font-semibold text-[#0a3f82]">{item.percent}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#dce8f7]">
                <div className={["h-full rounded-full", item.color].join(" ")} style={{ width: `${clampPercent(item.percent)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="surface-card p-5">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Marketplace Health</p>
        <h3 className="mt-1 text-lg font-black text-slate-900">Ops Snapshot</h3>

        <div className="mt-4 grid gap-2 text-sm">
          <div className="rounded-xl border border-[#d6e4f5] bg-[#f8fbff] p-3">
            <p className="text-xs text-slate-500">Monthly Revenue</p>
            <p className="mt-1 font-bold text-[#0a3f82]">{formatThaiBahtNoDecimal(revenue)}</p>
          </div>
          <div className="rounded-xl border border-[#d6e4f5] bg-[#f8fbff] p-3">
            <p className="text-xs text-slate-500">Confirmed Orders</p>
            <p className="mt-1 font-bold text-[#0a3f82]">{paid.toLocaleString()} orders</p>
          </div>
          <div className="rounded-xl border border-[#d6e4f5] bg-[#f8fbff] p-3">
            <p className="text-xs text-slate-500">Stock Alert</p>
            <p className="mt-1 font-bold text-[#0a3f82]">
              {lowStockCount.toLocaleString()} low-stock / {skuCount.toLocaleString()} SKUs
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#d0e2fa] bg-gradient-to-r from-[#e7f0ff] to-[#f4f8ff] p-3">
          <p className="text-xs font-semibold text-[#0a3f82]">
            Next best move: push 1 limited-time campaign and restock top 3 converting items before weekend peak.
          </p>
        </div>
      </article>
    </section>
  );
}
