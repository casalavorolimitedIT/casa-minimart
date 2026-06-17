"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
}

export function PaginationControls({ page, totalPages }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.replace(`/dashboard/orders?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="h-8 w-8 rounded-lg text-sm font-semibold border transition-all disabled:opacity-30"
        style={{ borderColor: "#DDD0B3", color: "#7A5C3E" }}
      >
        ‹
      </button>

      {pages.map((p) => {
        const isActive = p === page;
        return (
          <button
            key={p}
            onClick={() => goTo(p)}
            className="h-8 w-8 rounded-lg text-sm font-semibold border transition-all"
            style={{
              backgroundColor: isActive ? "#C8720A" : "white",
              color: isActive ? "white" : "#7A5C3E",
              borderColor: isActive ? "#C8720A" : "#DDD0B3",
            }}
          >
            {p}
          </button>
        );
      })}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="h-8 w-8 rounded-lg text-sm font-semibold border transition-all disabled:opacity-30"
        style={{ borderColor: "#DDD0B3", color: "#7A5C3E" }}
      >
        ›
      </button>
    </div>
  );
}
