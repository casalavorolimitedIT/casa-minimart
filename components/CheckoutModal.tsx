"use client";

import React, { useState, useEffect } from "react";
import {
  Check,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatPrice } from "@/lib/data";
import type { CartItem } from "@/store/cartSlice";
import { createOrder } from "@/app/actions/create-order";

const BANK_NAME = process.env.NEXT_PUBLIC_BANK_NAME ?? "Taj Bank";
const ACCOUNT_NAME = process.env.NEXT_PUBLIC_ACCOUNT_NAME ?? "Casalavoro Ltd";
const ACCOUNT_NUMBER = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER ?? "0008261185";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const VAT_RATE = parseFloat(process.env.NEXT_PUBLIC_VAT_RATE ?? "0.075");

function generateOrderRef(): string {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${date}-${rand}`;
}

const STEPS = ["Review", "Transfer", "Receipt"] as const;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
}: CheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [orderRef] = useState(generateOrderRef);
  const [copiedField, setCopiedField] = useState<"account" | "amount" | null>(null);
  const [receiptSent, setReceiptSent] = useState(false);

  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: "account" | "amount") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const saveOrder = () => {
    createOrder(
      orderRef,
      items.map((i) => ({ id: i.id, qty: i.qty })),
    ).then(({ error }) => {
      if (error) console.error("[orders] save failed:", error);
    });
  };

  const orderUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? (typeof window !== "undefined" ? window.location.origin : "")}/order/${orderRef}`;
  const whatsappText = encodeURIComponent(
    `Hi! I've made a bank transfer for my Casalavoro Minimart order.\n\nOrder Reference: ${orderRef}\nTrack order: ${orderUrl}\n\nItems:\n${items.map((i) => `- ${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}`).join("\n")}\n\nSubtotal: ${formatPrice(subtotal)}\nVAT (7.5%): ${formatPrice(vat)}\nTotal Paid: ${formatPrice(total)}\n\nPlease confirm and process my order. Thank you!`,
  );
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(44, 26, 14, 0.65)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#FEFCF7", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4 border-b sticky top-0"
          style={{ backgroundColor: "#FEFCF7", borderColor: "#E5D9C0" }}
        >
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all"
                    style={{
                      backgroundColor: i + 1 <= step ? "#C8720A" : "#E5D9C0",
                      color: i + 1 <= step ? "white" : "#A89070",
                    }}
                  >
                    {i + 1 < step ? (
                      <HugeiconsIcon icon={Check} className="w-2.5 h-2.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className="text-xs font-semibold hidden sm:block"
                    style={{ color: i + 1 <= step ? "#C8720A" : "#A89070" }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-5 sm:w-8 h-px shrink-0"
                    style={{
                      backgroundColor: i + 1 < step ? "#C8720A" : "#DDD0B3",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-[#A89070] hover:text-[#2C1A0E] hover:bg-[#F5EDD6] transition-all text-xl leading-none shrink-0"
          >
            ×
          </button>
        </div>

        {/* ── Step 1: Review ───────────────────────────────── */}
        {step === 1 && (
          <div className="p-5 space-y-5">
            <div>
              <h2
                className="text-lg font-bold text-[#2C1A0E]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Review Your Order
              </h2>
              <span
                className="mt-1.5 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#FBF5E6", color: "#C8720A" }}
              >
                Ref: {orderRef}
              </span>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2C1A0E] leading-snug line-clamp-1">
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

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7A5C3E]">Subtotal</span>
                <span className="font-semibold text-[#2C1A0E]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A5C3E]">VAT (7.5%)</span>
                <span className="font-semibold text-[#2C1A0E]">
                  {formatPrice(vat)}
                </span>
              </div>
              <div
                className="flex justify-between pt-2 border-t"
                style={{ borderColor: "#E5D9C0" }}
              >
                <span className="font-bold text-[#2C1A0E]">Total</span>
                <span
                  className="text-xl font-bold text-[#2C1A0E]"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
              style={{ backgroundColor: "#C8720A" }}
            >
              Proceed to Transfer
              <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step 2: Transfer ─────────────────────────────── */}
        {step === 2 && (
          <div className="p-5 space-y-5">
            <div>
              <h2
                className="text-lg font-bold text-[#2C1A0E]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Make Your Transfer
              </h2>
              <p className="text-xs text-[#A89070] mt-0.5">
                Transfer the exact amount to the account below.
              </p>
            </div>

            <div
              className="rounded-xl p-4 space-y-3"
              style={{ backgroundColor: "#FAF4E8", border: "1px solid #E5D9C0" }}
            >
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A89070]">Bank</span>
                  <span className="font-semibold text-[#2C1A0E]">{BANK_NAME}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A89070]">Account name</span>
                  <span className="font-semibold text-[#2C1A0E]">{ACCOUNT_NAME}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#A89070]">Account number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2C1A0E] tracking-widest">
                      {ACCOUNT_NUMBER}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACCOUNT_NUMBER, "account")}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all shrink-0"
                      style={{
                        backgroundColor:
                          copiedField === "account" ? "#EAF2EC" : "#F5EDD6",
                        color: copiedField === "account" ? "#4A7C59" : "#C8720A",
                      }}
                    >
                      {copiedField === "account" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                <div
                  className="flex justify-between items-center pt-2.5 border-t"
                  style={{ borderColor: "#E5D9C0" }}
                >
                  <span className="text-[#A89070]">Amount to pay</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold text-lg"
                      style={{ color: "#C8720A" }}
                    >
                      {formatPrice(total)}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(String(total), "amount")}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all shrink-0"
                      style={{
                        backgroundColor:
                          copiedField === "amount" ? "#EAF2EC" : "#F5EDD6",
                        color: copiedField === "amount" ? "#4A7C59" : "#C8720A",
                      }}
                    >
                      {copiedField === "amount" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Narration reminder */}
            <div
              className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs"
              style={{ backgroundColor: "#EAF2EC", color: "#4A7C59" }}
            >
              <HugeiconsIcon
                icon={Check}
                className="w-3.5 h-3.5 shrink-0 mt-0.5"
              />
              <span>
                Use{" "}
                <strong className="font-bold tracking-wide">{orderRef}</strong>{" "}
                as your transfer narration so we can match your payment.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="h-12 px-4 rounded-xl font-semibold text-sm border flex items-center gap-1 transition-all active:scale-[0.98]"
                style={{ borderColor: "#DDD0B3", color: "#7A5C3E" }}
              >
                <HugeiconsIcon icon={ChevronLeft} className="w-4 h-4" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
                style={{ backgroundColor: "#C8720A" }}
              >
                I&apos;ve Made the Transfer
                <HugeiconsIcon icon={ChevronRight} className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Send Receipt ─────────────────────────── */}
        {step === 3 && (
          <div className="p-5 space-y-5">
            {!receiptSent ? (
              <>
                <div className="text-center space-y-2">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: "#EAF2EC" }}
                  >
                    <HugeiconsIcon
                      icon={MessageCircle}
                      className="w-7 h-7 text-[#4A7C59]"
                    />
                  </div>
                  <h2
                    className="text-lg font-bold text-[#2C1A0E]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Send Your Receipt
                  </h2>
                  <p className="text-sm text-[#A89070] max-w-xs mx-auto">
                    Send your payment receipt via WhatsApp. Your order will be
                    confirmed once we verify the transfer.
                  </p>
                </div>

                <div
                  className="rounded-xl px-4 py-3 space-y-1.5 text-sm"
                  style={{ backgroundColor: "#FAF4E8", border: "1px solid #E5D9C0" }}
                >
                  <div className="flex justify-between text-xs">
                    <span className="text-[#A89070]">Order Ref</span>
                    <span className="font-bold" style={{ color: "#C8720A" }}>
                      {orderRef}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#7A5C3E]">Total Paid</span>
                    <span
                      className="font-bold text-[#2C1A0E]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    const existing: string[] = JSON.parse(localStorage.getItem("pendingOrderRefs") ?? "[]");
                    if (!existing.includes(orderRef)) {
                      localStorage.setItem("pendingOrderRefs", JSON.stringify([...existing, orderRef]));
                    }
                    saveOrder();
                    setTimeout(() => setReceiptSent(true), 600);
                  }}
                  className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <HugeiconsIcon icon={MessageCircle} className="w-4 h-4" />
                  Send Receipt on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full text-xs text-center text-[#A89070] hover:text-[#2C1A0E] transition-colors"
                >
                  ← Go back
                </button>
              </>
            ) : (
              <div className="text-center space-y-4 py-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: "#EAF2EC" }}
                >
                  <HugeiconsIcon icon={Check} className="w-8 h-8 text-[#4A7C59]" />
                </div>
                <div className="space-y-2">
                  <h2
                    className="text-xl font-bold text-[#2C1A0E]"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Order Placed!
                  </h2>
                  <p className="text-sm text-[#A89070] max-w-xs mx-auto">
                    Thank you! We&apos;ll confirm your payment and reach out via
                    WhatsApp shortly.
                  </p>
                  <span
                    className="inline-block mt-1 px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#FBF5E6", color: "#C8720A" }}
                  >
                    {orderRef}
                  </span>
                </div>

                <a
                  href={`/order/${orderRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border transition-all hover:bg-[#F5EDD6]"
                  style={{ borderColor: "#DDD0B3", color: "#7A5C3E" }}
                >
                  Track your order
                  <HugeiconsIcon icon={ChevronRight} className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const existing: string[] = JSON.parse(localStorage.getItem("pendingOrderRefs") ?? "[]");
                    localStorage.setItem("pendingOrderRefs", JSON.stringify(existing.filter((r) => r !== orderRef)));
                    onClose();
                  }}
                  className="w-full h-12 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
                  style={{ backgroundColor: "#C8720A" }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
