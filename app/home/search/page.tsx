"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/home/Footer";
import ProductSection from "@/components/home/productSection";
import SidebarComponent from "@/components/home/sidebar";
import NavbarComponents from "@/components/ui/header";
import {
  adaptInventoryItem,
  CATEGORY_ACCENT,
  groupByCategory,
} from "@/lib/adapters";
import {
  useInfiniteInventoryItems,
  useSiteCategories,
  type SiteCategory,
} from "@/lib/queries/supabase-rest";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

interface SearchContentProps {
  categories: SiteCategory[];
  categoriesLoading: boolean;
}

function SearchContent({ categories, categoriesLoading }: SearchContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [activeFilter, setActiveFilter] = useState("all");
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Reset category filter when the search query changes
  useEffect(() => {
    setActiveFilter("all");
  }, [query]);

  const queryParams: Record<string, string> = { site_id: SITE_ID };
  if (query) queryParams.name = `ilike.*${query}*`;
  if (activeFilter !== "all") queryParams.category = activeFilter;

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
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingRef.current
        ) {
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
  const totalLoaded = products.length;

  return (
    <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6 flex-1">
      <SidebarComponent
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />

      <main className="flex-1 min-w-0 space-y-8">
        {/* Search heading */}
        <div className="pb-4 border-b border-[#E5D9C0]">
          {query ? (
            <>
              <div className="flex items-center justify-between gap-4 mb-1">
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-1"
                  style={{ color: "#A89070" }}
                >
                  Search results
                </p>
                <button
                  className="text-sm text-[#C8720A] underline cursor-pointer"
                  onClick={() => window.history.back()}
                >
                  Clear search
                </button>
              </div>
              <h1
                className="text-2xl font-bold"
                style={{
                  color: "var(--espresso)",
                  fontFamily: "Georgia, serif",
                }}
              >
                &ldquo;{query}&rdquo;
              </h1>
              {!isLoading && (
                <p className="text-sm mt-1" style={{ color: "#7A5C3E" }}>
                  {totalLoaded} product{totalLoaded !== 1 ? "s" : ""} found
                  {hasNextPage ? "+" : ""}
                </p>
              )}
            </>
          ) : (
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--espresso)", fontFamily: "Georgia, serif" }}
            >
              Browse all products
            </h1>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-20">
            <p className="text-sm" style={{ color: "var(--espresso)" }}>
              {query ? "Searching…" : "Loading products…"}
            </p>
          </div>
        )}

        {error && (
          <div className="py-10">
            <p className="text-sm text-red-600">
              Failed to load results. Please try again.
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
                accentColor={
                  CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT._default
                }
              />
            ))}

            {Object.entries(grouped).length === 0 && (
              <div className="py-20 text-center">
                <p
                  className="text-base font-semibold"
                  style={{ color: "var(--espresso)" }}
                >
                  No products found
                </p>
                {query && (
                  <p className="text-sm mt-1" style={{ color: "#7A5C3E" }}>
                    Try a different search term or remove the category filter
                  </p>
                )}
              </div>
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
      </main>
    </div>
  );
}

export default function SearchPage() {
  const { data: categoriesData, isLoading: categoriesLoading } =
    useSiteCategories({
      p_site_id: SITE_ID,
    });
  const categories = categoriesData ?? [];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cream-bg)" }}
    >
      <NavbarComponents categories={categories} />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-sm" style={{ color: "var(--espresso)" }}>
              Loading…
            </p>
          </div>
        }
      >
        <SearchContent
          categories={categories}
          categoriesLoading={categoriesLoading}
        />
      </Suspense>
      <Footer />
    </div>
  );
}
