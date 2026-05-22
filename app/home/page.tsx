"use client";

import Footer from "@/components/home/Footer";
import HeroBanner from "@/components/home/herobanner";
import PopularSection from "@/components/home/Popularsection";
import ProductSection from "@/components/home/productSection";
import SidebarComponent from "@/components/home/sidebar";
import NavbarComponents from "@/components/ui/header";
import { beverages, bodycare, seasoning, sweets, toiletries } from "@/lib/data";
import { useInventoryItems } from "@/lib/queries/supabase-rest";
import { useState } from "react";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [cartCount, setCartCount] = useState(2);
  const siteId = "2f8cd82b-4ff4-44fe-965d-10f4a2a37bb7";
  const category = "General";
  const { data, error, isLoading } = useInventoryItems({
    select: "*",
    limit: 10,
    queryParams: {
      // Plain values are automatically converted to eq.*
      site_id: siteId,
      category,
    },
  });
  console.log("🚀 ~ HomePage ~ data:", data);
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--cream-bg)" }}
    >
      <NavbarComponents cartCount={cartCount} />

      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex gap-6 flex-1">
        {/* Sidebar */}
        <SidebarComponent
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-10">
          {/* Hero + Featured */}
          <HeroBanner />

          {/* Product sections */}
          <div id="toiletries" className="space-y-10">
            <ProductSection
              title="Toiletries & Personal Care"
              products={toiletries}
              accentColor="#C8720A"
            />
          </div>

          <div id="bodycare">
            <ProductSection
              title="Body Care & Skincare"
              products={bodycare}
              accentColor="#C8A87A"
            />
          </div>

          <div id="tea-coffee">
            <ProductSection
              title="Tea, Coffee & Beverages"
              products={beverages}
              accentColor="#4A7C59"
            />
          </div>

          <div id="snacks">
            <ProductSection
              title="Sweets & Bubble Gum"
              products={sweets}
              accentColor="#C85A20"
            />
          </div>

          <div id="seasoning">
            <ProductSection
              title="Seasoning"
              products={seasoning}
              accentColor="#7A5C3E"
            />
          </div>

          {/* Popular */}
          <PopularSection />
        </main>
      </div>

      <Footer />
    </div>
  );
}
