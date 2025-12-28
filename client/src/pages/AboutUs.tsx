import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiUsers,
  FiBookOpen,
  FiAward,
  FiTarget,
} from "react-icons/fi";

export default function AboutUs() {
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
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-cyan-300">
                About Our Department
              </span>
            </div>

            <h1 className="section-title-large bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent neon-glow">
              About ICT Department
            </h1>

            <p className="section-subtitle text-cyan-100/90">
              Leading the future of technology education with innovative
              programs, expert faculty, and cutting-edge facilities
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="section-padding-large bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container-responsive">
          <div className="grid-responsive-2">
            <div className="enhanced-card stagger-animation-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FiTarget className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent">
                  Our Mission
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To provide world-class education in Information and
                Communication Technology, preparing students to become
                innovative leaders and problem-solvers in the rapidly evolving
                digital landscape. We are committed to fostering creativity,
                critical thinking, and practical skills that empower our
                graduates to make meaningful contributions to society.
              </p>
            </div>

            <div className="enhanced-card stagger-animation-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
                  Our Vision
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To be recognized globally as a premier institution for ICT
                education, known for producing graduates who drive technological
                innovation and digital transformation across industries. We
                envision a future where our alumni lead the development of
                sustainable, inclusive, and cutting-edge technology solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview Section */}
      <div className="section-padding-large bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container-responsive">
          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-8">
              <span className="text-blue-600 animate-pulse">🎓</span>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Excellence in Education
              </span>
            </div>
            <h2 className="section-title bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Why Choose ICT Department?
            </h2>
            <p className="section-subtitle text-gray-600">
              We combine academic excellence with practical industry experience
              to prepare you for the future
            </p>
          </div>

          <div className="grid-responsive">
            <div className="enhanced-card stagger-animation-1">
              <div className="text-5xl mb-6 group-hover:animate-bounce transition-transform duration-300">
                <FiBookOpen className="w-16 h-16 text-cyan-500 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent group-hover:neon-glow transition-all duration-300">
                Innovative Curriculum
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                Industry-aligned courses that evolve with technology trends
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            <div className="enhanced-card stagger-animation-2">
              <div className="text-5xl mb-6 group-hover:animate-bounce transition-transform duration-300">
                <FiUsers className="w-16 h-16 text-purple-500 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent group-hover:neon-glow transition-all duration-300">
                Expert Staff
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                Experienced professionals with decades of industry expertise
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>

            <div className="enhanced-card stagger-animation-3">
              <div className="text-5xl mb-6 group-hover:animate-bounce transition-transform duration-300">
                <FiAward className="w-16 h-16 text-green-500 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-green-600 bg-clip-text text-transparent group-hover:neon-glow transition-all duration-300">
                Proven Results
              </h3>
              <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                95% graduate success rate and strong industry partnerships
              </p>
              <div className="mt-6 w-12 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section-padding-large bg-gradient-to-br from-slate-50 to-cyan-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container-responsive">
          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/20 mb-8">
              <span className="text-purple-400 animate-pulse">✨</span>
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                What Sets Us Apart
              </span>
            </div>
            <h2 className="section-title bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
              Excellence in Every Aspect
            </h2>
            <p className="section-subtitle text-gray-600">
              We combine academic excellence with practical industry experience
              to prepare you for the future
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                icon: "🎯",
                title: "Industry-Aligned Programs",
                description:
                  "Our curriculum is designed in consultation with industry leaders to ensure graduates have the skills employers demand.",
              },
              {
                icon: "💼",
                title: "Strong Industry Connections",
                description:
                  "Partnerships with leading tech companies provide internship opportunities and direct pathways to employment.",
              },
              {
                icon: "🔬",
                title: "State-of-the-Art Facilities",
                description:
                  "Modern computer labs, specialized equipment, and collaborative learning spaces support hands-on learning.",
              },
              {
                icon: "🌟",
                title: "Award-Winning Faculty",
                description:
                  "Learn from professors who are active researchers, industry consultants, and technology innovators.",
              },
              {
                icon: "🚀",
                title: "Career Support Services",
                description:
                  "Comprehensive career guidance, resume workshops, and interview preparation to ensure your success.",
              },
              {
                icon: "🌍",
                title: "Global Perspective",
                description:
                  "International exchange programs and global project collaborations prepare you for the worldwide tech industry.",
              },
            ].map((item, idx) => (
              <div key={idx} className="enhanced-card">
                <div className="flex items-start gap-6">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section bg-gradient-to-br from-cyan-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div
            className="absolute top-0 left-0 w-full h-full opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container-responsive text-center">
          <div className="section-header">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-cyan-300">
                Ready to Start Your Journey?
              </span>
            </div>

            <h2 className="cta-title bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-glow">
              Join Our Community
            </h2>

            <p className="cta-subtitle">
              Join thousands of successful graduates who have transformed their
              careers with our programs
            </p>
          </div>

          <div className="cta-buttons">
            <Link
              to="/login"
              className="group px-10 py-5 glass-effect hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 border border-white/30 holographic backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3 text-white">
                <span className="animate-float">🚀</span>
                <span className="font-semibold tracking-wide">Apply Now</span>
              </div>
            </Link>

            <Link
              to="/programs"
              className="group px-10 py-5 glass-effect hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 border border-white/30 holographic backdrop-blur-sm"
            >
              <div className="relative flex items-center gap-3">
                <span className="animate-pulse">🎓</span>
                <span>View Programs</span>
              </div>
            </Link>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 animate-float">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-full blur-xl"></div>
          </div>
          <div className="absolute bottom-10 right-10 animate-float delay-1000">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-xl"></div>
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
