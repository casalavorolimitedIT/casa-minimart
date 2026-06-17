"use client";

import { useAppSelector } from "@/store/hooks";
import { selectCartCount } from "@/store/cartSlice";

export function CartBadge() {
  const count = useAppSelector(selectCartCount);
  if (count === 0) return null;
  return (
    <span
      className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
      style={{ backgroundColor: "#C8720A" }}
    >
      {count}
    </span>
  );
}
