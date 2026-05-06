export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  seller: string;
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

export interface SellerStat {
  label: string;
  value: string;
  trend: string;
}
