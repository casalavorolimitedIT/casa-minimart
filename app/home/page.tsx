"use client";

import Footer from "@/components/home/Footer";
import HeroBanner from "@/components/home/herobanner";
import PopularSection from "@/components/home/Popularsection";
import ProductSection from "@/components/home/productSection";
import SidebarComponent from "@/components/home/sidebar";
import NavbarComponents from "@/components/ui/header";
import { adaptInventoryItem, CATEGORY_ACCENT, groupByCategory } from "@/lib/adapters";
import { useInfiniteInventoryItems } from "@/lib/queries/supabase-rest";
import { useEffect, useRef, useState } from "react";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cartCount, setCartCount] = useState(2);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteInventoryItems({
    select: "*",
    queryParams: { site_id: SITE_ID },
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  const products = data?.pages.flat().map(adaptInventoryItem) ?? [];
  const grouped = groupByCategory(products);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cream-bg)" }}
    >
      <NavbarComponents cartCount={cartCount} />

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6 flex-1">
        <SidebarComponent
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <main className="flex-1 min-w-0 space-y-10">
          <HeroBanner />

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
