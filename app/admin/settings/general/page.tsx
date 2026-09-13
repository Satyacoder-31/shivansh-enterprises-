import React from "react";
import { getSiteSettings } from "@/lib/actions/admin";
import GeneralSettingsClient from "./GeneralSettingsClient";

export const metadata = {
  title: "General Settings | Sivansh Admin",
};

export default async function AdminGeneralSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <GeneralSettingsClient initialSettings={settings} />
    </div>
  );
}
