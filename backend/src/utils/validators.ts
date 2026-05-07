import { PaymentMethod } from "@prisma/client";
import { BadRequestError } from "./errors";

export interface CreateProductInput {
  sellerId: number;
  image: string;
  title: string;
  description: string;
  unitPrice: number;
  quantity: number;
}

export interface UpdateProductInput {
  sellerId?: number;
  image?: string;
  title?: string;
  description?: string;
  unitPrice?: number;
  quantity?: number;
}

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  buyerId: number;
  status?: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: CreateOrderItemInput[];
}

export interface CreatePaymentInput {
  saleOrderId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate?: Date;
}

export interface GoogleAuthInput {
  googleId: string;
  email: string;
  username: string;
}

export interface GoogleRegisterInput {
  googleId?: string;
  providerAccountId?: string;
  email: string;
  username: string;
  address?: string;
}

export interface CreateShippingLabelInput {
  trackingNo?: string;
  recipientAddress?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

export const parseIdParam = (value: string, name = "id"): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new BadRequestError(`${name} must be a positive integer`);
  }
  return parsed;
};

const requireString = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestError(`${field} is required and must be a non-empty string`);
  }
  return value.trim();
};

const requirePositiveNumber = (value: unknown, field: string): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new BadRequestError(`${field} must be a positive number`);
  }
  return parsed;
};

const requireNonNegativeInt = (value: unknown, field: string): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new BadRequestError(`${field} must be a non-negative integer`);
  }
  return parsed;
};

const requirePositiveInt = (value: unknown, field: string): number => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new BadRequestError(`${field} must be a positive integer`);
  }
  return parsed;
};

export const validateCreateProduct = (body: unknown): CreateProductInput => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  return {
    sellerId: requirePositiveInt(body.sellerId, "sellerId"),
    image: requireString(body.image, "image"),
    title: requireString(body.title, "title"),
    description: requireString(body.description, "description"),
    unitPrice: requirePositiveNumber(body.unitPrice, "unitPrice"),
    quantity: requireNonNegativeInt(body.quantity, "quantity")
  };
};

export const validateUpdateProduct = (body: unknown): UpdateProductInput => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  const payload: UpdateProductInput = {};

  if (body.sellerId !== undefined) payload.sellerId = requirePositiveInt(body.sellerId, "sellerId");
  if (body.image !== undefined) payload.image = requireString(body.image, "image");
  if (body.title !== undefined) payload.title = requireString(body.title, "title");
  if (body.description !== undefined) payload.description = requireString(body.description, "description");
  if (body.unitPrice !== undefined) payload.unitPrice = requirePositiveNumber(body.unitPrice, "unitPrice");
  if (body.quantity !== undefined) payload.quantity = requireNonNegativeInt(body.quantity, "quantity");

  if (Object.keys(payload).length === 0) {
    throw new BadRequestError("At least one field is required for update");
  }

  return payload;
};

export const validateAddStock = (body: unknown): { quantityAdded: number } => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  return {
    quantityAdded: requirePositiveInt(body.quantityAdded, "quantityAdded")
  };
};

export const validateUpdateInventory = (body: unknown): { quantity: number } => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  return {
    quantity: requireNonNegativeInt(body.quantity, "quantity")
  };
};

export const validateCreateOrder = (body: unknown): CreateOrderInput => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  const buyerId = requirePositiveInt(body.buyerId, "buyerId");

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new BadRequestError("items must be a non-empty array");
  }

  const items = body.items.map((item, index) => {
    if (!isObject(item)) {
      throw new BadRequestError(`items[${index}] must be an object`);
    }

    return {
      productId: requirePositiveInt(item.productId, `items[${index}].productId`),
      quantity: requirePositiveInt(item.quantity, `items[${index}].quantity`)
    };
  });

  return {
    buyerId,
    items
  };
};

export const validateCreatePayment = (body: unknown): CreatePaymentInput => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  const saleOrderId = requirePositiveInt(body.saleOrderId, "saleOrderId");
  const amount = requirePositiveNumber(body.amount, "amount");
  const paymentMethodRaw = requireString(body.paymentMethod, "paymentMethod");

  if (!Object.values(PaymentMethod).includes(paymentMethodRaw as PaymentMethod)) {
    throw new BadRequestError(
      `paymentMethod must be one of: ${Object.values(PaymentMethod).join(", ")}`
    );
  }

  let paymentDate: Date | undefined;
  if (body.paymentDate !== undefined) {
    const parsed = new Date(String(body.paymentDate));
    if (Number.isNaN(parsed.getTime())) {
      throw new BadRequestError("paymentDate must be a valid date");
    }
    paymentDate = parsed;
  }

  return {
    saleOrderId,
    amount,
    paymentMethod: paymentMethodRaw as PaymentMethod,
    paymentDate
  };
};

export const validateGoogleAuth = (body: unknown): GoogleAuthInput => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  return {
    googleId: requireString(body.googleId, "googleId"),
    email: requireString(body.email, "email"),
    username: requireString(body.username, "username")
  };
};

export const validateGoogleRegister = (body: unknown): GoogleRegisterInput => {
  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  const email = requireString(body.email, "email");
  const username = requireString(body.username, "username");

  const googleId =
    typeof body.googleId === "string" && body.googleId.trim().length > 0 ? body.googleId.trim() : undefined;
  const providerAccountId =
    typeof body.providerAccountId === "string" && body.providerAccountId.trim().length > 0
      ? body.providerAccountId.trim()
      : undefined;

  if (!googleId && !providerAccountId) {
    throw new BadRequestError("Either googleId or providerAccountId is required");
  }

  const address =
    typeof body.address === "string" && body.address.trim().length > 0 ? body.address.trim() : undefined;

  return {
    googleId,
    providerAccountId,
    email,
    username,
    address
  };
};

export const validateCreateShippingLabel = (body: unknown): CreateShippingLabelInput => {
  if (body === undefined || body === null) {
    return {};
  }

  if (!isObject(body)) {
    throw new BadRequestError("Request body must be an object");
  }

  const payload: CreateShippingLabelInput = {};

  if (body.trackingNo !== undefined) {
    payload.trackingNo = requireString(body.trackingNo, "trackingNo");
  }

  if (body.recipientAddress !== undefined) {
    payload.recipientAddress = requireString(body.recipientAddress, "recipientAddress");
  }

  return payload;
};
