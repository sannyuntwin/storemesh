import Link from "next/link";

export function SellerActionBar() {
  return (
    <section className="surface-card sticky top-20 z-20 border border-[#d7e3f3] bg-white/95 p-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Ops</p>
        <Link
          href="/seller/add-product"
          title="New Listing"
          aria-label="New Listing"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0b4f9f] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#0e62c4]"
        >
          <span aria-hidden="true">+</span> New
        </Link>
        <Link
          href="#shipment"
          title="Fulfill Orders"
          aria-label="Fulfill Orders"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-2 text-xs font-semibold text-[#0a3f82] transition hover:bg-[#eaf2fd]"
        >
          <span aria-hidden="true">↗</span> Ship
        </Link>
        <Link
          href="#payments"
          title="Record Payments"
          aria-label="Record Payments"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-2 text-xs font-semibold text-[#0a3f82] transition hover:bg-[#eaf2fd]"
        >
          <span aria-hidden="true">฿</span> Pay
        </Link>
        <Link
          href="#inventory"
          title="Manage Stock"
          aria-label="Manage Stock"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-2 text-xs font-semibold text-[#0a3f82] transition hover:bg-[#eaf2fd]"
        >
          <span aria-hidden="true">◍</span> Stock
        </Link>
      </div>
    </section>
  );
}
