"use client";

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

  const quantityInCart = getProductQuantity(product.id);

  const handleAdd = () => {
    addItem(product, 1);
    pushToast(`${product.title} added to cart.`, "success");
  };

  return (
    <Button className={className} onClick={handleAdd}>
      {quantityInCart > 0 ? `Add more (${quantityInCart})` : "Add to cart"}
    </Button>
  );
}
