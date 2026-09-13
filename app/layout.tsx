import type { Metadata } from "next";
import "./globals.css";
import { getSiteSettings } from "@/lib/actions/admin";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const businessName = settings?.business_name || "Sivansh Enterprise";
  const tagline = settings?.tagline || "CCTV, Architectural LED Lighting & Rooftop Solar in Keshod, Gujarat";

  return {
    title: `${businessName} | ${tagline}`,
    description: "Sivansh Enterprise provides ultra-premium CCTV surveillance solutions, architectural LED lighting, and turnkey rooftop solar installations in Keshod, Gujarat. Consult +91 7533838538.",
    icons: {
      icon: settings?.favicon_url || "/assets/images/favicon.svg",
    },
    openGraph: {
      title: `${businessName} | Security, Lighting & Clean Energy`,
      description: "Ultra-premium security, architectural illumination, and rooftop solar solutions for modern Gujarat spaces.",
      images: ["/assets/images/hero/hero-cctv.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        <PublicLayoutWrapper settings={settings}>
          {children}
        </PublicLayoutWrapper>
      </body>
    </html>
  );
}
