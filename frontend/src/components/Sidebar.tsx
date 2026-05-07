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
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#0a3f82]">Seller Panel</p>
      <nav className="space-y-1">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "block rounded-xl px-3 py-2 text-sm font-semibold transition",
                active ? "bg-[#0b4f9f] text-white" : "text-[#0a3f82] hover:bg-[#eaf2fd]"
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
