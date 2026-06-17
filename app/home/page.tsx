"use client";

import Footer from "@/components/home/Footer";
import HeroBanner from "@/components/home/herobanner";
import PopularSection from "@/components/home/Popularsection";
import ProductSection from "@/components/home/productSection";
import SidebarComponent from "@/components/home/sidebar";
import NavbarComponents from "@/components/ui/header";
import { adaptInventoryItem, CATEGORY_ACCENT, groupByCategory } from "@/lib/adapters";
import {
  useInfiniteInventoryItems,
  useSiteCategories,
} from "@/lib/queries/supabase-rest";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useSiteCategories({ p_site_id: SITE_ID });

  const categories = categoriesData ?? [];

  const queryParams =
    activeFilter === "all"
      ? { site_id: SITE_ID }
      : { site_id: SITE_ID, category: activeFilter };

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteInventoryItems({ select: "*", queryParams });

  const isFetchingRef = useRef(false);
  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage;
  }, [isFetchingNextPage]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingRef.current) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isLoading]);

  const products = data?.pages.flat().map(adaptInventoryItem) ?? [];
  const grouped = groupByCategory(products);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cream-bg)" }}
    >
      <NavbarComponents categories={categories} categoriesLoading={categoriesLoading} />

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6 flex-1">
        <SidebarComponent
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          categories={categories}
          categoriesLoading={categoriesLoading}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 space-y-10">
          <HeroBanner />

          {/* Mobile filter bar — hidden on desktop */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#DDD0B3] bg-white text-sm font-semibold text-[#4A2E1A] shadow-sm active:scale-95 transition-transform"
            >
              <HugeiconsIcon icon={SlidersHorizontal} className="w-4 h-4 text-[#C8720A]" />
              Filters
            </button>
            {activeFilter !== "all" && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FBF5E6] border border-[#C8720A]/30 text-xs font-semibold text-[#C8720A]">
                {activeFilter}
                <button
                  type="button"
                  onClick={() => setActiveFilter("all")}
                  className="ml-0.5 leading-none text-[#C8720A]/60 hover:text-[#C8720A]"
                  aria-label="Clear filter"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <p className="text-sm" style={{ color: "var(--espresso)" }}>
                Loading products…
              </p>
            </div>
          )}

          {error && (
            <div className="py-10">
              <p className="text-sm text-red-600">
                Failed to load products. Please refresh the page.
              </p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-10">
              {Object.entries(grouped).map(([category, items]) => (
                <ProductSection
                  key={category}
                  title={category}
                  products={items}
                  accentColor={CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT._default}
                />
              ))}

              {Object.entries(grouped).length === 0 && (
                <p className="text-sm text-center py-10" style={{ color: "var(--espresso)" }}>
                  No products available.
                </p>
              )}

              <div ref={sentinelRef} className="h-4" />

              {isFetchingNextPage && (
                <div className="flex justify-center py-6">
                  <p className="text-sm" style={{ color: "var(--espresso)" }}>
                    Loading more…
                  </p>
                </div>
              )}
            </div>
          )}

          <PopularSection />
        </main>
      </div>

      <Footer />
    </div>
  );
}
