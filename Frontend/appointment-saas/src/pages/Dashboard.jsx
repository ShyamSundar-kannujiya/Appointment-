import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import CalendarGrid from "../components/CalendarGrid";
import api from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    estimatedRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

 const fetchStats = async () => {
   try {
     const token = localStorage.getItem("token");

     const res = await api.get("/dashboard/stats", {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     setStats(res.data.stats);
   } catch (error) {
     console.log(error);
   }
 };

  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard title="Today's Bookings" value={stats.todayBookings} />

            <StatCard title="Pending Approval" value={stats.pendingBookings} />

            <StatCard title="Confirmed" value={stats.confirmedBookings} />

            <StatCard title="Revenue" value={`₹${stats.estimatedRevenue}`} />
          </div>

          <CalendarGrid />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
