"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Delete,
  Lock,
  ShoppingBag,
  MessageCircle,
  Check,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatPrice, relatedProducts } from "@/lib/data";
import SmartImage from "@/components/custom/smart-images";
import NavbarComponents from "@/components/ui/header";
import Footer from "@/components/home/Footer";
import {
  useSiteCategories,
  fetchInventoryItems,
} from "@/lib/queries/supabase-rest";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeItem,
  updateQty,
  syncWithServer,
  selectCartItems,
  selectCartTotal,
  addItem,
  type CartItem,
} from "@/store/cartSlice";
import CheckoutModal from "@/components/CheckoutModal";


function CartItemCard({
  item,
  maxStock,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  maxStock: number;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  const atMax = item.qty >= maxStock;

  return (
    <div
      className="group flex gap-4 rounded-2xl bg-white border p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      style={{ borderColor: "#E5D9C0" }}
    >
      <div
        className="relative shrink-0 rounded-xl overflow-hidden bg-[#F5EDD6] aspect-square"
        style={{ width: 96, height: 96 }}
      >
        <SmartImage
          src={item.imageUrl}
          alt={item.name}
          width={196}
          height={196}
          className="object-stretch aspect-square"
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
              aria-label={`Decrease quantity of ${item.name}`}
              className="w-8 h-8 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
            >
              <HugeiconsIcon icon={Minus} className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-[#2C1A0E]">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, 1)}
              disabled={atMax}
              aria-label={`Increase quantity of ${item.name}`}
              className={`w-8 h-8 flex items-center justify-center transition-colors ${
                atMax
                  ? "text-[#DDD0B3] cursor-not-allowed"
                  : "text-[#7A5C3E] hover:bg-[#F5EDD6]"
              }`}
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
              aria-label={`Remove ${item.name} from cart`}
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

const VAT_RATE = parseFloat(process.env.NEXT_PUBLIC_VAT_RATE ?? "0.075");

function OrderSummary({
  subtotal,
  onCheckout,
}: {
  subtotal: number;
  onCheckout: () => void;
}) {
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

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
          <span className="font-semibold text-[#2C1A0E]">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#7A5C3E]">VAT (7.5%)</span>
          <span className="font-semibold text-[#2C1A0E]">
            {formatPrice(vat)}
          </span>
        </div>
      </div>

      <div className="h-px bg-[#E5D9C0]" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#2C1A0E]">Total</span>
        <span
          className="text-2xl font-bold text-[#2C1A0E]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {formatPrice(total)}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
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
        <HugeiconsIcon
          icon={MessageCircle}
          className="w-3.5 h-3.5 text-[#25D366]"
        />
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#A89070] hover:text-[#2C1A0E] transition-colors"
        >
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
          Looks like you haven&apos;t added anything yet. Browse our store and
          discover something you&apos;ll love.
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
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [added, setAdded] = React.useState(false);

  const cartItem = cartItems.find((i) => i.id === product.id);
  const inCart = (cartItem?.qty ?? 0) > 0;

  const handleAdd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: "General",
        qty: 1,
      }),
    );
    setAdded(true);
    timerRef.current = setTimeout(() => setAdded(false), 1800);
  };

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
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{ backgroundColor: added || inCart ? "#4A7C59" : "#C8720A" }}
          >
            <HugeiconsIcon
              icon={added || inCart ? Check : Plus}
              className="w-3.5 h-3.5 text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const hasSynced = useRef(false);

  const { data: categoriesData } = useSiteCategories({ p_site_id: SITE_ID });
  const categories = categoriesData ?? [];

  const cartIds = items.map((i) => i.id);

  const { data: serverItems } = useQuery({
    queryKey: ["cart-sync-initial"],
    queryFn: () =>
      fetchInventoryItems({
        queryParams: {
          id: `in.(${cartIds.join(",")})`,
          site_id: SITE_ID,
        },
      }),
    enabled: cartIds.length > 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!serverItems || hasSynced.current) return;
    hasSynced.current = true;

    const anyChange = items.some((item) => {
      const server = serverItems.find((s) => s.id === item.id);
      if (!server || server.quantity === 0) return true;
      if (item.qty > server.quantity) return true;
      const serverPrice =
        server.price !== null ? parseFloat(server.price) : NaN;
      if (!isNaN(serverPrice) && serverPrice !== item.price) return true;
      return false;
    });

    dispatch(syncWithServer(serverItems));

    if (anyChange) {
      toast("Some items were updated to match current availability");
    }
  }, [serverItems, items]); // eslint-disable-line react-hooks/exhaustive-deps

  const stockMap = new Map(
    (serverItems ?? []).map((s) => [s.id, s.quantity]),
  );

  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  const handleUpdateQty = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = item.qty + delta;
    const maxStock = stockMap.get(id) ?? Infinity;
    if (newQty > maxStock) return;
    dispatch(updateQty({ id, qty: newQty }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
      <NavbarComponents categories={categories} />

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
                      maxStock={stockMap.get(item.id) ?? Infinity}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </section>

              <aside className="sticky top-20">
                <OrderSummary
                  subtotal={subtotal}
                  onCheckout={() => setCheckoutOpen(true)}
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
            <span className="text-sm text-[#A89070]">
              Total <span className="text-[10px]">(incl. 7.5% VAT)</span>
            </span>
            <span
              className="font-bold text-[#2C1A0E]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {formatPrice(total)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCheckoutOpen(true)}
            className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ backgroundColor: "#C8720A" }}
          >
            Proceed to Checkout
            <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
          </button>
        </div>
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        subtotal={subtotal}
      />

      <Footer />
    </div>
  );
}
