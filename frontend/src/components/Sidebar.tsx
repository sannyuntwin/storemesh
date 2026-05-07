"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/seller/dashboard", label: "Dashboard" },
  { href: "/seller/add-product", label: "Add Product" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="surface-card p-4 lg:sticky lg:top-24 lg:h-fit">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Seller Panel</p>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "block rounded-xl px-3 py-2 text-sm font-semibold transition",
                active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
