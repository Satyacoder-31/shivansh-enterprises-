import React from "react";
import { getCategories } from "@/lib/actions/admin";
import CategoriesClient from "./CategoriesClient";

export const metadata = {
  title: "Categories | Sivansh Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
