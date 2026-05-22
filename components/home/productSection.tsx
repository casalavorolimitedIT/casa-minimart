import { type Product } from "@/lib/data";
import ProductCard from "./productCard";

interface ProductSectionProps {
  title: string;
  products: Product[];
  accentColor?: string;
}

export default function ProductSection({
  title,
  products,
  accentColor = "var(--amber-brand)",
}: ProductSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          className="block w-1 h-6 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <h2
          className="text-base font-bold uppercase tracking-widest"
          style={{ color: "var(--espresso)", fontFamily: "Georgia, serif" }}
        >
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 stagger-children">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
