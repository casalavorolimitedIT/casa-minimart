"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./navigation-menu";
import {
  Cancel01Icon,
  ChevronDown,
  ChevronRight,
  Coffee,
  Cookie,
  Droplets,
  FileText,
  Grid,
  Heart,
  HelpCircleIcon,
  Home,
  MapPin,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Sparkles,
  Truck,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type SiteCategory } from "@/lib/queries/supabase-rest";
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";
import { selectWishlistCount } from "@/store/wishlistSlice";

const CartBadge = dynamic(
  () => import("@/components/ui/cart-badge").then((m) => m.CartBadge),
  { ssr: false },
);
const WishlistBadge = dynamic(
  () => import("@/components/ui/wishlist-badge").then((m) => m.WishlistBadge),
  { ssr: false },
);

const CATEGORY_ICONS: Record<string, typeof Package> = {
  General: Grid,
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

/* ── Mobile navigation drawer content ───────────────────────────────────── */
function MobileNavContent({
  categories,
  categoriesLoading,
  onClose,
}: {
  categories: SiteCategory[];
  categoriesLoading?: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const cartCount = useAppSelector(selectCartCount);
  const wishlistCount = useAppSelector(selectWishlistCount);

  const quickLinks = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Search", href: "/home/search", icon: Search },
    {
      label: "Wishlist",
      href: "/home/wishlist",
      icon: Heart,
      badge: wishlistCount,
    },
    {
      label: "Cart",
      href: "/home/cart",
      icon: ShoppingCart,
      badge: cartCount,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Delivery */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-[#EAF2EC] text-[#4A7A5C]">
        <HugeiconsIcon icon={Truck} className="w-3.5 h-3.5" />
        Abuja Delivery
      </div>

      {/* Quick links */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-2 px-1">
          Navigate
        </p>
        <nav className="space-y-0.5">
          {quickLinks.map(({ label, href, icon, badge }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-[#FBF5E6] text-[#C8720A] border border-[#C8720A]/25"
                    : "text-[#4A2E1A] hover:bg-[#F5EDD6]"
                }`}
              >
                <HugeiconsIcon icon={icon} className="w-4 h-4 shrink-0" />
                <span className="flex-1">{label}</span>
                {badge != null && badge > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-[#C8720A]">
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="h-px bg-[#E5D9C0]" />

      {/* Category navigation */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-2 px-1">
          Shop by Category
        </p>
        <nav className="space-y-0.5">
          <Link
            href="/home"
            onClick={onClose}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
              pathname === "/home"
                ? "bg-[#FBF5E6] text-[#C8720A] border border-[#C8720A]/25"
                : "text-[#4A2E1A] hover:bg-[#F5EDD6]"
            }`}
          >
            <HugeiconsIcon icon={Grid} className="w-4 h-4 shrink-0 text-[#C8720A]" />
            <span className="flex-1">All Products</span>
            <HugeiconsIcon
              icon={ChevronRight}
              className="w-3.5 h-3.5 text-[#C8A87A] group-hover:text-[#C8720A] transition-colors"
            />
          </Link>

          {categoriesLoading &&
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-[#F5EDD6] animate-pulse mx-1" />
            ))}

          {categories.map((cat) => {
            const icon = CATEGORY_ICONS[cat.category] ?? Package;
            const href = `/home/category/${categorySlug(cat.category)}`;
            const active = pathname === href;
            return (
              <Link
                key={cat.category}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? "bg-[#FBF5E6] text-[#C8720A] border border-[#C8720A]/25"
                    : "text-[#4A2E1A] hover:bg-[#F5EDD6]"
                }`}
              >
                <HugeiconsIcon icon={icon} className="w-4 h-4 shrink-0 text-[#C8720A]" />
                <span className="flex-1">{cat.category}</span>
                <HugeiconsIcon
                  icon={ChevronRight}
                  className="w-3.5 h-3.5 text-[#C8A87A] group-hover:text-[#C8720A] transition-colors"
                />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="h-px bg-[#E5D9C0]" />

      {/* Footer */}
      <div className="space-y-0.5">
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={HelpCircleIcon} className="w-4 h-4" />
          Help
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={FileText} className="w-4 h-4" />
          Terms
        </button>
      </div>
    </div>
  );
}

/* ── Navbar ──────────────────────────────────────────────────────────────── */
export default function NavbarComponents({
  categories = [],
  categoriesLoading,
}: {
  categories?: SiteCategory[];
  categoriesLoading?: boolean;
}) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchValue.trim();
    if (trimmed) {
      router.push(`/home/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-[#DDD0B3]"
        style={{
          backgroundColor: "rgba(255, 253, 247)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F5EDD6] text-[#2C1A0E] transition-colors shrink-0"
          >
            <HugeiconsIcon icon={Menu} className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/home" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 hidden rounded-lg md:flex items-center justify-center bg-amber-700">
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
          </Link>

          {/* Desktop category nav */}
          <NavigationMenu className="hidden lg:flex">
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
                          <div key={i} className="h-9 rounded-lg bg-[#F5EDD6] animate-pulse" />
                        ))}
                      </div>
                    </div>
                  )}
                </NavigationMenuContent>
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
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#7A5C3E]"
            >
              <HugeiconsIcon icon={MapPin} className="w-3.5 h-3.5 text-[#C8720A]" />
              Abuja
              <HugeiconsIcon icon={ChevronDown} className="w-3 h-3" />
            </Button>

            <Link href="/home/wishlist">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <HugeiconsIcon
                  icon={Heart}
                  className="w-4.5 h-4.5"
                  style={{ color: "var(--espresso)" }}
                />
                <WishlistBadge />
              </Button>
            </Link>

            <Link href="/home/cart">
              <Button variant="ghost" size="icon" className="relative cursor-pointer">
                <HugeiconsIcon
                  icon={ShoppingCart}
                  className="w-4.5 h-4.5"
                  style={{ color: "var(--espresso)" }}
                />
                <CartBadge />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile nav drawer ─────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          navOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-[#FFFDF7] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#DDD0B3] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center bg-amber-700">
              <span className="text-white text-[10px] font-bold">C</span>
            </div>
            <span className="font-semibold text-sm text-[#2C1A0E]">
              Casalavoro
              <span className="block text-[9px] font-normal tracking-widest uppercase text-[#C8720A]">
                Minimart
              </span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5EDD6] transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 text-[#7A5C3E]" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <MobileNavContent
            categories={categories}
            categoriesLoading={categoriesLoading}
            onClose={() => setNavOpen(false)}
          />
        </div>
      </div>
    </>
  );
}
