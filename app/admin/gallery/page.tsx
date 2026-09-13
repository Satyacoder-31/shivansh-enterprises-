import React from "react";
import { getGalleryItems } from "@/lib/actions/admin";
import GalleryManagerClient from "./GalleryManagerClient";

export const metadata = {
  title: "Gallery & Showcase | Sivansh Admin",
};

export default async function AdminGalleryPage() {
  const items = await getGalleryItems();

  return (
    <div>
      <GalleryManagerClient initialItems={items} />
    </div>
  );
}
