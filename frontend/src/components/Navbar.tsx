"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useCart } from "@/hooks/useCart";

const links = [
  { href: "/", label: "Shop" },
  { href: "/cart", label: "Cart" },
  { href: "/seller/dashboard", label: "Seller" }
];

const isActivePath = (pathname: string, href: string): boolean => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-blue-100/90 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b4f9f] text-xs font-black text-white">
            SM
          </span>
          <span className="text-lg font-black tracking-tight text-[#0a3f82]">Storemesh</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                  active
                    ? "bg-[#0b4f9f] text-white shadow-sm"
                    : "text-slate-600 hover:bg-[#eaf2fd] hover:text-[#0a3f82]"
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-white px-2 py-1.5 sm:flex">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User avatar"}
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
                <p className="truncate text-xs font-semibold text-[#0a3f82]">{user.name ?? "Signed in"}</p>
                <p className="truncate text-[11px] text-slate-500">{user.email ?? ""}</p>
              </div>
            </div>
          ) : null}

          <Link
            href="/cart"
            className="hidden rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-[#0a3f82] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-[#f3f8ff] hover:shadow md:inline-flex"
          >
            Cart {itemCount > 0 ? `(${itemCount})` : ""}
          </Link>

          {user ? (
            <LogoutButton className="hidden md:inline-flex" />
          ) : (
            <Link
              href="/login"
              className="hidden rounded-xl bg-[#0b4f9f] px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0e62c4] md:inline-flex"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-[#0a3f82] shadow-sm transition hover:border-blue-200 md:hidden"
          >
            Menu
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav className="border-t border-blue-100 bg-white px-4 py-3 shadow-sm md:hidden">
          <div className="space-y-2">
            {user ? (
              <div className="mb-2 rounded-xl border border-blue-100 bg-[#f3f8ff] p-3">
                <p className="text-sm font-semibold text-[#0a3f82]">{user.name ?? "Signed in user"}</p>
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

            {user ? (
              <LogoutButton className="w-full" />
            ) : (
              <Link
                href="/login"
                className="block rounded-lg bg-[#0b4f9f] px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-[#0e62c4]"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
