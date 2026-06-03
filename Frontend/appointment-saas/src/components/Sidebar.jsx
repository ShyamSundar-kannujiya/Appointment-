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
  Copy,
  LogOut,
  User,
  BookOpen,
} from "lucide-react";
import { useNavbarData } from "./Navbar";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/services", icon: Scissors, label: "Services" },
  { to: "/bookings", icon: CalendarDays, label: "Bookings" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/owner-profile", icon: User, label: "Owner Profile" },
  { to: "/user-guide", icon: BookOpen, label: "User Guide" },
];

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, liveLink, copyLink, logout } = useNavbarData();

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

        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div
            title={user?.businessName}
            className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-base cursor-pointer"
          >
            {user?.businessName?.charAt(0)?.toUpperCase()}
          </div>

          {/* Logout */}
          <button onClick={logout} className="bg-red-600 p-2 rounded-lg">
            <LogOut size={18} />
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-slate-800 text-white"
          >
            <Menu size={22} />
          </button>
        </div>
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-indigo-500">AppointmentPro</h1>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg bg-slate-800 text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Shop link in drawer */}
        <div className="mb-6 p-3 bg-slate-800 rounded-xl">
          <p className="text-slate-400 text-xs mb-1">Your shop link</p>
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 text-xs truncate flex-1">
              {liveLink}
            </span>
            <button
              onClick={() => {
                copyLink();
                setMobileOpen(false);
              }}
              className="bg-slate-700 p-1.5 rounded-lg shrink-0"
            >
              <Copy size={15} />
            </button>
          </div>
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

      {/* TOP BAR SPACER - mobile pe content neeche rahe */}
      <div className="md:hidden h-14" />
    </>
  );
};



export default Sidebar;
