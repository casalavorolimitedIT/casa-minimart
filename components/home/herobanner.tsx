"use client";

import { ChevronLeft, ChevronRight } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import SmartImage from "../custom/smart-images";
import { Button } from "../ui/button";

const heroSlides = [
  {
    id: 1,
    title: "Tim Hortons",
    subtitle: "Premium instant coffee — rich, bold, and satisfying",
    tag: "☕ New Arrival",
    bg: "from-[#2C1A0E] via-[#4A2E1A] to-[#6B3F1F]",
    accent: "#C8720A",
    imageUrl:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=85",
  },
  {
    id: 2,
    title: "Fresh Produce",
    subtitle: "Farm-fresh fruits and vegetables delivered to your door",
    tag: "🌿 Just In",
    bg: "from-[#1A3A2A] via-[#2A5A3A] to-[#3A7A4A]",
    accent: "#4A7C59",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=85",
  },
  {
    id: 3,
    title: "Snack Season",
    subtitle: "Gourmet treats and imported snacks for every craving",
    tag: "🍪 Featured",
    bg: "from-[#3A1A2A] via-[#5A2A3A] to-[#7A3A1A]",
    accent: "#C85A20",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85",
  },
];

const featuredTiles = [
  {
    id: "toiletries",
    title: "Toiletries",
    desc: "Essentials for your daily routine",
    imageUrl:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80",
  },
  {
    id: "tea-coffee",
    title: "Tea & Coffee",
    desc: "Morning pick-me-ups",
    imageUrl:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
  },
  {
    id: "snacks",
    title: "Snacks",
    desc: "Delicious treats for any time",
    imageUrl:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const slide = heroSlides[current];

  const prev = () =>
    setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setCurrent((c) => (c + 1) % heroSlides.length);

  return (
    <div className="space-y-4">
      {/* Main hero */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${slide.bg} h-44 sm:h-56 transition-all duration-500`}
      >
        {/* Background image */}
        <SmartImage
          src={slide.imageUrl}
          alt={slide.title}
          width={800}
          height={450}
          className=" inset-0 w-full h-full object-contain opacity-30 mix-blend-luminosity"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end h-full p-5 sm:p-7">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 w-fit"
            style={{ backgroundColor: slide.accent, color: "white" }}
          >
            {slide.tag}
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white leading-tight"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {slide.title}
          </h1>
          <p className="text-white/70 text-sm mt-1 max-w-xs">
            {slide.subtitle}
          </p>
        </div>

        {/* Nav arrows */}
        <Button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
        >
          <HugeiconsIcon icon={ChevronLeft} className="w-4 h-4" />
        </Button>
        <Button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors"
        >
          <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
        </Button>

        {/* Dots */}
        <div className="absolute bottom-3 right-5 flex gap-1.5">
          {heroSlides.map((_, i) => (
            <Button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 pt-1">
        <span
          className="block w-1 h-5 rounded-full"
          style={{ backgroundColor: "var(--amber-brand)" }}
        />
        <h2
          className="text-sm font-bold uppercase tracking-widest"
          style={{ color: "var(--espresso)", fontFamily: "Georgia, serif" }}
        >
          Featured This Week
        </h2>
      </div>

      {/* Featured tiles */}
      <div className="grid grid-cols-3 gap-3">
        {featuredTiles.map((tile) => (
          <a
            key={tile.id}
            href={`#${tile.id}`}
            className="group relative rounded-xl overflow-hidden aspect-[4/3] block"
          >
            <SmartImage
              src={tile.imageUrl}
              alt={tile.title}
              width={400}
              height={300}
              className="w-full h-full object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p
                className="text-white text-sm font-bold leading-tight"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {tile.title}
              </p>
              <p className="text-white/70 text-[10px] mt-0.5">{tile.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
