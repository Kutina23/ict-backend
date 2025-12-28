import { useState, useEffect } from "react";
import {
  FiSettings,
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface AdminSettings {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export default function AdminSettings() {
  const { api } = useAuth();
  const [settings, setSettings] = useState<AdminSettings>({
    id: 1,
    name: "",
    email: "",
    phone: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/admin/settings");
      const data = response.data;
      setSettings({
        id: data.id || 1,
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "admin",
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put("/api/admin/settings", {
        name: settings.name,
        email: settings.email,
        phone: settings.phone,
      });
      alert("Settings updated successfully!");
    } catch (error: any) {
      console.error("Failed to update settings:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update settings");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
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
      await api.put("/api/admin/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      alert("Password changed successfully!");
      setShowPasswordForm(false);
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
        alert("Failed to change password");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin"></div>
        <span className="ml-3 text-cyan-400 neon-glow">
          Loading settings...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1 h-12 bg-gradient-to-b from-indigo-400 to-blue-500 rounded-full neon-glow"></div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-blue-200 bg-clip-text text-transparent neon-glow">
              Admin Settings
            </h1>
            <p className="text-indigo-100/70 mt-2">
              Manage your account and system preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center">
              <FiUser className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Full Name / Username
              </label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/80 transition-all duration-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/80 transition-all duration-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/80 transition-all duration-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Role
              </label>
              <input
                type="text"
                value={settings.role}
                disabled
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-xl text-white/60 cursor-not-allowed"
              />
              <p className="text-white/60 text-sm mt-1">
                Role cannot be changed
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <FiSave className={`${saving ? "animate-spin" : ""}`} />
              <span className="neon-glow">
                {saving ? "Saving..." : "Save Changes"}
              </span>
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
              <FiLock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
              Security Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-400/30">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">
                  Account Security
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Keep your account secure by using a strong password and
                regularly updating it.
              </p>
            </div>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400/60"
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
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-red-400/60 focus:border-red-400/80 transition-all duration-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      {showPasswords.current ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-red-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400/60"
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
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-red-400/60 focus:border-red-400/80 transition-all duration-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      {showPasswords.new ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-red-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FiLock
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400/60"
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
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-red-400/60 focus:border-red-400/80 transition-all duration-500 outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      {showPasswords.confirm ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex-1 py-3 border-2 border-white/20 hover:border-white/40 text-white rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-400 hover:to-orange-500 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
