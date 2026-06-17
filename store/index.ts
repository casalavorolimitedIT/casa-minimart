// store/index.ts
import { configureStore, type Middleware } from "@reduxjs/toolkit";
import cartReducer, { type CartState } from "./cartSlice";
import wishlistReducer, { type WishlistState } from "./wishlistSlice";

const CART_KEY = "casa-cart";
const WISHLIST_KEY = "casa-wishlist";

function loadFromStorage():
  | { cart: CartState; wishlist: WishlistState }
  | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const cart = localStorage.getItem(CART_KEY);
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    if (!cart && !wishlist) return undefined;
    return {
      ...(cart ? { cart: JSON.parse(cart) } : {}),
      ...(wishlist ? { wishlist: JSON.parse(wishlist) } : {}),
    } as { cart: CartState; wishlist: WishlistState };
  } catch {
    return undefined;
  }
}

const localStorageMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);
    try {
      if (typeof window !== "undefined") {
        const state = storeApi.getState() as RootState;
        localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
      }
    } catch {
      // QuotaExceededError or other storage errors
    }
    return result;
  };

export const store = configureStore({
  reducer: { cart: cartReducer, wishlist: wishlistReducer },
  preloadedState: loadFromStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
