import { CartSummary as CartSummaryType } from "@/types";
import { formatThaiBaht } from "@/utils/formatCurrency";

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  return (
    <aside className="surface-card h-fit p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatThaiBaht(summary.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{formatThaiBaht(summary.shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd>{formatThaiBaht(summary.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
          <dt>Total</dt>
          <dd>{formatThaiBaht(summary.total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
