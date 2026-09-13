"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/types/database";
import { saveService, deleteService } from "@/lib/actions/admin";
import { Plus, Edit3, Trash2, Save, Wrench } from "lucide-react";

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [loading, setLoading] = useState(false);
  const [featuresStr, setFeaturesStr] = useState("");
  const [benefitsStr, setBenefitsStr] = useState("");

  const startEdit = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFeaturesStr((service.features || []).join("\n"));
      setBenefitsStr((service.benefits || []).join("\n"));
    } else {
      setEditingService({
        name: "",
        slug: "",
        short_desc: "",
        full_desc: "",
        main_image: "/assets/images/hero/hero-cctv.jpg",
        icon: "ShieldCheck",
        status: "published",
        display_order: services.length + 1
      });
      setFeaturesStr("");
      setBenefitsStr("");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name) return;
    setLoading(true);

    try {
      const features = featuresStr.split("\n").map(s => s.trim()).filter(Boolean);
      const benefits = benefitsStr.split("\n").map(s => s.trim()).filter(Boolean);

      const saved = await saveService({
        ...editingService,
        features,
        benefits,
      });

      if (editingService.id) {
        setServices(services.map(s => s.id === saved.id ? saved : s));
      } else {
        setServices([...services, saved]);
      }
      setEditingService(null);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to save service.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete service "${name}"?`)) return;
    try {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete service.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
            TECHNICAL <span className="text-gold">SERVICES</span>
          </h1>
          <p className="text-secondary text-xs mt-1">
            Manage engineering divisions, scope descriptions, technical features, and client benefits.
          </p>
        </div>

        <button
          type="button"
          onClick={() => startEdit()}
          className="btn btn-gold btn-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={14} /> Add New Service
        </button>
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((svc) => (
          <div key={svc.id} className="bg-carbon-800 border border-gold/20 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-gold font-bold flex items-center gap-1.5">
                  <Wrench size={14} /> {svc.slug}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold uppercase">
                  {svc.status}
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">{svc.name}</h3>
              <p className="text-secondary text-xs line-clamp-3 mb-4">{svc.short_desc}</p>
            </div>

            <div className="pt-4 border-t border-gold/10 flex items-center justify-between text-xs">
              <span className="text-muted text-[11px]">
                {svc.features?.length || 0} features • {svc.benefits?.length || 0} benefits
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(svc)}
                  className="p-1.5 text-gold hover:text-gold-light"
                  title="Edit Service"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(svc.id, svc.name)}
                  className="p-1.5 text-red-400 hover:text-red-300"
                  title="Delete Service"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-carbon-800 border border-gold/30 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gold/15 pb-3">
              <h3 className="font-serif text-lg font-bold text-gold">
                {editingService.id ? "Edit Service" : "Add New Technical Service"}
              </h3>
              <button 
                type="button" 
                onClick={() => setEditingService(null)}
                className="text-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="form-label text-xs">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise CCTV Architecture"
                  className="form-input text-xs"
                  value={editingService.name || ""}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">URL Slug</label>
                <input
                  type="text"
                  placeholder="e.g. cctv-architecture"
                  className="form-input text-xs"
                  value={editingService.slug || ""}
                  onChange={(e) => setEditingService({ ...editingService, slug: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Main Image URL</label>
                <input
                  type="text"
                  placeholder="/assets/images/hero/hero-cctv.jpg"
                  className="form-input text-xs"
                  value={editingService.main_image || ""}
                  onChange={(e) => setEditingService({ ...editingService, main_image: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  className="form-input form-textarea text-xs"
                  value={editingService.short_desc || ""}
                  onChange={(e) => setEditingService({ ...editingService, short_desc: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label text-xs">Full Comprehensive Description</label>
                <textarea
                  rows={4}
                  className="form-input form-textarea text-xs"
                  value={editingService.full_desc || ""}
                  onChange={(e) => setEditingService({ ...editingService, full_desc: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label text-xs">Features (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Dual-Lens 10X Zoom&#10;4G Wire-Free Linkage"
                    className="form-input form-textarea text-xs"
                    value={featuresStr}
                    onChange={(e) => setFeaturesStr(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Benefits (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Zero Blindspot Coverage&#10;2-Year Warranty Support"
                    className="form-input form-textarea text-xs"
                    value={benefitsStr}
                    onChange={(e) => setBenefitsStr(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gold/15">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="btn btn-gold-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold btn-sm flex items-center gap-1"
                >
                  <Save size={14} /> {loading ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
