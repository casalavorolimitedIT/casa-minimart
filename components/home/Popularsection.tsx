"use client";

import { useState } from "react";

import { formatPrice, popularProducts } from "@/lib/data";
import { Check, ShoppingCart, TrendingUp } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SmartImage from "../custom/smart-images";

export default function PopularSection() {
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = (id: string) => {
    setAdded(id);
    setTimeout(() => setAdded(null), 1800);
  };

  return (
    <section
      className="rounded-2xl p-5 sm:p-6 space-y-4"
      style={{ backgroundColor: "var(--espresso)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={TrendingUp} className="w-4 h-4 text-[#C8A87A]" />
        <h2
          className="text-base font-bold text-white"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Popular in Abuja
        </h2>
      </div>
      <p className="text-[#A89070] text-xs -mt-2">
        What your neighbors are buying right now
      </p>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {popularProducts.map((product) => (
          <div
            key={product.id}
            className="group flex flex-col rounded-xl overflow-hidden border border-[#4A2E1A] hover:border-[#C8A87A] transition-all duration-200"
            style={{ backgroundColor: "#3A2010" }}
          >
            {/* Image */}
            <div className="relative overflow-hidden aspect-video">
              <SmartImage
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C1A0E]/60 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-2 flex-1">
              <p
                className="text-white text-sm font-semibold leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {product.name}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span
                  className="font-bold text-sm"
                  style={{ color: "#C8A87A" }}
                >
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={() => handleAdd(product.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95"
                  style={{
                    backgroundColor:
                      added === product.id ? "#4A7C59" : "#C8720A",
                    color: "white",
                  }}
                >
                  {added === product.id ? (
                    <>
                      <HugeiconsIcon icon={Check} className="w-3.5 h-3.5" />
                      Added
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon
                        icon={ShoppingCart}
                        className="w-3.5 h-3.5"
                      />
                      Add
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
