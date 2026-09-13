import React from "react";
import { getMediaLibrary } from "@/lib/actions/admin";
import MediaManagerClient from "./MediaManagerClient";

export const metadata = {
  title: "Media Assets Library | Sivansh Admin",
};

export const dynamic = "force-dynamic";


export default async function AdminMediaPage() {
  const media = await getMediaLibrary();

  return (
    <div>
      <MediaManagerClient initialMedia={media} />
    </div>
  );
}
