"use client";

import {
  useInventoryItems,
  useSiteCategories,
} from "@/lib/queries/supabase-rest";

const siteId = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";
const category = "General";

export function ExampleApiUsage() {
  const inventoryQuery = useInventoryItems({
    select: "*",
    limit: 10,
    queryParams: {
      // Plain values are automatically converted to eq.*
      site_id: siteId,
      category,
      // Explicit operators are kept as-is
      stock: "gte.1",
    },
  });

  const categoriesQuery = useSiteCategories({
    p_site_id: siteId,
  });

  if (inventoryQuery.isLoading || categoriesQuery.isLoading) {
    return <p>Loading...</p>;
  }

  if (inventoryQuery.error || categoriesQuery.error) {
    return <p>Failed to fetch data.</p>;
  }

  return (
    <div>
      <p>Inventory items: {inventoryQuery.data?.length ?? 0}</p>
      <p>Categories: {categoriesQuery.data?.length ?? 0}</p>
    </div>
  );
}
