"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, Product } from "@/types";
import { calculateCartSummary } from "@/services/api";
import { DEMO_MODE_COOKIE_NAME, DEMO_MODE_COOKIE_VALUE } from "@/services/fetcher";

interface CartContextValue {
  items: CartLine[];
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  hydrateFromServer: (lines: CartLine[], options?: { forceReplace?: boolean }) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CART_STORAGE_KEY_LIVE = "storemesh_cart_live";
const CART_STORAGE_KEY_DEMO = "storemesh_cart_demo";

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

const readCookieValue = (cookieString: string, name: string): string | null => {
  const prefix = `${name}=`;
  const parts = cookieString.split(";").map((part) => part.trim());
  const cookie = parts.find((part) => part.startsWith(prefix));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(prefix.length));
};

const getStorageKeyFromMode = (): string => {
  if (typeof window === "undefined") {
    return CART_STORAGE_KEY_LIVE;
  }

  const cookieValue = readCookieValue(document.cookie, DEMO_MODE_COOKIE_NAME);
  return cookieValue === DEMO_MODE_COOKIE_VALUE ? CART_STORAGE_KEY_DEMO : CART_STORAGE_KEY_LIVE;
};

const readStorage = (storageKey: string): CartLine[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
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
  const pathname = usePathname();
  const [items, setItems] = useState<CartLine[]>([]);
  const [activeStorageKey, setActiveStorageKey] = useState(CART_STORAGE_KEY_LIVE);
  const [isHydrated, setIsHydrated] = useState(false);

  const syncStorageMode = useCallback((forceReload: boolean = false) => {
    const nextStorageKey = getStorageKeyFromMode();

    setActiveStorageKey((currentStorageKey) => {
      const storageModeChanged = currentStorageKey !== nextStorageKey;
      const switchingFromDemoToLive = currentStorageKey === CART_STORAGE_KEY_DEMO && nextStorageKey === CART_STORAGE_KEY_LIVE;

      if (storageModeChanged || forceReload) {
        if (switchingFromDemoToLive) {
          // Clear cart when switching from demo to live mode
          setItems([]);
        } else {
          setItems(readStorage(nextStorageKey));
        }
      }

      return nextStorageKey;
    });
  }, []);

  useEffect(() => {
    syncStorageMode(true);
    setIsHydrated(true);
  }, [syncStorageMode]);

  useEffect(() => {
    syncStorageMode(false);
  }, [pathname, syncStorageMode]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(activeStorageKey, JSON.stringify(items));
  }, [activeStorageKey, isHydrated, items]);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
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
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((line) => line.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
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
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const getProductQuantity = useCallback((productId: string): number => {
    return items.find((line) => line.product.id === productId)?.quantity ?? 0;
  }, [items]);

  const hydrateFromServer = useCallback((lines: CartLine[], options?: { forceReplace?: boolean }) => {
    setItems((current) => {
      if (!options?.forceReplace && current.length > 0) {
        return current;
      }

      return normalizeCartLines(lines);
    });
  }, []);

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((count, line) => count + line.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    getProductQuantity,
    hydrateFromServer,
    clearCart,
    isHydrated
  }), [items, addItem, removeItem, updateQuantity, getProductQuantity, hydrateFromServer, clearCart, isHydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  const summary = useMemo(() => calculateCartSummary(context.items), [context.items]);

  return {
    ...context,
    summary
  };
};
