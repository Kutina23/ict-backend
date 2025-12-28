import { Routes, Route } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiFileText,
  FiSettings,
  FiCalendar,
  FiTrendingUp,
  FiGlobe,
} from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AdminHome from "./AdminHome";
import ManageStudents from "./ManageStudents";
import ManageDues from "./ManageDues";
import PaymentRecords from "./PaymentRecords";
import StudentPaymentStatus from "./StudentPaymentStatus";
import ManageEvents from "./ManageEvents";
import ManagePartners from "./ManagePartners";
import AdminSettings from "./AdminSettings";

const menuItems = [
  { path: "", label: "Dashboard", icon: FiHome },
  { path: "/students", label: "Students", icon: FiUsers },
  { path: "/dues", label: "Dues", icon: FiDollarSign },
  { path: "/payments", label: "Payments", icon: FiFileText },
  { path: "/payment-status", label: "Student Status", icon: FiTrendingUp },
  { path: "/events", label: "Events", icon: FiCalendar },
  { path: "/partners", label: "Partners", icon: FiGlobe },
  { path: "/settings", label: "Settings", icon: FiSettings },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout basePath="/admin" menuItems={menuItems}>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/students" element={<ManageStudents />} />
        <Route path="/dues" element={<ManageDues />} />
        <Route path="/payments" element={<PaymentRecords />} />
        <Route path="/payment-status" element={<StudentPaymentStatus />} />
        <Route path="/events" element={<ManageEvents />} />
        <Route path="/partners" element={<ManagePartners />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Routes>
    </DashboardLayout>
  );
}
