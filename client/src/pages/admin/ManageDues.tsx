import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

interface Due {
  id: number;
  title: string;
  amount: number;
  level: string;
  academic_year: string;
  description: string;
}

export default function ManageDues() {
  const { api } = useAuth();
  const [dues, setDues] = useState<Due[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDue, setEditingDue] = useState<Due | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    level: "",
    academic_year: "",
    description: "",
  });

  useEffect(() => {
    fetchDues();
  }, []);

  const fetchDues = async () => {
    try {
      const response = await api.get("/api/admin/dues");
      setDues(response.data);
    } catch (error) {
      console.error("Failed to fetch dues:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/dues", formData);
      setShowModal(false);
      fetchDues();
      resetForm();
    } catch (error) {
      console.error("Failed to create due:", error);
      alert("Failed to create due. Please try again.");
    }
  };

  const handleEdit = (due: Due) => {
    setEditingDue(due);
    setFormData({
      title: due.title,
      amount: due.amount.toString(),
      level: due.level,
      academic_year: due.academic_year,
      description: due.description,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDue) return;

    try {
      console.log("Updating due:", editingDue.id, formData);

      const response = await api.put(
        `/api/admin/dues/${editingDue.id}`,
        formData
      );
      console.log("Update response:", response.data);

      setShowEditModal(false);
      fetchDues();
      resetForm();
      setEditingDue(null);

      // Show success message
      alert("Due updated successfully!");
    } catch (error: any) {
      console.error("Failed to update due:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }

      // Show more specific error message
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      alert(
        `Failed to update due: ${errorMessage}. Please check your connection and try again.`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this due? This action cannot be undone."
      )
    ) {
      try {
        console.log("Deleting due:", id);

        const response = await api.delete(`/api/admin/dues/${id}`);
        console.log("Delete response:", response.data);

        fetchDues();

        // Show success message
        alert("Due deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete due:", error);

        // More detailed error logging
        if (error.response) {
          console.error("Server response:", error.response.data);
          console.error("Status:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Request setup error:", error.message);
        }

        // Show more specific error message
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Unknown error occurred";
        alert(
          `Failed to delete due: ${errorMessage}. Please check your connection and try again.`
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      level: "",
      academic_year: "",
      description: "",
    });
  };

  const levels = [
    "ICT 100",
    "ICT 200",
    "ICT 300",
    "B-Tech 100",
    "B-Tech 200",
    "B-Tech 300",
    "B-Tech 400",
    "Top Up 300",
    "Top Up 400",
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent neon-glow">
              Dues Management
            </h1>
            <p className="text-green-100/70 mt-2">
              Create and manage student payment dues
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          <FiPlus
            size={20}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          <span className="neon-glow">Create Dues</span>
        </button>
      </div>

      {/* Dues Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dues.map((due) => (
          <div
            key={due.id}
            className="group bg-gradient-to-br from-slate-900/80 via-green-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-green-400/50 transition-all duration-500 hover:scale-105 holographic"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-2 group-hover:neon-glow transition-all duration-300">
                  {due.title}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300/80 text-sm font-medium uppercase tracking-wider">
                    {due.level}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent neon-glow group-hover:animate-pulse">
                  GH₵ {due.amount}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4zm0 0v1a2 2 0 100 4 2 2 0 000-4v-1m-6 4a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-300/80 text-xs uppercase tracking-wider">
                    Academic Year
                  </p>
                  <p className="text-white font-semibold">
                    {due.academic_year}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-white/70 text-sm leading-relaxed">
                {due.description}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => handleEdit(due)}
                className="group flex-1 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-400 rounded-xl font-semibold transition-all duration-300 border border-cyan-400/30 hover:border-cyan-400/50"
                title="Edit Due"
              >
                <span className="group-hover:scale-105 transition-transform duration-300">
                  Edit
                </span>
              </button>
              <button
                onClick={() => handleDelete(due.id)}
                className="group flex-1 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-400 rounded-xl font-semibold transition-all duration-300 border border-red-400/30 hover:border-red-400/50"
                title="Delete Due"
              >
                <span className="group-hover:scale-105 transition-transform duration-300">
                  Delete
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 rounded-2xl p-8 max-w-lg w-full mx-4 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <FiPlus className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Create New Dues
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Amount (GH₵)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                >
                  <option value="" className="bg-slate-800">
                    Select Level
                  </option>
                  {levels.map((level) => (
                    <option key={level} value={level} className="bg-slate-800">
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2024/2025"
                  value={formData.academic_year}
                  onChange={(e) =>
                    setFormData({ ...formData, academic_year: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Due Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 rounded-2xl p-8 max-w-lg w-full mx-4 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                Edit Due
              </h2>
            </div>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Amount (GH₵)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                >
                  <option value="" className="bg-slate-800">
                    Select Level
                  </option>
                  {levels.map((level) => (
                    <option key={level} value={level} className="bg-slate-800">
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2024/2025"
                  value={formData.academic_year}
                  onChange={(e) =>
                    setFormData({ ...formData, academic_year: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-green-400/60 focus:border-green-400/80 transition-all duration-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingDue(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Update Due
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
