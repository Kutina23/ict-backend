import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiDollarSign, FiCheckCircle, FiClock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function HODHome() {
  const { api } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalDues: 0,
    paidPayments: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/hod/stats");
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent neon-glow">
              HOD Command Center
            </h1>
            <p className="text-purple-100/70 mt-2">
              Department oversight and analytics dashboard
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-400/30">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span className="text-purple-300 text-sm font-medium">
            Read-Only Access
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="group bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl hover:border-purple-400/50 transition-all duration-500 hover:scale-105 holographic"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`${card.color} p-3 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg`}
              >
                <card.icon size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-purple-300/80 text-sm font-medium uppercase tracking-wider">
                  {card.title}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent neon-glow group-hover:animate-pulse">
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

      {/* Department Overview */}
      <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Department Overview
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-6 bg-purple-500/10 rounded-xl border border-purple-400/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-300">
                  Faculty Access
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                You have read-only access to view student records, payment
                status, and department analytics. Contact the system
                administrator for any data modifications.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-indigo-500/10 rounded-xl border border-indigo-400/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-indigo-400"
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
                <h3 className="text-lg font-semibold text-indigo-300">
                  Analytics Available
                </h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Monitor department performance with real-time statistics on
                student enrollment, payment collections, and academic progress
                tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
