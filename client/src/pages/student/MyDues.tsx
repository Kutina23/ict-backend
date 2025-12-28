import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface StudentDue {
  id: number;
  due_title: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
}

export default function MyDues() {
  const { api } = useAuth();
  const [dues, setDues] = useState<StudentDue[]>([]);
  const [selectedDue, setSelectedDue] = useState<StudentDue | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchDues();
  }, []);

  const fetchDues = async () => {
    try {
      const response = await api.get("/api/student/dues");
      setDues(response.data);
    } catch (error) {
      console.error("Failed to fetch dues:", error);
    }
  };

  const handlePayment = async () => {
    if (!selectedDue) return;

    try {
      const response = await api.post("/api/student/payment/initiate", {
        due_id: selectedDue.id,
        amount: parseFloat(paymentAmount),
      });

      // Initialize Paystack
      const handler = (window as any).PaystackPop.setup({
        key: "pk_test_xxxxxxxxxxxx", // Replace with your Paystack public key
        email: "student@ict.edu",
        amount: parseFloat(paymentAmount) * 100,
        ref: response.data.reference,
        callback: function (response: any) {
          verifyPayment(response.reference);
        },
        onClose: function () {
          alert("Payment cancelled");
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    }
  };

  const verifyPayment = async (reference: string) => {
    try {
      await api.post("/api/student/payment/verify", { reference });
      alert("Payment successful!");
      setShowPaymentModal(false);
      fetchDues();
    } catch (error) {
      console.error("Payment verification failed:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">My Dues</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dues.map((due) => (
          <div
            key={due.id}
            className="bg-white rounded-xl shadow-lg p-6 card-hover"
          >
            <h3 className="text-xl font-bold text-dark mb-4">
              {due.due_title}
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">GH₵ {due.total_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-green-600">
                  GH₵ {due.amount_paid}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance:</span>
                <span className="font-semibold text-red-600">
                  GH₵ {due.balance}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    due.status === "Paid"
                      ? "bg-green-100 text-green-700"
                      : due.status === "Partial"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {due.status}
                </span>
              </div>
            </div>
            {due.balance > 0 && (
              <button
                onClick={() => {
                  setSelectedDue(due);
                  setShowPaymentModal(true);
                }}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
              >
                Make Payment
              </button>
            )}
          </div>
        ))}
      </div>

      {showPaymentModal && selectedDue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-dark">Make Payment</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Dues: {selectedDue.due_title}
              </p>
              <p className="text-2xl font-bold text-red-600">
                Balance: GH₵ {selectedDue.balance}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (GH₵)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                max={selectedDue.balance}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
              >
                Pay with Paystack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
