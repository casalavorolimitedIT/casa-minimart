"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/home/Footer";
import ProductCard from "@/components/home/productCard";
import SidebarComponent from "@/components/home/sidebar";
import NavbarComponents from "@/components/ui/header";
import { adaptInventoryItem, CATEGORY_ACCENT } from "@/lib/adapters";
import {
  useInfiniteInventoryItems,
  useSiteCategories,
} from "@/lib/queries/supabase-rest";

const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

function categorySlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading: categoriesLoading } =
    useSiteCategories({ p_site_id: SITE_ID });
  const categories = categoriesData ?? [];

  // Use real category name from API when loaded; derive from slug as initial value
  const matched = categories.find((cat) => categorySlug(cat.category) === slug);
  const categoryName = matched?.category ?? slugToDisplayName(slug);
  const accentColor = CATEGORY_ACCENT[categoryName] ?? CATEGORY_ACCENT._default;

  const handleFilterChange = (filter: string) => {
    if (filter === "all") {
      router.push("/home");
    } else {
      router.push(`/home/category/${categorySlug(filter)}`);
    }
  };

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteInventoryItems({
    select: "*",
    queryParams: { site_id: SITE_ID, category: categoryName },
  });

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
  const totalLoaded = products.length;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cream-bg)" }}
    >
      <NavbarComponents categories={categories} />

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6 flex-1">
        <SidebarComponent
          activeFilter={categoryName}
          onFilterChange={handleFilterChange}
          categories={categories}
          categoriesLoading={categoriesLoading}
        />

        <main className="flex-1 min-w-0 space-y-8">
          {/* Category heading */}
          <div className="pb-4 border-b border-[#E5D9C0]">
            <div className="flex items-center gap-3 mb-1">
              <span
                className="block w-1 h-6 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <p
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#A89070" }}
              >
                Category
              </p>
            </div>
            <h1
              className="text-2xl font-bold pl-4"
              style={{
                color: "var(--espresso)",
                fontFamily: "Georgia, serif",
              }}
            >
              {categoryName}
            </h1>
            {!isLoading && (
              <p className="text-sm mt-1 pl-4" style={{ color: "#7A5C3E" }}>
                {totalLoaded} product{totalLoaded !== 1 ? "s" : ""}
                {hasNextPage ? "+" : ""}
              </p>
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
                Failed to load products. Please refresh.
              </p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="space-y-6">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 stagger-children">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p
                    className="text-base font-semibold"
                    style={{ color: "var(--espresso)" }}
                  >
                    No products in this category
                  </p>
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

      <Footer />
    </div>
  );
}
