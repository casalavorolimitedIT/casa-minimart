"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Cancel01Icon,
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
  /** Mobile filter drawer state */
  isOpen?: boolean;
  onClose?: () => void;
}

/* ── Shared filter content (used by both desktop and mobile) ─────────────── */
function FilterContent({
  activeFilter,
  onFilterChange,
  categories,
  categoriesLoading,
  onClose,
}: Omit<SidebarProps, "isOpen">) {
  const handleSelect = (id: string) => {
    onFilterChange(id);
    onClose?.();
  };

  return (
    <div className="space-y-5">
      {/* Delivery badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-[#EAF2EC] text-[#4A7A5C]">
        <HugeiconsIcon icon={Truck} className="w-3.5 h-3.5" />
        Abuja Delivery
      </div>

      {/* Category filters */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-2 px-1">
          Filter by category
        </p>
        <nav className="space-y-0.5">
          <button
            type="button"
            onClick={() => handleSelect("all")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
              activeFilter === "all"
                ? "bg-[#FBF5E6] text-[#C8720A] font-semibold border border-[#C8720A]/25"
                : "text-[#4A2E1A] hover:bg-[#F5EDD6] font-medium"
            }`}
          >
            <HugeiconsIcon icon={Grid} className="w-4 h-4 shrink-0" />
            All Products
          </button>

          {categoriesLoading && (
            <div className="space-y-1 px-1 pt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 rounded-lg bg-[#F5EDD6] animate-pulse" />
              ))}
            </div>
          )}

          {categories?.map((cat) => {
            const icon = CATEGORY_ICONS[cat.category] ?? Package;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => handleSelect(cat.category)}
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

      <Separator />

      <div className="space-y-1">
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={HelpCircleIcon} className="w-4 h-4" />
          Help
        </button>
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={FileText} className="w-4 h-4" />
          Terms
        </button>
      </div>
    </div>
  );
}

/* ── Exported component ──────────────────────────────────────────────────── */
export default function SidebarComponent({
  activeFilter,
  onFilterChange,
  categories = [],
  categoriesLoading = false,
  isOpen = false,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar — lg+ only */}
      <aside className="w-52 shrink-0 hidden lg:block">
        <div className="sticky top-20">
          <FilterContent
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            categories={categories}
            categoriesLoading={categoriesLoading}
          />
        </div>
      </aside>

      {/* Mobile filter drawer — triggered by "Filters" pill on home page */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-72 flex flex-col bg-[#FFFDF7] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#DDD0B3] shrink-0">
          <span className="font-semibold text-sm text-[#2C1A0E]">
            Filter Products
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5EDD6] transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4 text-[#7A5C3E]" />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <FilterContent
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
            categories={categories}
            categoriesLoading={categoriesLoading}
            onClose={onClose}
          />
        </div>
      </div>
    </>
  );
}
