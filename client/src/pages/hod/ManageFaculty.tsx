import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUserCheck,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import ImageUpload from "../../components/ImageUpload";

interface FacultyMember {
  id: number;
  name: string;
  position: string;
  specialization: string;
  email: string;
  phone: string;
  office: string;
  image: string;
  bio: string;
  qualifications: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FacultyFormData {
  name: string;
  position: string;
  specialization: string;
  email: string;
  phone: string;
  office: string;
  image: string;
  bio: string;
  qualifications: string[];
  isActive: boolean;
}

interface FacultyImageFile {
  file: File | null;
}

export default function ManageFaculty() {
  const { api } = useAuth();
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(
    null
  );
  const [formData, setFormData] = useState<FacultyFormData>({
    name: "",
    position: "",
    specialization: "",
    email: "",
    phone: "",
    office: "",
    image: "/default-avatar.svg",
    bio: "",
    qualifications: [],
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/hod/faculty");
      setFacultyMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
      setError("Failed to load faculty members");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      specialization: "",
      email: "",
      phone: "",
      office: "",
      image: "/default-avatar.svg",
      bio: "",
      qualifications: [],
      isActive: true,
    });
    setImageFile(null);
    setEditingFaculty(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (faculty: FacultyMember) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      position: faculty.position,
      specialization: faculty.specialization,
      email: faculty.email,
      phone: faculty.phone,
      office: faculty.office,
      image: faculty.image || "/default-avatar.svg",
      bio: faculty.bio,
      qualifications: getQualificationsArray(faculty.qualifications),
      isActive: faculty.isActive,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm("Are you sure you want to delete this faculty member?")
    ) {
      return;
    }

    try {
      await api.delete(`/api/faculty/${id}`);
      await fetchFaculty();
    } catch (error) {
      console.error("Failed to delete faculty:", error);
      setError("Failed to delete faculty member");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = new FormData();

      const qualifications = Array.isArray(formData.qualifications)
        ? formData.qualifications.filter(Boolean)
        : [formData.qualifications].filter(Boolean);

      console.log('Form Data:', {
        ...formData,
        qualifications,
        isActive: formData.isActive
      });

      const { image, ...formDataWithoutImage } = formData;
      const formDataObj = {
        ...formDataWithoutImage,
        qualifications: JSON.stringify(qualifications),
        isActive: formData.isActive
      };

      console.log('Form Data Object:', formDataObj);

      Object.entries(formDataObj).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const formValue = typeof value === 'boolean' ? value.toString() : value;
          submitData.append(key, formValue as string);
        }
      });

      if (imageFile instanceof File) {
        submitData.append('image', imageFile);
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      // Log the request details
      console.log('Sending request to:', 
        editingFaculty 
          ? `/api/hod/faculty/${editingFaculty.id}` 
          : '/api/hod/faculty'
      );
      console.log('Request method:', editingFaculty ? 'PUT' : 'POST');
      console.log('Request config:', config);

      let response;
      if (editingFaculty) {
        response = await api.put(
          `/api/hod/faculty/${editingFaculty.id}`,
          submitData,
          config
        );
      } else {
        response = await api.post("/api/hod/faculty", submitData, config);
      }

      console.log('Response:', response.data);
      await fetchFaculty();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      // Log complete error details for debugging
      console.error('--- ERROR DETAILS ---');
      console.error('Error message:', error.message);
      console.error('Status code:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request config:', {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      });
      console.error('--- END ERROR DETAILS ---');

      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 400) {
          if (error.response.data?.errors) {
            // Format validation errors
            const validationErrors = Object.entries(error.response.data.errors)
              .map(([field, messages]) => {
                const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                return `${fieldName}: ${(messages as string[]).join(', ')}`;
              })
              .join('\n');
            setError(`Validation failed:\n${validationErrors}`);
          } else if (error.response.data?.message) {
            // Use server-provided error message
            setError(error.response.data.message);
          } else {
            setError('Bad request. Please check your input and try again.');
          }
        } else if (error.response.status === 401) {
          setError('Session expired. Please log in again.');
        } else if (error.response.status === 403) {
          setError('You do not have permission to perform this action.');
        } else if (error.response.status === 404) {
          setError('The requested resource was not found.');
        } else if (error.response.status >= 500) {
          setError('A server error occurred. Please try again later.');
        } else {
          setError(`Error: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        setError(`Error: ${error.message}`);
      }
    }
  };

  const addQualification = () => {
    setFormData({
      ...formData,
      qualifications: [...formData.qualifications, ""],
    });
  };

  const updateQualification = (index: number, value: string) => {
    const updated = [...formData.qualifications];
    updated[index] = value;
    setFormData({
      ...formData,
      qualifications: updated,
    });
  };

  const removeQualification = (index: number) => {
    const updated = formData.qualifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      qualifications: updated,
    });
  };

  const getQualificationsArray = (qualifications: string): string[] => {
    try {
      if (!qualifications) return [];

      // Handle double-escaped JSON strings
      let parsed = JSON.parse(qualifications);

      // If it's still a string after parsing, try to parse again
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse qualifications:", qualifications, error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiUserCheck className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl font-bold text-white">Manage Staff</h1>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Faculty Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facultyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/default-avatar.svg";
                      }}
                    />
                  ) : (
                    <img
                      src="/default-avatar.svg"
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {member.position}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Specialization */}
            <div className="mb-3">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {member.specialization}
              </p>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
              {member.bio}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiMail className="w-4 h-4" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiPhone className="w-4 h-4" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <FiMapPin className="w-4 h-4" />
                <span>{member.office}</span>
              </div>
            </div>

            {/* Qualifications */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                Qualifications:
              </p>
              <div className="space-y-1">
                {getQualificationsArray(member.qualifications)
                  .slice(0, 2)
                  .map((qual, idx) => (
                    <p
                      key={idx}
                      className="text-xs text-gray-600 dark:text-gray-300"
                    >
                      • {qual}
                    </p>
                  ))}
                {getQualificationsArray(member.qualifications).length > 2 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    +{getQualificationsArray(member.qualifications).length - 2}{" "}
                    more
                  </p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {member.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingFaculty ? "Edit Faculty" : "Add Faculty"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Office *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.office}
                    onChange={(e) =>
                      setFormData({ ...formData, office: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profile Image
                  </label>
                  <div className="flex justify-center">
                    <ImageUpload
                      currentImage={editingFaculty ? formData.image : undefined}
                      onImageSelect={setImageFile}
                      size="md"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Qualifications
                </label>
                <div className="space-y-2">
                  {formData.qualifications.map((qual, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={qual}
                        onChange={(e) =>
                          updateQualification(index, e.target.value)
                        }
                        placeholder="Enter qualification"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addQualification}
                    className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    + Add Qualification
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Active Faculty Member
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  {editingFaculty ? "Update" : "Add"} Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
