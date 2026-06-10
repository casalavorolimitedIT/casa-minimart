"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import {
  ChevronDown,
  Coffee,
  Cookie,
  Droplets,
  Heart,
  Home,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type SiteCategory } from "@/lib/queries/supabase-rest";

const CATEGORY_ICONS: Record<string, typeof Package> = {
  General: Package,
  Toiletries: Droplets,
  Bodycare: Sparkles,
  Beverages: Coffee,
  Snacks: Cookie,
  Pantry: Package,
  Household: Home,
};

function categorySlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function NavbarComponents({
  cartCount = 2,
  categories = [],
}: {
  cartCount?: number;
  categories?: SiteCategory[];
}) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      router.push(`/home/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#DDD0B3]"
      style={{
        backgroundColor: "rgba(255, 253, 247, 0.8)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <a href="/home" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-700">
            <span className="text-white  text-xs font-bold font-display">
              C
            </span>
          </div>
          <span
            className="hidden sm:block font-display font-bold text-base leading-tight"
            style={{ color: "var(--espresso)" }}
          >
            Casalavoro
            <span
              className="block text-[10px] font-normal tracking-widest uppercase"
              style={{ color: "var(--amber-brand)" }}
            >
              Minimart
            </span>
          </span>
        </a>

        {/* Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-semibold text-sm gap-1">
                Categories
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                {categories.length > 0 ? (
                  <div className="p-4 w-[320px]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-3">
                      Shop by Category
                    </p>
                    <ul className="grid grid-cols-2 gap-1">
                      {categories.map((cat) => {
                        const icon = CATEGORY_ICONS[cat.category] ?? Package;
                        return (
                          <li key={cat.category}>
                            <NavigationMenuLink
                              render={
                                <Link
                                  href={`/home/category/${categorySlug(cat.category)}`}
                                  className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-[#F5EDD6] transition-colors group"
                                >
                                  <HugeiconsIcon
                                    icon={icon}
                                    className="w-4 h-4 text-[#C8720A] shrink-0"
                                  />
                                  <span className="text-sm font-semibold text-[#2C1A0E] group-hover:text-[#C8720A] transition-colors">
                                    {cat.category}
                                  </span>
                                </Link>
                              }
                            />
                          </li>
                        );
                      })}
                    </ul>
                    <div className="border-t border-[#DDD0B3] mt-4 pt-3">
                      <Link
                        href="/home"
                        className="flex items-center gap-2 text-sm font-semibold text-[#C8720A] hover:underline"
                      >
                        <HugeiconsIcon icon={Sparkles} className="w-4 h-4" />
                        View all products →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 w-[280px]">
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-9 rounded-lg bg-[#F5EDD6] animate-pulse"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Best Sellers
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Deals
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className={cn(
            "flex-1 max-w-md relative transition-all duration-200",
            searchFocused ? "max-w-lg" : "",
          )}
        >
          <HugeiconsIcon
            icon={Search}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "var(--amber-brand)" }}
          />
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for everyday essentials"
            className="pl-9 pr-3 h-9 text-sm"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </form>

        {/* Right actions */}
        <div className="flex items-center gap-1 ml-auto shrink-0">
          {/* Location */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#7A5C3E]"
          >
            <HugeiconsIcon
              icon={MapPin}
              className="w-3.5 h-3.5 text-[#C8720A]"
            />
            Abuja
            <HugeiconsIcon icon={ChevronDown} className="w-3 h-3" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative">
            <HugeiconsIcon
              icon={Heart}
              className="w-4.5 h-4.5"
              style={{ color: "var(--espresso)" }}
            />
          </Button>

          {/* Cart */}
          <Link href="/home/cart">
            <Button variant="ghost" size="icon" className="relative">
              <HugeiconsIcon
                icon={ShoppingCart}
                className="w-4.5 h-4.5"
                style={{ color: "var(--espresso)" }}
              />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ backgroundColor: "#C8720A" }}
                >
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
