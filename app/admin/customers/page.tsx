import React from "react";
import { getCustomers } from "@/lib/actions/admin";
import CustomersClient from "./CustomersClient";

export const metadata = {
  title: "Customers | Sivansh Admin",
};

export const dynamic = "force-dynamic";


export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <CustomersClient initialCustomers={customers} />
    </div>
  );
}
