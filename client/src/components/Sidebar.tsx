import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

interface MenuItem {
  path: string;
  label: string;
  icon: any;
}

interface SidebarProps {
  basePath: string;
  menuItems: MenuItem[];
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  basePath,
  menuItems,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const sidebarClasses = `
    ${collapsed ? "w-20" : "w-64"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    bg-gradient-to-b from-slate-900/95 via-purple-900/90 to-slate-900/95 backdrop-blur-xl text-white h-screen fixed left-0 top-0 
    transition-all duration-300 z-50 lg:relative border-r border-cyan-400/20 shadow-2xl shadow-cyan-500/10
  `;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`${sidebarClasses} flex flex-col`}>
        {/* Header with gradient accent */}
        <div className="p-6 flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent neon-glow">
                  ICT Command
                </h2>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center mx-auto">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {/* Desktop collapse button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-white/10 rounded-lg hidden lg:block transition-all duration-300 hover:scale-110"
            >
              {collapsed ? (
                <FiMenu size={20} className="text-cyan-400" />
              ) : (
                <FiX size={20} className="text-cyan-400" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-evenly px-4 py-6">
          <div className="flex flex-col justify-evenly flex-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === `${basePath}${item.path}`;
              return (
                <Link
                  key={item.path}
                  to={`${basePath}${item.path}`}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105
                    ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-white shadow-lg shadow-cyan-500/20"
                        : "hover:bg-white/10 text-white/80 hover:text-white border border-transparent hover:border-white/20"
                    }
                    ${collapsed ? "justify-center px-3" : ""}
                  `}
                >
                  <item.icon
                    size={20}
                    className={`
                      ${
                        isActive
                          ? "text-cyan-400"
                          : "text-white/60 group-hover:text-cyan-400"
                      } 
                      transition-colors duration-300 group-hover:animate-pulse
                    `}
                  />
                  {!collapsed && (
                    <span
                      className={`
                      font-medium transition-all duration-300 
                      ${
                        isActive
                          ? "text-white neon-glow"
                          : "group-hover:neon-glow"
                      }
                    `}
                    >
                      {item.label}
                    </span>
                  )}
                  {!collapsed && isActive && (
                    <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse neon-glow"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Logout button at bottom */}
          <div className="flex-shrink-0 pt-6">
            <button
              onClick={logout}
              className={`
                group flex items-center gap-4 px-4 py-3 w-full text-left transition-all duration-300 hover:scale-105 rounded-xl
                hover:bg-red-500/10 border border-transparent hover:border-red-400/30 text-white/80 hover:text-white
                ${collapsed ? "justify-center px-3" : ""}
              `}
            >
              <FiLogOut
                size={20}
                className="text-white/60 group-hover:text-red-400 transition-colors duration-300 group-hover:animate-pulse"
              />
              {!collapsed && (
                <span className="font-medium group-hover:text-red-300 transition-colors duration-300">
                  Logout
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
