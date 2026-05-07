import prisma from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { serializeProduct } from "../utils/serializers";
import { CreateProductInput, UpdateProductInput } from "../utils/validators";

export const getProducts = async () => {
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
    }
  });

  return products.map(serializeProduct);
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return serializeProduct(product);
};

export const createProduct = async (input: CreateProductInput) => {
  const seller = await prisma.user.findUnique({
    where: { id: input.sellerId }
  });

  if (!seller) {
    throw new NotFoundError("Seller not found");
  }

  const product = await prisma.product.create({
    data: input,
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  return serializeProduct(product);
};

export const updateProduct = async (id: number, input: UpdateProductInput) => {
  const existing = await prisma.product.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new NotFoundError("Product not found");
  }

  if (input.sellerId !== undefined) {
    const seller = await prisma.user.findUnique({
      where: { id: input.sellerId }
    });

    if (!seller) {
      throw new NotFoundError("Seller not found");
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: input,
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  return serializeProduct(updated);
};

export const deleteProduct = async (id: number) => {
  const existing = await prisma.product.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new NotFoundError("Product not found");
  }

  await prisma.product.delete({
    where: { id }
  });
};

export const addStock = async (productId: number, quantityAdded: number) => {
  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: {
        quantity: {
          increment: quantityAdded
        }
      },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });

    await tx.stockLog.create({
      data: {
        productId,
        quantityAdded
      }
    });

    return updatedProduct;
  });

  return serializeProduct(result);
};

export const updateInventory = async (productId: number, quantity: number) => {
  const existing = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!existing) {
    throw new NotFoundError("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      quantity
    },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });

  return serializeProduct(updated);
};
