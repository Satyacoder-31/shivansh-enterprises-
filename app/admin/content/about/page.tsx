import React from "react";
import { getPageSection } from "@/lib/actions/admin";
import AboutManagerClient from "./AboutManagerClient";

export const metadata = {
  title: "About Page CMS | Sivansh Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminAboutContentPage() {
  const [banner, foundation, pillars] = await Promise.all([
    getPageSection("about", "hero_banner"),
    getPageSection("about", "foundation"),
    getPageSection("about", "pillars"),
  ]);

  return (
    <AboutManagerClient
      initialBanner={banner}
      initialFoundation={foundation}
      initialPillars={pillars}
    />
  );
}
