import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiBookOpen,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface Program {
  id: number;
  name: string;
  duration: string;
  focus: string;
  highlights: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ManagePrograms() {
  const { api } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    focus: "",
    highlights: [] as string[],
  });
  const [highlightInput, setHighlightInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/hod/programs/all");
      // Parse highlights from JSON string to array
      const programsWithParsedHighlights = response.data.map(
        (program: any) => ({
          ...program,
          highlights:
            typeof program.highlights === "string"
              ? JSON.parse(program.highlights || "[]")
              : program.highlights || [],
        })
      );
      setPrograms(programsWithParsedHighlights);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      duration: "",
      focus: "",
      highlights: [],
    });
    setHighlightInput("");
    setEditingProgram(null);
    setShowForm(false);
  };

  const handleEdit = (program: Program) => {
    setFormData({
      name: program.name,
      duration: program.duration,
      focus: program.focus,
      highlights: program.highlights,
    });
    setEditingProgram(program);
    setShowForm(true);
  };

  const addHighlight = () => {
    if (
      highlightInput.trim() &&
      !formData.highlights.includes(highlightInput.trim())
    ) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, highlightInput.trim()],
      });
      setHighlightInput("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.duration ||
      !formData.focus ||
      formData.highlights.length === 0
    ) {
      setError("Please fill in all fields and add at least one highlight");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (editingProgram) {
        await api.put(`/api/hod/programs/${editingProgram.id}`, formData);
      } else {
        await api.post("/api/hod/programs", formData);
      }

      await fetchPrograms();
      resetForm();
    } catch (error: any) {
      console.error("Failed to save program:", error);
      setError(error.response?.data?.message || "Failed to save program");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this program?"))
      return;

    try {
      await api.delete(`/api/hod/programs/${id}`);
      await fetchPrograms();
    } catch (error) {
      console.error("Failed to delete program:", error);
      setError("Failed to delete program");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent neon-glow">
              Manage Programs
            </h1>
            <p className="text-purple-100/70 mt-2">
              Create, edit, and manage academic programs
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          <FiPlus size={20} />
          Add Program
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/15 border border-red-400/40 text-red-300 rounded-xl">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {editingProgram ? "Edit Program" : "Add New Program"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-white" size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Program Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                  placeholder="e.g., Bachelor of Technology"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                  placeholder="e.g., 4 Years"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Focus Description
                </label>
                <textarea
                  value={formData.focus}
                  onChange={(e) =>
                    setFormData({ ...formData, focus: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all resize-none"
                  rows={3}
                  placeholder="Describe the focus and objectives of this program"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Program Highlights
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addHighlight())
                    }
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all"
                    placeholder="Add a highlight (e.g., Web Development)"
                  />
                  <button
                    type="button"
                    onClick={addHighlight}
                    className="px-4 py-3 bg-purple-500 hover:bg-purple-400 text-white rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-lg"
                    >
                      <span className="text-purple-200 text-sm">
                        {highlight}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="text-purple-300 hover:text-white transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave size={18} />
                  {submitting
                    ? "Saving..."
                    : editingProgram
                    ? "Update Program"
                    : "Create Program"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-400 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
            <FiBookOpen className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            All Programs ({programs.length})
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-purple-200/70 mt-4">Loading programs...</p>
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-8">
            <FiBookOpen className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-purple-200/70">
              No programs found. Create your first program!
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-400/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {program.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          program.isActive
                            ? "bg-green-500/20 text-green-300 border border-green-400/30"
                            : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {program.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-purple-200/70 text-sm mb-3">
                      <span>⏱️ {program.duration}</span>
                      <span>
                        📅 {new Date(program.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-purple-100/80 mb-4">{program.focus}</p>

                    <div className="flex flex-wrap gap-2">
                      {program.highlights.map((highlight, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-lg text-purple-200 text-sm"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(program)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-colors"
                      title="Edit Program"
                    >
                      <FiEdit2 className="w-4 h-4 text-blue-300" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-colors"
                      title="Delete Program"
                    >
                      <FiTrash2 className="w-4 h-4 text-red-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
