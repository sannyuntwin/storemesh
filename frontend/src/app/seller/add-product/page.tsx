import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/Button";

export default function AddProductPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <Sidebar />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-black text-slate-900">Add Product</h1>
        <p className="mt-1 text-sm text-slate-600">Create a new product listing for your store catalog.</p>

        <form className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Product Name</span>
            <input
              type="text"
              placeholder="Enter product name"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <input
              type="text"
              placeholder="Audio, Lifestyle..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Price</span>
            <input
              type="number"
              placeholder="0.00"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-slate-700">Stock</span>
            <input
              type="number"
              placeholder="0"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Image URL</span>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Description</span>
            <textarea
              placeholder="Describe your product"
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-200 focus:ring"
            />
          </label>

          <div className="sm:col-span-2">
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
