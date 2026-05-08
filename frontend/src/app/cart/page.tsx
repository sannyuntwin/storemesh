import type { Metadata } from "next";
import { ErrorState } from "@/components/ErrorState";
import { CartPageClient } from "@/components/CartPageClient";
import { api } from "@/services/api";
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Your Cart"
};

export default async function CartPage() {
  const t = await getTranslations('cart');
  
  try {
    const cart = await api.getCartWithMeta();
    return <CartPageClient initialItems={cart.data.items} usedFallback={cart.usedFallback} />;
  } catch {
    return <ErrorState 
      title={t("loadErrorTitle")} 
      description={t("loadErrorDescription")} 
      actionLabel={t("loadErrorAction")} 
      actionHref="/" 
    />;
  }
}
