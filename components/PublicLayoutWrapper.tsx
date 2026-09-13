"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { SiteSettings } from "@/types/database";

interface PublicLayoutWrapperProps {
  settings: SiteSettings | null;
  children: React.ReactNode;
}

export default function PublicLayoutWrapper({
  settings,
  children,
}: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // On any admin route (/admin, /admin/login, /admin/content/..., etc.),
  // do NOT render the public website Header, Footer, CartDrawer, or WhatsApp button.
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Header settings={settings} />
      <main id="main-content">{children}</main>
      <Footer settings={settings} />
      <CartDrawer />
      <WhatsAppButton phone={settings?.whatsapp || "+91 7533838538"} />
    </CartProvider>
  );
}
