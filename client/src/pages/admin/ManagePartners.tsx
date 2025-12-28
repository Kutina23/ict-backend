import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  isActive: boolean;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

export default function ManagePartners() {
  const { api } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    description: "",
    isActive: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await api.get("/api/admin/partners");
      setPartners(response.data);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPartner) {
        await api.put(`/api/admin/partners/${editingPartner.id}`, formData);
      } else {
        await api.post("/api/admin/partners", formData);
      }
      setShowModal(false);
      setEditingPartner(null);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error("Failed to save partner:", error);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      logo_url: partner.logo_url,
      website_url: partner.website_url || "",
      description: partner.description || "",
      isActive: partner.isActive,
      sort_order: partner.sort_order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        await api.delete(`/api/admin/partners/${id}`);
        fetchPartners();
      } catch (error) {
        console.error("Failed to delete partner:", error);
      }
    }
  };

  const toggleActive = async (partner: Partner) => {
    try {
      await api.put(`/api/admin/partners/${partner.id}`, {
        isActive: !partner.isActive,
      });
      fetchPartners();
    } catch (error) {
      console.error("Failed to update partner status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      logo_url: "",
      website_url: "",
      description: "",
      isActive: true,
      sort_order: 0,
    });
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPartner(null);
    resetForm();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-glow">
              Manage Partners
            </h1>
            <p className="text-cyan-100/70 mt-2">
              Manage technology partners and collaborations
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
        >
          <FiPlus className="inline mr-2" />
          Add Partner
        </button>
      </div>

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className={`group bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 hover:scale-105 holographic ${
              partner.isActive
                ? "border-white/20 hover:border-cyan-400/50"
                : "border-red-400/30 opacity-60"
            }`}
          >
            {/* Partner Logo */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden border border-white/20">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling!.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={`text-2xl ${partner.logo_url ? "hidden" : ""}`}>
                  🏢
                </div>
              </div>
            </div>

            {/* Partner Info */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {partner.name}
              </h3>
              {partner.description && (
                <p className="text-cyan-100/70 text-sm mb-3 line-clamp-2">
                  {partner.description}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    partner.isActive
                      ? "bg-green-500/20 text-green-300 border border-green-400/30"
                      : "bg-red-500/20 text-red-300 border border-red-400/30"
                  }`}
                >
                  {partner.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-cyan-300/60 text-xs">
                  Order: {partner.sort_order}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-2">
              {partner.website_url && (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-400/30 transition-all duration-300"
                  title="Visit Website"
                >
                  <FiExternalLink size={16} />
                </a>
              )}
              <button
                onClick={() => toggleActive(partner)}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  partner.isActive
                    ? "bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-400/30"
                    : "bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-400/30"
                }`}
                title={partner.isActive ? "Deactivate" : "Activate"}
              >
                {partner.isActive ? (
                  <FiEyeOff size={16} />
                ) : (
                  <FiEye size={16} />
                )}
              </button>
              <button
                onClick={() => handleEdit(partner)}
                className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-400/30 transition-all duration-300"
                title="Edit Partner"
              >
                <FiEdit size={16} />
              </button>
              <button
                onClick={() => handleDelete(partner.id)}
                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-400/30 transition-all duration-300"
                title="Delete Partner"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Partners Added
          </h3>
          <p className="text-cyan-100/60 mb-6">
            Start building your partner network by adding your first technology
            partner.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <FiPlus className="inline mr-2" />
            Add First Partner
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900/80 to-slate-900 rounded-2xl p-8 border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPartner ? "Edit Partner" : "Add New Partner"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Partner Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Enter partner name"
                  required
                />
              </div>

              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Logo URL *
                </label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) =>
                    setFormData({ ...formData, logo_url: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="https://example.com/logo.png"
                  required
                />
              </div>

              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) =>
                    setFormData({ ...formData, website_url: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="https://partner-website.com"
                />
              </div>

              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-colors h-24 resize-none"
                  placeholder="Brief description of the partnership"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_order: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={String(formData.isActive ?? true)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isActive: e.target.value === "true",
                      })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="true" className="bg-slate-800">
                      Active
                    </option>
                    <option value="false" className="bg-slate-800">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  {editingPartner ? "Update Partner" : "Add Partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
