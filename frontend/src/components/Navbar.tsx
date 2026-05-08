"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useCart } from "@/hooks/useCart";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { LanguageToggleButton } from "@/components/LanguageToggle";

const isActivePath = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

interface NavbarProps {
  demoModeEnabled?: boolean;
}

export function Navbar({ demoModeEnabled = false }: NavbarProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { itemCount } = useCart();
  const { data: session } = useSession();
  const user = session?.user;
  const exitDemoTarget = pathname.startsWith("/seller") ? "/seller/dashboard" : pathname || "/";
  const links = [
    { href: "/", label: t("navigation.shop") },
    { href: "/cart", label: t("navigation.cart") },
    { href: "/seller/dashboard", label: t("navigation.seller") }
  ];
  const categories = [
    { href: "/?category=all", label: t("product.categories.all") },
    { href: "/?category=new", label: t("product.categories.new") },
    { href: "/?category=electronics", label: t("product.categories.electronics") },
    { href: "/?category=fashion", label: t("product.categories.fashion") },
    { href: "/?category=home", label: t("product.categories.home") }
  ];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = search.trim();
    if (!normalized) {
      router.push("/");
      return;
    }

    router.push(`/?q=${encodeURIComponent(normalized)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/90 bg-white/95 backdrop-blur-xl">
      <div className="bg-[#0b4f9f] px-4 py-2 text-center text-xs font-semibold tracking-[0.06em] text-white sm:px-6 lg:px-8">
        {t("navbar.announcement")}
      </div>
      {demoModeEnabled ? (
        <div className="bg-amber-100 px-4 py-2 text-center text-xs font-semibold tracking-[0.04em] text-amber-900 sm:px-6 lg:px-8">
          Front-end Developer Test Demo: interface showcase with mock data (HTML/CSS/JavaScript implementation).
          <a href={`/live?next=${encodeURIComponent(exitDemoTarget)}`} className="ml-2 underline decoration-amber-700/70 underline-offset-2">
            Exit Demo Mode
          </a>
        </div>
      ) : null}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b4f9f] text-xs font-black text-white">
            SM
          </span>
          <span className="text-lg font-black tracking-tight text-[#0a3f82]">Storemesh</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="hidden max-w-xl flex-1 md:block">
          <div className="flex items-center rounded-xl border border-blue-100 bg-white px-3">
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-slate-400" aria-hidden>
              <path
                fill="currentColor"
                d="M8.5 2a6.5 6.5 0 1 1 4.06 11.57l3.44 3.43-1.06 1.06-3.43-3.44A6.5 6.5 0 0 1 8.5 2Zm0 1.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("search.placeholder")}
              className="h-10 w-full border-0 bg-transparent px-2 text-sm text-slate-700 outline-none"
            />
            <button type="submit" className="rounded-lg bg-[#0b4f9f] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0e62c4]">
              {t("search.button")}
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-white px-2 py-1.5 sm:flex">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? t("common.userAvatar")}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#0a3f82]">
                  {(user.name ?? "U").slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="max-w-36">
                <p className="truncate text-xs font-semibold text-[#0a3f82]">{user.name ?? t("common.signedIn")}</p>
                <p className="truncate text-[11px] text-slate-500">{user.email ?? ""}</p>
              </div>
            </div>
          ) : null}

          <Link
            href="/cart"
            className="relative inline-flex h-10 items-center justify-center rounded-xl border border-blue-100 bg-white px-3 text-[#0a3f82] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#f3f8ff] hover:shadow"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                fill="currentColor"
                d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 17 18ZM6.2 6l.23 2H20a1 1 0 0 1 .98 1.2l-1.2 6a1 1 0 0 1-.98.8H8a1 1 0 0 1-.98-.8L5.1 4H3V2h2.9a1 1 0 0 1 .98.8L7.2 4H22v2H6.2Z"
              />
            </svg>
            {itemCount > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#0b4f9f] px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>

          <Link
            href="/seller/dashboard"
            className="hidden text-xs font-semibold text-slate-500 transition hover:text-[#0a3f82] lg:inline-flex"
          >
            {t("navigation.sellerPortal")}
          </Link>

          <ThemeToggleButton />
          <LanguageToggleButton />

          {user ? (
            <LogoutButton className="hidden md:inline-flex" />
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl bg-[#0b4f9f] px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0e62c4] md:inline-flex"
            >
              {t("navigation.signIn")}
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-[#0a3f82] shadow-sm transition hover:border-blue-200 md:hidden"
          >
            {t("common.menu")}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-blue-100 bg-white/95 md:block">
        <div className="mx-auto flex h-11 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-[#eaf2fd] hover:text-[#0a3f82]"
            >
              {category.label}
            </Link>
          ))}
        </div>
      </nav>

      {isMenuOpen ? (
        <nav className="border-t border-blue-100 bg-white px-4 py-3 shadow-sm md:hidden">
          <div className="space-y-2">
            {user ? (
              <div className="mb-2 rounded-xl border border-blue-100 bg-[#f3f8ff] p-3">
                <p className="text-sm font-semibold text-[#0a3f82]">{user.name ?? t("common.signedInUser")}</p>
                <p className="text-xs text-slate-600">{user.email ?? ""}</p>
              </div>
            ) : null}

            {links.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    "block rounded-lg px-3 py-2 text-sm font-semibold transition-all",
                    active ? "bg-[#0b4f9f] text-white" : "text-[#0a3f82] hover:bg-[#eaf2fd]"
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="rounded-xl border border-blue-100 bg-[#f3f8ff] p-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0a3f82]">{t("navbar.browseCategories")}</p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="rounded-lg bg-white px-2 py-1.5 text-xs font-semibold text-[#0a3f82] hover:bg-[#eaf2fd]"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>

            {user ? (
              <LogoutButton className="w-full" />
            ) : (
              <Link
                href="/login"
                className="block rounded-lg bg-[#0b4f9f] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0e62c4]"
              >
                {t("navigation.signIn")}
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
