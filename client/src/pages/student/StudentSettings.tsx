import { useState } from "react";
import { FiLock, FiEye, FiEyeOff, FiSave, FiShield } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function StudentSettings() {
  const { api } = useAuth();
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    try {
      setSaving(true);
      await api.put("/api/student/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Failed to change password:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert(
          "Failed to change password. Please check your current password and try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-1 h-12 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-full neon-glow"></div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent neon-glow">
            Account Settings
          </h1>
          <p className="text-emerald-100/70 mt-2">
            Manage your account security and preferences
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Security Settings */}
        <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <FiShield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
              Change Password
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-emerald-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/60"
                  size={18}
                />
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/60 hover:text-emerald-400 transition-colors"
                >
                  {showPasswords.current ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-emerald-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/60"
                  size={18}
                />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/60 hover:text-emerald-400 transition-colors"
                >
                  {showPasswords.new ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-emerald-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/60"
                  size={18}
                />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400/80 transition-all duration-500 outline-none"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/60 hover:text-emerald-400 transition-colors"
                >
                  {showPasswords.confirm ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Changing Password...
                </>
              ) : (
                <>
                  <FiSave />
                  Change Password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-400/30">
            <p className="text-emerald-300/80 text-sm">
              <strong>Security Tips:</strong> Use a strong password with at
              least 6 characters, including letters, numbers, and symbols. Avoid
              using personal information.
            </p>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gradient-to-br from-slate-900/80 via-emerald-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Account Information
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-300">
                  Email Address
                </h3>
              </div>
              <p className="text-white/80 text-sm">
                Your email address is used for login and important
                notifications. Contact the ICT department to update your email.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-purple-300">
                  Password Security
                </h3>
              </div>
              <p className="text-white/80 text-sm">
                Keep your account secure by using a strong password and
                regularly updating it. Never share your password with others.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-green-300">
                  Account Status
                </h3>
              </div>
              <p className="text-white/80 text-sm">
                Your account is active and in good standing. All department
                services are available to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
