"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarMetric {
  label: string;
  value: string;
}

interface SidebarProps {
  metrics?: SidebarMetric[];
}

const groups = [
  {
    title: "Operations",
    links: [{ href: "/seller/dashboard", label: "Dashboard", icon: "▦" }]
  },
  {
    title: "Catalog",
    links: [
      { href: "/seller/add-product", label: "Add Product", icon: "+" },
      { href: "/seller/dashboard#inventory", label: "Inventory", icon: "◍" }
    ]
  },
  {
    title: "Fulfillment",
    links: [
      { href: "/seller/dashboard#shipment", label: "Shipment", icon: "↗" },
      { href: "/seller/dashboard#payments", label: "Payments", icon: "฿" }
    ]
  }
];

const isActivePath = (pathname: string, href: string): boolean => {
  const normalized = href.split("#")[0];

  if (normalized === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(normalized);
};

export function Sidebar({ metrics = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="surface-card p-4 lg:sticky lg:top-24 lg:h-fit">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0a3f82]">Seller Panel</p>
        <p className="mt-1 text-xs text-slate-500">Commerce operations center</p>
      </div>

      <nav className="space-y-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{group.title}</p>
            <div className="space-y-1">
              {group.links.map((link) => {
                const active = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                      active ? "bg-[#0b4f9f] text-white" : "text-[#0a3f82] hover:bg-[#eaf2fd]"
                    ].join(" ")}
                  >
                    <span className={["text-xs", active ? "text-white/90" : "text-[#0a3f82]/70"].join(" ")}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {metrics.length > 0 ? (
        <div className="mt-5 space-y-2 border-t border-[#d7e3f3] pt-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-lg bg-[#f3f8ff] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">{metric.label}</p>
              <p className="text-sm font-bold text-[#0a3f82]">{metric.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
