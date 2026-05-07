import Link from "next/link";

const sections = [
  {
    title: "Customer Care",
    links: [
      { href: "/?category=all", label: "Help Center" },
      { href: "/?category=all", label: "Shipping Info" },
      { href: "/?category=all", label: "Returns & Refunds" },
      { href: "/?category=all", label: "Contact Support" }
    ]
  },
  {
    title: "Shop",
    links: [
      { href: "/?category=new", label: "New Arrivals" },
      { href: "/?category=electronics", label: "Electronics" },
      { href: "/?category=fashion", label: "Fashion" },
      { href: "/?category=home", label: "Home Living" }
    ]
  },
  {
    title: "Seller",
    links: [
      { href: "/seller/dashboard", label: "Seller Dashboard" },
      { href: "/seller/add-product", label: "Add Product" },
      { href: "/seller/dashboard", label: "Stock Management" },
      { href: "/seller/dashboard", label: "Shipment & Payments" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/?category=all", label: "Terms of Service" },
      { href: "/?category=all", label: "Privacy Policy" },
      { href: "/?category=all", label: "Cookie Policy" }
    ]
  }
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-[#dbe7f6] bg-[#eef4fb]">
      <div className="mx-auto w-full max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <article className="space-y-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b4f9f] text-xs font-black text-white">
                SM
              </span>
              <span className="text-lg font-black tracking-tight text-[#0a3f82]">Storemesh</span>
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Marketplace essentials for product listing, inventory control, and reliable order fulfillment.
            </p>
            <p className="text-xs font-semibold text-[#0a3f82]">Secure payments · Fast shipping · Seller tools</p>
          </article>

          {sections.map((section) => (
            <article key={section.title} className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{section.title}</p>
              <nav className="space-y-2">
                {section.links.map((link) => (
                  <Link key={link.label} href={link.href} className="block text-sm text-slate-600 transition hover:text-[#0a3f82]">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </article>
          ))}
        </div>

        <div className="mt-8 border-t border-[#d7e3f3] pt-4 text-xs text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© {year} Storemesh. All rights reserved.</p>
          <p>Built for modern ecommerce operations and seamless buyer-seller workflows.</p>
        </div>
      </div>
    </footer>
  );
}
