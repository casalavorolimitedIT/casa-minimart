import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { OrderActionButton } from "./order-action-button";
import { SearchInput } from "./search-input";
import { PaginationControls } from "./pagination-controls";
import { requireAdmin } from "@/app/dashboard/require-admin";
import { createPmsAdminClient } from "@/lib/supabase/pms-admin";
import { formatPrice } from "@/lib/data";
import { STATUS_LABEL, STATUS_COLOR, type Order, type OrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

async function updateOrderStatus(ref: string, status: OrderStatus) {
  "use server";
  await requireAdmin();

  const client = createPmsAdminClient();
  const { error } = await client
    .from("orders")
    .update({ status })
    .eq("ref", ref);
  if (error) console.error("[orders] update failed:", error.message);
  revalidatePath("/dashboard/orders");
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  await requireAdmin();

  const { status: filterStatus, q: searchQuery, page: pageParam } = await searchParams;
  const PAGE_SIZE = 10;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * PAGE_SIZE;

  const client = createPmsAdminClient();

  let dataQuery = client
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (filterStatus && filterStatus !== "all") {
    dataQuery = dataQuery.eq("status", filterStatus);
  }
  if (searchQuery) {
    dataQuery = dataQuery.ilike("ref", `%${searchQuery}%`);
  }

  const [{ data, count: filteredCount }, ...statusCounts] = await Promise.all([
    dataQuery.range(offset, offset + PAGE_SIZE - 1),
    ...(["pending", "confirmed", "delivered"] as OrderStatus[]).map((s) =>
      client
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", s),
    ),
  ]);

  const orders: Order[] = data ?? [];
  const totalPages = Math.ceil((filteredCount ?? 0) / PAGE_SIZE);

  const countMap = Object.fromEntries(
    (["pending", "confirmed", "delivered"] as OrderStatus[]).map((s, i) => [
      s,
      statusCounts[i].count ?? 0,
    ]),
  ) as Record<OrderStatus, number>;
  const totalCount = countMap.pending + countMap.confirmed + countMap.delivered;

  const tabs: { key: string; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "pending", label: "Pending", count: countMap.pending },
    { key: "confirmed", label: "Confirmed", count: countMap.confirmed },
    { key: "delivered", label: "Delivered", count: countMap.delivered },
  ];

  const activeTab = filterStatus ?? "all";

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1
          className="text-2xl font-bold text-[#2C1A0E]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Orders
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#A89070]">{totalCount} total</span>
          <Suspense>
            <SearchInput />
          </Suspense>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const tabParams = new URLSearchParams();
          if (tab.key !== "all") tabParams.set("status", tab.key);
          if (searchQuery) tabParams.set("q", searchQuery);
          const tabHref = `/dashboard/orders${tabParams.toString() ? `?${tabParams.toString()}` : ""}`;
          return (
            <a
              key={tab.key}
              href={tabHref}
              className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-sm font-semibold transition-all border"
              style={{
                backgroundColor: isActive ? "#C8720A" : "white",
                color: isActive ? "white" : "#7A5C3E",
                borderColor: isActive ? "#C8720A" : "#DDD0B3",
              }}
            >
              {tab.label}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.25)"
                    : "#F5EDD6",
                  color: isActive ? "white" : "#C8720A",
                }}
              >
                {tab.count}
              </span>
            </a>
          );
        })}
      </div>

      {/* Orders list */}
      {orders.length === 0 ? (
        <div className="text-center py-20 text-[#A89070] text-sm">
          No orders found.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const color = STATUS_COLOR[order.status];
            const label = STATUS_LABEL[order.status];
            const canConfirm = order.status === "pending";
            const canDeliver = order.status === "confirmed";

            return (
              <div
                key={order.id}
                className="rounded-2xl border p-5 space-y-4"
                style={{ backgroundColor: "white", borderColor: "#E5D9C0" }}
              >
                {/* Order header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C1A0E] text-sm">
                        {order.ref}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: color.bg, color: color.text }}
                      >
                        {label}
                      </span>
                    </div>
                    <p className="text-xs text-[#A89070]">
                      {new Date(order.created_at).toLocaleString("en-NG", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <a
                    href={`/order/${order.ref}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold underline"
                    style={{ color: "#C8720A" }}
                  >
                    Customer view ↗
                  </a>
                </div>

                {/* Items */}
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm text-[#5A3A20]"
                    >
                      <span>
                        {item.name}{" "}
                        <span className="text-[#A89070]">×{item.qty}</span>
                      </span>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "#E5D9C0" }}>
                  <div className="text-sm">
                    <span className="text-[#A89070]">Total </span>
                    <span
                      className="font-bold text-[#2C1A0E]"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-[10px] text-[#A89070] ml-1">
                      (incl. VAT)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {canConfirm && (
                      <form
                        action={async () => {
                          "use server";
                          await updateOrderStatus(order.ref, "confirmed");
                        }}
                      >
                        <OrderActionButton
                          label="Confirm Order"
                          pendingLabel="Confirming..."
                          color="#4A7C59"
                        />
                      </form>
                    )}
                    {canDeliver && (
                      <form
                        action={async () => {
                          "use server";
                          await updateOrderStatus(order.ref, "delivered");
                        }}
                      >
                        <OrderActionButton
                          label="Mark Delivered"
                          pendingLabel="Updating..."
                          color="#3730A3"
                        />
                      </form>
                    )}
                    {order.status === "delivered" && (
                      <span className="text-xs text-[#A89070] self-center">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Suspense>
        <PaginationControls page={page} totalPages={totalPages} />
      </Suspense>
    </main>
  );
}
