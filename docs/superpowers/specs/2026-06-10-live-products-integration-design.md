# Live Products Integration Design

**Date:** 2026-06-10  
**Status:** Approved

## Goal

Replace the static product arrays in `lib/data.ts` with live data from the Supabase inventory API, rendered dynamically by category on the home page. No axios — the existing `fetch`-based React Query hook is kept.

## API

```
GET https://bzhatetufhlkwrtfjbyp.supabase.co/rest/v1/inventory_items
  ?select=*&site_id=eq.2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7&limit=20&offset=0
```

Infinite scroll page size: **20 items per page**. Subsequent pages increment `offset` by 20.

Image base URL: `https://bzhatetufhlkwrtfjbyp.supabase.co/storage/v1/object/public/app-bucket/`

Items with no images fall back to `/placeholder.png`.

## Changes

### 1. `lib/queries/supabase-rest.ts` — type fix + infinite query hook

Replace the loose `InventoryItem` interface with a fully typed shape:

Add a `useInfiniteInventoryItems` hook using `useInfiniteQuery`:
- `initialPageParam: 0`
- `getNextPageParam`: returns `lastPage.length === PAGE_SIZE ? offset + PAGE_SIZE : undefined` — signals no more pages when a page comes back with fewer than 20 items
- Each page calls `fetchInventoryItems` with the current `offset`

The existing `useInventoryItems` hook is kept unchanged for other uses.

```ts
export interface InventoryItem {
  id: string;
  site_id: string;
  category: string;
  name: string;
  quantity: number;
  unit: string;
  images: string[];
  price: string | null;
  status: string;
  tenant_id: string;
  received_date: string;
  vendor: string;
  last_updated: string;
  created_at: string;
  unit_value: unknown;
  reorder_level: unknown;
}
```

### 2. `lib/data.ts` — nullable price

- Change `Product.price: number` → `price: number | null`
- Update `formatPrice(price: number | null): string` — returns `"Price on request"` when `price` is null

### 3. `lib/adapters.ts` — new file

Three exports:

**`getImageUrl(images: string[]): string`**  
Returns `STORAGE_BASE + images[0]` if the array is non-empty, otherwise `/placeholder.png`.

**`adaptInventoryItem(item: InventoryItem): Product`**  
Maps API → `Product`:
- `price`: `parseFloat(item.price)` or `null` if missing/unparseable
- `stock`: `item.quantity`
- `imageUrl`: `getImageUrl(item.images)`
- `category`: passed through

**`groupByCategory(products: Product[]): Record<string, Product[]>`**  
Groups by `product.category`. Insertion-ordered (first category encountered = first section).

**`CATEGORY_ACCENT: Record<string, string>`**  
Maps known category names to accent hex colours with a `_default` fallback for unknown categories.

### 4. `app/home/page.tsx` — wire live data with infinite scroll

- Remove static array imports (`toiletries`, `bodycare`, `beverages`, `sweets`, `seasoning`)
- Switch to `useInfiniteInventoryItems` (replaces the existing `useInventoryItems` call)
- Flatten all pages: `data.pages.flat()` → adapt each item → group by category
- A sentinel `<div ref={sentinelRef}>` placed below the last section; an `IntersectionObserver` calls `fetchNextPage()` when it enters the viewport
- While `isFetchingNextPage` is true, show a small spinner below the sections
- Initial loading state: simple loading indicator in the product area
- Error state: inline error message
- Success: one `<ProductSection>` per category group, title = category name, accentColor from `CATEGORY_ACCENT`

**Untouched:** `HeroBanner`, `PopularSection`, sidebar, navbar, footer, `ProductCard`, `ProductSection`.

## Behaviour Notes

- When a new category appears in the API response, a new section is automatically rendered — no code change needed.
- Items with `price: null` display "Price on request" in the card.
- Items with an empty `images` array show `/placeholder.png`.
- The `removeConsole` log in `home/page.tsx` should be removed as part of this change.

## Out of Scope

- Per-category API calls
- Replacing `PopularSection` or `HeroBanner` with live data
- Cart integration changes
