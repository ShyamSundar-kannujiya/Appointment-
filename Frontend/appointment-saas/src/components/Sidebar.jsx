import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Scissors,
  Users,
  Settings
} from "lucide-react";
import { CalendarDays } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen p-5">
      <h1 className="text-2xl font-bold text-indigo-500 mb-10">SaaS Booking</h1>

      <div className="space-y-3">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/services"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Scissors size={20} />
          Services
        </NavLink>

        <NavLink
          to="/bookings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <CalendarDays size={20} />
          Bookings
        </NavLink>
        
        <NavLink
          to="/customers"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Users size={20} />
          Customers
        </NavLink>

        <NavLink
          to="/settings"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Settings size={20} />
          Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;