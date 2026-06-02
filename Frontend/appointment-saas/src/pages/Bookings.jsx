import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.bookings);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Booking Management
          </h1>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-slate-800">
                    <td className="p-4">{booking.clientName}</td>
                    <td className="p-4">{booking.clientPhone}</td>
                    <td className="p-4">{booking.serviceId?.serviceName}</td>
                    <td className="p-4">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">{booking.slotTime}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === "confirmed"
                            ? "bg-green-600"
                            : booking.status === "cancelled"
                              ? "bg-red-600"
                              : "bg-yellow-600"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => updateStatus(booking._id, "confirmed")}
                        className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking._id, "cancelled")}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {bookings.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No bookings found
              </div>
            )}
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden space-y-4">
            {bookings.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No bookings found
              </div>
            )}
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{booking.clientName}</p>
                    <p className="text-slate-400 text-sm">{booking.clientPhone}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      booking.status === "confirmed"
                        ? "bg-green-600"
                        : booking.status === "cancelled"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-400">Service</p>
                    <p>{booking.serviceId?.serviceName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Date</p>
                    <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Time</p>
                    <p>{booking.slotTime}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => updateStatus(booking._id, "confirmed")}
                    className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(booking._id, "cancelled")}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Bookings;