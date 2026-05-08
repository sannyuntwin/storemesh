import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations();
  const year = new Date().getFullYear();
  const sections = [
    {
      title: t("footer.sections.customerCare"),
      links: [
        { href: "/?category=all", label: t("footer.links.helpCenter") },
        { href: "/?category=all", label: t("footer.links.shippingInfo") },
        { href: "/?category=all", label: t("footer.links.returnsAndRefunds") },
        { href: "/?category=all", label: t("footer.links.contactSupport") }
      ]
    },
    {
      title: t("footer.sections.shop"),
      links: [
        { href: "/?category=new", label: t("product.categories.new") },
        { href: "/?category=electronics", label: t("product.categories.electronics") },
        { href: "/?category=fashion", label: t("product.categories.fashion") },
        { href: "/?category=home", label: t("product.categories.home") }
      ]
    },
    {
      title: t("footer.sections.seller"),
      links: [
        { href: "/seller/dashboard", label: t("footer.links.sellerDashboard") },
        { href: "/seller/add-product", label: t("seller.products.addProduct") },
        { href: "/seller/dashboard", label: t("footer.links.stockManagement") },
        { href: "/seller/dashboard", label: t("footer.links.shipmentAndPayments") }
      ]
    },
    {
      title: t("footer.sections.legal"),
      links: [
        { href: "/?category=all", label: t("footer.links.termsOfService") },
        { href: "/?category=all", label: t("footer.links.privacyPolicy") },
        { href: "/?category=all", label: t("footer.links.cookiePolicy") }
      ]
    }
  ];

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
              {t("footer.description")}
            </p>
            <p className="text-xs font-semibold text-[#0a3f82]">{t("footer.tagline")}</p>
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
          <p>{t("footer.copyright", { year })}</p>
          <p>{t("footer.builtFor")}</p>
        </div>
      </div>
    </footer>
  );
}
