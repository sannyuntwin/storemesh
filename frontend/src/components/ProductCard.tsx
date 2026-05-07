import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="surface-card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <div className="relative h-52 w-full bg-slate-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-slate-900">{product.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-black tracking-tight text-slate-900">${product.unitPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{product.quantity} in stock</p>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}
