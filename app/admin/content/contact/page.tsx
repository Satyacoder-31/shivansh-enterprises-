import React from "react";
import { getPageSection } from "@/lib/actions/admin";
import ContactManagerClient from "./ContactManagerClient";

export const metadata = {
  title: "Contact Page CMS | Sivansh Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminContactContentPage() {
  const [banner, operational] = await Promise.all([
    getPageSection("contact", "hero_banner"),
    getPageSection("contact", "operational_info"),
  ]);

  return (
    <ContactManagerClient
      initialBanner={banner}
      initialOperational={operational}
    />
  );
}
