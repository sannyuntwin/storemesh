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
