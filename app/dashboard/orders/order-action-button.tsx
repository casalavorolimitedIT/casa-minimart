"use client";

import { useFormStatus } from "react-dom";

interface OrderActionButtonProps {
  label: string;
  pendingLabel: string;
  color: string;
}

export function OrderActionButton({ label, pendingLabel, color }: OrderActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="h-9 px-4 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
      style={{ backgroundColor: color }}
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block"
          />
          {pendingLabel}
        </span>
      ) : (
        label
      )}
    </button>
  );
}
