import { Product } from "@/types";

const now = new Date().toISOString();

export const products: Product[] = [
  {
    id: "101",
    sellerId: "1",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    title: "Arc Wireless Headphones",
    description: "Noise-canceling over-ear headphones with 40-hour battery life.",
    unitPrice: 229,
    quantity: 14,
    createdAt: now
  },
  {
    id: "102",
    sellerId: "1",
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80",
    title: "Monolith Mechanical Keyboard",
    description: "Compact 75% keyboard with tactile switches and hot-swap support.",
    unitPrice: 149,
    quantity: 36,
    createdAt: now
  },
  {
    id: "103",
    sellerId: "1",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80",
    title: "Lumen Smart Desk Lamp",
    description: "Adjustable LED lamp with wireless charging base and scene presets.",
    unitPrice: 89,
    quantity: 27,
    createdAt: now
  },
  {
    id: "104",
    sellerId: "1",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    title: "Nomad Sling Bag",
    description: "Water-resistant daily sling with modular pockets and hidden sleeve.",
    unitPrice: 79,
    quantity: 42,
    createdAt: now
  },
  {
    id: "105",
    sellerId: "1",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    title: "AeroFit Running Shoes",
    description: "Lightweight trainers with breathable mesh and responsive cushioning.",
    unitPrice: 139,
    quantity: 21,
    createdAt: now
  },
  {
    id: "106",
    sellerId: "1",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30e?auto=format&fit=crop&w=1200&q=80",
    title: "Pulse Smartwatch",
    description: "AMOLED smartwatch with health tracking and 7-day battery life.",
    unitPrice: 199,
    quantity: 18,
    createdAt: now
  }
];
