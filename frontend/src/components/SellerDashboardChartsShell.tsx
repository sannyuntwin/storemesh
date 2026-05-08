"use client";

import dynamic from "next/dynamic";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Product, SellerStat } from "@/types";

interface SellerDashboardChartsShellProps {
  stats: SellerStat[];
  products: Product[];
}

const SellerDashboardCharts = dynamic(
  () => import("@/components/SellerDashboardCharts").then((mod) => mod.SellerDashboardCharts),
  {
    ssr: false,
    loading: () => (
      <article className="surface-card min-w-0 p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="space-y-2">
            <LoadingSkeleton className="h-3 w-24" />
            <LoadingSkeleton className="h-6 w-40" />
          </div>
          <LoadingSkeleton className="h-7 w-24 rounded-full" />
        </div>
        <LoadingSkeleton className="h-72 w-full rounded-xl" />
      </article>
    )
  }
);

export function SellerDashboardChartsShell({ stats, products }: SellerDashboardChartsShellProps) {
  return <SellerDashboardCharts stats={stats} products={products} />;
}
