import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type WishlistItem = {
  id: string;
  name: string;
  price: number | null;
  imageUrl: string;
  category: string;
};

export type WishlistState = {
  items: WishlistItem[];
};

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem(state, action: PayloadAction<WishlistItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    removeWishlistItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlistItem, removeWishlistItem, clearWishlist } =
  wishlistSlice.actions;

export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.items;

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.items.length;

export const selectIsInWishlist =
  (id: string) =>
  (state: { wishlist: WishlistState }): boolean =>
    state.wishlist.items.some((i) => i.id === id);

export default wishlistSlice.reducer;
