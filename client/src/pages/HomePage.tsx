import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Event {
  id: number;
  type: "image" | "xml";
  content_url?: string;
  content_text?: string;
}

interface Program {
  id: number;
  name: string;
  duration: string;
  focus: string;
  highlights: string[];
}

interface Partner {
  id: number;
  name: string;
  logo_url: string;
  website_url?: string;
  description?: string;
  sort_order: number;
}

export default function HomePage() {
  const { api } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [stats, setStats] = useState([
    { label: "Active Students", value: "0" },
    { label: "Experienced Staff", value: "0" },
    { label: "Industry Partners", value: "0" },
    { label: "Success Rate", value: "0%" },
  ]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchPrograms();
    fetchStats();
    fetchPartners();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchPrograms = async () => {
    try {
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
      // Fallback to empty array if fetch fails
      setPrograms([]);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await api.get("/api/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      // Keep default stats (all zeros) if fetch fails
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      // Use the public partners endpoint directly
      const response = await api.get("/api/partners");
      setPartners(response.data);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
      // Fallback to empty array if fetch fails
      setPartners([]);
    }
  };

  // Background images for hero section with fallback gradients
  const heroBackgrounds = [
    {
      image:
        "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)",
    },
    {
      image:
        "url('https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(240, 147, 251, 0.9) 0%, rgba(245, 87, 108, 0.9) 100%)",
    },
    {
      image:
        "url('https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80')",
      gradient:
        "linear-gradient(135deg, rgba(79, 172, 254, 0.9) 0%, rgba(0, 242, 254, 0.9) 100%)",
    },
  ];

  const features = [
    {
      icon: "💻",
      title: "Modern Curriculum",
      desc: "Industry-aligned courses with latest technologies and programming languages",
    },
    {
      icon: (
        <img src="/default-avatar.svg" alt="Faculty" className="w-12 h-12" />
      ),
      title: "Expert Staff",
      desc: "Learn from experienced professionals with decades of industry experience",
    },
    {
      icon: "🔬",
      title: "State-of-Art Labs",
      desc: "Access to cutting-edge equipment and modern computing facilities",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Events Strip */}
      {events.length > 0 && (
        <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-4 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="relative z-10 animate-announcement-slide whitespace-nowrap flex gap-8">
            {events.map((event) => (
              <span
                key={event.id}
                className="inline-flex items-center gap-4 px-6 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20"
              >
                {event.type === "image" ? (
                  <img
                    src={event.content_url}
                    alt="Event"
                    className="h-6 w-auto rounded"
                  />
                ) : (
                  <span className="text-sm font-medium flex items-center gap-2">
                    <span className="animate-pulse">📢</span>
                    {event.content_text}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        {/* Animated Background with Images */}
        <div className="absolute inset-0 h-full w-full">
          <div
            className="h-full w-full animate-fade bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: heroBackgrounds[0].image,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/60 to-slate-900/80"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-none mx-auto text-center">
            {/* Main Title */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-8">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-medium text-cyan-300">
                  Leading Tech Education
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-glow leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Department of Information and Communication Technology
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-6 text-cyan-100/90">
                Empowering the next generation of
                <span className="text-purple-400 font-semibold">
                  {" "}
                  tech innovators
                </span>{" "}
                and
                <span className="text-cyan-400 font-semibold">
                  {" "}
                  digital leaders
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8  justify-center">
              <Link
                to="/login"
                className="group px-10 py-5 glass-effect hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 border border-white/30 holographic backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3 text-white">
                  <span className="animate-float">🚀</span>
                  <span className="font-semibold tracking-wide">
                    Login Portal
                  </span>
                </div>
              </Link>

              <Link
                to="/student"
                className="group px-10 py-5 glass-effect hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 border border-white/30 holographic backdrop-blur-sm"
              >
                <div className="relative flex items-center gap-3">
                  <span className="animate-bounce">📚</span>
                  <span>Student Portal</span>
                </div>
              </Link>

              <a
                href="#programs"
                className="group px-8 py-4 bg-white/5 backdrop-blur-sm hover:bg-white/15 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 border border-white/20 hover:border-cyan-400/50"
              >
                <div className="relative flex items-center gap-3">
                  <span className="animate-pulse">🎓</span>
                  <span>Explore Programs</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="animate-bounce">
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="section-padding-large bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating Orbs */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container-responsive">
          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-400/20 mb-8">
              <span className="text-cyan-400 animate-spin">📊</span>
              <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Real Time Data
              </span>
            </div>
            <h2 className="section-title-large bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent neon-glow">
              By The Numbers
            </h2>
          </div>

          {statsLoading ? (
            <div className="grid-responsive-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="group text-center">
                  <div className="stat-card">
                    <div className="stat-number">
                      <div className="skeleton h-12 w-20 mx-auto rounded"></div>
                    </div>
                    <div className="stat-label mt-4">
                      <div className="skeleton h-6 w-32 mx-auto rounded"></div>
                    </div>
                    <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid-responsive-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="group text-center">
                  <div className={`stat-card stagger-animation-${idx + 1}`}>
                    <div className="stat-number">{stat.value}</div>
                    <p className="stat-label">{stat.label}</p>

                    {/* Progress Bar */}
                    <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000"
                        style={{ animationDelay: `${idx * 200}ms` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="section-padding-large bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        <div className="relative z-10 container-responsive">
          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-400/20 mb-8">
              <span className="text-cyan-400 animate-bounce">✨</span>
              <span className="text-sm font-semibold text-cyan-600 uppercase tracking-wider">
                Premium Features
              </span>
            </div>
            <h2 className="section-title bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Why Choose ICT Department?
            </h2>
            <p className="section-subtitle text-gray-600">
              We combine academic excellence with practical industry experience
              to prepare you for the future
            </p>
          </div>

          <div className="grid-responsive">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`enhanced-card stagger-animation-${idx + 1}`}
              >
                <div className="text-5xl mb-6 group-hover:animate-bounce transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-cyan-600 bg-clip-text text-transparent group-hover:neon-glow transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {feature.desc}
                </p>

                {/* Hover Indicator */}
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partners Section */}
      {partners.length > 0 && (
        <div className="section-padding-large bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-50 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="relative z-10 container-responsive">
            <div className="section-header-large">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-8">
                <span className="text-blue-600 animate-pulse">🤝</span>
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                  Industry Partners
                </span>
              </div>
              <h2 className="section-title bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                Our Trusted Partners
              </h2>
              <p className="section-subtitle text-gray-600">
                Collaborating with leading technology companies to enhance your
                learning experience
              </p>
            </div>

            {/* Animated Partners Carousel */}
            <div className="relative overflow-hidden">
              {/* Outer container for proper overflow control */}
              <div className="relative">
                {/* Partners track with enhanced animation */}
                <div className="flex animate-partners-marquee gap-16 py-8 whitespace-nowrap">
                  {/* First set of partners */}
                  {partners.map((partner, idx) => (
                    <div
                      key={`first-${partner.id}-${idx}`}
                      className="flex-shrink-0 group inline-block"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-48 h-32 flex items-center justify-center">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-20 object-contain transition-all duration-300"
                          onError={(e) => {
                            // Fallback to company initial if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-4xl font-bold text-gray-400">${partner.name.charAt(
                                0
                              )}</div>`;
                            }
                          }}
                        />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-sm font-medium text-gray-700">
                          {partner.name}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Duplicate set for seamless loop */}
                  {partners.map((partner, idx) => (
                    <div
                      key={`second-${partner.id}-${idx}`}
                      className="flex-shrink-0 group inline-block"
                    >
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-48 h-32 flex items-center justify-center">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-20 object-contain transition-all duration-300"
                          onError={(e) => {
                            // Fallback to company initial if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="text-4xl font-bold text-gray-400">${partner.name.charAt(
                                0
                              )}</div>`;
                            }
                          }}
                        />
                      </div>
                      <div className="text-center mt-4">
                        <p className="text-sm font-medium text-gray-700">
                          {partner.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient overlays for infinite effect */}
              <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        </div>
      )}

      {/* Programs Section */}
      <div
        id="programs"
        className="section-padding-large bg-gradient-to-br from-slate-50 to-cyan-50 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container-responsive">
          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full border border-purple-400/20 mb-8">
              <span className="text-purple-400 animate-pulse">🎓</span>
              <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
                Academic Programs
              </span>
            </div>
            <h2 className="section-title bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
              Our Programs
            </h2>
            <p className="section-subtitle text-gray-600">
              Choose the program that fits your goals and aspirations
            </p>
          </div>

          <div className="grid-responsive-2">
            {programs.map((program, idx) => (
              <div
                key={idx}
                className={`program-card stagger-animation-${idx + 1}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="program-title">{program.name}</h3>
                  <div className="program-icon">
                    {idx === 0 ? "🎯" : idx === 1 ? "⚡" : "🚀"}
                  </div>
                </div>

                <div className="program-duration">
                  <span>⏱️</span>
                  <span>{program.duration}</span>
                </div>

                <p className="program-description">{program.focus}</p>

                <ul className="program-highlights">
                  {program.highlights.map((highlight, hidx) => (
                    <li key={hidx}>{highlight}</li>
                  ))}
                </ul>

                <Link
                  to="/programs"
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg group/btn flex items-center justify-center"
                >
                  <span className="relative z-10 group-hover/btn:neon-glow">
                    Learn More
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="section-padding-large bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 container-responsive">
          <div className="section-header-large">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-400/20 mb-8">
              <span className="text-cyan-400 animate-bounce">💬</span>
              <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                Student Reviews
              </span>
            </div>
            <h2 className="section-title-large bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent neon-glow">
              What Our Students Say
            </h2>
          </div>

          <div className="grid-responsive">
            {[
              {
                name: "Rajesh Kumar",
                role: "Software Engineer @ Tech Corp",
                text: "The ICT department gave me the skills and confidence to land my dream job. Highly recommended!",
                rating: 5,
                avatar: "👨‍💻",
              },
              {
                name: "Priya Sharma",
                role: "Full Stack Developer",
                text: "Excellent faculty and hands-on projects. The internship program was a game-changer for my career.",
                rating: 5,
                avatar: "👩‍💻",
              },
              {
                name: "Arjun Patel",
                role: "Data Analyst @ Analytics Firm",
                text: "Great learning environment with practical exposure to real-world problems. Worth every penny!",
                rating: 5,
                avatar: "👨‍🔬",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className={`testimonial-card stagger-animation-${idx + 1}`}
              >
                {/* Avatar & Rating */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="testimonial-avatar">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <p className="testimonial-author">{testimonial.name}</p>
                    <p className="testimonial-role">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="text-xl animate-pulse group-hover:animate-bounce"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      ⭐
                    </span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="testimonial-text">
                  {testimonial.text}
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
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
                Join Our Community
              </span>
            </div>

            <h2 className="cta-title bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent neon-glow">
              Ready to Transform Your Future?
            </h2>

            <p className="cta-subtitle">
              Join thousands of students who have successfully started their
              tech careers with us
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
                <span className="font-semibold tracking-wide">Sign In Now</span>
              </div>
            </Link>

            <a
              href="#contact"
              className="group px-10 py-5 glass-effect hover:bg-white/20 text-white rounded-2xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95 border border-white/30 holographic backdrop-blur-sm"
            >
              <div className="relative flex items-center gap-3">
                <span className="animate-pulse">📞</span>
                <span>Contact Us</span>
              </div>
            </a>
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
