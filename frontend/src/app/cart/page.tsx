import type { Metadata } from "next";
import { ErrorState } from "@/components/ErrorState";
import { CartPageClient } from "@/components/CartPageClient";
import { api } from "@/services/api";

export const metadata: Metadata = {
  title: "Your Cart"
};

export default async function CartPage() {
  try {
    const cart = await api.getCartWithMeta();
    return <CartPageClient initialItems={cart.data.items} usedFallback={cart.usedFallback} />;
  } catch {
    return <ErrorState title="Unable to load cart" description="Please refresh and try again." actionLabel="Back to shop" actionHref="/" />;
  }
}
