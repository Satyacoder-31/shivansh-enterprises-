import React from "react";
import { getPageSection } from "@/lib/actions/admin";
import DomainPageManagerClient from "../DomainPageManagerClient";

export const metadata = {
  title: "LED Lighting Page CMS | Sivansh Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminLEDContentPage() {
  const [heroBanner, standards] = await Promise.all([
    getPageSection("led", "hero_banner"),
    getPageSection("led", "standards"),
  ]);

  return (
    <DomainPageManagerClient
      pageSlug="led"
      pageTitle="Architectural LED Lighting"
      initialHeroBanner={heroBanner}
      initialStandards={standards}
    />
  );
}
