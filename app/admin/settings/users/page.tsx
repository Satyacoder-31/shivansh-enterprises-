import React from "react";
import { getProfiles } from "@/lib/actions/admin";
import UsersClient from "./UsersClient";

export const metadata = {
  title: "Team & User Roles | Sivansh Admin",
};

export default async function AdminUsersPage() {
  const profiles = await getProfiles();

  return (
    <div>
      <UsersClient initialProfiles={profiles} />
    </div>
  );
}
