# Cart Page Design Spec
**Date:** 2026-06-10
**Status:** Approved

## Overview

A premium full-page cart experience at `/home/cart`. Uses the shared `NavbarComponents` header, static mock data (real state management via Redux deferred to a future phase), and `SmartImage` for all product images. Designed to feel like a high-end grocery experience — warm, editorial, and confident.

## Route & Entry Point

- **Route:** `/home/cart` (new Next.js App Router page)
- **Component file:** `components/CartPage.tsx` (client component)
- **Page file:** `app/home/cart/page.tsx` (thin wrapper)
- **Header:** Shared `NavbarComponents` from `components/ui/header.tsx`

## Layout

### Desktop (lg+)
Two-column grid: `grid-cols-[1fr_380px]`, `gap-8`, inside a `max-w-7xl` container.
- Left column: cart items list
- Right column: sticky order summary (`sticky top-20`)

### Mobile (< lg)
Single column. Items panel stacks above summary panel. A sticky "Proceed to Checkout" bar pins to the bottom of the viewport on mobile.

### Background
`#FAF4E8` (warm cream) — consistent with the rest of the app.

---

## Left Panel — Cart Items

### Section Header
- "Your Cart" in Georgia serif, espresso `#2C1A0E`, `text-2xl font-bold`
- Item count pill: e.g. `3 items` — small amber-tinted badge

### Cart Item Card
Each item is a `rounded-2xl` white card with `border border-[#E5D9C0]` and subtle shadow. Layout: horizontal row.

| Element | Detail |
|---|---|
| Image | `SmartImage` 96×96 (mobile: 72×72), `rounded-xl`, `object-cover` |
| Category badge | Small pill: `bg-[#FBF5E6] text-[#C8720A]`, e.g. "Toiletries" |
| Product name | Georgia serif, espresso, `text-sm font-semibold`, 2-line clamp |
| Unit price | `text-xs text-[#A89070]` |
| Quantity stepper | Pill-style `rounded-xl` border, Minus/Plus HugeIcons, count centered |
| Line subtotal | `font-bold text-[#2C1A0E]` — qty × unit price |
| Delete button | Trash HugeIcon, `text-[#A89070]` → `text-red-400` on hover |

Card hover state: `hover:shadow-md hover:-translate-y-0.5 transition-all`.

### Footer of Items Panel
- "← Continue Shopping" text link back to `/home`

### Empty State
When cart has 0 items: centered layout with a large shopping bag HugeIcon (muted), "Your cart is empty" heading, subtext, and an amber "Start Shopping →" button linking to `/home`.

---

## Right Panel — Order Summary

Sticky white `rounded-2xl` card with `border border-[#E5D9C0]`.

### Summary Rows
```
Subtotal          ₦55,680
─────────────────────────   (divider)
Total             ₦55,680   (bold, large)
```

**Delivery fee row** — present in code but `hidden`. Markup:
```tsx
{/* TODO: unhide when delivery is wired up */}
<div className="hidden items-center justify-between ...">
  <span>Delivery Fee <Badge>Abuja Express</Badge></span>
  <span>₦1,500</span>
</div>
```

### Promo Code
Inline form: cream-background input + amber "Apply" button. Non-functional for now (static).

### CTA
Full-width amber button: `bg-[#C8720A]` → "Proceed to Checkout →", `h-12 rounded-xl font-semibold`.

### Trust Line
Lock HugeIcon + "Secure Transaction" in `text-xs text-[#A89070]`.

### WhatsApp Support
`MessageCircle` HugeIcon (green) + "Need help? Chat on WhatsApp" link — matches Footer pattern.

---

## "You May Also Like" Strip

Below the two-column grid, a full-width section using the same `relatedProducts` data and `RelatedCard` pattern from `ProductDetailPage`. 4 cards in a `grid-cols-2 sm:grid-cols-4` grid.

---

## Mock Data

```typescript
const cartItems = [
  {
    id: "t1",
    name: "Gillette Shaving Stick",
    category: "Toiletries",
    price: 20000,
    qty: 1,
    imageUrl: "https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=300&q=80",
  },
  {
    id: "t2",
    name: "Kids Oral B Toothbrush",
    category: "Toiletries",
    price: 20000,
    qty: 2,
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=300&q=80",
  },
  {
    id: "t3",
    name: "Sensodyne Toothpaste",
    category: "Toiletries",
    price: 7840,
    qty: 1,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80",
  },
];
```

Subtotal computed as `cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)` = ₦67,840.
(Gillette ₦20,000×1 + Oral B ₦20,000×2 + Sensodyne ₦7,840×1)

---

## Icons (HugeIcons)

All icons via `HugeiconsIcon` from `@hugeicons/react`:

| Usage | Icon alias |
|---|---|
| Delete item | `Delete02` |
| Quantity minus | `Minus` |
| Quantity plus | `Plus` |
| Continue shopping | `ChevronLeft` |
| Checkout arrow | `ChevronRight` |
| Secure transaction | `LockKey` (or `SecurityLock01`) |
| WhatsApp | `MessageCircle` |
| Empty state bag | `ShoppingBag01` |
| Promo/tag | `Tag01` |

---

## Files to Create

| File | Purpose |
|---|---|
| `app/home/cart/page.tsx` | Thin page wrapper |
| `components/CartPage.tsx` | Full cart UI (client component) |

## Files Unchanged
All existing files — this is a pure addition.

---

## Out of Scope (Future)
- Redux cart state management
- Real delete/quantity update logic (buttons present, wired to local static state only)
- Delivery fee calculation and address selection
- Checkout flow / payment integration
