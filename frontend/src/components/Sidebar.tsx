"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactElement } from "react";
import { useState } from "react";

type IconComponent = () => ReactElement;

interface NavItem {
  label: string;
  icon: IconComponent;
  href?: string;
  soon?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    <rect x="14" y="11" width="7" height="10" rx="1.5" />
    <rect x="3" y="13" width="7" height="8" rx="1.5" />
  </svg>
);

const OrdersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10M7 12h10M7 16h6" />
  </svg>
);

const InventoryIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 7l9-4 9 4-9 4-9-4z" />
    <path d="M3 12l9 4 9-4M3 17l9 4 9-4" />
  </svg>
);

const ShipmentIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 7h12v10H3z" />
    <path d="M15 10h4l2 2v5h-6z" />
    <circle cx="8" cy="18" r="1.5" />
    <circle cx="18" cy="18" r="1.5" />
  </svg>
);

const PaymentIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
    <path d="M2.5 10.5h19M8 14h4" />
  </svg>
);

const MarketingIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 10l14-6v16L4 14V10z" />
    <path d="M7 14v4a2 2 0 002 2h1" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 20V10M10 20V6M16 20v-8M22 20v-4" />
  </svg>
);

const MessagesIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M4 5h16v11H8l-4 3V5z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 01-4 0v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1A1.7 1.7 0 005 15a1.7 1.7 0 00-1.6-1H3a2 2 0 010-4h.2A1.7 1.7 0 005 8.4a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1A1.7 1.7 0 0010.2 2H10a2 2 0 014 0v.2a1.7 1.7 0 001 1.6h.1a1.7 1.7 0 001.9-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.6 1H21a2 2 0 010 4h-.2a1.7 1.7 0 00-1.6 1z" />
  </svg>
);

const isActivePath = (pathname: string, href: string): boolean => {
  const normalized = href.split("#")[0];
  return pathname.startsWith(normalized);
};

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations('seller.sidebar');

  const groups: NavGroup[] = [
    {
      title: t("groups.core"),
      items: [
        { label: t("items.dashboard"), icon: DashboardIcon, href: "/seller/dashboard" },
        { label: t("items.orders"), icon: OrdersIcon, soon: true }
      ]
    },
    {
      title: t("groups.catalog"),
      items: [{ label: t("items.products"), icon: InventoryIcon, href: "/seller/products" }]
    },
    {
      title: t("groups.fulfillment"),
      items: [
        { label: t("items.shipping"), icon: ShipmentIcon, href: "/seller/shipping" },
        { label: t("items.payments"), icon: PaymentIcon, href: "/seller/payments" }
      ]
    },
    {
      title: t("groups.growth"),
      items: [
        { label: t("items.marketing"), icon: MarketingIcon, soon: true },
        { label: t("items.analytics"), icon: AnalyticsIcon, soon: true },
        { label: t("items.messages"), icon: MessagesIcon, soon: true },
        { label: t("items.settings"), icon: SettingsIcon, soon: true }
      ]
    }
  ];

  return (
    <aside className="surface-card p-4 lg:sticky lg:top-24 lg:h-fit">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0a3f82]">{t("title")}</p>
          <p className="mt-1 text-xs text-slate-500">{t("subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          className="mt-1 rounded-lg border border-[#d5e1f2] bg-[#f3f8ff] px-3 py-1.5 text-xs font-semibold text-[#0a3f82] lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="seller-sidebar-nav"
        >
          {mobileOpen ? t("close") : t("menu")}
        </button>
      </div>

      <div id="seller-sidebar-nav" className={mobileOpen ? "block" : "hidden lg:block"}>
        <nav className="space-y-4">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{group.title}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.href ? isActivePath(pathname, item.href) : false;

                  if (item.href) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={[
                          "flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
                          active ? "bg-[#0b4f9f] text-white" : "text-[#0a3f82] hover:bg-[#eaf2fd]"
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon />
                          <span>{item.label}</span>
                        </span>
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold text-slate-400"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Icon />
                        <span>{item.label}</span>
                      </span>
                      <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em]">
                        {t("comingSoon")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
