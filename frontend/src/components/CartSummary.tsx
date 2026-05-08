import { CartSummary as CartSummaryType } from "@/types";
import { formatThaiBaht } from "@/utils/formatCurrency";
import { useTranslations } from "next-intl";

interface CartSummaryProps {
  summary: CartSummaryType;
}

export function CartSummary({ summary }: CartSummaryProps) {
  const t = useTranslations('cart.summary');
  
  return (
    <aside className="surface-card h-fit p-5 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold text-slate-900">{t("title")}</h2>
      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <dt>{t("subtotal")}</dt>
          <dd>{formatThaiBaht(summary.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t("shipping")}</dt>
          <dd>{formatThaiBaht(summary.shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{t("tax")}</dt>
          <dd>{formatThaiBaht(summary.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
          <dt>{t("total")}</dt>
          <dd>{formatThaiBaht(summary.total)}</dd>
        </div>
      </dl>
    </aside>
  );
}
