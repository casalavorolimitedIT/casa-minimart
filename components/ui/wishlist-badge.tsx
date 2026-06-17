"use client";

import { useAppSelector } from "@/store/hooks";
import { selectWishlistCount } from "@/store/wishlistSlice";

export function WishlistBadge() {
  const count = useAppSelector(selectWishlistCount);
  if (count === 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center bg-rose-500">
      {count}
    </span>
  );
}
