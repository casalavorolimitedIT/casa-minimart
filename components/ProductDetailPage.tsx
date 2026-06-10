"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  MapPin,
  Search,
  ChevronDown,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { featuredProduct, relatedProducts, formatPrice } from "@/lib/data";
import Footer from "@/components/home/Footer";
import SmartImage from "./custom/smart-images";

/* ─────────────────────────────────────────────
   HEADER (shared)
───────────────────────────────────────────── */
function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "#2C1A0E",
        borderColor: "#4A2E1A",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 h-14 flex items-center gap-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#C8720A] flex items-center justify-center">
            <span
              className="text-white text-xs font-bold"
              style={{ fontFamily: "Georgia, serif" }}
            >
              C
            </span>
          </div>
          <div className="hidden sm:block">
            <p
              className="text-white text-sm font-bold leading-none"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Casalavoro
            </p>
            <p className="text-[#C8A87A] text-[9px] tracking-widest uppercase leading-none mt-0.5">
              Minimart
            </p>
          </div>
        </a>

        {/* Search */}
        <div className="flex-1 max-w-sm relative mx-4">
          <HugeiconsIcon
            icon={Search}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A5C3E]"
          />
          <input
            placeholder="Search products..."
            className="w-full h-8 pl-9 pr-3 rounded-lg bg-[#3A2010] border border-[#4A2E1A] text-white text-sm placeholder:text-[#7A5C3E] focus:outline-none focus:border-[#C8720A] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-md text-[#C8A87A] text-xs hover:bg-[#3A2010] transition-colors">
            <HugeiconsIcon
              icon={MapPin}
              className="w-3.5 h-3.5 text-[#C8720A]"
            />
            Abuja
            <HugeiconsIcon icon={ChevronDown} className="w-3 h-3" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md text-[#C8A87A] hover:bg-[#3A2010] transition-colors">
            <HugeiconsIcon icon={Heart} className="w-4 h-4" />
          </button>
          <Link
            href="/home/cart"
            className="relative w-8 h-8 flex items-center justify-center rounded-md text-[#C8A87A] hover:bg-[#3A2010] transition-colors"
          >
            <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C8720A] text-white text-[9px] font-bold flex items-center justify-center">
              2
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   BREADCRUMB
───────────────────────────────────────────── */
function Breadcrumb() {
  const crumbs = ["Home", "Body Care & Skincare", "Bio Oil (Special Care)"];
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#A89070]">
      {crumbs.map((crumb, i) => (
        <React.Fragment key={crumb}>
          {i > 0 && (
            <HugeiconsIcon
              icon={ChevronRight}
              className="w-3 h-3 text-[#C8A87A]"
            />
          )}
          {i < crumbs.length - 1 ? (
            <a href="#" className="hover:text-[#C8720A] transition-colors">
              {crumb}
            </a>
          ) : (
            <span className="text-[#2C1A0E] font-medium truncate max-w-[160px]">
              {crumb}
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
function ImageGallery({ images, badge }: { images: string[]; badge?: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-[#F5EDD6] aspect-square">
        <SmartImage
          src={images[active]}
          alt="Product"
          width={600}
          height={600}
          className="object-fill transition-all aspect-square duration-500"
        />
        {/* Badge */}
        {badge && (
          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white bg-red-500 shadow-md">
            {badge}
          </span>
        )}
        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActive((a) => (a - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <HugeiconsIcon
                icon={ChevronLeft}
                className="w-4 h-4 text-[#2C1A0E]"
              />
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow flex items-center justify-center hover:bg-white transition-colors"
            >
              <HugeiconsIcon
                icon={ChevronRight}
                className="w-4 h-4 text-[#2C1A0E]"
              />
            </button>
          </>
        )}
        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-200 ${i === active ? "w-5 h-1.5 bg-[#C8720A]" : "w-1.5 h-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
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
              alt={`Thumbnail ${i + 1}`}
              width={300}
              height={300}
              className="object-fill aspect-square"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   QUANTITY SELECTOR
───────────────────────────────────────────── */
function QuantitySelector() {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-xl border border-[#DDD0B3] overflow-hidden bg-white">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="w-9 h-9 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={Minus} className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center text-sm font-bold text-[#2C1A0E]">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="w-9 h-9 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={Plus} className="w-3.5 h-3.5" />
        </button>
      </div>
      <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#DDD0B3] text-[#A89070] hover:text-red-400 hover:border-red-200 transition-colors bg-white">
        <HugeiconsIcon icon={Heart} className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   RELATED PRODUCT CARD
───────────────────────────────────────────── */
function RelatedCard({ product }: { product: (typeof relatedProducts)[0] }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="group flex flex-col rounded-2xl border border-[#E5D9C0] bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative overflow-hidden bg-[#F5EDD6] aspect-[4/3]">
        <SmartImage
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={300}
          className="object-cover group-hover:scale-105 transition-transform duration-300 aspect-[4/3]"
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
            onClick={() => {
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{ backgroundColor: added ? "#4A7C59" : "#C8720A" }}
          >
            {added ? (
              <HugeiconsIcon icon={Check} className="w-3.5 h-3.5 text-white" />
            ) : (
              <HugeiconsIcon icon={Plus} className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProductDetailPage() {
  const product = featuredProduct;
  const [addedToCart, setAddedToCart] = useState(false);
  const [relatedStart, setRelatedStart] = useState(0);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
      <Header />

      <main className="max-w-7xl mx-auto px-5 py-6 space-y-10">
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* ── Product Hero ─────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — gallery */}
          <ImageGallery images={product.images} badge={product.badge} />

          {/* Right — info panel */}
          <div className="flex flex-col gap-5">
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
              <StarRating rating={product.rating} count={product.reviewCount} />
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
            <p className="text-sm text-[#5A3A20] leading-relaxed">
              {product.description}
            </p>

            {/* Highlights */}
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

            {/* Divider */}
            <div className="h-px bg-[#E5D9C0]" />

            {/* Quantity + wishlist */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#A89070] uppercase tracking-wider">
                Quantity
              </p>
              <QuantitySelector />
            </div>

            {/* CTAs */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98]"
                style={{ backgroundColor: addedToCart ? "#4A7C59" : "#C8720A" }}
              >
                {addedToCart ? (
                  <>
                    <HugeiconsIcon icon={Check} className="w-4 h-4" /> Added to
                    Cart!
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />{" "}
                    Add to Cart
                  </>
                )}
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm border-2 transition-all duration-200 active:scale-[0.98] hover:bg-[#FBF5E6]"
                style={{ borderColor: "#C8720A", color: "#C8720A" }}
              >
                Buy Now
              </button>
            </div>

            {/* Delivery card */}
            {/* <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ borderColor: "#DDD0B3", backgroundColor: "#FEFCF7" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#EAF2EC" }}
              >
                <HugeiconsIcon
                  icon={Truck}
                  className="w-4 h-4 text-[#4A7C59]"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2C1A0E]">
                  Abuja Delivery
                </p>
                <p className="text-xs text-[#A89070]">
                  Delivered within 45–60 mins to your residence.
                </p>
              </div>
            </div> */}
          </div>
        </div>

        {/* line */}
        <div className="h-px bg-[#E5D9C0]"></div>
        {/* ── How to use + Ingredients ─────────── */}
        <div className="grid grid-cols-1 hidden md:grid-cols-2 gap-5">
          {/* How to use */}
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

          {/* Ingredients */}
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
        </div>

        {/* ── You may also like ─────────────────── */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
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
            <div className="flex gap-1.5">
              <button
                onClick={() => setRelatedStart((s) => Math.max(0, s - 1))}
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
                style={{ borderColor: "#DDD0B3" }}
              >
                <HugeiconsIcon icon={ChevronLeft} className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setRelatedStart((s) =>
                    Math.min(relatedProducts.length - 4, s + 1),
                  )
                }
                className="w-8 h-8 rounded-lg border flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
                style={{ borderColor: "#DDD0B3" }}
              >
                <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
