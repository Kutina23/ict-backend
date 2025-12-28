import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiDollarSign, FiCheckCircle, FiClock } from "react-icons/fi";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const navigate = useNavigate();
  const { user, api } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDues: 0,
    paidPayments: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: FiUsers,
      color: "bg-blue-500",
    },
    {
      title: "Total Dues",
      value: `GH₵ ${stats.totalDues}`,
      icon: FiDollarSign,
      color: "bg-green-500",
    },
    {
      title: "Paid Payments",
      value: stats.paidPayments,
      icon: FiCheckCircle,
      color: "bg-purple-500",
    },
    {
      title: "Pending Payments",
      value: stats.pendingPayments,
      icon: FiClock,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "Add New Student",
      icon: "🚀",
      action: () => navigate("/admin/students"),
      gradient:
        "from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500",
      description: "Register new student",
    },
    {
      title: "Create New Dues",
      icon: "💰",
      action: () => navigate("/admin/dues"),
      gradient:
        "from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500",
      description: "Set up payment dues",
    },
    {
      title: "Upload Event",
      icon: "📅",
      action: () => navigate("/admin/events"),
      gradient:
        "from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500",
      description: "Add department event",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-glow">
              Admin Command Center
            </h1>
            <p className="text-cyan-100/70 mt-2">
              System overview and management controls
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-400/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-300 text-sm font-medium">
            System Online
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 holographic"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${card.color} p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg`}
              >
                <card.icon size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-cyan-300/80 text-sm font-medium uppercase tracking-wider">
                  {card.title}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent neon-glow group-hover:animate-pulse">
                {card.value}
              </p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.color} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000`}
                  style={{ animationDelay: `${idx * 200}ms` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              System Activity Feed
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">
                  System Status: All services operational
                </p>
                <p className="text-cyan-100/60 text-sm">
                  Last updated: Just now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-white font-medium">
                  Database: Connected and synchronized
                </p>
                <p className="text-cyan-100/60 text-sm">
                  Last backup: 2 hours ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-4">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.action}
                className={`group w-full py-4 bg-gradient-to-r ${action.gradient} text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative flex flex-col items-center justify-center gap-1">
                  <span className="text-xl animate-float">{action.icon}</span>
                  <span className="neon-glow text-sm">{action.title}</span>
                  <span className="text-xs text-white/70">
                    {action.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
