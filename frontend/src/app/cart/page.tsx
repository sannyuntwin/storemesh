import { CartItem } from "@/components/CartItem";
import { EmptyState } from "@/components/EmptyState";
import { api } from "@/services/api";

export default async function CartPage() {
  const cart = await api.getCart();

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4">
        <h1 className="text-2xl font-black text-slate-900">Your Cart</h1>

        {cart.items.length === 0 ? (
          <EmptyState title="Your cart is empty" description="Add products from the shop to get started." />
        ) : (
          cart.items.map((item) => <CartItem key={item.product.id} item={item} />)
        )}
      </section>

      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>${cart.summary.subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>${cart.summary.shipping.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Tax</dt>
            <dd>${cart.summary.tax.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
            <dt>Total</dt>
            <dd>${cart.summary.total.toFixed(2)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
