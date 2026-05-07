"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartLine, Product } from "@/types";
import { calculateCartSummary } from "@/services/api";

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  hydrateFromServer: (lines: CartLine[]) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CART_STORAGE_KEY = "storemesh_cart";

const CartContext = createContext<CartContextValue | null>(null);

const normalizeCartLines = (value: unknown): CartLine[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((line) => {
      if (typeof line !== "object" || line === null) {
        return null;
      }

      const candidate = line as {
        quantity?: unknown;
        product?: Record<string, unknown>;
      };

      if (!candidate.product || typeof candidate.product !== "object") {
        return null;
      }

      const raw = candidate.product;
      const id = String(raw.id ?? "").trim();
      const title = String(raw.title ?? "").trim();
      const description = String(raw.description ?? "").trim();
      const image = String(raw.image ?? "").trim();

      if (!id || !title || !description || !image) {
        return null;
      }

      const parsedUnitPrice = Number(raw.unitPrice ?? raw.price ?? 0);
      const parsedQuantity = Number(raw.quantity ?? raw.stock ?? 0);
      const lineQuantity = Number(candidate.quantity ?? 1);

      const product: Product = {
        id,
        sellerId: raw.sellerId !== undefined && raw.sellerId !== null ? String(raw.sellerId) : undefined,
        createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
        unitPrice: Number.isFinite(parsedUnitPrice) ? parsedUnitPrice : 0,
        quantity: Number.isInteger(parsedQuantity) ? parsedQuantity : 0,
        image,
        title,
        description
      };

      return {
        product,
        quantity: Number.isInteger(lineQuantity) && lineQuantity > 0 ? lineQuantity : 1
      } as CartLine;
    })
    .filter((line): line is CartLine => line !== null);
};

const readStorage = (): CartLine[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as unknown;
    return normalizeCartLines(parsed);
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedItems = readStorage();
    setItems(storedItems);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [isHydrated, items]);

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((current) => {
      const existingLine = current.find((line) => line.product.id === product.id);

      if (!existingLine) {
        return [...current, { product, quantity }];
      }

      return current.map((line) =>
        line.product.id === product.id
          ? {
              ...line,
              quantity: line.quantity + quantity
            }
          : line
      );
    });
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((line) => line.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((line) =>
        line.product.id === productId
          ? {
              ...line,
              quantity
            }
          : line
      )
    );
  };

  const clearCart = () => setItems([]);

  const getProductQuantity = (productId: string): number => {
    return items.find((line) => line.product.id === productId)?.quantity ?? 0;
  };

  const hydrateFromServer = (lines: CartLine[]) => {
    setItems((current) => {
      if (current.length > 0) {
        return current;
      }

      return normalizeCartLines(lines);
    });
  };

  const value = {
    items,
    itemCount: items.reduce((count, line) => count + line.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    getProductQuantity,
    hydrateFromServer,
    clearCart,
    isHydrated
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  const summary = calculateCartSummary(context.items);

  return {
    ...context,
    summary
  };
};
