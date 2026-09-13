import React from "react";
import { getPageSection } from "@/lib/actions/admin";
import BannersManagerClient from "./BannersManagerClient";

export const metadata = {
  title: "Page Banners CMS | Sivansh Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const [servicesBanner, galleryBanner, shopBanner] = await Promise.all([
    getPageSection("services", "hero_banner"),
    getPageSection("gallery", "hero_banner"),
    getPageSection("shop", "hero_banner"),
  ]);

  return (
    <BannersManagerClient
      initialServicesBanner={servicesBanner}
      initialGalleryBanner={galleryBanner}
      initialShopBanner={shopBanner}
    />
  );
}
