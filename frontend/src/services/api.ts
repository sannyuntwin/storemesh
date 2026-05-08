import { products as mockProducts } from "@/data/products";
import {
  CartLine,
  CartPayload,
  CartSummary,
  CreateOrderInput,
  Order,
  Product,
  ProductInput,
  SellerStat
} from "@/types";
import {
  ApiRequestError,
  fetchJson,
  isDemoModeEnabled,
  shouldUseRemoteApi,
  DEFAULT_TIMEOUT_MS
} from "@/services/fetcher";

const API_LATENCY_MS = 0;

type ApiEnvelope<T> = {
  success: boolean;
  data: T;
};

export type ApiResult<T> = {
  data: T;
  usedFallback: boolean;
};

type BackendProduct = {
  id: number | string;
  sellerId?: number | string | null;
  image: string;
  title: string;
  description: string;
  unitPrice?: number;
  quantity?: number;
  createdAt?: string | Date;
  price?: number;
  stock?: number;
};

type BackendOrder = {
  id: number;
  buyerId: number;
  status: string;
  totalAmount: number;
  createdAt?: string;
  items: Array<{
    id: number;
    saleOrderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
};

export const endpoints = {
  products: "/products",
  productById: (id: string) => `/products/${id}`,
  productStock: (id: string) => `/products/${id}/stock`,
  orders: "/orders",
  orderShippingLabel: (id: string) => `/orders/${id}/shipping-label`,
  payments: "/payments",
  cart: "/cart",
  sellerStats: "/seller/stats",
  uploadProductImage: "/uploads/product-image"
};

const wait = async (ms: number): Promise<void> => {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, ms));
};

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

const toProduct = (raw: BackendProduct): Product => {
  const unitPrice = Number(raw.unitPrice ?? raw.price ?? 0);
  const quantity = Number(raw.quantity ?? raw.stock ?? 0);

  return {
    id: String(raw.id),
    sellerId: raw.sellerId !== undefined && raw.sellerId !== null ? String(raw.sellerId) : undefined,
    image: raw.image,
    title: raw.title,
    description: raw.description,
    unitPrice,
    quantity,
    createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : undefined
  };
};

const toOrder = (raw: BackendOrder): Order => ({
  id: String(raw.id),
  buyerId: String(raw.buyerId),
  status: raw.status,
  totalAmount: Number(raw.totalAmount),
  createdAt: raw.createdAt,
  items: raw.items.map((item) => ({
    id: String(item.id),
    saleOrderId: String(item.saleOrderId),
    productId: String(item.productId),
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal)
  }))
});

export const calculateCartSummary = (items: CartLine[]): CartSummary => {
  const subtotal = items.reduce((total, item) => total + item.product.unitPrice * item.quantity, 0);
  const shipping = subtotal > 0 ? 12 : 0;
  const tax = subtotal * 0.08;

  return {
    subtotal: roundMoney(subtotal),
    shipping: roundMoney(shipping),
    tax: roundMoney(tax),
    total: roundMoney(subtotal + shipping + tax)
  };
};

let localProducts: Product[] = [...mockProducts];

const fallbackCartItems: CartLine[] = [
  { product: mockProducts[0], quantity: 1 },
  { product: mockProducts[2], quantity: 1 }
];

const useMockData = async <T>(task: () => Promise<T>): Promise<T> => {
  await wait(API_LATENCY_MS);
  return task();
};

const resolveWithMode = async <T>(
  remoteTask: () => Promise<T>,
  demoTask: () => Promise<T>
): Promise<ApiResult<T>> => {
  if (await isDemoModeEnabled()) {
    return {
      data: await demoTask(),
      usedFallback: true
    };
  }

  if (!shouldUseRemoteApi()) {
    throw new ApiRequestError("Backend API not configured. Set NEXT_PUBLIC_API_URL or click Live Demo mode.");
  }

  return {
    data: await remoteTask(),
    usedFallback: false
  };
};

const fileToDataUrl = async (file: File): Promise<string> => {
  if (typeof window === "undefined") {
    throw new ApiRequestError("Demo upload only works in browser context.");
  }

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new ApiRequestError("Could not read selected image."));
    };
    reader.onerror = () => reject(new ApiRequestError("Could not read selected image."));
    reader.readAsDataURL(file);
  });
};

export const api = {
  async getProductsWithMeta(): Promise<ApiResult<Product[]>> {
    return resolveWithMode(
      async () => {
        const response = await fetchJson<ApiEnvelope<BackendProduct[]>>(endpoints.products, undefined, DEFAULT_TIMEOUT_MS, true);
        return response.data.map(toProduct);
      },
      () => useMockData(async () => localProducts)
    );
  },

  async getProducts(): Promise<Product[]> {
    const result = await this.getProductsWithMeta();
    return result.data;
  },

  async getProductByIdWithMeta(id: string): Promise<ApiResult<Product | null>> {
    return resolveWithMode(
      async () => {
        const response = await fetchJson<ApiEnvelope<BackendProduct>>(endpoints.productById(id), undefined, DEFAULT_TIMEOUT_MS, true);
        return toProduct(response.data);
      },
      () => useMockData(async () => localProducts.find((product) => product.id === id) ?? null)
    );
  },

  async getProductById(id: string): Promise<Product | null> {
    const result = await this.getProductByIdWithMeta(id);
    return result.data;
  },

  async getCart(): Promise<CartPayload> {
    const result = await this.getCartWithMeta();
    return result.data;
  },

  async getCartWithMeta(): Promise<ApiResult<CartPayload>> {
    return resolveWithMode(
      async () => {
        const data = await fetchJson<ApiEnvelope<{ items: CartLine[] }>>(endpoints.cart, undefined, DEFAULT_TIMEOUT_MS, true);
        return {
          items: data.data.items,
          summary: calculateCartSummary(data.data.items)
        };
      },
      () =>
        useMockData(async () => ({
          items: fallbackCartItems,
          summary: calculateCartSummary(fallbackCartItems)
        }))
    );
  },

  async getSellerStats(): Promise<SellerStat[]> {
    const result = await this.getSellerStatsWithMeta();
    return result.data;
  },

  async getSellerStatsWithMeta(): Promise<ApiResult<SellerStat[]>> {
    return resolveWithMode(
      async () => {
        const response = await fetchJson<ApiEnvelope<SellerStat[]>>(endpoints.sellerStats, undefined, DEFAULT_TIMEOUT_MS, true);
        return response.data;
      },
      () =>
        useMockData(async () => [
          { label: "Revenue", value: "฿42,350", trend: "+12.4%", trendDirection: "up" },
          { label: "Orders", value: "1,084", trend: "+8.7%", trendDirection: "up" },
          { label: "Returns", value: "1.1%", trend: "-0.3%", trendDirection: "down" }
        ])
    );
  },

  async createProduct(input: ProductInput): Promise<Product> {
    const result = await resolveWithMode(
      async () => {
        const payload = {
          sellerId: Number(input.sellerId),
          image: input.image,
          title: input.title,
          description: input.description,
          unitPrice: input.unitPrice,
          quantity: input.quantity
        };

        const response = await fetchJson<ApiEnvelope<BackendProduct>>(endpoints.products, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        return toProduct(response.data);
      },
      () =>
        useMockData(async () => {
          const created: Product = {
            id: String(Date.now()),
            ...input
          };
          localProducts = [created, ...localProducts];
          return created;
        })
    );

    return result.data;
  },

  async addStock(productId: string, quantityAdded: number): Promise<Product> {
    const result = await resolveWithMode(
      async () => {
        const response = await fetchJson<ApiEnvelope<BackendProduct>>(endpoints.productStock(productId), {
          method: "POST",
          body: JSON.stringify({
            quantityAdded
          })
        });

        return toProduct(response.data);
      },
      () =>
        useMockData(async () => {
          const target = localProducts.find((item) => item.id === productId);
          if (!target) {
            throw new ApiRequestError("Product not found");
          }

          const updated: Product = {
            ...target,
            quantity: target.quantity + quantityAdded
          };

          localProducts = localProducts.map((item) => (item.id === productId ? updated : item));
          return updated;
        })
    );

    return result.data;
  },

  async uploadProductImage(file: File): Promise<string> {
    const result = await resolveWithMode(
      async () => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetchJson<
          ApiEnvelope<{
            imageUrl: string;
          }>
        >(endpoints.uploadProductImage, {
          method: "POST",
          body: formData
        });

        return response.data.imageUrl;
      },
      () => useMockData(async () => fileToDataUrl(file))
    );

    return result.data;
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const result = await resolveWithMode(
      async () => {
        const payload = {
          buyerId: Number(input.buyerId),
          totalAmount: input.totalAmount,
          items: input.items.map((item) => ({
            productId: Number(item.productId),
            quantity: item.quantity
          }))
        };

        const response = await fetchJson<ApiEnvelope<BackendOrder>>(endpoints.orders, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        return toOrder(response.data);
      },
      () =>
        useMockData(async () => {
          const fallbackOrderId = String(Date.now());
          const createdAt = new Date().toISOString();

          return {
            id: fallbackOrderId,
            buyerId: input.buyerId,
            status: "PENDING",
            totalAmount: input.totalAmount,
            createdAt,
            items: input.items.map((item, index) => {
              const unitPrice = localProducts.find((product) => product.id === item.productId)?.unitPrice ?? 0;

              return {
                id: String(index + 1),
                saleOrderId: fallbackOrderId,
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
                subtotal: unitPrice * item.quantity
              };
            })
          };
        })
    );

    return result.data;
  },

  async createPayment(input: { saleOrderId: string; amount: number; paymentMethod: string; paymentDate?: string }) {
    const result = await resolveWithMode(
      async () => {
        const payload = {
          saleOrderId: Number(input.saleOrderId),
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          paymentDate: input.paymentDate
        };

        const response = await fetchJson<
          ApiEnvelope<{
            id: number;
            saleOrderId: number;
            amount: number;
            paymentMethod: string;
            paymentDate: string;
          }>
        >(endpoints.payments, {
          method: "POST",
          body: JSON.stringify(payload)
        });

        return {
          id: String(response.data.id),
          saleOrderId: String(response.data.saleOrderId),
          amount: Number(response.data.amount),
          paymentMethod: response.data.paymentMethod,
          paymentDate: response.data.paymentDate
        };
      },
      () =>
        useMockData(async () => ({
          id: String(Date.now()),
          saleOrderId: input.saleOrderId,
          amount: input.amount,
          paymentMethod: input.paymentMethod,
          paymentDate: new Date().toISOString()
        }))
    );

    return result.data;
  },

  async createShippingLabel(input: { orderId: string; recipientAddress: string; trackingNo?: string }) {
    const result = await resolveWithMode(
      async () => {
        const payload = {
          recipientAddress: input.recipientAddress,
          trackingNo: input.trackingNo?.trim() ? input.trackingNo.trim() : undefined
        };

        const response = await fetchJson<
          ApiEnvelope<{
            id: number;
            saleOrderId: number;
            trackingNo: string;
            recipientAddress: string;
            printedAt: string;
          }>
        >(endpoints.orderShippingLabel(input.orderId), {
          method: "POST",
          body: JSON.stringify(payload)
        });

        return {
          id: String(response.data.id),
          saleOrderId: String(response.data.saleOrderId),
          trackingNo: response.data.trackingNo,
          recipientAddress: response.data.recipientAddress,
          printedAt: response.data.printedAt
        };
      },
      () =>
        useMockData(async () => ({
          id: String(Date.now()),
          saleOrderId: input.orderId,
          trackingNo: input.trackingNo?.trim() || `TRK-${Date.now()}`,
          recipientAddress: input.recipientAddress,
          printedAt: new Date().toISOString()
        }))
    );

    return result.data;
  }
};
