import type { Metadata } from "next";
import ProductDetailPage from "@/components/ProductDetailPage";

const STORAGE_BASE =
  "https://bzhatetufhlkwrtfjbyp.supabase.co/storage/v1/object/public/app-bucket/";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const url = new URL(
    "/rest/v1/inventory_items",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  url.searchParams.set("select", "name,category,price,images,note,quantity");
  url.searchParams.set("id", `eq.${slug}`);
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: {
      apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    },
    next: { revalidate: 60 },
  });

  const fallback: Metadata = {
    title: "Product | Casalavoro Minimart",
    description: "Shop everyday essentials at Casalavoro Minimart, Abuja.",
  };

  if (!res.ok) return fallback;

  const items = await res.json() as Array<{
    name: string;
    category: string;
    price: string | null;
    images: string[];
    note?: string;
    quantity: number;
  }>;

  const item = items[0];
  if (!item) return fallback;

  const priceNum = item.price !== null ? parseFloat(item.price) : null;
  const priceStr =
    priceNum !== null && !isNaN(priceNum)
      ? `₦${priceNum.toLocaleString("en-NG")}`
      : "Price on request";

  const description =
    [item.note, `${item.category} · ${priceStr}`]
      .filter(Boolean)
      .join(" · ");

  const imageUrl =
    Array.isArray(item.images) && item.images.length > 0
      ? `${STORAGE_BASE}${item.images[0].replace(/^\//, "")}`
      : null;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    "https://casa-minimart.vercel.app";

  const pageUrl = `${baseUrl}/home/product/${slug}`;

  return {
    title: `${item.name} | Casalavoro Minimart`,
    description,
    openGraph: {
      title: item.name,
      description,
      url: pageUrl,
      siteName: "Casalavoro Minimart",
      type: "website",
      ...(imageUrl && {
        images: [{ url: imageUrl, width: 800, height: 800, alt: item.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: item.name,
      description,
      ...(imageUrl && { images: [imageUrl] }),
    },
  };
}

export default function Page() {
  return <ProductDetailPage />;
}
