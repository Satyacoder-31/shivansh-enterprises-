import React from "react";
import { getHeroSlides } from "@/lib/actions/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import HomepageManagerClient from "./HomepageManagerClient";

export const revalidate = 0;

export default async function AdminHomepageCMSPage() {
  const supabase = createAdminClient();
  const [slides, { data: sections }] = await Promise.all([
    getHeroSlides(),
    supabase.from("page_sections").select("*").eq("page_slug", "home").order("display_order", { ascending: true })
  ]);

  return (
    <HomepageManagerClient 
      initialSlides={slides} 
      initialSections={sections || []} 
    />
  );
}
