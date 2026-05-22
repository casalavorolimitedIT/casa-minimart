"use client";

import { useState } from "react";

import { type Product, formatPrice, getStockLevel } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, ShoppingCart } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SmartImage from "../custom/smart-images";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

const stockConfig = {
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
  const [added, setAdded] = useState(false);
  const level = getStockLevel(product.stock);
  const cfg = stockConfig[level];

  const stockLabel =
    level === "critical"
      ? cfg.label
      : level === "plenty"
        ? cfg.label
        : (cfg.label as (n: number) => string)(product.stock);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
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
            {2}
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
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            added
              ? "bg-[#4A7C59] text-white scale-95"
              : "text-white hover:scale-[1.02] active:scale-95",
          )}
          style={!added ? { backgroundColor: "#4A7C59" } : {}}
        >
          {added ? (
            <>
              <HugeiconsIcon icon={Check} className="w-4 h-4" />
              Added!
            </>
          ) : (
            <>
              <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
              Add
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
