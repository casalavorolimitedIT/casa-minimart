# Live Products Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static product arrays with live Supabase inventory data, grouped by category, with infinite scroll on the home page.

**Architecture:** A new `lib/adapters.ts` bridges the API shape (`InventoryItem`) to the app's `Product` type. A new `useInfiniteInventoryItems` hook in the existing query file handles offset-based pagination. The home page flattens all pages, groups by category, and uses an `IntersectionObserver` sentinel to trigger `fetchNextPage()`.

**Tech Stack:** Next.js 16, React 19, TanStack React Query v5, native `fetch`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `lib/data.ts` | Modify | Make `Product.price` nullable; update `formatPrice` for null |
| `lib/queries/supabase-rest.ts` | Modify | Fully type `InventoryItem`; add `PAGE_SIZE`; add `useInfiniteInventoryItems` |
| `lib/adapters.ts` | Create | `getImageUrl`, `adaptInventoryItem`, `groupByCategory`, `CATEGORY_ACCENT` |
| `components/home/productCard.tsx` | Modify | Add `label` + `fallbackVariant="initials"` to `SmartImage` for missing images |
| `app/home/page.tsx` | Modify | Use infinite hook, adapt+group live data, IntersectionObserver sentinel |

---

## Task 1: Make `Product.price` nullable and update `formatPrice`

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 1: Update the `Product` interface — change `price: number` to `price: number | null`**

In `lib/data.ts`, find the `Product` interface and change the `price` line:
```ts
export interface Product {
  id: string;
  name: string;
  price: number | null;   // was: price: number
  stock: number;
  category: string;
  imageUrl: string;
  featured?: boolean;
}
```

- [ ] **Step 2: Update `formatPrice` to handle null**

Replace the existing `formatPrice` function in `lib/data.ts`:
```ts
export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return `₦${price.toLocaleString("en-NG")}`;
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors. All existing callers of `formatPrice` and `Product.price` still compile because `number` is assignable to `number | null`.

- [ ] **Step 4: Commit**

```bash
git add lib/data.ts
git commit -m "feat: make Product.price nullable, handle null in formatPrice"
```

---

## Task 2: Fully type `InventoryItem` and add `useInfiniteInventoryItems`

**Files:**
- Modify: `lib/queries/supabase-rest.ts`

- [ ] **Step 1: Add `PAGE_SIZE` constant**

After the existing imports at the top of `lib/queries/supabase-rest.ts`, add:
```ts
export const PAGE_SIZE = 20;
```

- [ ] **Step 2: Replace the `InventoryItem` interface**

Replace the current loose `InventoryItem` interface with:
```ts
export interface InventoryItem {
  id: string;
  tenant_id: string;
  site_id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  images: string[];
  price: string | null;
  status: string;
  received_date: string;
  vendor: string;
  last_updated: string;
  created_at: string;
  unit_value: unknown;
  reorder_level: unknown;
}
```

- [ ] **Step 3: Add `useInfiniteQuery` to the import**

Update the existing TanStack import line:
```ts
import { useQuery, useInfiniteQuery, type UseQueryOptions } from "@tanstack/react-query";
```

- [ ] **Step 4: Append `useInfiniteInventoryItems` hook**

Add at the bottom of `lib/queries/supabase-rest.ts`:
```ts
export function useInfiniteInventoryItems(
  params: Omit<InventoryItemsQueryParams, "limit" | "offset">,
) {
  return useInfiniteQuery({
    queryKey: ["inventory-items-infinite", params],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      fetchInventoryItems({ ...params, limit: PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: InventoryItem[],
      _: InventoryItem[][],
      lastPageParam: number,
    ) => (lastPage.length === PAGE_SIZE ? lastPageParam + PAGE_SIZE : undefined),
  });
}
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/queries/supabase-rest.ts
git commit -m "feat: type InventoryItem fully, add PAGE_SIZE and useInfiniteInventoryItems"
```

---

## Task 3: Create `lib/adapters.ts`

**Files:**
- Create: `lib/adapters.ts`

- [ ] **Step 1: Create the file with all adapter exports**

Create `lib/adapters.ts`:
```ts
import { type InventoryItem } from "@/lib/queries/supabase-rest";
import { type Product } from "@/lib/data";

const STORAGE_BASE =
  "https://bzhatetufhlkwrtfjbyp.supabase.co/storage/v1/object/public/app-bucket/";

export const CATEGORY_ACCENT: Record<string, string> = {
  General: "#C8720A",
  Toiletries: "#C8720A",
  Bodycare: "#C8A87A",
  Beverages: "#4A7C59",
  Snacks: "#C85A20",
  Pantry: "#7A5C3E",
  _default: "#C8720A",
};

export function getImageUrl(images: string[]): string {
  if (images.length > 0) {
    return `${STORAGE_BASE}${images[0]}`;
  }
  return "";
}

export function adaptInventoryItem(item: InventoryItem): Product {
  const parsed = item.price !== null ? parseFloat(item.price) : null;
  return {
    id: item.id,
    name: item.name,
    price: parsed !== null && !isNaN(parsed) ? parsed : null,
    stock: item.quantity,
    category: item.category,
    imageUrl: getImageUrl(item.images),
  };
}

export function groupByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce<Record<string, Product[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/adapters.ts
git commit -m "feat: add adapters for InventoryItem→Product mapping, category grouping, accent map"
```

---

## Task 4: Update `ProductCard` to handle missing images

**Files:**
- Modify: `components/home/productCard.tsx`

`SmartImage` already supports a built-in `initials` fallback. Adding `label` and `fallbackVariant` means products with empty `imageUrl` will show a name-based placeholder instead of a broken image.

- [ ] **Step 1: Add `label` and `fallbackVariant` props to the `SmartImage` call**

In `components/home/productCard.tsx`, find the `<SmartImage` block and update it:
```tsx
// Before
<SmartImage
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={600}
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-square"
  loading="lazy"
/>

// After
<SmartImage
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={600}
  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 aspect-square"
  loading="lazy"
  label={product.name}
  fallbackVariant="initials"
/>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/home/productCard.tsx
git commit -m "feat: use initials fallback in ProductCard for items without images"
```

---

## Task 5: Wire live data with infinite scroll in `app/home/page.tsx`

**Files:**
- Modify: `app/home/page.tsx`

- [ ] **Step 1: Replace the entire file contents**

Replace `app/home/page.tsx` with:
```tsx
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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Run the dev server and verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/home` and check each of the following:

1. Network tab shows a `GET /rest/v1/inventory_items` request with `offset=0`
2. Products appear grouped under a "General" section heading with the amber accent bar
3. Items with `price: null` display "Price on request" in the card
4. Items with images show the Supabase-hosted photo; items without images show initials
5. Scrolling to the bottom of the page triggers a second network request with `offset=20`
6. When the last page has fewer than 20 items, no further fetches are triggered
7. If a new category appears in the API, a new section is rendered automatically

- [ ] **Step 4: Commit**

```bash
git add app/home/page.tsx
git commit -m "feat: wire live inventory data to home page with infinite scroll by category"
```
