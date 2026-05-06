import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-slate-500">Seller Panel</p>
      <nav className="space-y-1">
        <Link
          href="/seller/dashboard"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Dashboard
        </Link>
        <Link
          href="/seller/add-product"
          className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Add Product
        </Link>
      </nav>
    </aside>
  );
}
