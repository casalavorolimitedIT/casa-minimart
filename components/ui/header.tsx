"use client";

import React, { useState } from "react";
import Link from "next/link";

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
  Heart,
  Home,
  Leaf,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const categoryGroups = [
  {
    title: "Fresh & Pantry",
    items: [
      {
        title: "Fresh Produce",
        href: "#",
        icon: Leaf,
        desc: "Fruits, vegetables, herbs",
      },
      {
        title: "Pantry Staples",
        href: "#",
        icon: Package,
        desc: "Rice, pasta, canned goods",
      },
      {
        title: "Best Sellers",
        href: "#",
        icon: Star,
        desc: "What everyone's buying",
      },
    ],
  },
  {
    title: "Drinks & Snacks",
    items: [
      {
        title: "Tea & Coffee",
        href: "#",
        icon: Coffee,
        desc: "Morning pick-me-ups",
      },
      {
        title: "Snacks",
        href: "#",
        icon: Cookie,
        desc: "Chips, sweets, biscuits",
      },
    ],
  },
  {
    title: "Home & Care",
    items: [
      {
        title: "Household",
        href: "#",
        icon: Home,
        desc: "Cleaning & home essentials",
      },
      {
        title: "Toiletries",
        href: "#",
        icon: UtensilsCrossed,
        desc: "Personal care basics",
      },
    ],
  },
];

export default function NavbarComponents({ cartCount = 2 }: { cartCount?: number }) {
  const [searchFocused, setSearchFocused] = useState(false);

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
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "var(--espresso)" }}
          >
            <span className="text-white text-xs font-bold font-display">C</span>
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
                <div className="grid grid-cols-3 gap-6 p-6 w-[580px]">
                  {categoryGroups.map((group) => (
                    <div key={group.title}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-3">
                        {group.title}
                      </p>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.title}>
                            <NavigationMenuLink
                              render={
                                <a
                                  href={item.href}
                                  className="flex items-start gap-2.5 rounded-lg p-2 hover:bg-[#F5EDD6] transition-colors group"
                                >
                                  <HugeiconsIcon
                                    icon={item.icon}
                                    className="w-4 h-4 mt-0.5 text-[#C8720A] shrink-0"
                                  />
                                  <div>
                                    <p className="text-sm font-semibold text-[#2C1A0E] group-hover:text-[#C8720A] transition-colors">
                                      {item.title}
                                    </p>
                                    <p className="text-[11px] text-[#A89070]">
                                      {item.desc}
                                    </p>
                                  </div>
                                </a>
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#DDD0B3] p-4 bg-[#F5EDD6]">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-semibold text-[#C8720A] hover:underline"
                  >
                    <HugeiconsIcon icon={Sparkles} className="w-4 h-4" />
                    View all products →
                  </a>
                </div>
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
        <div
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
            placeholder="Search for everyday essentials in Abuja..."
            className="pl-9 pr-3 h-9 text-sm"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

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
