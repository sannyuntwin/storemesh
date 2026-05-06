import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/Button";
import { api } from "@/services/api";

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = await params;
  const product = await api.getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="relative h-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:h-[30rem]">
        <Image src={product.image} alt={product.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>

      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{product.category}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-900">{product.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-slate-500">Price</p>
            <p className="font-bold text-slate-900">${product.price.toFixed(2)}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-slate-500">Stock</p>
            <p className="font-bold text-slate-900">{product.stock}</p>
          </div>
          <div className="rounded-xl bg-slate-100 p-3">
            <p className="text-slate-500">Rating</p>
            <p className="font-bold text-slate-900">{product.rating.toFixed(1)} / 5</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button className="px-6">Add to cart</Button>
          <Link href="/" className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Back to products
          </Link>
        </div>
      </section>
    </div>
  );
}
