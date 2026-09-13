import React from "react";
import { getOrders } from "@/lib/actions/admin";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Orders & Transactions | Sivansh Admin",
};

export const dynamic = "force-dynamic";


export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <OrdersClient initialOrders={orders} />
    </div>
  );
}
