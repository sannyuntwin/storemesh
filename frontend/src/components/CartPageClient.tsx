"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { EmptyState } from "@/components/EmptyState";
import { mockSession } from "@/config/session";
import { useCart } from "@/hooks/useCart";
import { CartLine } from "@/types";
import { api } from "@/services/api";
import { Button } from "@/components/Button";
import { getErrorMessage } from "@/utils/errorMessage";
import { useToast } from "@/components/ToastProvider";

interface CartPageClientProps {
  initialItems: CartLine[];
  usedFallback?: boolean;
}

export function CartPageClient({ initialItems, usedFallback = false }: CartPageClientProps) {
  const { items, updateQuantity, removeItem, hydrateFromServer, summary, isHydrated, clearCart } = useCart();
  const { pushToast } = useToast();
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccessMessage, setOrderSuccessMessage] = useState("");
  const [orderErrorMessage, setOrderErrorMessage] = useState("");

  useEffect(() => {
    if (isHydrated) {
      hydrateFromServer(initialItems);
    }
  }, [isHydrated, hydrateFromServer, initialItems]);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      return;
    }

    setOrderSuccessMessage("");
    setOrderErrorMessage("");
    setIsSubmittingOrder(true);

    try {
      const orderPayload = {
        buyerId: mockSession.buyerId,
        totalAmount: summary.total,
        items: items.map((line) => ({
          productId: line.product.id,
          quantity: line.quantity
        }))
      };

      const order = await api.createOrder(orderPayload);
      clearCart();
      setOrderSuccessMessage(`Order #${order.id} submitted successfully.`);
      pushToast(`Order #${order.id} submitted.`, "success");
    } catch (error) {
      const message = getErrorMessage(error, "Could not submit your order. Please try again.");
      setOrderErrorMessage(message);
      pushToast(message, "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900 md:text-3xl">Your Cart</h1>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
            Secure checkout
          </span>
          <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
            Fast dispatch
          </span>
          <span className="rounded-full border border-[#d9e4f3] bg-[#f3f8ff] px-3 py-1 font-semibold text-[#0a3f82]">
            Live stock validation
          </span>
        </div>
        {usedFallback ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Cart data is currently running in fallback mode.
          </section>
        ) : null}

        {orderSuccessMessage ? <p className="text-sm font-medium text-emerald-700">{orderSuccessMessage}</p> : null}
        {orderErrorMessage ? <p className="text-sm font-medium text-rose-700">{orderErrorMessage}</p> : null}

        {items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Looks like you have not added anything yet. Discover products and add your first item."
            actionLabel="Browse products"
            actionHref="/"
            emoji="🧺"
          />
        ) : (
          items.map((item) => (
            <CartItem
              key={item.product.id}
              item={item}
              onIncrease={() => updateQuantity(item.product.id, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.product.id, item.quantity - 1)}
              onRemove={() => removeItem(item.product.id)}
            />
          ))
        )}
      </section>

      <div className="space-y-3">
        <CartSummary summary={summary} />
        <Button className="w-full" onClick={handlePlaceOrder} loading={isSubmittingOrder} disabled={items.length === 0}>
          {isSubmittingOrder ? "Placing order..." : "Place order"}
        </Button>
        <p className="text-center text-xs text-slate-500">By placing an order, you agree to our shipping and return policy.</p>
      </div>
    </div>
  );
}
