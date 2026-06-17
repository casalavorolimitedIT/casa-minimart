"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      startTransition(() => {
        router.replace(`/dashboard/orders?${params.toString()}`);
      });
    }, 300);
  };

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
        style={{ color: isPending ? "#C8720A" : "#A89070" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        onChange={handleChange}
        placeholder="Search by order ref…"
        className="h-9 pl-8 pr-3 rounded-xl text-sm border outline-none w-full sm:w-56 transition-all"
        style={{
          backgroundColor: "white",
          borderColor: "#DDD0B3",
          color: "#2C1A0E",
        }}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "#C8720A")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "#DDD0B3")
        }
      />
    </div>
  );
}
