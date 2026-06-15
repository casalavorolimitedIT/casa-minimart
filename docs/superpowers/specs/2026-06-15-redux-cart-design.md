# Redux Cart with localStorage + Server Sync

**Date:** 2026-06-15  
**Status:** Approved

---

## Problem

The current cart is entirely fake: `CartPage` initialises from a hardcoded `INITIAL_CART` array. "Add to Cart" buttons on `ProductCard` and `ProductDetailPage` only toggle a local animation state — nothing is persisted. The navbar `cartCount` prop is hardcoded to `2`. There is no real cart flow.

---

## Goals

1. Add Redux Toolkit as the single source of truth for cart state.
2. Persist cart to `localStorage` so it survives page refreshes.
3. Sync cart items against live Supabase inventory on cart page open — auto-clamp quantities to available stock, update prices, remove fully out-of-stock items, and notify the user with a toast.

---

## Architecture

### New files

| File | Purpose |
|---|---|
| `store/cartSlice.ts` | Cart state, reducers, selectors |
| `store/index.ts` | Store configuration + localStorage middleware |
| `store/hooks.ts` | Typed `useAppDispatch` / `useAppSelector` |
| `components/providers/redux-provider.tsx` | `<Provider store={store}>` wrapper |

### Modified files

| File | Change |
|---|---|
| `app/layout.tsx` | Wrap with `<ReduxProvider>` |
| `components/home/productCard.tsx` | Dispatch `addItem` on button click |
| `components/ProductDetailPage.tsx` | Dispatch `addItem` with selected qty; wire `QuantitySelector` state up |
| `components/CartPage.tsx` | Read from Redux; dispatch remove/updateQty; run server sync on mount |
| `components/ui/header.tsx` | Read `selectCartCount` from Redux; remove `cartCount` prop |

---

## Cart State Shape

```ts
type CartItem = {
  id: string;        // inventory_items.id
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
};
```

### Actions

| Action | Payload | Behaviour |
|---|---|---|
| `addItem` | `CartItem` | Appends item; if `id` already exists, increments `qty` by the payload `qty` |
| `removeItem` | `id: string` | Removes item with matching id |
| `updateQty` | `{ id, qty }` | Sets qty directly; removes item if qty reaches 0 |
| `syncWithServer` | `InventoryItem[]` | Clamps qty to server quantity; removes items with quantity 0; updates price if changed |

### Selectors

| Selector | Returns |
|---|---|
| `selectCartItems` | `CartItem[]` |
| `selectCartCount` | Number of distinct items (used for navbar badge) |
| `selectCartTotal` | `sum(price × qty)` across all items |

---

## localStorage Middleware

A custom Redux middleware that runs after every dispatched action and writes `store.getState().cart` to `localStorage` under the key `"casa-cart"`.

On store creation, `preloadedState` is loaded from `localStorage` inside a `try/catch` — if the value is absent or corrupted it falls back to `{ items: [] }`.

No extra dependencies required.

---

## Server Sync Strategy

**Trigger:** `CartPage` component mount (React Query `useQuery`).

**Request:** `fetchInventoryItems` with `queryParams: { id: "in.(id1,id2,...)" }` — a single batch GET for all cart item IDs.

**`syncWithServer` reducer logic:**
1. For each current cart item, find the matching server record.
2. If not found on server → remove from cart.
3. If `serverItem.quantity === 0` → remove from cart.
4. If `cartItem.qty > serverItem.quantity` → clamp `qty` to `serverItem.quantity`.
5. If `serverItem.price !== cartItem.price` → update price.

**User feedback:** After dispatch, if any item was removed or qty was adjusted, fire a `sonner` toast: `"Some items were updated to match current availability"`.

**Navbar cart count:** `NavbarComponents` reads `selectCartCount` directly from Redux store — the `cartCount` prop is removed from all call sites. This makes the badge reactive to all cart changes across the app without prop-drilling.

---

## Key Constraints

- `addItem` on a product card should not exceed the product's available `stock` at the time of click. The button is already disabled for out-of-stock items; when clicking Add, if the item is already in the cart and `cartQty >= product.stock`, the button should be a no-op (and can show a brief "Max reached" state).
- The `syncWithServer` fetch is only triggered when the cart is non-empty. An empty cart skips the fetch entirely.
- The `QuantitySelector` in `ProductDetailPage` needs its `qty` state lifted so the "Add to Cart" button can dispatch the correct quantity.

---

## Out of Scope

- Checkout / payment integration
- Persisting cart to a server-side session or user account
- Real-time Supabase subscriptions (sync is on-demand at cart open only)
- Wishlist / save for later
