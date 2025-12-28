import { useState, useEffect, useRef } from "react";
import { FiDownload, FiPrinter } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Payment {
  id: number;
  due_title: string;
  amount: number;
  payment_reference: string;
  date: string;
  student_name: string;
  index_number: string;
  level: string;
}

export default function PaymentHistory() {
  const { api } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get("/api/student/payments");
      setPayments(response.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save(`receipt-${selectedPayment?.payment_reference}.pdf`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Payment History</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Dues
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Reference
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.due_title}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  GH₵ {payment.amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {payment.payment_reference}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => setSelectedPayment(payment)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-semibold"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-dark">
                  Payment Receipt
                </h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div
                ref={receiptRef}
                className="border-2 border-gray-300 rounded-lg p-8 mb-6"
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-primary mb-2">
                    ICT Department
                  </h3>
                  <p className="text-gray-600">Payment Receipt</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="font-semibold">
                      {selectedPayment.student_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Index Number</p>
                    <p className="font-semibold">
                      {selectedPayment.index_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Level</p>
                    <p className="font-semibold">{selectedPayment.level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {new Date(selectedPayment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-gray-300 py-6 mb-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Dues Title:</span>
                    <span className="font-semibold">
                      {selectedPayment.due_title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="text-2xl font-bold text-green-600">
                      GH₵ {selectedPayment.amount}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Transaction Reference
                  </p>
                  <p className="font-mono text-sm">
                    {selectedPayment.payment_reference}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiPrinter /> Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold"
                >
                  <FiDownload /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
