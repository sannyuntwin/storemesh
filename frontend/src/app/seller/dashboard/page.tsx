import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { api } from "@/services/api";

export default async function SellerDashboardPage() {
  const stats = await api.getSellerStats();
  const products = await api.getProducts();

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Seller Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Track performance and manage your catalog.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-slate-900">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-emerald-600">{stat.trend}</p>
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Products</h2>
            <Link href="/seller/add-product" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700">
              Add Product
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Product</th>
                  <th className="px-3 py-2 font-semibold">Category</th>
                  <th className="px-3 py-2 font-semibold">Stock</th>
                  <th className="px-3 py-2 font-semibold">Price</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-3 py-2 font-medium text-slate-900">{product.title}</td>
                    <td className="px-3 py-2 text-slate-600">{product.category}</td>
                    <td className="px-3 py-2 text-slate-600">{product.stock}</td>
                    <td className="px-3 py-2 text-slate-600">${product.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}
