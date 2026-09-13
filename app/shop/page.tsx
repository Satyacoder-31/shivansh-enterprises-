import React from "react";
import { getProducts, getPageSection } from "@/lib/actions/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import ShopClient from "./ShopClient";

export const revalidate = 0; // Always serve fresh dynamic content

export default async function ShopPage() {
  const supabase = createAdminClient();
  const [products, { data: categories }, bannerSec] = await Promise.all([
    getProducts({ status: "published" }),
    supabase.from("categories").select("*").order("display_order", { ascending: true }),
    getPageSection("shop", "hero_banner"),
  ]);

  const bannerEyebrow = bannerSec?.subtitle || "Official Product Registry";
  const bannerTitle = bannerSec?.title || "AUTHENTIC HARDWARE CATALOG.";
  const bannerDesc = bannerSec?.description || 
    "Verified manufacturer specifications, zero fabricated pricing, and authentic test parameters. Directly from official brand brochures.";
  const bannerMediaUrl = bannerSec?.content?.media_url || "/assets/images/hero/hero-shop.jpg";

  return (
    <div className="shop-page-container">
      {/* Page Hero Section with Background Image */}
      <section className="domain-hero-section relative overflow-hidden min-h-[440px] flex items-center">
        <div className="domain-hero-bg absolute inset-0 z-0">
          <img 
            src={bannerMediaUrl} 
            alt="Sivansh Enterprise Authentic Hardware Catalog" 
            className="hero-bg-media w-full h-full object-cover" 
          />
          <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/70 to-black/80"></div>
        </div>

        <div className="container relative z-10 pt-36 pb-20 text-center">
          <div className="eyebrow text-gold mb-2">{bannerEyebrow}</div>
          <h1 className="serif-heading section-title text-3xl md:text-5xl mb-4 text-white">
            {bannerTitle}
          </h1>
          <p className="page-header-sub max-w-2xl mx-auto text-secondary text-sm md:text-base leading-relaxed">
            {bannerDesc}
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
