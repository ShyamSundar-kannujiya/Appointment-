import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Settings,
  CalendarDays,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/services", icon: Scissors, label: "Services" },
  { to: "/bookings", icon: CalendarDays, label: "Bookings" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : "hover:bg-slate-800 text-slate-300"
    }`;

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <div className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-5 flex-col">
        <h1 className="text-2xl font-bold text-indigo-500 mb-10">
          AppointmentPro
        </h1>
        <div className="space-y-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-indigo-500">AppointmentPro</h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-slate-800 text-white"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ===== MOBILE DRAWER OVERLAY ===== */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===== MOBILE DRAWER ===== */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 z-50 bg-slate-900 border-r border-slate-800 p-5 flex flex-col transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-indigo-500">AppointmentPro</h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg bg-slate-800 text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={linkClass}
              onClick={() => setMobileOpen(false)}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* ===== MOBILE TOP BAR SPACER ===== */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default Sidebar;