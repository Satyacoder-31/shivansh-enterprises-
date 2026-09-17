import React from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/actions/admin";
import ProductForm from "../ProductForm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
          EDIT <span className="text-gold">HARDWARE</span>
        </h1>
        <p className="text-secondary text-xs mt-1">
          Editing {product.name} (ID: {product.id})
        </p>
      </div>

      <ProductForm initialProduct={product} />
    </div>
  );
}
