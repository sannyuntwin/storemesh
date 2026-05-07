export interface Product {
  id: string;
  sellerId?: string;
  createdAt?: string;
  unitPrice: number;
  quantity: number;
  image: string;
  title: string;
  description: string;
}

export interface ProductInput {
  sellerId: string;
  title: string;
  description: string;
  unitPrice: number;
  image: string;
  quantity: number;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  buyerId: string;
  items: CreateOrderItemInput[];
  totalAmount: number;
}

export interface Order {
  id: string;
  buyerId: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  items: Array<{
    id: string;
    saleOrderId: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CartPayload {
  items: CartLine[];
  summary: CartSummary;
}

export interface SellerStat {
  label: string;
  value: string;
  trend: string;
  trendDirection: "up" | "down";
}

export interface ApiErrorShape {
  message: string;
  status?: number;
  details?: unknown;
}
