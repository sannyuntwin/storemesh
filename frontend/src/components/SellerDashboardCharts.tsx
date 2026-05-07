"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Product, SellerStat } from "@/types";
import { formatThaiBahtNoDecimal } from "@/utils/formatCurrency";

interface SellerDashboardChartsProps {
  stats: SellerStat[];
  products: Product[];
}

const toNumber = (value: string): number => {
  const normalized = value.replace(/[^\d.-]/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toSafeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function SellerDashboardCharts({ stats, products }: SellerDashboardChartsProps) {
  const revenue = toNumber(stats.find((item) => item.label === "Revenue")?.value ?? "0");
  const orders = toNumber(stats.find((item) => item.label === "Orders")?.value ?? "0") || products.length * 3;

  const monthlyBase = Math.max(6000, revenue / 6);
  const monthlyTrend = [
    { month: "Jan", sales: Math.round(monthlyBase * 0.74) },
    { month: "Feb", sales: Math.round(monthlyBase * 0.82) },
    { month: "Mar", sales: Math.round(monthlyBase * 0.91) },
    { month: "Apr", sales: Math.round(monthlyBase * 0.96) },
    { month: "May", sales: Math.round(monthlyBase * 1.04) },
    { month: "Jun", sales: Math.round(monthlyBase * 1.1) }
  ];

  return (
    <article className="surface-card min-w-0 p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Sales Trend</p>
          <p className="mt-1 text-lg font-black text-slate-900">Last 6 Months</p>
        </div>
        <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#0a3f82]">{orders.toLocaleString()} orders</span>
      </div>

      <div className="h-72 min-w-0 w-full rounded-xl border border-[#dce8f7] bg-[#f8fbff] p-2">
        <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220} debounce={120}>
          <BarChart data={monthlyTrend} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#dce8f7" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              formatter={(value) => [formatThaiBahtNoDecimal(toSafeNumber(value)), "Sales"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #d6e4f5" }}
            />
            <Bar dataKey="sales" radius={[8, 8, 0, 0]} fill="#0b4f9f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
