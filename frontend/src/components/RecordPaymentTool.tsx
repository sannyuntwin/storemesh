"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { api } from "@/services/api";
import { getErrorMessage } from "@/utils/errorMessage";

const paymentMethods = [
  "CREDIT_CARD",
  "DEBIT_CARD",
  "BANK_TRANSFER",
  "CASH_ON_DELIVERY",
  "EWALLET"
] as const;

export function RecordPaymentTool() {
  const { pushToast } = useToast();
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof paymentMethods)[number]>("CREDIT_CARD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    const parsedOrderId = Number(orderId);
    const parsedAmount = Number(amount);

    if (!Number.isInteger(parsedOrderId) || parsedOrderId <= 0) {
      const message = "Order ID must be a positive integer.";
      setErrorMessage(message);
      pushToast(message, "error");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      const message = "Amount must be greater than zero.";
      setErrorMessage(message);
      pushToast(message, "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const payment = await api.createPayment({
        saleOrderId: String(parsedOrderId),
        amount: parsedAmount,
        paymentMethod
      });

      const message = `Payment recorded for order #${payment.saleOrderId}.`;
      setSuccessMessage(message);
      pushToast(message, "success");
      setAmount("");
    } catch (error) {
      const message = getErrorMessage(error, "Could not record payment. Please try again.");
      setErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="surface-card p-4">
      <h2 className="text-lg font-bold text-slate-900">Record Payment</h2>
      <p className="mt-1 text-sm text-slate-600">
        Record payment received from a buyer for a specific sale order.
      </p>

      <form className="mt-4 grid gap-3 sm:grid-cols-3" onSubmit={handleSubmit}>
        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Order ID</span>
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
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Amount</span>
          <input
            required
            min={0.01}
            step="0.01"
            type="number"
            className="form-input"
            placeholder="100.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Payment Method</span>
          <select
            className="form-input"
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as (typeof paymentMethods)[number])}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-3">
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? "Recording..." : "Record Payment"}
          </Button>
        </div>
      </form>

      {successMessage ? <p className="mt-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
      {errorMessage ? <p className="mt-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
    </section>
  );
}
