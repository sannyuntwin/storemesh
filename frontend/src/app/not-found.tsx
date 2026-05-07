import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card mx-auto max-w-xl p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-2 text-3xl font-black text-slate-900">Product not found</h1>
      <p className="mt-2 text-sm text-slate-600">The product you are looking for does not exist or is no longer available.</p>
      <Link
        href="/"
        className="mt-5 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Back to shop
      </Link>
    </div>
  );
}
