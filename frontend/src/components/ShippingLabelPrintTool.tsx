"use client";

import { FormEvent, useMemo, useState } from "react";

const normalizeApiBase = (rawBase: string | undefined) => {
  if (!rawBase) {
    return "";
  }

  return rawBase.replace(/\/+$/, "");
};

export function ShippingLabelPrintTool() {
  const [orderId, setOrderId] = useState("");
  const apiBase = useMemo(() => normalizeApiBase(process.env.NEXT_PUBLIC_API_URL), []);
  const isEnabled = apiBase.length > 0;

  const handlePrint = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedOrderId = orderId.trim();
    if (!trimmedOrderId || !isEnabled) {
      return;
    }

    const printUrl = `${apiBase}/api/orders/${encodeURIComponent(trimmedOrderId)}/shipping-label/print`;
    window.open(printUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="surface-card p-4">
      <h2 className="text-lg font-bold text-slate-900">Shipping Label Print</h2>
      <p className="mt-1 text-sm text-slate-600">
        Enter an order ID that already has a shipping label, then open a print-ready label page.
      </p>

      <form onSubmit={handlePrint} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="number"
          min={1}
          required
          value={orderId}
          onChange={(event) => setOrderId(event.target.value)}
          placeholder="Order ID (e.g. 1)"
          className="form-input sm:max-w-xs"
        />
        <button
          type="submit"
          disabled={!isEnabled}
          className="rounded-xl bg-[#0b4f9f] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0e62c4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Open Printable Label
        </button>
      </form>

      {!isEnabled ? (
        <p className="mt-2 text-xs text-rose-700">
          `NEXT_PUBLIC_API_URL` is not configured, so printing cannot be opened.
        </p>
      ) : null}
    </section>
  );
}
