import { products } from "@/data/products";
import { CartLine, CartSummary, Product, SellerStat } from "@/types";

const API_LATENCY_MS = 550;

const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const calculateCartSummary = (items: CartLine[]): CartSummary => {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 12 : 0;
  const tax = subtotal * 0.08;

  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax
  };
};

export const api = {
  async getProducts(): Promise<Product[]> {
    await wait(API_LATENCY_MS);
    return products;
  },

  async getProductById(id: string): Promise<Product | null> {
    await wait(API_LATENCY_MS / 2);
    return products.find((product) => product.id === id) ?? null;
  },

  async getCart(): Promise<{ items: CartLine[]; summary: CartSummary }> {
    await wait(API_LATENCY_MS);

    const items: CartLine[] = [
      { product: products[0], quantity: 1 },
      { product: products[2], quantity: 2 }
    ];

    return {
      items,
      summary: calculateCartSummary(items)
    };
  },

  async getSellerStats(): Promise<SellerStat[]> {
    await wait(API_LATENCY_MS / 2);

    return [
      { label: "Revenue", value: "$42,350", trend: "+12.4%" },
      { label: "Orders", value: "1,084", trend: "+8.7%" },
      { label: "Conversion", value: "3.9%", trend: "+0.6%" }
    ];
  }
};

// Future API wiring point for real backend integration.
export const endpoints = {
  products: "/api/products",
  cart: "/api/cart",
  sellerStats: "/api/seller/stats"
};
