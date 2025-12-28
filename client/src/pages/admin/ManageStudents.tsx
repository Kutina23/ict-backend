import { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiUser,
  FiHash,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import axios from "axios";
import DataTable from "../../components/DataTable";
import { useAuth } from "../../context/AuthContext";

interface Student {
  id: number;
  name: string;
  index_number: string;
  level: string;
  email: string;
  phone: string;
  status: string;
}

export default function ManageStudents() {
  const { api } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    index_number: "",
    level: "",
    email: "",
    phone: "",
    password: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      // Always use real API calls to XAMPP database
      const response = await api.get("/api/admin/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Always use real API calls to XAMPP database
      await api.post("/api/admin/students", formData);

      setShowModal(false);
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Failed to create student:", error);
      alert("Failed to create student. Please try again.");
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      index_number: student.index_number,
      level: student.level,
      email: student.email,
      phone: student.phone,
      password: "", // Don't populate password for security
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      console.log("Updating student:", editingStudent.id, formData);

      // Remove password if it's empty (for security)
      const updateData = { ...formData };
      if (!updateData.password || updateData.password.trim() === "") {
        delete (updateData as any).password;
      }

      console.log("Update data:", updateData);

      const response = await api.put(
        `/api/admin/students/${editingStudent.id}`,
        updateData
      );
      console.log("Update response:", response.data);

      setShowEditModal(false);
      fetchStudents();
      resetForm();
      setEditingStudent(null);

      // Show success message
      alert("Student updated successfully!");
    } catch (error: any) {
      console.error("Failed to update student:", error);

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
        `Failed to update student: ${errorMessage}. Please check your connection and try again.`
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      try {
        console.log("Deleting student:", id);

        const response = await api.delete(`/api/admin/students/${id}`);
        console.log("Delete response:", response.data);

        fetchStudents();

        // Show success message
        alert("Student deleted successfully!");
      } catch (error: any) {
        console.error("Failed to delete student:", error);

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
          `Failed to delete student: ${errorMessage}. Please check your connection and try again.`
        );
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      index_number: "",
      level: "",
      email: "",
      phone: "",
      password: "",
    });
  };

  // Filter and paginate students
  const filteredStudents = useMemo(() => {
    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.index_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [students, searchTerm, currentPage]);

  const totalPages = Math.ceil(students.length / itemsPerPage);
  const totalItems = students.length;

  const columns = [
    {
      key: "name",
      title: "Student",
      render: (value: string, record: Student) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white truncate">{value}</p>
            <p className="text-cyan-300/60 text-sm">{record.level}</p>
          </div>
        </div>
      ),
    },
    {
      key: "index_number",
      title: "Index Number",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FiHash className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="font-mono text-cyan-300 text-sm truncate">
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      title: "Contact",
      render: (value: string, record: Student) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 min-w-0">
            <FiMail className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span className="text-purple-300 text-sm truncate">{value}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <FiPhone className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span className="text-green-300 text-sm">{record.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            value === "active"
              ? "bg-green-500/20 text-green-300 border border-green-400/30"
              : "bg-red-500/20 text-red-300 border border-red-400/30"
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (value: any, record: Student) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(record)}
            className="group p-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-400/30 hover:border-cyan-400 transition-all duration-300 flex-shrink-0"
            title="Edit Student"
          >
            <FiEdit
              size={14}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
          </button>
          <button
            onClick={() => handleDelete(record.id)}
            className="group p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-400/30 hover:border-red-400 transition-all duration-300 flex-shrink-0"
            title="Delete Student"
          >
            <FiTrash2
              size={14}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </button>
        </div>
      ),
      width: "80px",
    },
  ];

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
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 sm:h-12 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-glow">
              Student Management
            </h1>
            <p className="text-cyan-100/70 mt-1 sm:mt-2 text-sm sm:text-base">
              Manage student records and information
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
        searchable={{
          searchTerm,
          onSearchChange: setSearchTerm,
          placeholder: "Search students by name, index, or email...",
        }}
        actionButton={{
          icon: <FiPlus size={20} />,
          label: "Add Student",
          onClick: () => setShowModal(true),
          variant: "primary",
        }}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: setCurrentPage,
        }}
        title="Student Records"
      />

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-4 sm:p-8 w-full max-w-md lg:max-w-lg border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Add New Student
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Index Number
                  </label>
                  <input
                    type="text"
                    value={formData.index_number}
                    onChange={(e) =>
                      setFormData({ ...formData, index_number: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-4 sm:p-8 w-full max-w-md lg:max-w-lg border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <FiEdit className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                Edit Student
              </h2>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Index Number
                  </label>
                  <input
                    type="text"
                    value={formData.index_number}
                    onChange={(e) =>
                      setFormData({ ...formData, index_number: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({ ...formData, level: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cyan-300 mb-2">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter new password (optional)"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingStudent(null);
                    resetForm();
                  }}
                  className="flex-1 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
