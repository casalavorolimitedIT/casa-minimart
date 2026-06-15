// components/home/productCard.tsx
"use client";

import { type Product, formatPrice, getStockLevel } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, ShoppingCart } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import SmartImage from "../custom/smart-images";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, selectCartItems } from "@/store/cartSlice";

interface ProductCardProps {
  product: Product;
}

const stockConfig = {
  out: { label: "Out of stock", variant: "low" as const, bg: "bg-gray-400" },
  critical: { label: "Only 1 left", variant: "low" as const, bg: "bg-red-500" },
  low: {
    label: (n: number) => `Only ${n} left`,
    variant: "low" as const,
    bg: "bg-orange-400",
  },
  medium: {
    label: (n: number) => `Only ${n} left`,
    variant: "medium" as const,
    bg: "bg-amber-400",
  },
  plenty: { label: "In stock", variant: "high" as const, bg: "bg-green-500" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const level = getStockLevel(product.stock);
  const cfg = stockConfig[level];

  const stockLabel =
    level === "out" || level === "critical" || level === "plenty"
      ? cfg.label
      : (cfg.label as (n: number) => string)(product.stock);

  const outOfStock = level === "out";
  const noPrice = product.price === null;
  const cartItem = cartItems.find((i) => i.id === product.id);
  const cartQty = cartItem?.qty ?? 0;
  const atMax = cartQty >= product.stock;
  const inCart = cartQty > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock || atMax || product.price === null) return;
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        qty: 1,
      }),
    );
  };

  return (
    <Link
      href={`/home/product/${product.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl border border-[#E5D9C0] overflow-hidden product-card-hover",
        "bg-white/80",
      )}
    >
      {/* Stock badge */}
      {level !== "plenty" && (
        <div className="absolute top-2 right-2 z-10">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full",
              cfg.bg,
            )}
          >
            {stockLabel as string}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F5EDD6] aspect-square">
        <SmartImage
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={600}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-square"
          loading="lazy"
          label={product.name}
          fallbackVariant="initials"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p
          className="text-sm font-semibold leading-tight line-clamp-2"
          style={{ color: "var(--espresso)", fontFamily: "Georgia, serif" }}
        >
          {product.name}
        </p>
        <p
          className="text-base font-bold mt-auto pt-1"
          style={{ color: "var(--amber-brand)" }}
        >
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Add button */}
      <div className="px-3 pb-3">
        <Button
          onClick={handleAdd}
          disabled={outOfStock || atMax || noPrice}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            outOfStock || noPrice
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : atMax
                ? "text-white"
                : inCart
                  ? "text-white"
                  : "text-white hover:scale-[1.02] active:scale-95",
          )}
          style={
            outOfStock || noPrice
              ? {}
              : atMax
                ? { backgroundColor: "#7A5C3E" }
                : inCart
                  ? { backgroundColor: "#4A7C59" }
                  : { backgroundColor: "#4A7C59" }
          }
        >
          {outOfStock ? (
            "Out of stock"
          ) : noPrice ? (
            "Price on request"
          ) : atMax ? (
            "Max in cart"
          ) : inCart ? (
            <>
              <HugeiconsIcon icon={Check} className="w-4 h-4" />
              In Cart ({cartQty})
            </>
          ) : (
            <>
              <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
              Add
            </>
          )}
        </Button>
      </div>
    </Link>
  );
}
