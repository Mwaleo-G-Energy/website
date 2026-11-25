"use client";

import { useCartStore } from "@/hooks/useCartStore";
import { useWixClient } from "@/hooks/useWixClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Add = ({
  productId,
  variantId,
  stockNumber,
}: {
  productId: string;
  variantId: string;
  stockNumber: number;
}) => {
  const [quantity, setQuantity] = useState(1);

  const router = useRouter();

  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const wixClient = useWixClient();

  const { addItem, isLoading } = useCartStore();

  const handleAddToCart = async () => {
    await addItem(wixClient, productId, variantId, quantity);
    router.push("/cart");
  };

  // A quantity of 9999 only means "in stock, quantity not tracked", so it is never shown as a count.
  const stockNote =
    stockNumber < 1 ? (
      <p className="whitespace-nowrap text-sm text-red-500">Out of stock</p>
    ) : stockNumber < 100 ? (
      <p className="whitespace-nowrap text-sm text-gray-600">
        Only <span className="font-semibold text-orange-500">{stockNumber}</span> left
      </p>
    ) : (
      <p className="whitespace-nowrap text-sm text-gray-600">In stock</p>
    );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-medium">Choose a Quantity</h4>
        {stockNote}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-32 flex-shrink-0 items-center justify-between border border-gray-300 bg-brand-cream px-1 dark:border-gray-600">
          <button
            aria-label="Decrease quantity"
            className="h-10 w-10 cursor-pointer text-xl text-gray-800 transition-colors hover:text-brand-leaf-ink disabled:cursor-not-allowed disabled:opacity-20 dark:text-gray-100"
            onClick={() => handleQuantity("d")}
            disabled={quantity === 1}
          >
            -
          </button>
          <span className="font-medium" aria-live="polite">{quantity}</span>
          <button
            aria-label="Increase quantity"
            className="h-10 w-10 cursor-pointer text-xl text-gray-800 transition-colors hover:text-brand-leaf-ink disabled:cursor-not-allowed disabled:opacity-20 dark:text-gray-100"
            onClick={() => handleQuantity("i")}
            disabled={quantity === stockNumber}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isLoading || stockNumber < 1}
          className="h-11 flex-1 bg-brand-leaf px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-leaf-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 dark:text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Add;
