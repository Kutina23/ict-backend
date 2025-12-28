import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUser, FiHash, FiLayers, FiPhone } from "react-icons/fi";

export default function StudentHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent neon-glow">
              Student Portal
            </h1>
            <p className="text-emerald-100/70 mt-2">
              Welcome back, {user?.name}
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/30">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-emerald-300 text-sm font-medium">
            Student Active
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
            <FiUser size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-2">
              {user?.name}
            </h2>
            <div className="flex items-center gap-4 text-emerald-300/80">
              <span className="flex items-center gap-2">
                <FiHash size={16} />
                {user?.indexNumber}
              </span>
              <span className="flex items-center gap-2">
                <FiLayers size={16} />
                {user?.level}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-400/30">
                <FiUser className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300/80 text-sm">Full Name</p>
                <p className="text-white font-semibold">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30">
                <FiHash className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-300/80 text-sm">Index Number</p>
                <p className="text-white font-semibold">{user?.indexNumber}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-400/30">
                <FiLayers className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-cyan-300/80 text-sm">Academic Level</p>
                <p className="text-white font-semibold">{user?.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-400/30">
                <FiPhone className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-orange-300/80 text-sm">Contact Number</p>
                <p className="text-white font-semibold">{user?.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900/80 via-emerald-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
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
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Quick Actions
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/student/dues")}
              className="group p-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-xl border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="font-semibold text-white mb-2">View Dues</h3>
                <p className="text-blue-300/60 text-sm">
                  Check outstanding payments
                </p>
              </div>
            </button>
            <button
              onClick={() => navigate("/student/dues")}
              className="group p-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 hover:from-emerald-500/30 hover:to-green-500/30 rounded-xl border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bounce transition-transform duration-300">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="font-semibold text-white mb-2">Make Payment</h3>
                <p className="text-emerald-300/60 text-sm">Pay fees securely</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/student/payments")}
              className="group p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 rounded-xl border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:pulse transition-transform duration-300">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="font-semibold text-white mb-2">History</h3>
                <p className="text-purple-300/60 text-sm">Payment records</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/student/settings")}
              className="group p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 rounded-xl border border-orange-400/30 hover:border-orange-400/50 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shake transition-transform duration-300">
                  <span className="text-2xl">🔐</span>
                </div>
                <h3 className="font-semibold text-white mb-2">
                  Change Password
                </h3>
                <p className="text-orange-300/60 text-sm">Update security</p>
              </div>
            </button>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
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
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Announcements
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-400/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-300 text-sm font-medium">
                  Latest Update
                </span>
              </div>
              <p className="text-white/80 text-sm">
                New semester fees have been posted. Please check your dues
                section.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-400/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium">
                  Reminder
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Payment deadline approaching. Complete your payments to avoid
                penalties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
