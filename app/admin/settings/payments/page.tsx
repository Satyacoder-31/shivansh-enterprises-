import React from "react";
import { getPaymentSettings } from "@/lib/actions/admin";
import PaymentSettingsClient from "./PaymentSettingsClient";

export const metadata = {
  title: "Payment Gateway | Sivansh Admin",
};

export default async function AdminPaymentSettingsPage() {
  const settings = await getPaymentSettings();

  return (
    <div>
      <PaymentSettingsClient initialSettings={settings} />
    </div>
  );
}
