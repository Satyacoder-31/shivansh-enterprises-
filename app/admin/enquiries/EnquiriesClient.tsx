"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Enquiry } from "@/types/database";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/actions/admin";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  Search, 
  Download, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  MessageCircle,
  FileText
} from "lucide-react";

export default function EnquiriesClient({ initialEnquiries }: { initialEnquiries: Enquiry[] }) {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(false);

  const statuses = [
    { id: "all", label: "All Inquiries" },
    { id: "new", label: "New Leads", color: "text-amber-400" },
    { id: "contacted", label: "Contacted", color: "text-blue-400" },
    { id: "follow_up", label: "Follow Up", color: "text-purple-400" },
    { id: "converted", label: "Converted", color: "text-emerald-400" },
    { id: "closed", label: "Closed", color: "text-neutral-400" },
  ];

  const filtered = enquiries.filter(enq => {
    const matchesStatus = selectedStatus === "all" || enq.status === selectedStatus;
    const matchesSearch = 
      enq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enq.phone.includes(searchQuery) ||
      (enq.email && enq.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (enq.product_service && enq.product_service.toLowerCase().includes(searchQuery.toLowerCase())) ||
      enq.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
      router.refresh();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setLoading(true);
    try {
      await updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, noteText);
      setEnquiries(enquiries.map(e => e.id === selectedEnquiry.id ? { ...e, notes: noteText } : e));
      setSelectedEnquiry(prev => prev ? { ...prev, notes: noteText } : null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Permanently delete inquiry from "${name}"?`)) return;
    try {
      await deleteEnquiry(id);
      setEnquiries(enquiries.filter(e => e.id !== id));
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      router.refresh();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "Date", "Name", "Phone", "Email", "Interest", "Status", "Message", "Notes"];
    const rows = filtered.map(e => [
      e.id,
      new Date(e.created_at).toLocaleDateString(),
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.phone}"`,
      `"${e.email || ""}"`,
      `"${e.product_service || ""}"`,
      e.status,
      `"${e.message.replace(/"/g, '""')}"`,
      `"${(e.notes || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sivansh_enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">NEW</span>;
      case "contacted":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">CONTACTED</span>;
      case "follow_up":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">FOLLOW UP</span>;
      case "converted":
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">CONVERTED</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-neutral-800 text-neutral-400 border border-neutral-700">CLOSED</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-serif tracking-wider text-white">Client Inquiries & Leads</h1>
          <p className="text-neutral-400 text-sm mt-1">Direct inquiries from website forms, product pages, and consultation requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider font-mono border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {statuses.map(st => {
            const count = st.id === "all" ? enquiries.length : enquiries.filter(e => e.status === st.id).length;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedStatus === st.id
                    ? "bg-[#c5a059] text-black font-semibold"
                    : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {st.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#141414] border border-white/10 rounded pl-9 pr-3 py-2 text-xs text-white focus:border-[#c5a059] focus:outline-none"
          />
        </div>
      </div>

      {/* Main Content Layout: List on Left, Detail Modal / Drawer */}
      <div className="bg-[#141414] border border-white/5 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/50 text-neutral-400 uppercase font-mono tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Subject / Service</th>
                <th className="py-3.5 px-4">Message Snippet</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map(enquiry => {
                const cleanPhone = enquiry.phone.replace(/[^0-9]/g, "");
                const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Hello%20${encodeURIComponent(enquiry.name)},%20thank%20you%20for%20contacting%20Sivansh%20Enterprise.`;

                return (
                  <tr 
                    key={enquiry.id}
                    onClick={() => {
                      setSelectedEnquiry(enquiry);
                      setNoteText(enquiry.notes || "");
                    }}
                    className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                      enquiry.status === 'new' ? 'bg-amber-500/[0.03]' : ''
                    }`}
                  >
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-2">
                        {enquiry.status === 'new' && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        )}
                        <span>{enquiry.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-neutral-300">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3 h-3 text-[#c5a059]" />
                          <span>{enquiry.phone}</span>
                        </div>
                        {enquiry.email && (
                          <div className="flex items-center gap-1.5 text-neutral-400">
                            <Mail className="w-3 h-3 text-neutral-500" />
                            <span>{enquiry.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {enquiry.product_service ? (
                        <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 font-mono text-[11px] border border-white/10">
                          {enquiry.product_service}
                        </span>
                      ) : (
                        <span className="text-neutral-500 italic">General Consultation</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-neutral-400 max-w-xs truncate">
                      {enquiry.message}
                    </td>
                    <td className="py-4 px-4 text-neutral-500 font-mono">
                      {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                      <select
                        value={enquiry.status}
                        onChange={e => handleStatusChange(enquiry.id, e.target.value)}
                        className="bg-black/60 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-[#c5a059] focus:outline-none"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                          title="Message on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <a
                          href={`tel:${enquiry.phone}`}
                          className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-[#c5a059] border border-white/10"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDelete(enquiry.id, enquiry.name)}
                          className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-white/10 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-neutral-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#c5a059]" />
                    <p className="font-serif text-white text-base">No inquiries found</p>
                    <p className="text-xs mt-1">Inquiries submitted via contact forms will appear here in real-time.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail & Follow-up Notes Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121212] border border-[#c5a059]/30 rounded-lg max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-serif text-white">Inquiry Details</h2>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">ID: {selectedEnquiry.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="text-neutral-400 hover:text-white text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded border border-white/5 text-xs">
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px]">Customer Name</span>
                <span className="text-white text-sm font-medium">{selectedEnquiry.name}</span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px]">Status</span>
                <div className="mt-1">{getStatusBadge(selectedEnquiry.status)}</div>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px]">Phone</span>
                <a href={`tel:${selectedEnquiry.phone}`} className="text-[#c5a059] hover:underline font-mono text-sm">
                  {selectedEnquiry.phone}
                </a>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px]">Email</span>
                <span className="text-white">{selectedEnquiry.email || "Not provided"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px]">Service / Product Interest</span>
                <span className="text-white">{selectedEnquiry.product_service || "General Inquiry"}</span>
              </div>
              <div>
                <span className="text-neutral-400 block uppercase font-mono text-[10px]">Source Page</span>
                <span className="text-white font-mono">{selectedEnquiry.source_page || "Website"}</span>
              </div>
            </div>

            <div>
              <span className="text-neutral-400 block uppercase font-mono text-[10px] mb-1.5">Customer Message</span>
              <div className="p-3 bg-black/60 border border-white/10 rounded text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">
                {selectedEnquiry.message}
              </div>
            </div>

            <div>
              <span className="text-neutral-400 block uppercase font-mono text-[10px] mb-1.5">Admin Internal Notes & Follow-up Log</span>
              <textarea
                rows={3}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Log internal updates (e.g., 'Called customer on 13 Sept, requested site inspection for solar quote next Monday...')"
                className="w-full bg-[#1c1c1c] border border-white/10 rounded p-3 text-sm text-white focus:border-[#c5a059] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedEnquiry.name)},%20from%20Sivansh%20Enterprise.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-xs flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
                <a
                  href={`tel:${selectedEnquiry.phone}`}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 text-[#c5a059] border border-white/10 rounded text-xs flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Direct</span>
                </a>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSaveNotes}
                  className="btn-luxury px-5 py-2 text-xs uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
