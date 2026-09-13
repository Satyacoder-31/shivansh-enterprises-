import React from "react";
import { getServices } from "@/lib/actions/admin";
import ServicesClient from "./ServicesClient";

export const metadata = {
  title: "Manage Services | Sivansh Admin",
};

export const dynamic = "force-dynamic";


export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <ServicesClient initialServices={services} />
    </div>
  );
}
