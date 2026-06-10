"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Delete,
  Lock,
  ShoppingBag,
  CouponPercentIcon as CouponPercent,
  MessageCircle,
  Check,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatPrice, relatedProducts } from "@/lib/data";
import SmartImage from "@/components/custom/smart-images";
import NavbarComponents from "@/components/ui/header";
import Footer from "@/components/home/Footer";

type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  imageUrl: string;
};

const INITIAL_CART: CartItem[] = [
  {
    id: "t1",
    name: "Gillette Shaving Stick",
    category: "Toiletries",
    price: 20000,
    qty: 1,
    imageUrl: "https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=300&q=80",
  },
  {
    id: "t2",
    name: "Kids Oral B Toothbrush",
    category: "Toiletries",
    price: 20000,
    qty: 2,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80",
  },
  {
    id: "t3",
    name: "Sensodyne Toothpaste",
    category: "Toiletries",
    price: 7840,
    qty: 1,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80",
  },
];

function CartItemCard({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      className="group flex gap-4 rounded-2xl bg-white border p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      style={{ borderColor: "#E5D9C0" }}
    >
      <div
        className="relative shrink-0 rounded-xl overflow-hidden bg-[#F5EDD6]"
        style={{ width: 96, height: 96 }}
      >
        <SmartImage
          src={item.imageUrl}
          alt={item.name}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span
          className="self-start px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: "#FBF5E6", color: "#C8720A" }}
        >
          {item.category}
        </span>
        <p
          className="text-sm font-semibold text-[#2C1A0E] leading-snug line-clamp-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {item.name}
        </p>
        <p className="text-xs text-[#A89070]">{formatPrice(item.price)} each</p>

        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex items-center rounded-xl border border-[#DDD0B3] overflow-hidden bg-white">
            <button
              onClick={() => onUpdateQty(item.id, -1)}
              className="w-8 h-8 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
            >
              <HugeiconsIcon icon={Minus} className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#2C1A0E]">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, 1)}
              className="w-8 h-8 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
            >
              <HugeiconsIcon icon={Plus} className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-[#2C1A0E] text-sm">
              {formatPrice(item.price * item.qty)}
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#A89070] hover:text-red-400 hover:bg-red-50 transition-all"
            >
              <HugeiconsIcon icon={Delete} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderSummary({
  subtotal,
  promoCode,
  setPromoCode,
  promoApplied,
  onApplyPromo,
}: {
  subtotal: number;
  promoCode: string;
  setPromoCode: (v: string) => void;
  promoApplied: boolean;
  onApplyPromo: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-6 space-y-5"
      style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
    >
      <h2
        className="font-bold text-[#2C1A0E] text-lg"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Order Summary
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-[#7A5C3E]">Subtotal</span>
          <span className="font-semibold text-[#2C1A0E]">{formatPrice(subtotal)}</span>
        </div>

        {/* Delivery fee — hidden until wired up */}
        <div className="hidden items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#7A5C3E]">Delivery Fee</span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
              style={{ backgroundColor: "#EAF2EC", color: "#4A7C59" }}
            >
              Abuja Express
            </span>
          </div>
          <span className="font-semibold text-[#2C1A0E]">{formatPrice(1500)}</span>
        </div>
      </div>

      <div className="h-px bg-[#E5D9C0]" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#2C1A0E]">Total</span>
        <span
          className="text-2xl font-bold text-[#2C1A0E]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#A89070] uppercase tracking-wider flex items-center gap-1.5">
          <HugeiconsIcon icon={CouponPercent} className="w-3.5 h-3.5" />
          Promo Code
        </p>
        {promoApplied ? (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
            style={{ backgroundColor: "#EAF2EC", color: "#4A7C59" }}
          >
            <HugeiconsIcon icon={Check} className="w-4 h-4" />
            Promo code applied!
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code"
              className="flex-1 h-9 px-3 rounded-xl border text-sm bg-[#FAF4E8] text-[#2C1A0E] placeholder:text-[#A89070] focus:outline-none focus:border-[#C8720A] transition-colors"
              style={{ borderColor: "#DDD0B3" }}
            />
            <button
              onClick={onApplyPromo}
              className="px-4 h-9 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
              style={{ backgroundColor: "#C8720A" }}
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <button
        className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] hover:opacity-90"
        style={{ backgroundColor: "#C8720A" }}
      >
        Proceed to Checkout
        <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
      </button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-[#A89070]">
        <HugeiconsIcon icon={Lock} className="w-3.5 h-3.5" />
        Secure Transaction
      </div>

      <div
        className="flex items-center justify-center gap-1.5 text-xs border-t pt-4"
        style={{ borderColor: "#E5D9C0" }}
      >
        <HugeiconsIcon icon={MessageCircle} className="w-3.5 h-3.5 text-[#25D366]" />
        <a href="#" className="text-[#A89070] hover:text-[#2C1A0E] transition-colors">
          Need help? Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-5">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#F5EDD6" }}
      >
        <HugeiconsIcon icon={ShoppingBag} className="w-9 h-9 text-[#C8A87A]" />
      </div>
      <div className="space-y-1.5">
        <h2
          className="text-xl font-bold text-[#2C1A0E]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Your cart is empty
        </h2>
        <p className="text-sm text-[#A89070] max-w-xs">
          Looks like you haven't added anything yet. Browse our store and
          discover something you'll love.
        </p>
      </div>
      <Link
        href="/home"
        className="inline-flex items-center gap-2 px-6 h-11 rounded-xl font-semibold text-sm text-white transition-all active:scale-[0.98]"
        style={{ backgroundColor: "#C8720A" }}
      >
        Start Shopping
        <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
      </Link>
    </div>
  );
}

function SuggestedCard({ product }: { product: (typeof relatedProducts)[0] }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="group flex flex-col rounded-2xl border border-[#E5D9C0] bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative overflow-hidden bg-[#F5EDD6] aspect-[4/3]">
        <SmartImage
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={225}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p
          className="text-sm font-semibold text-[#2C1A0E] leading-snug line-clamp-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {product.name}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-[#C8720A]">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1800); }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{ backgroundColor: added ? "#4A7C59" : "#C8720A" }}
          >
            <HugeiconsIcon
              icon={added ? Check : Plus}
              className="w-3.5 h-3.5 text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
      <NavbarComponents cartCount={items.length} />

      <main className="max-w-7xl mx-auto px-4 sm:px-5 py-6 pb-28 lg:pb-10">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-sm text-[#A89070] hover:text-[#C8720A] transition-colors mb-6"
        >
          <HugeiconsIcon icon={ChevronLeft} className="w-4 h-4" />
          Continue Shopping
        </Link>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <h1
                    className="text-2xl font-bold text-[#2C1A0E]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Your Cart
                  </h1>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: "#C8720A" }}
                  >
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onUpdateQty={updateQty}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </section>

              <aside className="sticky top-20">
                <OrderSummary
                  subtotal={subtotal}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  promoApplied={promoApplied}
                  onApplyPromo={() => promoCode && setPromoApplied(true)}
                />
              </aside>
            </div>

            <section className="mt-12 space-y-5">
              <div className="flex items-center gap-3">
                <span
                  className="block w-1 h-5 rounded-full"
                  style={{ backgroundColor: "#C8720A" }}
                />
                <h2
                  className="font-bold text-[#2C1A0E]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  You May Also Like
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((p) => (
                  <SuggestedCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {items.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t px-4 py-3"
          style={{ backgroundColor: "#FEFCF7", borderColor: "#E5D9C0" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#A89070]">Total</span>
            <span
              className="font-bold text-[#2C1A0E]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {formatPrice(subtotal)}
            </span>
          </div>
          <button
            className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#C8720A" }}
          >
            Proceed to Checkout
            <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}
