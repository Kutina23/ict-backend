import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [formShake, setFormShake] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Handle redirect after successful login
  useEffect(() => {
    if (user?.role) {
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "hod") {
        navigate("/hod");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setFormShake(false);

    try {
      await login(email, password);
      // Redirect will be handled by the useEffect above when user state updates
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
      setFormShake(true);
      // Remove shake animation after it completes
      setTimeout(() => setFormShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Homepage Link */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 rounded-lg transition-all duration-300 text-white/80 hover:text-white"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-sm font-medium">Home</span>
        </button>
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.2,
            }}
          ></div>

          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="w-full max-w-6xl mx-auto flex items-center justify-center lg:justify-between relative z-10 gap-8">
          {/* Left Side - Info */}
          <div className="hidden lg:block flex-1 max-w-lg">
            <div className="text-white max-w-md lg:ml-auto">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    ICT Department
                  </h1>
                </div>
                <p className="text-xl mb-12 text-cyan-100/80 leading-relaxed">
                  Next-generation student dues and payment management system
                </p>
              </div>

              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-3xl group-hover:animate-bounce">🎓</div>
                  <div>
                    <h3 className="font-bold text-cyan-300 mb-1">
                      For Students
                    </h3>
                    <p className="text-sm text-cyan-100/70">
                      Check dues and pay online with secure transactions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center - Form */}
          <div
            className={`flex-shrink-0 lg:ml-8 login-form-container lg:max-w-md w-full max-w-md min-h-[600px] ${
              formShake ? "form-shake" : ""
            }`}
          >
            <div className="relative z-10 flex flex-col justify-center flex-1 min-h-0">
              <div className="form-header">
                <div className="form-icon">🔐</div>
                <h2 className="form-title">Welcome Back</h2>
                <p className="form-subtitle">
                  Sign in to access your dashboard
                </p>
              </div>

              {error && (
                <div className="error-container">
                  <span className="error-icon">⚠️</span>
                  <div className="error-content">
                    <p className="error-title">Authentication Failed</p>
                    <p className="error-message">{error}</p>
                  </div>
                  <div className="error-indicator"></div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex-1 flex flex-col justify-between space-y-6"
              >
                {/* Email Input */}
                <div className="input-group">
                  <label className="input-label email">
                    <span className="animate-pulse">✉️</span>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="Enter your email address"
                      className={`enhanced-input email ${
                        emailFocused ? "focused" : ""
                      }`}
                      required
                    />
                    <div className="input-icon">✉️</div>
                    <div className="input-glow"></div>
                  </div>
                </div>

                {/* Password Input with Toggle */}
                <div className="input-group">
                  <label className="input-label password">
                    <span className="animate-pulse">🔒</span>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      placeholder="Enter your password"
                      className={`enhanced-input password ${
                        passwordFocused ? "focused" : ""
                      }`}
                      required
                    />
                    <div className="input-icon password">🔒</div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                    <div className="input-glow"></div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`submit-button ${loading ? "loading" : ""}`}
                >
                  <div className="submit-button-content">
                    {loading ? (
                      <>
                        <span className="submit-button-icon">⏳</span>
                        <span className="submit-button-text">
                          Authenticating...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="submit-button-icon">🚀</span>
                        <span className="submit-button-text">Log In</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
