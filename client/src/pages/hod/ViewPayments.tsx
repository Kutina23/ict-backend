import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

interface Payment {
  id: number
  student_name: string
  due_title: string
  amount: number
  payment_reference: string
  date: string
}

export default function ViewPayments() {
  const { api } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await api.get('/api/hod/payments')
      setPayments(response.data)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">View Payments</h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dues</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.student_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{payment.due_title}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600">
                  GH₵ {payment.amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{payment.payment_reference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}