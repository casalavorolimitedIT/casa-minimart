"use client";

import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectWishlistItems,
  removeWishlistItem,
  clearWishlist,
  toggleWishlistItem,
  type WishlistItem,
} from "@/store/wishlistSlice";
import { addItem, selectCartItems } from "@/store/cartSlice";
import { formatPrice, getStockLevel } from "@/lib/data";
import {
  useInventoryItems,
  useSiteCategories,
} from "@/lib/queries/supabase-rest";
import { adaptInventoryItem } from "@/lib/adapters";
import NavbarComponents from "@/components/ui/header";
import Footer from "@/components/home/Footer";
import SmartImage from "@/components/custom/smart-images";
import {
  Heart,
  ShoppingCart,
  Trash,
  ArrowLeft,
  Check,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

/* ── Single wishlist card ─────────────────────────────────────────────────── */
function WishlistCard({
  item,
  liveStock,
  livePrice,
}: {
  item: WishlistItem;
  liveStock: number | null;
  livePrice: number | null;
}) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartItem = cartItems.find((c) => c.id === item.id);
  const cartQty = cartItem?.qty ?? 0;

  const stock = liveStock ?? 0;
  const price = livePrice;
  const level = getStockLevel(stock);
  const outOfStock = level === "out";
  const noPrice = price === null;
  const atMax = cartQty >= stock;
  const inCart = cartQty > 0;

  const handleAddToCart = () => {
    if (outOfStock || atMax || price === null) return;
    dispatch(
      addItem({
        id: item.id,
        name: item.name,
        price,
        imageUrl: item.imageUrl,
        category: item.category,
        qty: 1,
      }),
    );
  };

  const handleRemove = () => {
    dispatch(removeWishlistItem(item.id));
  };

  const stockBadge =
    level === "out"
      ? { text: "Out of stock", cls: "bg-gray-400" }
      : level === "critical"
        ? { text: "Only 1 left", cls: "bg-red-500" }
        : level === "low"
          ? { text: `Only ${stock} left`, cls: "bg-orange-400" }
          : level === "medium"
            ? { text: `Only ${stock} left`, cls: "bg-amber-400" }
            : null;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-[#E5D9C0] bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Remove button */}
      <button
        type="button"
        onClick={handleRemove}
        aria-label="Remove from wishlist"
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#A89070] hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
      >
        <HugeiconsIcon icon={Trash} className="w-3.5 h-3.5" />
      </button>

      {/* Stock badge */}
      {stockBadge && (
        <div className="absolute top-2 left-2 z-10">
          <span className={`text-[10px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full ${stockBadge.cls}`}>
            {stockBadge.text}
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/home/product/${item.id}`} className="block">
        <div className="relative bg-[#F5EDD6] aspect-square overflow-hidden">
          <SmartImage
            src={item.imageUrl}
            alt={item.name}
            width={400}
            height={400}
            className="w-full h-50 object-cover transition-transform duration-300 group-hover:scale-105 aspect-square"
            label={item.name}
            fallbackVariant="initials"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]" />
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#A89070] mb-0.5">
            {item.category}
          </p>
          <Link href={`/home/product/${item.id}`}>
            <p className="text-sm font-semibold text-[#2C1A0E] leading-tight line-clamp-2 hover:text-[#C8720A] transition-colors">
              {item.name}
            </p>
          </Link>
        </div>
        <p className="text-base font-bold text-[#C8720A] mt-auto">
          {noPrice ? (
            <span className="text-sm font-medium text-[#A89070]">Price on request</span>
          ) : (
            formatPrice(price)
          )}
        </p>
      </div>

      {/* Add to cart */}
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock || atMax || noPrice}
          className={`w-full flex items-center justify-center gap-1.5 h-9 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            outOfStock || noPrice
              ? "bg-[#F5EDD6] text-[#A89070] cursor-not-allowed"
              : atMax
                ? "bg-[#7A5C3E] text-white cursor-not-allowed"
                : inCart
                  ? "bg-[#4A7C59] text-white hover:bg-[#3D6B4A]"
                  : "bg-[#C8720A] text-white hover:bg-[#B5640A]"
          }`}
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
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Empty state ──────────────────────────────────────────────────────────── */
function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center">
          <HugeiconsIcon icon={Heart} className="w-10 h-10 text-rose-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FBF5E6] border-2 border-white flex items-center justify-center">
          <span className="text-sm">✨</span>
        </div>
      </div>
      <h2 className="text-xl font-bold text-[#2C1A0E] mb-2">
        Your wishlist is empty
      </h2>
      <p className="text-sm text-[#A89070] max-w-xs mb-8">
        Browse our products and tap the heart icon to save items you love.
      </p>
      <Link
        href="/home"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white bg-[#C8720A] hover:bg-[#B5640A] transition-colors shadow-sm"
      >
        <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
        Start Shopping
      </Link>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────────────── */
export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectWishlistItems);
  const wishlistIds = React.useMemo(() => items.map((i) => i.id), [items]);

  const { data: categoriesData } = useSiteCategories({ p_site_id: SITE_ID });
  const categories = categoriesData ?? [];

  /* Fetch live stock + price for all wishlisted items */
  const { data: liveData } = useInventoryItems(
    {
      select: "*",
      queryParams: {
        site_id: SITE_ID,
        id: `in.(${wishlistIds.join(",")})`,
      },
    },
    { enabled: wishlistIds.length > 0 },
  );

  const serverMap = React.useMemo(() => {
    const map = new Map<string, { stock: number; price: number | null }>();
    (liveData ?? []).forEach((raw) => {
      const adapted = adaptInventoryItem(raw);
      map.set(adapted.id, { stock: adapted.stock, price: adapted.price });
    });
    return map;
  }, [liveData]);

  const handleClearAll = () => {
    if (confirm("Remove all items from your wishlist?")) {
      dispatch(clearWishlist());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">
      <NavbarComponents categories={categories} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/home"
              className="w-9 h-9 rounded-full border border-[#DDD0B3] flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
              aria-label="Back to shop"
            >
              <HugeiconsIcon icon={ArrowLeft} className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#2C1A0E] flex items-center gap-2">
                <HugeiconsIcon icon={Heart} className="w-5 h-5 text-rose-500" />
                My Wishlist
              </h1>
              {items.length > 0 && (
                <p className="text-xs text-[#A89070] mt-0.5">
                  {items.length} {items.length === 1 ? "item" : "items"} saved
                </p>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#DDD0B3] text-sm font-medium text-[#7A5C3E] hover:bg-[#F5EDD6] hover:border-rose-200 hover:text-rose-500 transition-colors"
            >
              <HugeiconsIcon icon={Trash} className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => {
              const live = serverMap.get(item.id);
              return (
                <WishlistCard
                  key={item.id}
                  item={item}
                  liveStock={live?.stock ?? null}
                  livePrice={live?.price ?? item.price}
                />
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
