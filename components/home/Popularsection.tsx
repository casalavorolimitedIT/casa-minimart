"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, selectCartItems } from "@/store/cartSlice";
import { useInventoryItems } from "@/lib/queries/supabase-rest";
import { adaptInventoryItem } from "@/lib/adapters";
import { formatPrice } from "@/lib/data";
import { Check, ShoppingCart, Sparkles } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SmartImage from "../custom/smart-images";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

export default function PopularSection() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const { data: raw, isLoading } = useInventoryItems({
    select: "*",
    limit: 6,
    order: "created_at.desc",
    queryParams: {
      site_id: SITE_ID,
      quantity: "gt.0",
    },
  });

  const products = (raw ?? []).map(adaptInventoryItem);

  const handleAdd = (product: (typeof products)[number]) => {
    const cartQty = cartItems.find((c) => c.id === product.id)?.qty ?? 0;
    if (product.price === null || cartQty >= product.stock) return;
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
    <section
      className="rounded-2xl p-5 sm:p-6 space-y-4"
      style={{ backgroundColor: "var(--espresso)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={Sparkles} className="w-4 h-4 text-[#C8A87A]" />
        <h2
          className="text-base font-bold text-white"
          style={{ fontFamily: "Georgia, serif" }}
        >
          New Arrivals
        </h2>
      </div>
      <p className="text-[#A89070] text-xs -mt-2">
        Fresh stock just added to the store
      </p>

      {/* Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-[#4A2E1A] animate-pulse"
              style={{ backgroundColor: "#3A2010" }}
            >
              <div className="aspect-video bg-[#4A2E1A]" />
              <div className="p-3 space-y-2">
                <div className="h-4 rounded bg-[#4A2E1A] w-3/4" />
                <div className="h-4 rounded bg-[#4A2E1A] w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {products.map((product) => {
            const cartQty = cartItems.find((c) => c.id === product.id)?.qty ?? 0;
            const inCart = cartQty > 0;
            const atMax = cartQty >= product.stock;
            const noPrice = product.price === null;
            const disabled = noPrice || atMax;

            return (
              <div
                key={product.id}
                className="group flex flex-col rounded-xl overflow-hidden border border-[#4A2E1A] hover:border-[#C8A87A] transition-all duration-200"
                style={{ backgroundColor: "#3A2010" }}
              >
                {/* Image */}
                <Link href={`/home/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden aspect-video">
                    <SmartImage
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      label={product.name}
                      fallbackVariant="initials"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/60 to-transparent" />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  <Link href={`/home/product/${product.id}`}>
                    <p
                      className="text-white text-sm font-semibold leading-tight hover:text-[#C8A87A] transition-colors"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {product.name}
                    </p>
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-sm" style={{ color: "#C8A87A" }}>
                      {formatPrice(product.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      disabled={disabled}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: disabled
                          ? "#4A2E1A"
                          : inCart
                            ? "#4A7C59"
                            : "#C8720A",
                        color: "white",
                      }}
                    >
                      {inCart && !atMax ? (
                        <>
                          <HugeiconsIcon icon={Check} className="w-3.5 h-3.5" />
                          In Cart
                        </>
                      ) : atMax ? (
                        "Max"
                      ) : noPrice ? (
                        "N/A"
                      ) : (
                        <>
                          <HugeiconsIcon icon={ShoppingCart} className="w-3.5 h-3.5" />
                          Add
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
