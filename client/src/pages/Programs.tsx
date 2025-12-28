import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiClock,
  FiUsers,
  FiBookOpen,
  FiCheckCircle,
  FiStar,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface Program {
  id: number;
  name: string;
  duration: string;
  focus: string;
  highlights: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Programs() {
  const { api } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/programs");
      // Parse highlights from JSON string to array
      const programsWithParsedHighlights = response.data.map(
        (program: any) => ({
          ...program,
          highlights:
            typeof program.highlights === "string"
              ? JSON.parse(program.highlights || "[]")
              : program.highlights || [],
        })
      );
      setPrograms(programsWithParsedHighlights);
    } catch (error) {
      console.error("Failed to fetch programs:", error);
      setError("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  const getProgramIcon = (index: number) => {
    const icons = ["🎯", "⚡", "🚀", "💡", "🔧", "📱"];
    return icons[index % icons.length];
  };

  const getAccentColor = (index: number) => {
    const colors = [
      "from-purple-500 to-cyan-500",
      "from-blue-500 to-indigo-500",
      "from-cyan-500 to-teal-500",
      "from-green-500 to-emerald-500",
      "from-yellow-500 to-orange-500",
      "from-pink-500 to-rose-500",
    ];
    return colors[index % colors.length];
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
              <span className="text-purple-400 animate-pulse">🎓</span>
              <span className="text-sm font-medium text-purple-300">
                Academic Programs
              </span>
            </div>

            <h1 className="section-title-large bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent neon-glow">
              Our Programs
            </h1>

            <p className="section-subtitle text-cyan-100/90">
              Choose the program that fits your goals and aspirations. From
              undergraduate degrees to specialized certifications.
            </p>
          </div>
        </div>
      </div>

      {/* Programs Grid Section */}
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
              <div className="animate-spin w-12 h-12 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-purple-200/70">Loading programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBookOpen className="w-12 h-12 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Programs Available
              </h3>
              <p className="text-purple-200/70">
                Please check back later for program updates.
              </p>
            </div>
          ) : (
            <div className="grid-responsive-2">
              {programs.map((program, idx) => (
                <div key={program.id} className="program-card">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl group-hover:animate-bounce transition-transform duration-300">
                      {getProgramIcon(idx)}
                    </div>
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${getAccentColor(
                        idx
                      )} rounded-full animate-pulse`}
                    ></div>
                  </div>

                  {/* Program Title */}
                  <h3 className="program-title">{program.name}</h3>

                  {/* Duration */}
                  <div className="program-duration">
                    <span>⏱️</span>
                    <span>{program.duration}</span>
                  </div>

                  {/* Focus */}
                  <p className="program-description">{program.focus}</p>

                  {/* Highlights */}
                  <div className="space-y-3 mb-8">
                    <h4 className="text-slate-800 font-semibold flex items-center gap-2">
                      <FiStar className="w-4 h-4 text-yellow-400" />
                      Program Highlights
                    </h4>
                    {program.highlights.map((highlight, hidx) => (
                      <div
                        key={hidx}
                        className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors"
                      >
                        <FiCheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="font-medium text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <FiUsers className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Small Class Sizes</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg">
                      <FiBookOpen className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Hands-on Learning</p>
                    </div>
                  </div>

                  <Link
                    to="/about"
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg group/btn flex items-center justify-center"
                  >
                    <span className="relative z-10 group-hover/btn:neon-glow">
                      Learn More
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Additional Information Section */}
          {!loading && programs.length > 0 && (
            <div className="mt-20 bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
              <div className="section-header-large">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/20 mb-8">
                  <span className="text-purple-400 animate-pulse">🎯</span>
                  <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                    Program Features
                  </span>
                </div>
                <h2 className="section-title bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
                  Excellence in Education
                </h2>
                <p className="section-subtitle text-gray-600">
                  All our programs are designed with industry best practices and
                  real-world applications
                </p>
              </div>

              <div className="grid-responsive-4">
                {[
                  {
                    icon: "🎯",
                    title: "Career Focused",
                    description:
                      "Programs designed to meet current industry demands and prepare you for immediate employment",
                  },
                  {
                    icon: "💼",
                    title: "Industry Projects",
                    description:
                      "Work on real-world projects with actual clients and industry partners",
                  },
                  {
                    icon: "🏆",
                    title: "Certification Ready",
                    description:
                      "Prepare for industry-recognized certifications alongside your degree",
                  },
                  {
                    icon: "🌍",
                    title: "Global Perspective",
                    description:
                      "International case studies and global project collaboration opportunities",
                  },
                ].map((feature, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-4xl mb-4 group-hover:animate-bounce">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 text-center bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
            <h2 className="section-title bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
              Ready to Begin Your Journey?
            </h2>
            <p className="section-subtitle text-gray-600 mb-8">
              Take the first step towards your tech career with our
              comprehensive programs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                Apply Now
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-slate-800 rounded-xl font-semibold transition-all border border-gray-300 hover:border-cyan-400/50"
              >
                Learn More About Us
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
