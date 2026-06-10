"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Coffee,
  Cookie,
  Droplets,
  FileText,
  Grid,
  HelpCircleIcon,
  Home,
  Package,
  Sparkles,
  Truck,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type SiteCategory } from "@/lib/queries/supabase-rest";

const CATEGORY_ICONS: Record<string, typeof Package> = {
  General: Grid,
  Toiletries: Droplets,
  Bodycare: Sparkles,
  Beverages: Coffee,
  Snacks: Cookie,
  Pantry: Package,
  Household: Home,
};

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
  categories?: SiteCategory[];
  categoriesLoading?: boolean;
}

export default function SidebarComponent({
  activeFilter,
  onFilterChange,
  categories = [],
  categoriesLoading = false,
}: SidebarProps) {
  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-5">
        {/* Delivery badge */}
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
          style={{ backgroundColor: "#EAF2EC", color: "var(--sage)" }}
        >
          <HugeiconsIcon icon={Truck} className="w-3.5 h-3.5" />
          Abuja Delivery
        </div>

        {/* Category filters */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-2 px-1">
            Categories
          </p>
          <nav className="space-y-0.5">
            {/* All Products — always first */}
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                activeFilter === "all"
                  ? "bg-[#FBF5E6] text-[#C8720A] font-semibold border border-[#C8720A]/25"
                  : "text-[#4A2E1A] hover:bg-[#F5EDD6] font-medium"
              }`}
            >
              <HugeiconsIcon icon={Grid} className="w-4 h-4 shrink-0" />
              All Products
            </button>

            {/* Live categories */}
            {categoriesLoading && (
              <div className="space-y-1 px-1 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 rounded-lg bg-[#F5EDD6] animate-pulse"
                  />
                ))}
              </div>
            )}
            {categories.map((cat) => {
              const icon = CATEGORY_ICONS[cat.category] ?? Package;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => onFilterChange(cat.category)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                    activeFilter === cat.category
                      ? "bg-[#FBF5E6] text-[#C8720A] font-semibold border border-[#C8720A]/25"
                      : "text-[#4A2E1A] hover:bg-[#F5EDD6] font-medium"
                  }`}
                >
                  <HugeiconsIcon icon={icon} className="w-4 h-4 shrink-0" />
                  {cat.category}
                </button>
              );
            })}
          </nav>
        </div>

        <Button
          className="w-full"
          style={{ backgroundColor: "var(--sage)", color: "white" }}
        >
          Apply Filters
        </Button>

        <Separator />

        {/* Footer links */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors">
            <HugeiconsIcon icon={HelpCircleIcon} className="w-4 h-4" />
            Help
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors">
            <HugeiconsIcon icon={FileText} className="w-4 h-4" />
            Terms
          </button>
        </div>
      </div>
    </aside>
  );
}
