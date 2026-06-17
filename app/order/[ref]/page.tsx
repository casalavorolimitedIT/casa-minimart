import Link from "next/link";
import { createPmsAdminClient } from "@/lib/supabase/pms-admin";
import { formatPrice } from "@/lib/data";
import { STATUS_LABEL, STATUS_COLOR, type Order } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;

  const { data: order, error } = await createPmsAdminClient()
    .from("orders")
    .select("*")
    .eq("ref", ref)
    .single<Order>();

  if (error || !order) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ backgroundColor: "#FAF4E8" }}
      >
        <p className="text-lg font-semibold text-[#2C1A0E]">Order not found</p>
        <p className="text-sm text-[#A89070]">
          Check your order reference and try again.
        </p>
        <Link
          href="/home"
          className="text-sm font-semibold"
          style={{ color: "#C8720A" }}
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const statusColor = STATUS_COLOR[order.status];
  const statusLabel = STATUS_LABEL[order.status];

  const steps: { key: Order["status"]; label: string }[] = [
    { key: "pending", label: "Order Placed" },
    { key: "confirmed", label: "Payment Confirmed" },
    { key: "delivered", label: "Delivered" },
  ];
  const currentStep = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF4E8" }}>
      {/* Header */}
      <div
        className="border-b px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
      >
        <Link
          href="/home"
          className="text-sm font-bold"
          style={{ fontFamily: "Georgia, serif", color: "#2C1A0E" }}
        >
          Casalavoro Minimart
        </Link>
        <span className="text-xs text-[#A89070]">Order Tracking</span>
      </div>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Ref + status badge */}
        <div className="space-y-2">
          <p className="text-xs text-[#A89070] uppercase tracking-wider">
            Order Reference
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-xl font-bold text-[#2C1A0E]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {order.ref}
            </h1>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
            >
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-[#A89070]">
            Placed{" "}
            {new Date(order.created_at).toLocaleString("en-NG", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        {/* Progress stepper */}
        <div
          className="rounded-2xl border p-5"
          style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
        >
          <div className="flex items-start justify-between gap-2">
            {steps.map((step, i) => {
              const done = i <= currentStep;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center gap-2 flex-1"
                >
                  {/* connector + circle row */}
                  <div className="flex items-center w-full">
                    {i > 0 && (
                      <div
                        className="flex-1 h-0.5"
                        style={{
                          backgroundColor: i <= currentStep ? "#C8720A" : "#E5D9C0",
                        }}
                      />
                    )}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        backgroundColor: done ? "#C8720A" : "#E5D9C0",
                        color: done ? "white" : "#A89070",
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className="flex-1 h-0.5"
                        style={{
                          backgroundColor:
                            i < currentStep ? "#C8720A" : "#E5D9C0",
                        }}
                      />
                    )}
                  </div>
                  <span
                    className="text-[10px] font-semibold text-center leading-tight"
                    style={{ color: done ? "#C8720A" : "#A89070" }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items */}
        <div
          className="rounded-2xl border p-5 space-y-4"
          style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
        >
          <h2
            className="font-bold text-[#2C1A0E]"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Items
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#2C1A0E] leading-snug">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#A89070]">
                    {formatPrice(item.price)} × {item.qty}
                  </p>
                </div>
                <span className="font-bold text-[#2C1A0E] shrink-0">
                  {formatPrice(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px bg-[#E5D9C0]" />

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7A5C3E]">Subtotal</span>
              <span className="font-semibold">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A5C3E]">VAT (7.5%)</span>
              <span className="font-semibold">{formatPrice(order.vat)}</span>
            </div>
            <div className="flex justify-between pt-1.5 border-t" style={{ borderColor: "#E5D9C0" }}>
              <span className="font-bold text-[#2C1A0E]">Total Paid</span>
              <span
                className="text-lg font-bold text-[#2C1A0E]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Help */}
        <p className="text-xs text-center text-[#A89070]">
          Have questions about your order?{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}?text=${encodeURIComponent(`Hi, I have a question about order ${order.ref}`)}`}
            className="font-semibold underline"
            style={{ color: "#25D366" }}
          >
            Chat on WhatsApp
          </a>
        </p>
      </main>
    </div>
  );
}
