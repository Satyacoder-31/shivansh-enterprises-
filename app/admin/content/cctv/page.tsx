import React from "react";
import { getPageSection } from "@/lib/actions/admin";
import DomainPageManagerClient from "../DomainPageManagerClient";

export const metadata = {
  title: "CCTV Page CMS | Sivansh Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminCCTVContentPage() {
  const [heroBanner, standards, productsHeader] = await Promise.all([
    getPageSection("cctv", "hero_banner"),
    getPageSection("cctv", "standards"),
    getPageSection("cctv", "products_header"),
  ]);

  return (
    <DomainPageManagerClient
      pageSlug="cctv"
      pageTitle="CCTV Surveillance Architecture"
      initialHeroBanner={heroBanner}
      initialStandards={standards}
      initialProductsHeader={productsHeader}
    />
  );
}
