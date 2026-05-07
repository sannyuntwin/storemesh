import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/Button";
import { CartLine } from "@/types";
import { formatThaiBaht } from "@/utils/formatCurrency";

interface CartItemProps {
  item: CartLine;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const unitPrice = Number(item.product.unitPrice);
  const safeUnitPrice = Number.isFinite(unitPrice) ? unitPrice : 0;
  const lineTotal = safeUnitPrice * item.quantity;

  return (
    <article className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
        <Image src={item.product.image} alt={item.product.title} fill className="object-cover" sizes="96px" />
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/products/${item.product.id}`} className="line-clamp-1 text-base font-bold text-slate-900">
          {item.product.title}
        </Link>
        <p className="mt-1 text-sm text-slate-500">{formatThaiBaht(safeUnitPrice)} each</p>

        <div className="mt-3 flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onDecrease}>
            -
          </Button>
          <span className="inline-flex w-8 justify-center rounded-md bg-slate-100 py-1 text-center text-sm font-semibold text-slate-800">
            {item.quantity}
          </span>
          <Button variant="secondary" size="sm" onClick={onIncrease}>
            +
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end">
        <p className="text-base font-black text-slate-900">{formatThaiBaht(lineTotal)}</p>
        <Button variant="ghost" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </div>
    </article>
  );
}
