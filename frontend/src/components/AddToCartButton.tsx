"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { useToast } from "@/components/ToastProvider";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem, getProductQuantity } = useCart();
  const { pushToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const quantityInCart = getProductQuantity(product.id);

  const handleAdd = async () => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    addItem(product, 1);
    pushToast(`${product.title} added to cart.`, "success");
    setIsAdding(false);
  };

  return (
    <Button className={className} loading={isAdding} onClick={handleAdd}>
      {quantityInCart > 0 ? `Add more (${quantityInCart})` : "Add to cart"}
    </Button>
  );
}
