import Link from "next/link";

export function SellerActionBar() {
  return (
    <section className="surface-card sticky top-20 z-20 border border-[#d7e3f3] bg-white/95 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Quick Actions</p>
        <Link
          href="/seller/add-product"
          className="rounded-lg bg-[#0b4f9f] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0e62c4]"
        >
          + Add Product
        </Link>
        <Link
          href="#shipment"
          className="rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-1.5 text-xs font-semibold text-[#0a3f82] transition hover:bg-[#eaf2fd]"
        >
          Create Shipment
        </Link>
        <Link
          href="#payments"
          className="rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-1.5 text-xs font-semibold text-[#0a3f82] transition hover:bg-[#eaf2fd]"
        >
          Record Payment
        </Link>
        <Link
          href="#inventory"
          className="rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-1.5 text-xs font-semibold text-[#0a3f82] transition hover:bg-[#eaf2fd]"
        >
          Manage Stock
        </Link>
      </div>
    </section>
  );
}
