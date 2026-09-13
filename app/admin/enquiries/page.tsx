import React from "react";
import { getEnquiries } from "@/lib/actions/admin";
import EnquiriesClient from "./EnquiriesClient";

export const metadata = {
  title: "Client Enquiries & Leads | Sivansh Admin",
};

export const dynamic = "force-dynamic";


export default async function AdminEnquiriesPage() {
  const enquiries = await getEnquiries();

  return (
    <div>
      <EnquiriesClient initialEnquiries={enquiries} />
    </div>
  );
}
