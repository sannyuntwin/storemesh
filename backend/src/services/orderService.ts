import { OrderStatus, Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import { serializeOrder, serializeShippingLabel } from "../utils/serializers";
import { CreateOrderInput } from "../utils/validators";

interface AggregatedOrderItem {
  productId: number;
  quantity: number;
}

const aggregateOrderItems = (items: CreateOrderInput["items"]): AggregatedOrderItem[] => {
  const map = new Map<number, number>();

  for (const item of items) {
    map.set(item.productId, (map.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(map.entries()).map(([productId, quantity]) => ({
    productId,
    quantity
  }));
};

export const createOrder = async (input: CreateOrderInput) => {
  const buyer = await prisma.user.findUnique({
    where: { id: input.buyerId }
  });

  if (!buyer) {
    throw new NotFoundError("Buyer not found");
  }

  const aggregatedItems = aggregateOrderItems(input.items);
  const productIds = aggregatedItems.map((item) => item.productId);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  });

  if (products.length !== productIds.length) {
    throw new BadRequestError("One or more products do not exist");
  }

  const productById = new Map(products.map((product) => [product.id, product]));

  const orderItemsData = aggregatedItems.map((item) => {
    const product = productById.get(item.productId);
    if (!product) {
      throw new BadRequestError(`Product ${item.productId} was not found`);
    }

    if (product.quantity < item.quantity) {
      throw new BadRequestError(`Insufficient stock for product ${product.id}`);
    }

    const unitPrice = Number(product.unitPrice);
    const subtotal = unitPrice * item.quantity;

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPrice,
      subtotal
    };
  });

  const totalAmount = orderItemsData.reduce((total, item) => total + item.subtotal, 0);

  const created = await prisma.saleOrder.create({
    data: {
      buyerId: input.buyerId,
      status: OrderStatus.PENDING,
      totalAmount,
      items: {
        create: orderItemsData
      }
    },
    include: {
      items: true,
      payments: true,
      shippingLabel: true
    }
  });

  return serializeOrder(created);
};

export const getOrders = async () => {
  const orders = await prisma.saleOrder.findMany({
    include: {
      items: true,
      payments: true,
      shippingLabel: true,
      buyer: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return orders.map(serializeOrder);
};

export const getOrderById = async (id: number) => {
  const order = await prisma.saleOrder.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      shippingLabel: true
    }
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return serializeOrder(order);
};

const createTrackingNo = () => {
  return `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export const createShippingLabelForOrder = async (
  orderId: number,
  payload?: { trackingNo?: string; recipientAddress?: string }
) => {
  try {
    const created = await prisma.$transaction(async (tx) => {
      const order = await tx.saleOrder.findUnique({
        where: { id: orderId },
        include: {
          buyer: true,
          shippingLabel: true,
          items: true
        }
      });

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      if (order.shippingLabel) {
        throw new ConflictError("Shipping label already exists for this order");
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestError("Cannot create shipping label for a cancelled order");
      }

      if (order.status === OrderStatus.DELIVERED) {
        throw new BadRequestError("Cannot create shipping label for a delivered order");
      }

      const recipientAddress = payload?.recipientAddress ?? order.buyer.address;
      if (!recipientAddress || recipientAddress.trim().length === 0) {
        throw new BadRequestError("recipientAddress is required");
      }

      const productIds = order.items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds
          }
        }
      });

      const productById = new Map(products.map((product) => [product.id, product]));

      for (const item of order.items) {
        const product = productById.get(item.productId);
        if (!product) {
          throw new BadRequestError(`Product ${item.productId} was not found`);
        }

        if (product.quantity < item.quantity) {
          throw new BadRequestError(`Insufficient stock for product ${product.id} at shipment time`);
        }
      }

      const shippingLabel = await tx.shippingLabel.create({
        data: {
          saleOrderId: orderId,
          trackingNo: payload?.trackingNo?.trim() || createTrackingNo(),
          recipientAddress: recipientAddress.trim(),
          printedAt: new Date()
        }
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity
            }
          }
        });

        await tx.stockLog.create({
          data: {
            productId: item.productId,
            quantityAdded: -item.quantity
          }
        });
      }

      await tx.saleOrder.update({
        where: { id: orderId },
        data: {
          status: OrderStatus.SHIPPED
        }
      });

      return shippingLabel;
    });

    return serializeShippingLabel(created);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictError("Shipping label already exists for this order");
    }

    throw error;
  }
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const getShippingLabelPrintDocument = async (orderId: number): Promise<string> => {
  const order = await prisma.saleOrder.findUnique({
    where: { id: orderId },
    include: {
      buyer: true,
      shippingLabel: true,
      items: {
        include: {
          product: {
            select: {
              title: true
            }
          }
        }
      }
    }
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  if (!order.shippingLabel) {
    throw new NotFoundError("Shipping label not found for this order");
  }

  const label = order.shippingLabel;
  const printedAt = label.printedAt ?? new Date();
  const itemsHtml = order.items
    .map((item) => {
      const productTitle = item.product?.title ?? `Product #${item.productId}`;
      return `<tr>
        <td>${escapeHtml(productTitle)}</td>
        <td>${item.quantity}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shipping Label - Order #${order.id}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
      background: #f5f7fb;
      color: #0f172a;
    }
    .label {
      max-width: 700px;
      margin: 0 auto;
      background: #ffffff;
      border: 2px solid #0f172a;
      border-radius: 8px;
      padding: 16px;
    }
    .heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .heading h1 {
      font-size: 24px;
      margin: 0;
      letter-spacing: 0.04em;
    }
    .chip {
      background: #e2e8f0;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }
    .section {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px;
      margin-top: 10px;
    }
    .section h2 {
      margin: 0 0 8px 0;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .meta {
      line-height: 1.7;
      font-size: 14px;
    }
    .address {
      white-space: pre-line;
      font-size: 15px;
      line-height: 1.5;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    th, td {
      border-top: 1px solid #cbd5e1;
      padding: 8px;
      text-align: left;
    }
    .actions {
      margin-top: 14px;
      display: flex;
      gap: 10px;
    }
    .btn {
      border: 1px solid #0f172a;
      background: #0f172a;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 700;
    }
    .btn.secondary {
      background: white;
      color: #0f172a;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .label {
        max-width: 100%;
        border: 2px solid #000;
        border-radius: 0;
        margin: 0;
      }
      .actions {
        display: none;
      }
    }
  </style>
</head>
<body>
  <main class="label">
    <header class="heading">
      <h1>Shipping Label</h1>
      <span class="chip">${escapeHtml(order.status)}</span>
    </header>

    <section class="section">
      <h2>Shipment</h2>
      <div class="meta">
        <div><strong>Tracking No:</strong> ${escapeHtml(label.trackingNo)}</div>
        <div><strong>Order ID:</strong> #${order.id}</div>
        <div><strong>Printed At:</strong> ${escapeHtml(printedAt.toISOString())}</div>
      </div>
    </section>

    <section class="section">
      <h2>Ship To</h2>
      <div class="address">${escapeHtml(label.recipientAddress)}</div>
      <div class="meta"><strong>Buyer:</strong> ${escapeHtml(order.buyer.username)} (${escapeHtml(order.buyer.email)})</div>
    </section>

    <section class="section">
      <h2>Items</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </section>

    <div class="actions">
      <button class="btn" onclick="window.print()">Print Label</button>
      <button class="btn secondary" onclick="window.close()">Close</button>
    </div>
  </main>
</body>
</html>`;
};
