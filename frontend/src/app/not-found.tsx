import Link from "next/link";

export default function NotFound() {
  return (
    <div className="surface-card relative mx-auto max-w-xl overflow-hidden p-8 text-center">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#0b4f9f]/10 blur-2xl" />
      <p className="relative text-xs font-bold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="relative mt-2 text-3xl font-black text-slate-900">Product not found</h1>
      <p className="relative mt-2 text-sm text-slate-600">
        The product you are looking for does not exist or is no longer available.
      </p>
      <Link
        href="/"
        className="relative mt-5 inline-flex items-center rounded-xl bg-[#0b4f9f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0e62c4]"
      >
        Back to shop
      </Link>
    </div>
  );
}
