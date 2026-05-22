"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Coffee, Cookie, Droplets, FileText, Grid, HelpCircleIcon, Home, Leaf, Package, Star, Truck } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";


const filters = [
  { id: "all", label: "All Products", icon: Grid },
  { id: "best-sellers", label: "Best Sellers", icon: Star },
  { id: "fresh-produce", label: "Fresh Produce", icon: Leaf },
  { id: "pantry", label: "Pantry", icon: Package },
  { id: "household", label: "Household", icon: Home },
];

const featuredCategories = [
  {
    id: "toiletries",
    label: "Toiletries",
    icon: Droplets,
    desc: "Essentials for your daily routine",
  },
  {
    id: "tea-coffee",
    label: "Tea & Coffee",
    icon: Coffee,
    desc: "Morning pick-me-ups",
  },
  {
    id: "snacks",
    label: "Snacks",
    icon: Cookie,
    desc: "Delicious treats for any time",
  },
];

interface SidebarProps {
  activeFilter: string;
  onFilterChange: (id: string) => void;
}

export default function SidebarComponent({
  activeFilter,
  onFilterChange,
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

        {/* Filters */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-2 px-1">
            Filters
          </p>
          <nav className="space-y-0.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  activeFilter === f.id
                    ? "bg-[#FBF5E6] text-[#C8720A] font-semibold border border-[#C8720A]/25"
                    : "text-[#4A2E1A] hover:bg-[#F5EDD6] font-medium"
                }`}
              >
                <HugeiconsIcon icon={f.icon} className="w-4 h-4 shrink-0" />
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        <Separator />

        {/* Featured categories */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#A89070] mb-2 px-1">
            Featured
          </p>
          <nav className="space-y-1">
            {featuredCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => onFilterChange(c.id)}
                className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                  activeFilter === c.id
                    ? "bg-[#FBF5E6] border border-[#C8720A]/25"
                    : "hover:bg-[#F5EDD6]"
                }`}
              >
                <HugeiconsIcon
                  icon={c.icon}
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    activeFilter === c.id ? "text-[#C8720A]" : "text-[#7A5C3E]"
                  }`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold leading-tight ${
                      activeFilter === c.id
                        ? "text-[#C8720A]"
                        : "text-[#2C1A0E]"
                    }`}
                  >
                    {c.label}
                  </p>
                  <p className="text-[11px] text-[#A89070] mt-0.5">{c.desc}</p>
                </div>
              </button>
            ))}
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
