"use server";

import { createClient } from "@/lib/supabase/server";
import { createPmsAdminClient } from "@/lib/supabase/pms-admin";

const VAT_RATE = parseFloat(process.env.NEXT_PUBLIC_VAT_RATE ?? "0.075");
const SITE_ID = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";

export async function createOrder(
  ref: string,
  cartItems: { id: string; qty: number }[],
): Promise<{ error?: string }> {
  if (!ref || cartItems.length === 0) return { error: "Invalid request" };

  const minimart = await createClient();
  const ids = cartItems.map((i) => i.id);

  const { data: rows, error: fetchError } = await minimart
    .from("inventory_items")
    .select("id, name, price, category, images")
    .eq("site_id", SITE_ID)
    .in("id", ids);

  if (fetchError || !rows) {
    console.error("[createOrder] inventory fetch failed:", fetchError?.message);
    return { error: "Failed to fetch product data" };
  }

  const pricedItems = cartItems.flatMap(({ id, qty }) => {
    const row = rows.find((r) => r.id === id);
    if (!row || row.price === null) return [];
    const price = parseFloat(row.price as string);
    if (isNaN(price)) return [];
    return [
      {
        id,
        name: row.name as string,
        price,
        qty,
        category: (row.category as string) ?? "",
        imageUrl:
          Array.isArray(row.images) && row.images.length > 0
            ? `https://bzhatetufhlkwrtfjbyp.supabase.co/storage/v1/object/public/app-bucket/${String(row.images[0]).replace(/^\//, "")}`
            : "",
      },
    ];
  });

  if (pricedItems.length === 0) {
    return { error: "No priceable items" };
  }

  const subtotal = pricedItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + vat;

  const pms = createPmsAdminClient();
  const { error: insertError } = await pms.from("orders").insert({
    ref,
    items: pricedItems,
    subtotal,
    vat,
    total,
    status: "pending",
  });

  if (insertError) {
    console.error("[createOrder] PMS insert failed:", insertError.message);
    return { error: insertError.message };
  }
  console.log("[createOrder] order saved:", ref);
  return {};
}
