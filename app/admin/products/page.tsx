import React from "react";
import { getProducts } from "@/lib/actions/admin";
import ProductsListClient from "./ProductsListClient";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsListClient initialProducts={products} />;
}
