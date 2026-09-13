import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProducts } from "@/lib/actions/admin";
import ProductDetailsClient from "./ProductDetailsClient";
import ProductCard from "@/components/ProductCard";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Related products
  const allProducts = await getProducts({ category: product.category_id, status: 'published' });
  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="product-details-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb-strip bg-surface">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="crumb-sep">/</span>
            <Link href="/shop">Shop</Link>
            <span className="crumb-sep">/</span>
            <Link href={`/${product.category_id}`}>{product.category?.name || product.category_id.toUpperCase()}</Link>
            <span className="crumb-sep">/</span>
            <span className="current-crumb text-gold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero / Main Specifications Grid */}
      <section className="product-main-view section-pad">
        <div className="container">
          <ProductDetailsClient product={product} />
        </div>
      </section>

      {/* Related Products from the Same Category */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section section-pad-sm bg-surface">
          <div className="container">
            <div className="section-header text-center mb-8">
              <div className="eyebrow text-gold">Complementary Hardware</div>
              <h2 className="serif-heading section-title">RELATED <span className="text-gold-gradient">EQUIPMENT.</span></h2>
            </div>
            <div className="products-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
