import React from "react";
import ShippingSettingsClient from "./ShippingSettingsClient";
import { getShippingSettings } from "@/lib/actions/admin";

export const metadata = {
  title: "Logistics & Shiprocket Settings | Sivansh Admin",
};

export const revalidate = 0;

export default async function ShippingSettingsPage() {
  const initialSettings = await getShippingSettings();
  return <ShippingSettingsClient initialSettings={initialSettings} />;
}
