import Link from "next/link";
import { Product } from "@/types";

interface SellerActionQueueProps {
  products: Product[];
}

export function SellerActionQueue({ products }: SellerActionQueueProps) {
  const lowStockProducts = products.filter((product) => product.quantity < 10);
  const outOfStockProducts = products.filter((product) => product.quantity === 0);

  const tasks = [
    {
      title: "Restock low inventory",
      detail: `${lowStockProducts.length} products are below 10 units.`,
      href: "#inventory",
      cta: "Open inventory"
    },
    {
      title: "Review out-of-stock items",
      detail: `${outOfStockProducts.length} products are currently out of stock.`,
      href: "#inventory",
      cta: "Review products"
    },
    {
      title: "Process pending shipments",
      detail: "Generate shipping labels for newly paid orders.",
      href: "#shipment",
      cta: "Create shipment"
    },
    {
      title: "Record buyer payments",
      detail: "Keep payment status updated to keep fulfillment smooth.",
      href: "#payments",
      cta: "Record payment"
    }
  ];

  return (
    <section className="surface-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Action Queue</p>
          <h2 className="mt-1 text-lg font-black text-slate-900">Today&apos;s priorities</h2>
        </div>
        <span className="rounded-full bg-[#e7eef8] px-2 py-1 text-[10px] font-bold text-[#0a3f82]">Live workflow</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {tasks.map((task) => (
          <article key={task.title} className="rounded-xl border border-[#d8e4f4] bg-[#f8fbff] p-3">
            <p className="text-sm font-semibold text-slate-900">{task.title}</p>
            <p className="mt-1 text-xs leading-6 text-slate-600">{task.detail}</p>
            <Link href={task.href} className="mt-2 inline-flex text-xs font-semibold text-[#0b4f9f] hover:underline">
              {task.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
