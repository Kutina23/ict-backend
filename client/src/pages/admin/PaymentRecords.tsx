import { useState, useEffect, useMemo } from "react";
import { FiDollarSign, FiCalendar, FiUser, FiHash } from "react-icons/fi";
import axios from "axios";
import DataTable from "../../components/DataTable";
import { useAuth } from "../../context/AuthContext";

interface Payment {
  id: number;
  student_name: string;
  due_title: string;
  amount: number;
  payment_reference: string;
  date: string;
}

export default function PaymentRecords() {
  const { api } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Paginate payments
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return payments.slice(startIndex, endIndex);
  }, [payments, currentPage]);

  const totalPages = Math.ceil(payments.length / itemsPerPage);
  const totalItems = payments.length;

  const columns = [
    {
      key: "date",
      title: "Payment Date",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FiCalendar className="w-4 h-4 text-cyan-400" />
          <span className="text-cyan-300">
            {new Date(value).toLocaleDateString()}
          </span>
        </div>
      ),
    },
    {
      key: "student_name",
      title: "Student",
      render: (value: string) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white">{value}</span>
        </div>
      ),
    },
    {
      key: "due_title",
      title: "Due Type",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FiHash className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300">{value}</span>
        </div>
      ),
    },
    {
      key: "amount",
      title: "Amount Paid",
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <FiDollarSign className="w-4 h-4 text-green-400" />
          <span className="text-green-300 font-bold">
            GH₵ {value.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      key: "payment_reference",
      title: "Reference",
      render: (value: string) => (
        <span className="font-mono text-cyan-300/80 text-sm">{value}</span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent neon-glow">
              Payment Records
            </h1>
            <p className="text-green-100/70 mt-2">
              Complete payment history and transaction records
            </p>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedPayments}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage,
          onPageChange: setCurrentPage,
        }}
        title="Payment History"
      />
    </div>
  );
}
