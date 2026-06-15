# Redux Cart with localStorage + Server Sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fake hardcoded cart with Redux Toolkit state persisted to localStorage, wired to real add-to-cart buttons across the app, and synced against live Supabase inventory on cart page open.

**Architecture:** A Redux cart slice holds `CartItem[]`. A custom middleware writes the slice to `localStorage` after every action and the store hydrates from it on boot. `ProductCard` and `ProductDetailPage` dispatch `addItem`. `CartPage` reads from Redux, dispatches `removeItem`/`updateQty`, and on mount fires a React Query batch fetch that calls `syncWithServer` to auto-clamp quantities and update prices from live server data.

**Tech Stack:** `@reduxjs/toolkit`, `react-redux` (to install), `@tanstack/react-query` (already installed), `sonner` (already installed)

---

## File Map

| Path | Status | Responsibility |
|---|---|---|
| `store/cartSlice.ts` | Create | CartItem type, cart state, reducers, selectors |
| `store/index.ts` | Create | Store config + localStorage read/write middleware |
| `store/hooks.ts` | Create | Typed `useAppDispatch` / `useAppSelector` |
| `components/providers/redux-provider.tsx` | Create | `<Provider store={store}>` client component |
| `app/layout.tsx` | Modify | Wrap body with `<ReduxProvider>` |
| `components/ui/header.tsx` | Modify | Remove `cartCount` prop; derive from `selectCartCount` |
| `app/home/page.tsx` | Modify | Remove local `cartCount` state and prop |
| `app/home/category/[slug]/page.tsx` | Modify | Remove local `cartCount` state and prop |
| `app/home/search/page.tsx` | Modify | Remove local `cartCount` state and prop |
| `components/home/productCard.tsx` | Modify | Dispatch `addItem`; guard max-stock |
| `components/ProductDetailPage.tsx` | Modify | Lift qty selector state; dispatch `addItem`; remove cartCount prop |
| `components/CartPage.tsx` | Modify | Read from Redux; server sync on mount; dispatch remove/updateQty |

---

## Task 1: Install dependencies

**Files:**
- `package.json` (via npm)

- [ ] **Step 1: Install Redux Toolkit and react-redux**

```bash
npm install @reduxjs/toolkit react-redux
```

Expected: `added X packages` with no errors.

- [ ] **Step 2: Verify TypeScript picks up the types**

```bash
npx tsc --noEmit 2>&1 | head -5
```

Expected: same output as before — no new errors introduced by the install.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @reduxjs/toolkit and react-redux"
```

---

## Task 2: Create `store/cartSlice.ts`

**Files:**
- Create: `store/cartSlice.ts`

- [ ] **Step 1: Create the file**

```ts
// store/cartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { InventoryItem } from "@/lib/queries/supabase-rest";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  qty: number;
};

export type CartState = {
  items: CartItem[];
};

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.qty += action.payload.qty;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQty(
      state,
      action: PayloadAction<{ id: string; qty: number }>,
    ) {
      if (action.payload.qty <= 0) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
        return;
      }
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.qty = action.payload.qty;
    },
    syncWithServer(state, action: PayloadAction<InventoryItem[]>) {
      const serverMap = new Map(action.payload.map((i) => [i.id, i]));
      state.items = state.items
        .filter((item) => {
          const server = serverMap.get(item.id);
          return server !== undefined && server.quantity > 0;
        })
        .map((item) => {
          const server = serverMap.get(item.id)!;
          const serverPrice =
            server.price !== null ? parseFloat(server.price) : NaN;
          return {
            ...item,
            qty: Math.min(item.qty, server.quantity),
            price: !isNaN(serverPrice) ? serverPrice : item.price,
          };
        });
    },
  },
});

export const { addItem, removeItem, updateQty, syncWithServer } =
  cartSlice.actions;

// Selectors use an inline state type to avoid circular imports with store/index.ts
export const selectCartItems = (state: { cart: CartState }) =>
  state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.length;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default cartSlice.reducer;
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit 2>&1 | grep "cartSlice"
```

Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add store/cartSlice.ts
git commit -m "feat: add Redux cart slice with addItem/removeItem/updateQty/syncWithServer"
```

---

## Task 3: Create `store/index.ts` and `store/hooks.ts`

**Files:**
- Create: `store/index.ts`
- Create: `store/hooks.ts`

- [ ] **Step 1: Create store/index.ts**

```ts
// store/index.ts
import { configureStore, type Middleware } from "@reduxjs/toolkit";
import cartReducer, { type CartState } from "./cartSlice";

const CART_KEY = "casa-cart";

function loadCartFromStorage(): { cart: CartState } | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? { cart: JSON.parse(raw) } : undefined;
  } catch {
    return undefined;
  }
}

const localStorageMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);
    try {
      const state = storeApi.getState() as { cart: CartState };
      localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
    } catch {
      // localStorage unavailable (e.g. private browsing quota exceeded)
    }
    return result;
  };

export const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: loadCartFromStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- [ ] **Step 2: Create store/hooks.ts**

```ts
// store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

- [ ] **Step 3: Verify both files compile**

```bash
npx tsc --noEmit 2>&1 | grep -E "store/"
```

Expected: no output.

- [ ] **Step 4: Commit**

```bash
git add store/index.ts store/hooks.ts
git commit -m "feat: configure Redux store with localStorage middleware and typed hooks"
```

---

## Task 4: Create `ReduxProvider` and wrap `app/layout.tsx`

**Files:**
- Create: `components/providers/redux-provider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/providers/redux-provider.tsx**

```tsx
// components/providers/redux-provider.tsx
"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
```

- [ ] **Step 2: Update app/layout.tsx**

Replace the entire file with:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { DevToolbarWrapper } from "./DevToolbarWrapper";
import { QueryProvider } from "@/components/providers/query-provider";
import ReduxProvider from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casalavoro MiniMart",
  description: "A mini supermarket built for quest by Casalavoro",
  icons: {
    icon: [
      {
        url: "/casalogo2.png",
        href: "/casalogo2.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" type="image/png" href="/casalogo2.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <TooltipProvider>
            <QueryProvider>{children}</QueryProvider>
            <Toaster position="top-right" closeButton />
          </TooltipProvider>
        </ReduxProvider>
        <DevToolbarWrapper />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: build completes (or the same pre-existing errors — no new ones).

- [ ] **Step 4: Commit**

```bash
git add components/providers/redux-provider.tsx app/layout.tsx
git commit -m "feat: add ReduxProvider and wrap root layout"
```

---

## Task 5: Update `NavbarComponents` to read cart count from Redux

`NavbarComponents` currently receives `cartCount` as a prop (default `2`). It is called from 5 files. This task removes the prop entirely and reads the count from Redux.

**Files:**
- Modify: `components/ui/header.tsx`
- Modify: `app/home/page.tsx`
- Modify: `app/home/category/[slug]/page.tsx`
- Modify: `app/home/search/page.tsx`
- Modify: `components/CartPage.tsx`
- Modify: `components/ProductDetailPage.tsx`

- [ ] **Step 1: Update components/ui/header.tsx**

Add two imports after the existing import block:

```tsx
import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";
```

Change the function signature from:

```tsx
export default function NavbarComponents({
  cartCount = 2,
  categories = [],
}: {
  cartCount?: number;
  categories?: SiteCategory[];
})
```

to:

```tsx
export default function NavbarComponents({
  categories = [],
}: {
  categories?: SiteCategory[];
})
```

Add this as the first line inside the function body (before the `useRouter` call):

```tsx
const cartCount = useAppSelector(selectCartCount);
```

The rest of the JSX that references `cartCount` is unchanged.

- [ ] **Step 2: Update app/home/page.tsx**

Remove: `const [cartCount, setCartCount] = useState(2);`

Change: `<NavbarComponents cartCount={cartCount} categories={categories} />`  
To: `<NavbarComponents categories={categories} />`

Also remove the `useState` import if `cartCount` was the only thing using it (check for other `useState` calls on that page first).

- [ ] **Step 3: Update app/home/category/[slug]/page.tsx**

Remove: `const [cartCount] = useState(2);`

Change: `<NavbarComponents cartCount={cartCount} categories={categories} />`  
To: `<NavbarComponents categories={categories} />`

- [ ] **Step 4: Update app/home/search/page.tsx**

Remove: `const [cartCount] = useState(2);`

Change: `<NavbarComponents cartCount={cartCount} categories={categories} />`  
To: `<NavbarComponents categories={categories} />`

- [ ] **Step 5: Update components/CartPage.tsx**

Change: `<NavbarComponents cartCount={items.length} categories={categories} />`  
To: `<NavbarComponents categories={categories} />`

(The `items` local state will be fully replaced in Task 8, but removing the prop now prevents a TypeScript error.)

- [ ] **Step 6: Update components/ProductDetailPage.tsx**

There are 3 instances of `cartCount={0}` (in the loading skeleton, error state, and main render). Remove `cartCount={0}` from all three.

- [ ] **Step 7: Verify**

```bash
npx tsc --noEmit 2>&1 | grep -i "cartcount\|cartCount"
```

Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add components/ui/header.tsx app/home/page.tsx "app/home/category/[slug]/page.tsx" app/home/search/page.tsx components/CartPage.tsx components/ProductDetailPage.tsx
git commit -m "feat: navbar reads cart count from Redux, remove cartCount prop"
```

---

## Task 6: Wire `ProductCard` Add button to Redux

**Files:**
- Modify: `components/home/productCard.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
// components/home/productCard.tsx
"use client";

import { type Product, formatPrice, getStockLevel } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Check, ShoppingCart } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import SmartImage from "../custom/smart-images";
import { Button } from "../ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, selectCartItems } from "@/store/cartSlice";

interface ProductCardProps {
  product: Product;
}

const stockConfig = {
  out: { label: "Out of stock", variant: "low" as const, bg: "bg-gray-400" },
  critical: { label: "Only 1 left", variant: "low" as const, bg: "bg-red-500" },
  low: {
    label: (n: number) => `Only ${n} left`,
    variant: "low" as const,
    bg: "bg-orange-400",
  },
  medium: {
    label: (n: number) => `Only ${n} left`,
    variant: "medium" as const,
    bg: "bg-amber-400",
  },
  plenty: { label: "In stock", variant: "high" as const, bg: "bg-green-500" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const level = getStockLevel(product.stock);
  const cfg = stockConfig[level];

  const stockLabel =
    level === "out" || level === "critical" || level === "plenty"
      ? cfg.label
      : (cfg.label as (n: number) => string)(product.stock);

  const outOfStock = level === "out";
  const cartItem = cartItems.find((i) => i.id === product.id);
  const cartQty = cartItem?.qty ?? 0;
  const atMax = cartQty >= product.stock;
  const inCart = cartQty > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (outOfStock || atMax || product.price === null) return;
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        qty: 1,
      }),
    );
  };

  return (
    <Link
      href={`/home/product/${product.id}`}
      className={cn(
        "group relative flex flex-col rounded-xl border border-[#E5D9C0] overflow-hidden product-card-hover",
        "bg-white/80",
      )}
    >
      {/* Stock badge */}
      {level !== "plenty" && (
        <div className="absolute top-2 right-2 z-10">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full",
              cfg.bg,
            )}
          >
            {stockLabel as string}
          </span>
        </div>
      )}

      {/* Image */}
      <div className="relative overflow-hidden bg-[#F5EDD6] aspect-square">
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
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 flex-1">
        <p
          className="text-sm font-semibold leading-tight line-clamp-2"
          style={{ color: "var(--espresso)", fontFamily: "Georgia, serif" }}
        >
          {product.name}
        </p>
        <p
          className="text-base font-bold mt-auto pt-1"
          style={{ color: "var(--amber-brand)" }}
        >
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Add button */}
      <div className="px-3 pb-3">
        <Button
          onClick={handleAdd}
          disabled={outOfStock}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
            outOfStock
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : atMax
                ? "text-white"
                : inCart
                  ? "text-white"
                  : "text-white hover:scale-[1.02] active:scale-95",
          )}
          style={
            outOfStock
              ? {}
              : atMax
                ? { backgroundColor: "#7A5C3E" }
                : inCart
                  ? { backgroundColor: "#4A7C59" }
                  : { backgroundColor: "#4A7C59" }
          }
        >
          {atMax ? (
            "Max in cart"
          ) : inCart ? (
            <>
              <HugeiconsIcon icon={Check} className="w-4 h-4" />
              In Cart ({cartQty})
            </>
          ) : (
            <>
              <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
              Add
            </>
          )}
        </Button>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit 2>&1 | grep "productCard"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add components/home/productCard.tsx
git commit -m "feat: wire ProductCard Add button to Redux cart"
```

---

## Task 7: Wire `ProductDetailPage` Add to Cart to Redux

**Files:**
- Modify: `components/ProductDetailPage.tsx`

Changes:
1. `QuantitySelector` becomes a controlled component (qty + onChange props instead of internal state)
2. Parent page owns `selectedQty` state
3. `handleAddToCart` dispatches `addItem` with the selected qty
4. Button reflects "Max in Cart" state when `cartQty >= product.stock`
5. Remove the `addedToCart` boolean state (no longer needed)

- [ ] **Step 1: Add Redux imports**

Add these two lines to the import block in `components/ProductDetailPage.tsx`:

```tsx
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, selectCartItems } from "@/store/cartSlice";
```

- [ ] **Step 2: Change QuantitySelector to a controlled component**

Replace the `QuantitySelector` function:

```tsx
function QuantitySelector({
  max,
  qty,
  onChange,
}: {
  max: number;
  qty: number;
  onChange: (qty: number) => void;
}) {
  const atMax = qty >= max;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center rounded-xl border border-[#DDD0B3] overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, qty - 1))}
          className="w-9 h-9 flex items-center justify-center text-[#7A5C3E] hover:bg-[#F5EDD6] transition-colors"
        >
          <HugeiconsIcon icon={Minus} className="w-3.5 h-3.5" />
        </button>
        <span className="w-10 text-center text-sm font-bold text-[#2C1A0E]">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, qty + 1))}
          disabled={atMax}
          className={`w-9 h-9 flex items-center justify-center text-[#7A5C3E] transition-colors ${
            atMax ? "opacity-30 cursor-not-allowed" : "hover:bg-[#F5EDD6]"
          }`}
        >
          <HugeiconsIcon icon={Plus} className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        type="button"
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#DDD0B3] text-[#A89070] hover:text-red-400 hover:border-red-200 transition-colors bg-white"
      >
        <HugeiconsIcon icon={Heart} className="w-4 h-4" />
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Update the ProductDetailPage function body**

In the `ProductDetailPage` function, make these targeted changes:

**Remove** this line:
```tsx
const [addedToCart, setAddedToCart] = useState(false);
```

**Add** these lines alongside the existing `useState` declarations:
```tsx
const dispatch = useAppDispatch();
const cartItems = useAppSelector(selectCartItems);
const [selectedQty, setSelectedQty] = useState(1);
```

**Replace** the `handleAddToCart` function and add the cart-derived values immediately before it:
```tsx
const cartItem = product ? cartItems.find((i) => i.id === product.id) : undefined;
const cartQty = cartItem?.qty ?? 0;
const atCartMax = product ? cartQty >= product.stock : false;

const handleAddToCart = () => {
  if (!product || product.stock === 0 || atCartMax || product.price === null) return;
  dispatch(
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] ?? "",
      category: product.category,
      qty: selectedQty,
    }),
  );
};
```

- [ ] **Step 4: Update QuantitySelector usage in the JSX**

Find:
```tsx
{product.stock > 0 && <QuantitySelector max={product.stock} />}
```

Replace with:
```tsx
{product.stock > 0 && (
  <QuantitySelector
    max={product.stock}
    qty={selectedQty}
    onChange={setSelectedQty}
  />
)}
```

- [ ] **Step 5: Update the Add to Cart button in the JSX**

Replace the entire Add to Cart `<button>` element (the one with `onClick={handleAddToCart}`):

```tsx
<button
  type="button"
  onClick={handleAddToCart}
  disabled={product.stock === 0 || atCartMax}
  className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm text-white transition-all duration-200 active:scale-[0.98]"
  style={{
    backgroundColor: atCartMax
      ? "#7A5C3E"
      : product.stock === 0
        ? "#A89070"
        : "#C8720A",
    cursor:
      product.stock === 0 || atCartMax ? "not-allowed" : "pointer",
  }}
>
  {atCartMax ? (
    "Max in Cart"
  ) : product.stock === 0 ? (
    "Out of Stock"
  ) : (
    <>
      <HugeiconsIcon icon={ShoppingCart} className="w-4 h-4" />
      Add to Cart
    </>
  )}
</button>
```

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit 2>&1 | grep "ProductDetail"
```

Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add components/ProductDetailPage.tsx
git commit -m "feat: wire ProductDetailPage Add to Cart to Redux, lift QuantitySelector state"
```

---

## Task 8: Rewrite `CartPage` to use Redux + server sync

**Files:**
- Modify: `components/CartPage.tsx`

This task replaces the hardcoded `INITIAL_CART` + local `useState` with Redux state, and adds server sync on mount.

- [ ] **Step 1: Replace the import block at the top of CartPage.tsx**

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Delete,
  Lock,
  ShoppingBag,
  MessageCircle,
  Check,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatPrice, relatedProducts } from "@/lib/data";
import SmartImage from "@/components/custom/smart-images";
import NavbarComponents from "@/components/ui/header";
import Footer from "@/components/home/Footer";
import {
  useSiteCategories,
  fetchInventoryItems,
} from "@/lib/queries/supabase-rest";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeItem,
  updateQty,
  syncWithServer,
  selectCartItems,
  selectCartTotal,
  addItem,
  type CartItem,
} from "@/store/cartSlice";
```

- [ ] **Step 2: Remove the local type and hardcoded data**

Delete these blocks entirely from `CartPage.tsx`:

```tsx
// DELETE this:
type CartItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
  imageUrl: string;
};

// DELETE this:
const INITIAL_CART: CartItem[] = [
  { ... },
  { ... },
  { ... },
];
```

- [ ] **Step 3: Replace the CartPage function body**

The `CartPage` function currently opens with:

```tsx
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useSiteCategories({ p_site_id: SITE_ID });
  const categories = categoriesData ?? [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const handleCheckout = () => { ... };

  const updateQty = (id: string, delta: number) => { ... };

  const removeItem = (id: string) => { ... };
```

Replace that entire opening block with:

```tsx
const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartTotal);
  const [promoCode, setPromoCode] = React.useState("");
  const [promoApplied, setPromoApplied] = React.useState(false);
  const hasSynced = useRef(false);

  const { data: categoriesData } = useSiteCategories({ p_site_id: SITE_ID });
  const categories = categoriesData ?? [];

  const cartIds = items.map((i) => i.id);

  const { data: serverItems } = useQuery({
    queryKey: ["cart-sync", cartIds.join(",")],
    queryFn: () =>
      fetchInventoryItems({
        queryParams: {
          id: `in.(${cartIds.join(",")})`,
          site_id: SITE_ID,
        },
      }),
    enabled: cartIds.length > 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!serverItems || hasSynced.current) return;
    hasSynced.current = true;

    const anyChange = items.some((item) => {
      const server = serverItems.find((s) => s.id === item.id);
      if (!server || server.quantity === 0) return true;
      if (item.qty > server.quantity) return true;
      const serverPrice =
        server.price !== null ? parseFloat(server.price) : NaN;
      if (!isNaN(serverPrice) && serverPrice !== item.price) return true;
      return false;
    });

    dispatch(syncWithServer(serverItems));

    if (anyChange) {
      toast("Some items were updated to match current availability");
    }
  }, [serverItems]);

  const handleCheckout = () => {
    // Checkout flow to be wired up with payment integration
  };

  const handleUpdateQty = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    dispatch(updateQty({ id, qty: item.qty + delta }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };
```

Note: the old `const SITE_ID` at the top of the file (line 24 in the original) must also be removed since it's now defined inside this block. Check if it already existed at module level and delete the duplicate.

- [ ] **Step 4: Update the two places in JSX that reference the old handler names**

Find:
```tsx
<CartItemCard
  key={item.id}
  item={item}
  onUpdateQty={updateQty}
  onRemove={removeItem}
/>
```

Replace with:
```tsx
<CartItemCard
  key={item.id}
  item={item}
  onUpdateQty={handleUpdateQty}
  onRemove={handleRemoveItem}
/>
```

- [ ] **Step 5: Update SuggestedCard to dispatch addItem**

The `SuggestedCard` component has a local `added` state for animation only and doesn't actually add to cart. Wire it up:

Add imports at the top of `SuggestedCard` (it's a local component, so pass dispatch via the parent or use the hook directly since it's `"use client"`):

Replace the `SuggestedCard` function with:

```tsx
function SuggestedCard({ product }: { product: (typeof relatedProducts)[0] }) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [added, setAdded] = React.useState(false);

  const cartItem = cartItems.find((i) => i.id === product.id);
  const inCart = (cartItem?.qty ?? 0) > 0;

  const handleAdd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: "General",
        qty: 1,
      }),
    );
    setAdded(true);
    timerRef.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-[#E5D9C0] bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative overflow-hidden bg-[#F5EDD6] aspect-[4/3]">
        <SmartImage
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={225}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p
          className="text-sm font-semibold text-[#2C1A0E] leading-snug line-clamp-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {product.name}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-[#C8720A]">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
            style={{ backgroundColor: added || inCart ? "#4A7C59" : "#C8720A" }}
          >
            <HugeiconsIcon
              icon={added || inCart ? Check : Plus}
              className="w-3.5 h-3.5 text-white"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
```

Note: `relatedProducts` items in `lib/data.ts` don't have a `category` field — they only have `id`, `name`, `price`, `imageUrl`. We use `"General"` as a fallback category for suggested items.

Also note: `relatedProducts` items have `price: number` (not `number | null`), so no null check is needed here.

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit 2>&1 | grep "CartPage"
```

Expected: no output.

- [ ] **Step 7: Full build check**

```bash
npm run build 2>&1 | tail -15
```

Expected: build succeeds.

- [ ] **Step 8: Manual smoke test**

Start the dev server: `npm run dev`

1. Go to `/home` → add a product → cart badge shows `1`
2. Navigate to a different category page → badge still shows `1`
3. Hard-refresh the page → badge still shows `1` (localStorage restored)
4. Open `/home/cart` → the item appears with correct name, price, image
5. Click `+` / `-` → quantity changes
6. Click the delete icon → item is removed
7. Add a second product from the detail page → select qty `2` → "Add to Cart" → cart badge shows `2`
8. Open `/home/cart` → both items visible, total is correct

- [ ] **Step 9: Commit**

```bash
git add components/CartPage.tsx
git commit -m "feat: rewrite CartPage with Redux state, server sync on mount, and real add-to-cart"
```

---

## Self-Review

**Spec coverage:**
- ✓ Redux Toolkit cart slice with all four actions — Task 2
- ✓ `CartState` and `CartItem` types exported — Task 2
- ✓ Selectors `selectCartItems`, `selectCartCount`, `selectCartTotal` — Task 2
- ✓ localStorage middleware writes on every action — Task 3
- ✓ Store hydrates from localStorage on boot — Task 3
- ✓ Typed hooks `useAppDispatch` / `useAppSelector` — Task 3
- ✓ `ReduxProvider` wraps layout — Tasks 4
- ✓ Navbar reads `selectCartCount` from Redux, `cartCount` prop removed from all 5 call sites — Task 5
- ✓ `ProductCard` dispatches `addItem`, guards max-stock, shows "In Cart (n)" / "Max in cart" — Task 6
- ✓ `ProductDetailPage` lifts qty state, dispatches `addItem` with selected qty, shows "Max in Cart" — Task 7
- ✓ `CartPage` reads items and total from Redux — Task 8
- ✓ Server sync fires on CartPage mount via React Query batch fetch — Task 8
- ✓ `syncWithServer` auto-clamps qty, updates price, removes out-of-stock — Task 2 reducer + Task 8
- ✓ Sonner toast fires when any item was adjusted — Task 8
- ✓ `SuggestedCard` in CartPage now dispatches real `addItem` — Task 8

**Placeholder scan:** No TBDs or incomplete steps. Every step contains the full code or the exact targeted edit.

**Type consistency:**
- `CartItem` defined and exported from `store/cartSlice.ts` — imported in `CartPage.tsx` (Task 8), used implicitly in `productCard.tsx` via `addItem` payload (Task 6)
- `addItem`, `removeItem`, `updateQty`, `syncWithServer` named consistently across slice definition and all import sites
- `handleUpdateQty` / `handleRemoveItem` named to avoid shadowing the imported Redux action names
- `selectCartItems`, `selectCartCount`, `selectCartTotal` named consistently in slice and all call sites
- `useAppDispatch`, `useAppSelector` defined in `store/hooks.ts`, imported the same way in all 4 consumer files
