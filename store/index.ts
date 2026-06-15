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
      if (typeof window !== "undefined") {
        const state = storeApi.getState() as RootState;
        localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
      }
    } catch {
      // QuotaExceededError or other storage errors
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
