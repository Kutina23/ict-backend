import { useState, useEffect, useMemo } from "react";
import {
  FiUser,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiTrendingUp,
} from "react-icons/fi";
import axios from "axios";
import DataTable from "../../components/DataTable";
import { useAuth } from "../../context/AuthContext";

interface StudentDue {
  id: number;
  due_id: number;
  due_title: string;
  due_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  academic_year: string;
}

interface Payment {
  id: number;
  due_title: string;
  amount: number;
  payment_reference: string;
  date: string;
  payment_method: string;
}

interface Student {
  id: number;
  name: string;
  index_number: string;
  level: string;
  email: string;
}

interface StudentPaymentData {
  student: Student;
  summary: {
    totalDues: number;
    totalPaid: number;
    totalBalance: number;
    paidDues: number;
    partialDues: number;
    unpaidDues: number;
    totalDuesCount: number;
  };
  dues: StudentDue[];
  paymentHistory: Payment[];
}

export default function StudentPaymentStatus() {
  const { api } = useAuth();
  const [studentsData, setStudentsData] = useState<StudentPaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentPaymentData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudentsPaymentStatus();
  }, []);

  const fetchStudentsPaymentStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/students-payment-status");
      setStudentsData(response.data);
    } catch (error) {
      console.error("Failed to fetch students payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Paginate students
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return studentsData.slice(startIndex, endIndex);
  }, [studentsData, currentPage]);

  const totalPages = Math.ceil(studentsData.length / itemsPerPage);
  const totalItems = studentsData.length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-green-400 bg-green-400/20";
      case "Partial":
        return "text-yellow-400 bg-yellow-400/20";
      case "Not Paid":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return <FiCheckCircle className="w-4 h-4" />;
      case "Partial":
        return <FiClock className="w-4 h-4" />;
      case "Not Paid":
        return <FiAlertCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  const columns = [
    {
      key: "student",
      title: "Student",
      render: (value: Student) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <FiUser className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">{value.name}</div>
            <div className="text-sm text-cyan-300/70">
              {value.index_number} • {value.level}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "summary",
      title: "Payment Summary",
      render: (summary: StudentPaymentData["summary"]) => (
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">
                GH₵ {(summary.totalPaid || 0).toFixed(2)}
              </div>
              <div className="text-xs text-green-300/70">Paid</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">
                GH₵ {(summary.totalBalance || 0).toFixed(2)}
              </div>
              <div className="text-xs text-red-300/70">Balance</div>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full">
              {summary.paidDues} Paid
            </span>
            {summary.partialDues > 0 && (
              <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                {summary.partialDues} Partial
              </span>
            )}
            {summary.unpaidDues > 0 && (
              <span className="px-2 py-1 bg-red-400/20 text-red-400 rounded-full">
                {summary.unpaidDues} Unpaid
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "summary.totalBalance",
      title: "Outstanding Balance",
      render: (balance: number) => (
        <div className="flex items-center gap-2">
          <FiTrendingUp className="w-4 h-4 text-orange-400" />
          <span
            className={`font-bold ${
              (balance || 0) > 0 ? "text-orange-400" : "text-green-400"
            }`}
          >
            GH₵ {(balance || 0).toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_: any, record: StudentPaymentData) => (
        <button
          onClick={() => {
            setSelectedStudent(record);
            setShowDetailModal(true);
          }}
          className="group flex items-center gap-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300"
        >
          <FiEye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm font-medium">View Details</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-cyan-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent neon-glow">
              Student Payment Status
            </h1>
            <p className="text-blue-100/70 mt-2">
              Track student payments, partial payments, and remaining balances
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-900/80 via-blue-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FiUser className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-300/80 text-sm uppercase tracking-wider">
                Total Students
              </p>
              <p className="text-2xl font-bold text-white">
                {studentsData.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 via-yellow-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-300/80 text-sm uppercase tracking-wider">
                Partial Payments
              </p>
              <p className="text-2xl font-bold text-white">
                {studentsData.reduce(
                  (sum, s) => sum + s.summary.partialDues,
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 via-red-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <FiAlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-red-300/80 text-sm uppercase tracking-wider">
                Outstanding Balance
              </p>
              <p className="text-2xl font-bold text-white">
                GH₵{" "}
                {(studentsData || [])
                  .reduce((sum, s) => sum + (s.summary?.totalBalance || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 via-green-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-green-300/80 text-sm uppercase tracking-wider">
                Total Collected
              </p>
              <p className="text-2xl font-bold text-white">
                GH₵{" "}
                {(studentsData || [])
                  .reduce((sum, s) => sum + (s.summary?.totalPaid || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedStudents}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: setCurrentPage,
        }}
        title="Student Payment Overview"
      />

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-xl border-b border-white/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                      {selectedStudent.student.name}
                    </h2>
                    <p className="text-cyan-300/70">
                      {selectedStudent.student.index_number} •{" "}
                      {selectedStudent.student.level}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-white/20 hover:border-white/40 text-white rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-green-400">
                    GH₵ {selectedStudent.summary.totalPaid.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-300/70">Total Paid</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-red-400">
                    GH₵ {selectedStudent.summary.totalBalance.toFixed(2)}
                  </div>
                  <div className="text-sm text-red-300/70">Balance</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedStudent.summary.paidDues}
                  </div>
                  <div className="text-sm text-blue-300/70">Paid Dues</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400">
                    {selectedStudent.summary.partialDues}
                  </div>
                  <div className="text-sm text-yellow-300/70">Partial Dues</div>
                </div>
              </div>

              {/* Dues Details */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Dues Status
                </h3>
                <div className="space-y-4">
                  {selectedStudent.dues.map((due) => (
                    <div
                      key={due.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-white">
                            {due.due_title}
                          </h4>
                          <p className="text-sm text-cyan-300/70">
                            {due.academic_year}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(
                            due.status
                          )}`}
                        >
                          {getStatusIcon(due.status)}
                          <span className="text-sm font-medium">
                            {due.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Total Amount</p>
                          <p className="text-white font-semibold">
                            GH₵ {due.due_amount.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Amount Paid</p>
                          <p className="text-green-400 font-semibold">
                            GH₵ {due.amount_paid.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Balance</p>
                          <p
                            className={`font-semibold ${
                              due.balance > 0
                                ? "text-red-400"
                                : "text-green-400"
                            }`}
                          >
                            GH₵ {due.balance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  Recent Payment History
                </h3>
                <div className="space-y-3">
                  {selectedStudent.paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FiDollarSign className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {payment.due_title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {payment.payment_reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold">
                          GH₵ {payment.amount.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
