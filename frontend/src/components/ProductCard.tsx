import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/Button";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block overflow-hidden">
        <div className="relative h-48 w-full bg-slate-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.category}</p>
          <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-slate-900">{product.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</p>
          <Button>Add to cart</Button>
        </div>
      </div>
    </article>
  );
}
