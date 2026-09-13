"use client";

import React, { useState } from "react";
import type { Customer } from "@/types/database";
import { Users, Search, Phone, Mail, MapPin, Building, Download } from "lucide-react";

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = ["ID", "Name", "Phone", "Email", "Company", "Total Spent", "Created At"];
    const rows = filtered.map(c => [
      c.id,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.email || ""}"`,
      `"${(c.company || "").replace(/"/g, '""')}"`,
      c.total_spent || 0,
      new Date(c.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sivansh_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Customer Directory</h1>
          <p className="text-neutral-400 text-sm mt-1">Verified clients, installation accounts, and purchase histories</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-mono border border-white/10 flex items-center gap-2 cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>Export Customers</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by customer name, phone, company..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-[#141414] border border-white/5 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/50 text-neutral-400 uppercase font-mono tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Client Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Company / Location</th>
                <th className="py-3.5 px-4">Total Lifetime Value</th>
                <th className="py-3.5 px-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center font-mono font-bold text-xs uppercase">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div>{customer.name}</div>
                        <div className="text-[10px] font-mono text-neutral-500">ID: {customer.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-300 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#c5a059]" />
                      <a href={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</a>
                    </div>
                    {customer.email && (
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-neutral-300">
                    {customer.company && (
                      <div className="flex items-center gap-1 font-medium text-white">
                        <Building className="w-3 h-3 text-[#c5a059]" />
                        <span>{customer.company}</span>
                      </div>
                    )}
                    {customer.address?.city && (
                      <div className="flex items-center gap-1 text-neutral-400 text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-500" />
                        <span>{customer.address.city}, {customer.address.state || "Gujarat"}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 font-mono font-semibold text-[#c5a059]">
                    ₹{Number(customer.total_spent || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-neutral-500 font-mono">
                    {new Date(customer.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-neutral-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#c5a059]" />
                    <p className="font-serif text-white text-base">No customers registered yet</p>
                    <p className="text-xs mt-1">Customers will automatically appear here when placing store orders or completing checkout.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
