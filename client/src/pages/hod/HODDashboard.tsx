import { Routes, Route } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiDollarSign,
  FiSettings,
  FiBookOpen,
  FiUserCheck,
} from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import HODHome from "./HODHome";
import ViewStudents from "./ViewStudents";
import ViewPayments from "./ViewPayments";
import HODSettings from "./HODSettings";
import ManagePrograms from "./ManagePrograms";
import ManageFaculty from "./ManageFaculty";

const menuItems = [
  { path: "", label: "Dashboard", icon: FiHome },
  { path: "/programs", label: "Programs", icon: FiBookOpen },
  { path: "/faculty", label: "Staff", icon: FiUserCheck },
  { path: "/students", label: "Students", icon: FiUsers },
  { path: "/payments", label: "Payments", icon: FiDollarSign },
  { path: "/settings", label: "Settings", icon: FiSettings },
];

export default function HODDashboard() {
  return (
    <DashboardLayout basePath="/hod" menuItems={menuItems}>
      <Routes>
        <Route path="/" element={<HODHome />} />
        <Route path="/programs" element={<ManagePrograms />} />
        <Route path="/faculty" element={<ManageFaculty />} />
        <Route path="/students" element={<ViewStudents />} />
        <Route path="/payments" element={<ViewPayments />} />
        <Route path="/settings" element={<HODSettings />} />
      </Routes>
    </DashboardLayout>
  );
}
