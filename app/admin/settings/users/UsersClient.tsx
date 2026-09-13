"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types/database";
import { updateUserRole } from "@/lib/actions/admin";
import { ShieldCheck, UserCheck, Mail, Calendar, Key } from "lucide-react";

export default function UsersClient({ initialProfiles }: { initialProfiles: Profile[] }) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    try {
      await updateUserRole(userId, newRole);
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole as any } : p));
      router.refresh();
    } catch (err: any) {
      alert("Failed to update role: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Staff & User Roles</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage staff privileges and dashboard access rights</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/50 text-neutral-400 uppercase font-mono tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4">Role Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {profiles.map(profile => (
                <tr key={profile.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-mono font-bold text-xs uppercase">
                        {profile.full_name ? profile.full_name.charAt(0) : profile.email.charAt(0)}
                      </div>
                      <div>
                        <div>{profile.full_name || "Admin User"}</div>
                        <div className="text-[10px] font-mono text-neutral-500">ID: {profile.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-300 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{profile.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-500 font-mono">
                    {new Date(profile.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={profile.role}
                      disabled={loadingId === profile.id}
                      onChange={e => handleRoleChange(profile.id, e.target.value)}
                      className="bg-black/60 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                    >
                      <option value="SUPER_ADMIN">SUPER_ADMIN (Full Control)</option>
                      <option value="CONTENT_MANAGER">CONTENT_MANAGER (Pages & Media)</option>
                      <option value="PRODUCT_MANAGER">PRODUCT_MANAGER (Catalog Only)</option>
                      <option value="ORDER_MANAGER">ORDER_MANAGER (Orders & Leads)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role explanation */}
      <div className="p-4 bg-white/[0.02] border border-white/5 rounded-lg space-y-2 text-xs text-neutral-400">
        <p className="font-semibold text-white">Role Privileges Explanation:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-[#c5a059] font-mono">SUPER_ADMIN</span>: Unrestricted access to products, settings, payment secrets, user roles, database content.</li>
          <li><span className="text-neutral-200 font-mono">CONTENT_MANAGER</span>: Can edit homepage slides, services, portfolio gallery, and site text.</li>
          <li><span className="text-neutral-200 font-mono">PRODUCT_MANAGER</span>: Can add/edit products, stock status, specs, features, and pricing.</li>
          <li><span className="text-neutral-200 font-mono">ORDER_MANAGER</span>: Can view inquiries, call leads, update order status, and print receipts.</li>
        </ul>
      </div>
    </div>
  );
}
