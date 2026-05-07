const { PrismaClient, UserRole, PaymentMethod, OrderStatus } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.payment.deleteMany();
  await prisma.shippingLabel.deleteMany();
  await prisma.saleOrderItem.deleteMany();
  await prisma.saleOrder.deleteMany();
  await prisma.stockLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const seller = await prisma.user.create({
    data: {
      username: "seller_demo",
      email: "seller@storemesh.local",
      address: "99 Market St, Springfield",
      role: UserRole.SELLER
    }
  });

  const buyer = await prisma.user.create({
    data: {
      username: "buyer_demo",
      email: "buyer@storemesh.local",
      address: "12 Lake Rd, Springfield",
      role: UserRole.BUYER
    }
  });

  const products = await prisma.product.createMany({
    data: [
      {
        sellerId: seller.id,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        title: "Wireless Headphones",
        description: "Noise-cancelling headphones with long battery life.",
        unitPrice: 89.99,
        quantity: 25
      },
      {
        sellerId: seller.id,
        image: "https://images.unsplash.com/photo-1580910051074-3eb694886505",
        title: "Mechanical Keyboard",
        description: "Compact mechanical keyboard for work and gaming.",
        unitPrice: 59.5,
        quantity: 40
      },
      {
        sellerId: seller.id,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        title: "Smartwatch Pro",
        description: "AMOLED smartwatch with fitness tracking and 7-day battery life.",
        unitPrice: 149,
        quantity: 30
      },
      {
        sellerId: seller.id,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        title: "Studio Headphones",
        description: "Over-ear headphones tuned for balanced studio monitoring.",
        unitPrice: 129,
        quantity: 18
      },
      {
        sellerId: seller.id,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        title: "Urban Sneakers",
        description: "Lightweight everyday sneakers with breathable mesh upper.",
        unitPrice: 74.5,
        quantity: 50
      },
      {
        sellerId: seller.id,
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3",
        title: "Running Shoes",
        description: "Comfort-focused running shoes for daily training sessions.",
        unitPrice: 98,
        quantity: 22
      }
    ]
  });

  const firstProduct = await prisma.product.findFirstOrThrow({
    where: { sellerId: seller.id },
    orderBy: { id: "asc" }
  });

  const order = await prisma.saleOrder.create({
    data: {
      buyerId: buyer.id,
      status: OrderStatus.PAID,
      totalAmount: 179.98,
      items: {
        create: [
          {
            productId: firstProduct.id,
            quantity: 2,
            unitPrice: 89.99,
            subtotal: 179.98
          }
        ]
      },
      payments: {
        create: [
          {
            amount: 179.98,
            paymentMethod: PaymentMethod.CREDIT_CARD,
            paymentDate: new Date()
          }
        ]
      }
    }
  });

  await prisma.shippingLabel.create({
    data: {
      saleOrderId: order.id,
      trackingNo: `TRK-${Date.now()}`,
      recipientAddress: buyer.address || "Unknown",
      printedAt: new Date()
    }
  });

  console.log(`Seed complete: 2 users, ${products.count} products, 1 order.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
