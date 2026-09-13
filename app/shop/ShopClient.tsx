"use client";

import React, { useState, useMemo } from "react";
import type { Product, Category } from "@/types/database";
import ProductCard from "@/components/ProductCard";

interface ShopClientProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ShopClient({ products, categories, initialCategory = "all" }: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category_id === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.short_desc?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "name_asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    } else {
      list.sort((a, b) => a.display_order - b.display_order);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="shop-page-wrapper">
      {/* Category Filter Pills & Search Bar */}
      <div className="shop-controls-bar flex-between flex-wrap gap-4 mb-8">
        <div className="category-filter-pills flex flex-wrap gap-2">
          <button
            type="button"
            className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
            onClick={() => setSelectedCategory("all")}
          >
            All Disciplines ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                className={`filter-pill ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <div className="shop-search-sort-group flex gap-3 items-center">
          <div className="shop-search-input-wrap">
            <input
              type="text"
              placeholder="Search specifications, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shop-sort-select"
          >
            <option value="featured">Featured Order</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
            <option value="rating">Highest Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="shop-empty-state text-center py-16">
          <p className="text-secondary text-lg mb-4">
            No hardware items found matching your current filter criteria.
          </p>
          <button
            type="button"
            className="btn btn-gold-outline btn-sm"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
