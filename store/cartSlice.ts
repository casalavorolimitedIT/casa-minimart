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
    /** Callers are responsible for checking stock before dispatching to prevent over-adding. */
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
    /**
     * Syncs cart against live server data. Caller MUST pass server records for ALL
     * current cart item IDs — any item absent from the payload is treated as deleted.
     */
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
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQty, syncWithServer, clearCart } =
  cartSlice.actions;

// Selectors use an inline state type to avoid circular imports with store/index.ts
export const selectCartItems = (state: { cart: CartState }) =>
  state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.qty, 0);
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export default cartSlice.reducer;
