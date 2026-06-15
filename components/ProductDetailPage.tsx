"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Droplets,
  Flask,
  ChevronLeft,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, selectCartItems } from "@/store/cartSlice";
import { formatPrice, type Product } from "@/lib/data";
import Footer from "@/components/home/Footer";
import SmartImage from "./custom/smart-images";
import NavbarComponents from "@/components/ui/header";
import {
  useInventoryItems,
  useSiteCategories,
  type InventoryItem,
} from "@/lib/queries/supabase-rest";
import {
  getAllImageUrls,
  adaptInventoryItem,
  CATEGORY_ACCENT,
} from "@/lib/adapters";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

/* ── Detail-specific product shape ──────────────────────────────────────── */

interface DetailProduct {
  id: string;
  name: string;
  category: string;
  price: number | null;
  stock: number;
  images: string[];
  subtitle?: string;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  deliveryNote?: string;
  note?: string;
  highlights: string[];
  howToUse: string[];
  ingredients?: string;
}

function adaptToDetail(item: InventoryItem): DetailProduct {
  const parsed = item.price !== null ? parseFloat(item.price) : null;
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: parsed !== null && !isNaN(parsed) ? parsed : null,
    stock: item.quantity,
    images: getAllImageUrls(item.images),
    note: item.note ?? undefined,
    highlights: [],
    howToUse: [],
  };
}

/* ─────────────────────────────────────────────
   BREADCRUMB
───────────────────────────────────────────── */
function Breadcrumb({
  category,
  productName,
}: {
  category?: string;
  productName?: string;
}) {
  const crumbs = [
    { label: "Home", href: "/home" },
    ...(category
      ? [
          {
            label: category,
            href: `/home/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
          },
        ]
      : []),
    ...(productName ? [{ label: productName, href: "" }] : []),
  ];

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#A89070]">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb.label}>
          {i > 0 && (
            <HugeiconsIcon
              icon={ChevronRight}
              className="w-3 h-3 text-[#C8A87A]"
            />
          )}
          {i < crumbs.length - 1 ? (
            <Link
              href={crumb.href}
              className="hover:text-[#C8720A] transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#2C1A0E] font-medium truncate max-w-[200px]">
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────
   STAR RATING
───────────────────────────────────────────── */
function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <HugeiconsIcon
            key={n}
            icon={Star}
            className="w-3.5 h-3.5"
            style={{ color: n <= Math.round(rating) ? "#C8720A" : "#DDD0B3" }}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-[#C8720A]">{rating}</span>
      <span className="text-xs text-[#A89070]">({count} reviews)</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   IMAGE GALLERY
───────────────────────────────────────────── */
function ImageGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);
  const displayImages = images.length > 0 ? images : [""];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#F5EDD6] aspect-square">
        <SmartImage
          src={displayImages[active]}
          alt={name}
          width={600}
          height={600}
          className="object-fill transition-all aspect-square duration-500"
          label={name}
          fallbackVariant="initials"
        />
        {badge && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500 shadow-md">
            {badge}
          </span>
        )}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive(
                  (a) => (a - 1 + displayImages.length) % displayImages.length,
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <HugeiconsIcon
                icon={ChevronLeft}
                className="w-4 h-4 text-[#2C1A0E]"
              />
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % displayImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <HugeiconsIcon
                icon={ChevronRight}
                className="w-4 h-4 text-[#2C1A0E]"
              />
            </button>
          </>
        )}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {displayImages.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-200 ${
                i === active
                  ? "w-5 h-1.5 bg-[#C8720A]"
                  : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {displayImages.map((img, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setActive(i)}
              className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all duration-150 ${
                i === active
                  ? "border-[#C8720A] shadow-sm"
                  : "border-transparent hover:border-[#DDD0B3]"
              }`}
            >
              <SmartImage
                src={img}
                alt={`${name} ${i + 1}`}
                width={300}
                height={300}
                className="object-fill aspect-square"
                label={name}
                fallbackVariant="initials"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUANTITY SELECTOR
───────────────────────────────────────────── */
function QuantitySelector({
  max,
  qty,
  onChange,
}: {
  max: number;
  qty: number;
  onChange: (qty: number) => void;
}) {
  const atMax = qty >= max;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-xl border border-[#DDD0B3] overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, qty - 1))}
          className="w-9 h-9 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={Minus} className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center text-sm font-bold text-[#2C1A0E]">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, qty + 1))}
          disabled={atMax}
          className={`w-9 h-9 flex items-center justify-center text-[#7A5C3E] transition-colors ${
            atMax ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F5EDD6]"
          }`}
        >
          <HugeiconsIcon icon={Plus} className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#DDD0B3] text-[#A89070] hover:text-red-400 hover:border-red-200 transition-colors bg-white"
      >
        <HugeiconsIcon icon={Heart} className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RELATED PRODUCT CARD
───────────────────────────────────────────── */
function RelatedCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  return (
    <Link
      href={`/home/product/${product.id}`}
      className="group flex flex-col rounded-2xl border border-[#E5D9C0] bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="relative overflow-hidden bg-[#F5EDD6] aspect-[4/3]">
        <SmartImage
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={300}
          className="object-cover group-hover:scale-105 transition-transform duration-300 aspect-[4/3]"
          label={product.name}
          fallbackVariant="initials"
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
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{
              backgroundColor: added ? "#4A7C59" : "#C8720A",
              opacity: product.stock === 0 ? 0.6 : 1,
              cursor: product.stock === 0 ? "not-allowed" : "pointer",
            }}
          >
            {added ? (
              <HugeiconsIcon icon={Check} className="w-3.5 h-3.5 text-white" />
            ) : (
              <HugeiconsIcon icon={Plus} className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.slug as string;
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const [selectedQty, setSelectedQty] = useState(1);

  const { data: categoriesData } = useSiteCategories({ p_site_id: SITE_ID });
  const categories = categoriesData ?? [];

  /* ── Fetch the product by ID ── */
  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useInventoryItems({
    select: "*",
    queryParams: { id: productId, site_id: SITE_ID },
    limit: 1,
  });

  const rawProduct = productData?.[0];
  const product: DetailProduct | null = rawProduct
    ? adaptToDetail(rawProduct)
    : null;

  /* ── Fetch related products (same category, excluding this one) ── */
  const { data: relatedData } = useInventoryItems(
    {
      select: "*",
      queryParams: {
        site_id: SITE_ID,
        category: rawProduct?.category,
        id: `neq.${productId}`,
      },
      limit: 5,
    },
    { enabled: !!rawProduct?.category },
  );

  const relatedProducts: Product[] = (relatedData ?? [])
    .slice(0, 4)
    .map(adaptInventoryItem);

  const cartItem = product ? cartItems.find((i) => i.id === product.id) : undefined;
  const cartQty = cartItem?.qty ?? 0;
  const atCartMax = product ? cartQty >= product.stock : false;

  const handleAddToCart = () => {
    if (!product || product.stock === 0 || atCartMax || product.price === null) return;
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] ?? "",
        category: product.category,
        qty: selectedQty,
      }),
    );
    setSelectedQty(1);
  };

  /* ── Loading state ── */
  if (productLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
        <NavbarComponents categories={categories} />
        <div className="max-w-7xl mx-auto px-5 py-20 flex items-center justify-center">
          <p className="text-sm" style={{ color: "var(--espresso)" }}>
            Loading product…
          </p>
        </div>
      </div>
    );
  }

  /* ── Not found / error state ── */
  if (productError || !product) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
        <NavbarComponents categories={categories} />
        <div className="max-w-7xl mx-auto px-5 py-20 text-center">
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--espresso)" }}
          >
            Product not found
          </p>
          <Link
            href="/home"
            className="text-sm text-[#C8720A] hover:underline mt-2 inline-block"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const accentColor =
    CATEGORY_ACCENT[product.category] ?? CATEGORY_ACCENT._default;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
      <NavbarComponents categories={categories} />

      <main className="max-w-7xl mx-auto px-5 py-6 space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb category={product.category} productName={product.name} />

        {/* ── Product Hero ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — gallery */}
          <ImageGallery
            images={product.images}
            name={product.name}
            badge={product.badge}
          />

          {/* Right — info panel */}
          <div className="flex flex-col gap-5">
            {/* Category pill */}
            <span
              className="self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: `${accentColor}20`,
                color: accentColor,
              }}
            >
              {product.category}
            </span>

            {/* Title block */}
            <div className="space-y-2">
              <h1
                className="text-2xl sm:text-3xl font-bold leading-tight text-[#2C1A0E]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-sm text-[#A89070] font-medium">
                  {product.subtitle}
                </p>
              )}
              {product.rating !== undefined &&
                product.reviewCount !== undefined && (
                  <StarRating
                    rating={product.rating}
                    count={product.reviewCount}
                  />
                )}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#E5D9C0]" />

            {/* Price block */}
            <div className="space-y-1">
              <p
                className="text-3xl font-bold text-[#2C1A0E]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {formatPrice(product.price)}
              </p>
              {product.deliveryNote && (
                <p className="text-xs text-[#A89070] flex items-center gap-1.5">
                  <HugeiconsIcon
                    icon={Truck}
                    className="w-3.5 h-3.5 text-[#4A7C59]"
                  />
                  {product.deliveryNote}
                </p>
              )}
            </div>

            {/* Description */}
            {product.note && (
              <p className="text-sm text-[#5A3A20] leading-relaxed">
                {product.note}
              </p>
            )}

            {/* Highlights */}
            {product.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#EAF2EC", color: "#4A7C59" }}
                  >
                    <HugeiconsIcon icon={Check} className="w-3 h-3" />
                    {h}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-[#E5D9C0]" />

            {/* Quantity + wishlist */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#A89070] uppercase tracking-wider">
                  Quantity
                </p>
                {product.stock === 0 ? (
                  <p className="text-xs font-semibold text-gray-400">
                    Out of stock
                  </p>
                ) : product.stock <= 5 ? (
                  <p className="text-xs font-semibold text-orange-500">
                    Only {product.stock} left
                  </p>
                ) : (
                  <p className="text-xs text-[#A89070]">
                    {product.stock} in stock
                  </p>
                )}
              </div>
              {product.stock > 0 && (
                <QuantitySelector
                  max={Math.max(1, product.stock - cartQty)}
                  qty={selectedQty}
                  onChange={setSelectedQty}
                />
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || atCartMax || product.price === null}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  backgroundColor: atCartMax
                    ? "#7A5C3E"
                    : product.stock === 0 || product.price === null
                      ? "#A89070"
                      : "#C8720A",
                  cursor:
                    product.stock === 0 || atCartMax || product.price === null
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {atCartMax ? (
                  "Max in Cart"
                ) : product.stock === 0 ? (
                  "Out of Stock"
                ) : product.price === null ? (
                  "Price on Request"
                ) : (
                  <>
                    <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm border-2 transition-all duration-200 active:scale-[0.98] hover:bg-[#FBF5E6]"
                style={{
                  borderColor: "#C8720A",
                  color: "#C8720A",
                  opacity: product.stock === 0 ? 0.6 : 1,
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* line */}
        <div className="h-px bg-[#E5D9C0]" />

        {/* ── How to use + Ingredients ─────────── */}
        {(product.howToUse.length > 0 || product.ingredients) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {product.howToUse.length > 0 && (
              <div
                className="rounded-2xl p-6 space-y-4 border"
                style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#FBF5E6" }}
                  >
                    <HugeiconsIcon
                      icon={Droplets}
                      className="w-4 h-4 text-[#C8720A]"
                    />
                  </div>
                  <h2
                    className="font-bold text-[#2C1A0E]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    How to use
                  </h2>
                </div>
                <ol className="space-y-3">
                  {product.howToUse.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                        style={{ backgroundColor: "#C8720A" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-[#5A3A20] leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {product.ingredients && (
              <div
                className="rounded-2xl p-6 space-y-4 border"
                style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#EAF2EC" }}
                  >
                    <HugeiconsIcon
                      icon={Flask}
                      className="w-4 h-4 text-[#4A7C59]"
                    />
                  </div>
                  <h2
                    className="font-bold text-[#2C1A0E]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Ingredients
                  </h2>
                </div>
                <p className="text-sm text-[#5A3A20] leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── You may also like ─────────────────── */}
        {relatedProducts.length > 0 && (
          <section className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="block w-1 h-5 rounded-full"
                style={{ backgroundColor: "#C8720A" }}
              />
              <h2
                className="font-bold text-[#2C1A0E]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                You may also like
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <RelatedCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
