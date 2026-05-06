import Image from "next/image";
import Link from "next/link";
import { CartLine } from "@/types";

interface CartItemProps {
  item: CartLine;
}

export function CartItem({ item }: CartItemProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <Image src={item.product.image} alt={item.product.title} fill className="object-cover" sizes="80px" />
      </div>

      <div className="min-w-0 flex-1">
        <Link href={`/products/${item.product.id}`} className="line-clamp-1 text-sm font-semibold text-slate-900">
          {item.product.title}
        </Link>
        <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
      </div>

      <p className="text-sm font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</p>
    </article>
  );
}
