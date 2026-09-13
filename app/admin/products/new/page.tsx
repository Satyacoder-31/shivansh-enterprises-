import React from "react";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
          ADD NEW <span className="text-gold">HARDWARE</span>
        </h1>
        <p className="text-secondary text-xs mt-1">
          Create an authentic equipment listing with verified brand specifications and purchase modes.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
