"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { api } from "@/services/api";
import { Product } from "@/types";
import { formatThaiBaht } from "@/utils/formatCurrency";
import { getErrorMessage } from "@/utils/errorMessage";
import { useTranslations } from "next-intl";

interface SellerProductsStockTableProps {
  products: Product[];
}

type FilterMode = "all" | "low" | "out";
type SortMode = "quantity_desc" | "quantity_asc" | "price_desc" | "price_asc" | "title_asc";

export function SellerProductsStockTable({ products }: SellerProductsStockTableProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const t = useTranslations('seller.stockTable');
  const [rows, setRows] = useState<Product[]>(products);
  const [stockInputs, setStockInputs] = useState<Record<string, string>>({});
  const [busyProductId, setBusyProductId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [sortMode, setSortMode] = useState<SortMode>("quantity_desc");
  const [query, setQuery] = useState("");

  const resolveStockStatus = (quantity: number) => {
    if (quantity <= 0) {
      return { label: t("status.outOfStock"), className: "bg-rose-100 text-rose-700" };
    }

    if (quantity < 10) {
      return { label: t("status.lowStock"), className: "bg-amber-100 text-amber-700" };
    }

    return { label: t("status.healthy"), className: "bg-emerald-100 text-emerald-700" };
  };

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const base =
      filterMode === "all"
        ? rows
        : rows.filter((row) => {
            if (filterMode === "out") return row.quantity <= 0;
            return row.quantity > 0 && row.quantity < 10;
          });

    const searched =
      normalizedQuery.length === 0
        ? base
        : base.filter((row) => `${row.title} ${row.description}`.toLowerCase().includes(normalizedQuery));

    return [...searched].sort((a, b) => {
      if (sortMode === "quantity_asc") return a.quantity - b.quantity;
      if (sortMode === "quantity_desc") return b.quantity - a.quantity;
      if (sortMode === "price_asc") return a.unitPrice - b.unitPrice;
      if (sortMode === "price_desc") return b.unitPrice - a.unitPrice;
      return a.title.localeCompare(b.title);
    });
  }, [filterMode, query, rows, sortMode]);

  const lowStockCount = rows.filter((row) => row.quantity > 0 && row.quantity < 10).length;
  const outOfStockCount = rows.filter((row) => row.quantity <= 0).length;

  const updateInput = (productId: string, value: string) => {
    setStockInputs((current) => ({
      ...current,
      [productId]: value
    }));
  };

  const handleAddStock = async (productId: string, fallbackQuantity?: number) => {
    const raw = fallbackQuantity !== undefined ? String(fallbackQuantity) : stockInputs[productId] ?? "";
    const quantityAdded = Number(raw);

    if (!Number.isInteger(quantityAdded) || quantityAdded <= 0) {
      pushToast(t("invalidQuantity"), "error");
      return;
    }

    setBusyProductId(productId);

    try {
      const updatedProduct = await api.addStock(productId, quantityAdded);
      setRows((current) => current.map((item) => (item.id === productId ? updatedProduct : item)));
      setStockInputs((current) => ({ ...current, [productId]: "" }));
      pushToast(`${t("stockUpdated")} "${updatedProduct.title}".`, "success");
      router.refresh();
    } catch (error) {
      const message = getErrorMessage(error, t("updateError"));
      pushToast(message, "error");
    } finally {
      setBusyProductId(null);
    }
  };

  return (
    <section className="surface-card p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t("title")}</h2>
          <p className="text-xs text-slate-500">
            {rows.length} รวม · {lowStockCount} สต็อกเหลือน้อย · {outOfStockCount} สต็อกหมด
          </p>
        </div>
        <Link
          href="/seller/add-product"
          className="rounded-xl bg-[#0b4f9f] px-3 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0e62c4]"
        >
          {t("addProduct")}
        </Link>
      </div>

      <div className="mb-4 grid gap-2 lg:grid-cols-[1fr_auto_auto]">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="form-input"
          placeholder={t("searchPlaceholder")}
        />

        <select
          value={filterMode}
          onChange={(event) => setFilterMode(event.target.value as FilterMode)}
          className="form-input min-w-[180px]"
        >
          <option value="all">{t("filters.all")}</option>
          <option value="low">{t("filters.low")}</option>
          <option value="out">{t("filters.out")}</option>
        </select>

        <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="form-input min-w-[180px]">
          <option value="quantity_desc">{t("sort.quantityDesc")}</option>
          <option value="quantity_asc">{t("sort.quantityAsc")}</option>
          <option value="price_desc">{t("sort.priceDesc")}</option>
          <option value="price_asc">{t("sort.priceAsc")}</option>
          <option value="title_asc">{t("sort.titleAsc")}</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-3 py-3 font-semibold">{t("table.product")}</th>
              <th className="px-3 py-3 font-semibold">{t("table.status")}</th>
              <th className="px-3 py-3 font-semibold">{t("table.quantity")}</th>
              <th className="px-3 py-3 font-semibold">{t("table.price")}</th>
              <th className="px-3 py-3 font-semibold">{t("table.addStock")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-sm text-slate-500">
                  {t("noProducts")}
                </td>
              </tr>
            ) : (
              filteredRows.map((product) => {
                const isBusy = busyProductId === product.id;
                const status = resolveStockStatus(product.quantity);

                return (
                  <tr key={product.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-3 font-medium text-slate-900">{product.title}</td>
                    <td className="px-3 py-3">
                      <span className={["rounded-full px-2 py-1 text-xs font-semibold", status.className].join(" ")}>{status.label}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-600">{product.quantity}</td>
                    <td className="px-3 py-3 text-slate-600">{formatThaiBaht(product.unitPrice)}</td>
                    <td className="px-3 py-3">
                      <div className="flex min-w-[260px] items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          inputMode="numeric"
                          className="form-input h-10"
                          placeholder={t("table.qtyPlaceholder")}
                          value={stockInputs[product.id] ?? ""}
                          onChange={(event) => updateInput(product.id, event.target.value)}
                          disabled={isBusy}
                        />
                        <Button
                          type="button"
                          size="sm"
                          loading={isBusy}
                          onClick={() => handleAddStock(product.id)}
                          disabled={isBusy}
                        >
                          {t("table.add")}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddStock(product.id, 5)}
                          disabled={isBusy}
                        >
                          {t("table.addFive")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
