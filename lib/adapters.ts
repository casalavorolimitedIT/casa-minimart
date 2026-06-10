import { type InventoryItem } from "@/lib/queries/supabase-rest";
import { type Product } from "@/lib/data";

const STORAGE_BASE =
  "https://bzhatetufhlkwrtfjbyp.supabase.co/storage/v1/object/public/app-bucket/";

export const CATEGORY_ACCENT: Record<string, string> = {
  General: "#C8720A",
  Toiletries: "#C8720A",
  Bodycare: "#C8A87A",
  Beverages: "#4A7C59",
  Snacks: "#C85A20",
  Pantry: "#7A5C3E",
  _default: "#C8720A",
};

export function getImageUrl(images: string[] | null | undefined): string {
  if (Array.isArray(images) && images.length > 0) {
    return `${STORAGE_BASE}${images[0].replace(/^\//, "")}`;
  }
  return "";
}

export function adaptInventoryItem(item: InventoryItem): Product {
  const parsed = item.price !== null ? parseFloat(item.price) : null;
  return {
    id: item.id,
    name: item.name,
    price: parsed !== null && !isNaN(parsed) ? parsed : null,
    stock: item.quantity,
    category: item.category,
    imageUrl: getImageUrl(item.images),
  };
}

export function groupByCategory(products: Product[]): Record<string, Product[]> {
  return products.reduce<Record<string, Product[]>>((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});
}
