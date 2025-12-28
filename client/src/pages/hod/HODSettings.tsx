import { useState, useEffect } from "react";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiSave,
  FiShield,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

interface HODProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
}

export default function HODSettings() {
  const { api } = useAuth();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<HODProfile | null>(null);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  });
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

  // Load current profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("/api/hod/profile");
        setProfile(response.data);
        setProfileData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
      }
    };
    loadProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!profileData.email.trim()) {
      alert("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      alert("Please provide a valid email address");
      return;
    }

    try {
      setSaving(true);
      const response = await api.put("/api/hod/profile", {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
        phone: profileData.phone.trim() || null,
      });

      // Update local state with the response data
      setProfile(response.data.user);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
      await api.put("/api/hod/change-password", {
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
        <div className="w-1 h-12 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-full neon-glow"></div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent neon-glow">
            Account Settings
          </h1>
          <p className="text-purple-100/70 mt-2">
            Manage your account security and preferences
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Security Settings */}
        <div className="bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <FiShield className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Change Password
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/60"
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
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400/60 hover:text-purple-400 transition-colors"
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
              <label className="block text-sm font-medium text-purple-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/60"
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
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400/60 hover:text-purple-400 transition-colors"
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
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400/60"
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
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400/60 focus:border-purple-400/80 transition-all duration-500 outline-none"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400/60 hover:text-purple-400 transition-colors"
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
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <div className="mt-6 p-4 bg-purple-500/10 rounded-xl border border-purple-400/30">
            <p className="text-purple-300/80 text-sm">
              <strong>Security Tips:</strong> Use a strong password with at
              least 6 characters, including letters, numbers, and symbols. Avoid
              using personal information.
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <div className="bg-gradient-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
              <FiUser className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400/60"
                  size={18}
                />
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      name: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400/60"
                  size={18}
                />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      email: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-indigo-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400/60"
                  size={18}
                />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-400/80 transition-all duration-500 outline-none"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating Profile...
                </>
              ) : (
                <>
                  <FiSave />
                  Update Profile
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-400/30">
            <p className="text-indigo-300/80 text-sm">
              <strong>Profile Information:</strong> Your name and email are used
              for identification and communication. Phone number is optional but
              recommended for contact purposes.
            </p>
          </div>

          {/* Account Status */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-cyan-400"
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
              <h3 className="text-lg font-semibold text-cyan-300">
                Access Level
              </h3>
            </div>
            <p className="text-white/80 text-sm">
              You have Head of Department access with permissions to manage
              programs, faculty, and monitor student records and payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
