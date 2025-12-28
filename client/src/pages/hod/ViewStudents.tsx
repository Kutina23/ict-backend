import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface Student {
  id: number;
  name: string;
  index_number: string;
  level: string;
  email: string;
  phone: string;
}

export default function ViewStudents() {
  const { api } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/api/hod/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.index_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-dark">View Students</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FiSearch
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Index Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Level
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.index_number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.level}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {student.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
