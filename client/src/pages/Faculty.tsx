import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface FacultyMember {
  id: number;
  name: string;
  position: string;
  specialization: string;
  email: string;
  phone: string;
  office: string;
  image: string;
  bio: string;
  qualifications: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Faculty() {
  const { api } = useAuth();
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/faculty");
      setFacultyMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch faculty:", error);
      setError("Failed to load faculty members");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse qualifications from JSON string
  const getQualificationsArray = (qualifications: string): string[] => {
    try {
      if (!qualifications) return [];

      // Handle double-escaped JSON strings
      let parsed = JSON.parse(qualifications);

      // If it's still a string after parsing, try to parse again
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse qualifications:", qualifications, error);
      return [];
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="section-padding-large bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container-responsive">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-cyan-400/50 rounded-lg transition-all duration-300 text-white/80 hover:text-white mb-8"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src="/default-avatar.svg"
                  alt="Faculty"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-cyan-300">
                Meet Our Staff
              </span>
            </div>

            <h1 className="section-title-large bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent neon-glow">
              Our Staff
            </h1>

            <p className="section-subtitle text-cyan-100/90">
              Learn from experienced professionals with decades of industry
              experience and academic excellence
            </p>
          </div>
        </div>
      </div>

      {/* Faculty Grid Section */}
      <div className="section-padding-large bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container-responsive">
          {error && (
            <div className="text-center mb-8 p-4 bg-red-500/15 border border-red-400/40 text-red-300 rounded-xl max-w-md mx-auto">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-cyan-200/70">Loading faculty members...</p>
            </div>
          ) : facultyMembers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <img
                  src="/default-avatar.svg"
                  alt="No faculty"
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Faculty Members Available
              </h3>
              <p className="text-cyan-200/70">
                Please check back later for faculty updates.
              </p>
            </div>
          ) : (
            <div className="grid-responsive">
              {facultyMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className="enhanced-card"
                >
                  {/* Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden mx-auto mb-4 group-hover:animate-bounce">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/default-avatar.svg";
                          }}
                        />
                      ) : (
                        <img
                          src="/default-avatar.svg"
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent mb-1">
                      {member.name}
                    </h3>
                    <p className="text-cyan-300 font-medium mb-2">
                      {member.position}
                    </p>
                    <p className="text-purple-300 text-sm">
                      {member.specialization}
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  </div>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h4 className="text-slate-800 font-semibold mb-2 text-sm">
                      Qualifications:
                    </h4>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {getQualificationsArray(member.qualifications).map(
                        (qual, qidx) => (
                          <li key={qidx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
                            {qual}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiMail className="w-4 h-4 text-cyan-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiPhone className="w-4 h-4 text-cyan-500" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <FiMapPin className="w-4 h-4 text-cyan-500" />
                      <span>{member.office}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Additional Info Section */}
          {!loading && facultyMembers.length > 0 && (
            <div className="mt-20 bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
              <div className="section-header-large">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-400/20 mb-8">
                  <span className="text-cyan-400 animate-pulse">🏆</span>
                  <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">
                    Faculty Excellence
                  </span>
                </div>
                <h2 className="section-title bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
                  Why Our Faculty Stands Out
                </h2>
                <p className="section-subtitle text-gray-600">
                  Our faculty combines academic excellence with real-world
                  industry experience
                </p>
              </div>

              <div className="grid-responsive-4">
                {[
                  {
                    icon: "🎓",
                    title: "Advanced Degrees",
                    description:
                      "All faculty hold Ph.D. or equivalent advanced degrees from top universities",
                  },
                  {
                    icon: "💼",
                    title: "Industry Experience",
                    description:
                      "Average of 15+ years of professional experience in leading tech companies",
                  },
                  {
                    icon: "📚",
                    title: "Research Excellence",
                    description:
                      "Active researchers publishing in top-tier conferences and journals",
                  },
                  {
                    icon: "🏆",
                    title: "Awards & Recognition",
                    description:
                      "Multiple faculty members have received national and international awards",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl mb-4 group-hover:animate-bounce">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
            <h2 className="section-title bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
              Learn from the Best
            </h2>
            <p className="section-subtitle text-gray-600 mb-8">
              Join our programs and learn directly from industry experts and
              academic leaders
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/programs"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                View Programs
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-800 rounded-xl font-semibold transition-all border border-gray-300 hover:border-cyan-400/50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-section bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative z-10 container-responsive">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ICT Department
                </h3>
              </div>
              <p className="footer-text">
                Empowering the next generation of tech innovators and digital
                leaders through excellence in education and innovation in
                technology.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-cyan-500/20 transition-colors cursor-pointer group">
                  <span className="group-hover:animate-bounce">📘</span>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-purple-500/20 transition-colors cursor-pointer group">
                  <span className="group-hover:animate-bounce">🐦</span>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer group">
                  <span className="group-hover:animate-bounce">📷</span>
                </div>
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-green-500/20 transition-colors cursor-pointer group">
                  <span className="group-hover:animate-bounce">💼</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="footer-title">
                <span className="text-cyan-400">🔗</span>
                Quick Links
              </h4>
              <ul className="footer-links">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faculty"
                    className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Staff
                  </Link>
                </li>
                <li>
                  <Link
                    to="/programs"
                    className="hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Programs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="footer-title">
                <span className="text-purple-400">📞</span>
                Contact
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 mt-1">📍</span>
                  <div>
                    <p className="text-gray-300">University Campus</p>
                    <p className="text-gray-500">Tech City, TC 12345</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">📞</span>
                  <div>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">📧</span>
                  <div>
                    <p className="text-gray-300">info@ict.edu</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400">🌐</span>
                  <div>
                    <p className="text-gray-300">www.ict.edu</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Border */}
          <div className="footer-bottom">
            <p className="text-gray-400 text-sm">
              &copy; 2024 ICT Department. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-cyan-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}
