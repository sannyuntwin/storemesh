import { Payment, Product, SaleOrder, SaleOrderItem, ShippingLabel } from "@prisma/client";

type ProductWithExtras = Product & {
  seller?: {
    id: number;
    username: string;
    email: string;
  } | null;
};

export const serializeProduct = (product: ProductWithExtras) => ({
  id: product.id,
  sellerId: product.sellerId,
  image: product.image,
  title: product.title,
  description: product.description,
  unitPrice: Number(product.unitPrice),
  quantity: product.quantity,
  createdAt: product.createdAt,
  // Optional aliases to simplify existing frontend integration.
  price: Number(product.unitPrice),
  stock: product.quantity,
  seller: product.seller?.username ?? null
});

type SaleOrderWithItems = SaleOrder & {
  items: SaleOrderItem[];
  payments?: Payment[];
  shippingLabel?: ShippingLabel | null;
};

export const serializeOrder = (order: SaleOrderWithItems) => ({
  id: order.id,
  buyerId: order.buyerId,
  status: order.status,
  totalAmount: Number(order.totalAmount),
  createdAt: order.createdAt,
  items: order.items.map((item) => ({
    id: item.id,
    saleOrderId: item.saleOrderId,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
    subtotal: Number(item.subtotal)
  })),
  payments: (order.payments ?? []).map((payment) => ({
    id: payment.id,
    saleOrderId: payment.saleOrderId,
    amount: Number(payment.amount),
    paymentMethod: payment.paymentMethod,
    paymentDate: payment.paymentDate
  })),
  shippingLabel: order.shippingLabel
    ? {
        id: order.shippingLabel.id,
        saleOrderId: order.shippingLabel.saleOrderId,
        trackingNo: order.shippingLabel.trackingNo,
        recipientAddress: order.shippingLabel.recipientAddress,
        printedAt: order.shippingLabel.printedAt
      }
    : null
});

export const serializePayment = (payment: Payment) => ({
  id: payment.id,
  saleOrderId: payment.saleOrderId,
  amount: Number(payment.amount),
  paymentMethod: payment.paymentMethod,
  paymentDate: payment.paymentDate
});

export const serializeShippingLabel = (shippingLabel: ShippingLabel) => ({
  id: shippingLabel.id,
  saleOrderId: shippingLabel.saleOrderId,
  trackingNo: shippingLabel.trackingNo,
  recipientAddress: shippingLabel.recipientAddress,
  printedAt: shippingLabel.printedAt
});
