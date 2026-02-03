"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  productId: string;
  className?: string;
  children?: React.ReactNode;
};

export function AddToCartButton({
  productId,
  className,
  children,
}: AddToCartButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const handleClick = () => {
    addItem(productId, 1);
    router.push("/cart");
  };

  return (
    <Button
      type="button"
      className={cn(
        "h-12 rounded-full px-10 text-base font-semibold",
        className,
      )}
      onClick={handleClick}
    >
      {children ?? "KUPI PROTEIN"}
    </Button>
  );
}
