import React from "react";
import AdminShell from "./components/AdminShell";

export const metadata = {
  title: "Admin Panel | Sivansh Enterprise",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
