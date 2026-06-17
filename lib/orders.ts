export type OrderStatus = "pending" | "confirmed" | "delivered";

export interface Order {
  id: string;
  ref: string;
  items: {
    id: string;
    name: string;
    price: number;
    qty: number;
    category: string;
    imageUrl: string;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Awaiting Confirmation",
  confirmed: "Order Confirmed",
  delivered: "Delivered",
};

export const STATUS_COLOR: Record<OrderStatus, { bg: string; text: string }> = {
  pending: { bg: "#FEF3C7", text: "#92400E" },
  confirmed: { bg: "#EAF2EC", text: "#4A7C59" },
  delivered: { bg: "#E0E7FF", text: "#3730A3" },
};
