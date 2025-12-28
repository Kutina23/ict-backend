import { Routes, Route } from 'react-router-dom'
import { FiHome, FiDollarSign, FiFileText, FiSettings } from 'react-icons/fi'
import DashboardLayout from '../../components/DashboardLayout'
import StudentHome from './StudentHome'
import MyDues from './MyDues'
import PaymentHistory from './PaymentHistory'
import StudentSettings from './StudentSettings'

const menuItems = [
  { path: '', label: 'Dashboard', icon: FiHome },
  { path: '/dues', label: 'My Dues', icon: FiDollarSign },
  { path: '/payments', label: 'Payment History', icon: FiFileText },
  { path: '/settings', label: 'Settings', icon: FiSettings },
]

export default function StudentDashboard() {
  return (
    <DashboardLayout basePath="/student" menuItems={menuItems}>
      <Routes>
        <Route path="/" element={<StudentHome />} />
        <Route path="/dues" element={<MyDues />} />
        <Route path="/payments" element={<PaymentHistory />} />
        <Route path="/settings" element={<StudentSettings />} />
      </Routes>
    </DashboardLayout>
  )
}
