import React from "react";
import { getPageSection } from "@/lib/actions/admin";
import DomainPageManagerClient from "../DomainPageManagerClient";

export const metadata = {
  title: "Solar Energy Page CMS | Sivansh Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminSolarContentPage() {
  const [heroBanner, standards] = await Promise.all([
    getPageSection("solar", "hero_banner"),
    getPageSection("solar", "standards"),
  ]);

  return (
    <DomainPageManagerClient
      pageSlug="solar"
      pageTitle="Rooftop Solar Clean Energy"
      initialHeroBanner={heroBanner}
      initialStandards={standards}
    />
  );
}
