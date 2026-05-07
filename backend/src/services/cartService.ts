import prisma from "../lib/prisma";
import { serializeProduct } from "../utils/serializers";

export const getCartPreview = async () => {
  const products = await prisma.product.findMany({
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 2
  });

  const items = products.map((product) => ({
    product: serializeProduct(product),
    quantity: 1
  }));

  return { items };
};
