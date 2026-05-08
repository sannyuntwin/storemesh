"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { api } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";
import { useTranslations } from "next-intl";

export function CreateShipmentTool() {
  const { pushToast } = useToast();
  const t = useTranslations('seller.shipping.createShipment');
  const [orderId, setOrderId] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [trackingNo, setTrackingNo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const parsedOrderId = Number(orderId);
    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
      const message = t("errors.invalidOrderId");
      setErrorMessage(message);
      pushToast(message, "error");
      return;
    }

    if (recipientAddress.trim().length === 0) {
      const message = t("errors.addressRequired");
      setErrorMessage(message);
      pushToast(message, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const label = await api.createShippingLabel({
        orderId: String(parsedOrderId),
        recipientAddress: recipientAddress.trim(),
        trackingNo: trackingNo.trim() || undefined
      });

      const message = `${t("shipmentCreated")}${label.saleOrderId}${t("trackingInfo")}${label.trackingNo}).`;
      setSuccessMessage(message);
      pushToast(t("success"), "success");
      setTrackingNo("");
    } catch (error) {
      const message = getErrorMessage(error, t("errors.createError"));
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="surface-card p-4">
      <h2 className="text-lg font-bold text-slate-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-slate-600">
        {t("description")}
      </p>

      <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={handleSubmit}>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("orderId")}</span>
          <input
            required
            min={1}
            type="number"
            className="form-input"
            placeholder="1"
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("trackingNo")}</span>
          <input
            type="text"
            className="form-input"
            placeholder="TRK-2026-0001"
            value={trackingNo}
            onChange={(event) => setTrackingNo(event.target.value)}
          />
        </label>

        <label className="space-y-1 sm:col-span-3">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t("recipientAddress")}</span>
          <textarea
            required
            rows={3}
            className="form-input min-h-24 resize-y"
            placeholder="12 Lake Rd, Springfield"
            value={recipientAddress}
            onChange={(event) => setRecipientAddress(event.target.value)}
          />
        </label>

        <div className="sm:col-span-3">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? t("creating") : t("createLabel")}
          </Button>
        </div>
      </form>

      {successMessage ? <p className="mt-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
      {errorMessage ? <p className="mt-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
    </section>
  );
}
