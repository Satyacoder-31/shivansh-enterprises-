import React from "react";
import { getProducts } from "@/lib/actions/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import ShopClient from "./ShopClient";

export const revalidate = 0;

export default async function ShopPage() {
  const supabase = createAdminClient();
  const [products, { data: categories }] = await Promise.all([
    getProducts({ status: "published" }),
    supabase.from("categories").select("*").order("display_order", { ascending: true }),
  ]);

  return (
    <div className="shop-page-container">
      {/* Page Header Banner */}
      <section className="page-header-banner bg-surface section-pad-sm">
        <div className="container text-center">
          <div className="eyebrow text-gold">Official Product Registry</div>
          <h1 className="serif-heading section-title">
            AUTHENTIC HARDWARE <span className="text-gold-gradient">CATALOG.</span>
          </h1>
          <p className="page-header-sub max-w-2xl mx-auto text-secondary">
            Verified manufacturer specifications, zero fabricated pricing, and authentic test parameters. 
            Directly from official brand brochures.
          </p>
        </div>
      </section>

      {/* Main Catalog Body */}
      <section className="shop-main-section section-pad">
        <div className="container">
          <ShopClient 
            products={products} 
            categories={categories || []} 
          />
        </div>
      </section>
    </div>
  );
}
