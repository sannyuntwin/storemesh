import { OrderStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { BadRequestError, NotFoundError } from "../utils/errors";
import { serializePayment } from "../utils/serializers";
import { CreatePaymentInput } from "../utils/validators";

const toCents = (amount: number) => Math.round(amount * 100);

export const createPayment = async (input: CreatePaymentInput) => {
  const order = await prisma.saleOrder.findUnique({
    where: { id: input.saleOrderId },
    include: {
      payments: true
    }
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  const totalAmount = Number(order.totalAmount);
  const paidAmount = order.payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const totalCents = toCents(totalAmount);
  const paidCents = toCents(paidAmount);
  const amountCents = toCents(input.amount);
  const remainingCents = totalCents - paidCents;

  if (remainingCents <= 0) {
    throw new BadRequestError("Order is already fully paid");
  }

  if (amountCents > remainingCents) {
    throw new BadRequestError(
      `Payment amount cannot exceed remaining amount (${(remainingCents / 100).toFixed(2)})`
    );
  }

  const payment = await prisma.$transaction(async (tx) => {
    const createdPayment = await tx.payment.create({
      data: {
        saleOrderId: input.saleOrderId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentDate: input.paymentDate ?? new Date()
      }
    });

    const newPaidCents = paidCents + amountCents;
    if (newPaidCents >= totalCents) {
      await tx.saleOrder.update({
        where: { id: input.saleOrderId },
        data: {
          status: OrderStatus.PAID
        }
      });
    }

    return createdPayment;
  });

  return serializePayment(payment);
};
