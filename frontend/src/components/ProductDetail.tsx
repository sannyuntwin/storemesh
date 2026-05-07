import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { AddToCartButton } from "@/components/AddToCartButton";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="grid gap-7 lg:grid-cols-[1.1fr_1fr]">
      <div className="surface-card relative h-80 overflow-hidden md:h-[34rem]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition duration-500 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      <section className="surface-card space-y-6 p-6 md:p-8">
        <div>
          <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">{product.title}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{product.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="surface-panel p-4">
            <p className="text-slate-500">Price</p>
            <p className="mt-1 text-lg font-bold text-slate-900">${product.unitPrice.toFixed(2)}</p>
          </div>
          <div className="surface-panel p-4">
            <p className="text-slate-500">Stock</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{product.quantity}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <AddToCartButton product={product} className="px-6" />
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to products
          </Link>
        </div>
      </section>
    </div>
  );
}
