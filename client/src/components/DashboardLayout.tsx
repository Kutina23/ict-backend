import type { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";

interface MenuItem {
  path: string;
  label: string;
  icon: any;
}

interface DashboardLayoutProps {
  basePath: string;
  menuItems: MenuItem[];
  children: ReactNode;
}

export default function DashboardLayout({
  basePath,
  menuItems,
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-dark">
      {/* Cyberpunk animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_230.29deg_at_51.63%_52.16%,rgb(32,18,77,0.3)_0deg,_rgb(38,45,113,0.3)_106.25deg,_rgb(22,27,56,0.3)_180deg,_rgb(56,26,86,0.3)_251.5deg,_rgb(26,29,58,0.3)_306.27deg,_rgb(32,18,77,0.3)_360deg)]"></div>
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_110%)]"></div>
      </div>

      {/* Mobile menu button - Fixed position, always visible on mobile */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 rounded-xl border border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-xl lg:hidden shadow-lg shadow-cyan-500/20"
        aria-label="Toggle menu"
      >
        <FiMenu size={24} className="text-cyan-400" />
      </button>

      <Sidebar 
        basePath={basePath} 
        menuItems={menuItems} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 transition-all duration-300 relative z-10 min-h-screen">
        <div className="w-full">
          {/* Main content area with proper responsive padding */}
          <div className="lg:ml-64 p-4 lg:p-6 xl:p-8 pt-16 lg:pt-4">
            <div className="w-full max-w-full">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
