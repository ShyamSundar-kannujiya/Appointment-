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
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const updatePaymentStatus = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/payment-status`, {
        paymentStatus,
      });

      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Payment update failed");
    }
  };

  const statusBadge = (status) =>
    status === "confirmed"
      ? "bg-green-600"
      : status === "cancelled"
        ? "bg-red-600"
        : "bg-yellow-600";

  const paymentBadge = (paymentStatus) =>
    paymentStatus === "verified"
      ? "bg-green-600"
      : paymentStatus === "rejected"
        ? "bg-red-600"
        : paymentStatus === "submitted"
          ? "bg-blue-600"
          : "bg-yellow-600";

  return (
    <div className="flex bg-slate-950 min-h-screen text-white">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />

        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Booking Management
          </h1>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Payment</th>
                  <th className="text-left p-4">UTR</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-slate-800">
                    <td className="p-4">{booking.clientName}</td>

                    <td className="p-4">{booking.clientPhone}</td>

                    <td className="p-4">
                      {booking.serviceId?.serviceName || "N/A"}
                    </td>

                    <td className="p-4">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>

                    <td className="p-4">{booking.slotTime}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${statusBadge(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${paymentBadge(
                          booking.paymentStatus,
                        )}`}
                      >
                        {booking.paymentStatus || "pending"}
                      </span>
                    </td>

                    <td className="p-4">{booking.utrNumber || "-"}</td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateStatus(booking._id, "confirmed")}
                          disabled={booking.paymentStatus !== "verified"}
                          className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-sm disabled:opacity-50"
                        >
                          Confirm
                        </button>

                        <button
                          onClick={() => updateStatus(booking._id, "cancelled")}
                          className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-sm"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() =>
                            updatePaymentStatus(booking._id, "verified")
                          }
                          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-sm"
                        >
                          Verify Payment
                        </button>

                        <button
                          onClick={() =>
                            updatePaymentStatus(booking._id, "rejected")
                          }
                          className="bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded-lg text-sm"
                        >
                          Reject Payment
                        </button>
                      </div>
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

          {/* MOBILE CARDS */}
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
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <p className="font-semibold text-lg">
                      {booking.clientName}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {booking.clientPhone}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusBadge(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Service</p>
                    <p>{booking.serviceId?.serviceName || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-slate-400">Date</p>
                    <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-slate-400">Time</p>
                    <p>{booking.slotTime}</p>
                  </div>

                  <div>
                    <p className="text-slate-400">Payment</p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs ${paymentBadge(
                        booking.paymentStatus,
                      )}`}
                    >
                      {booking.paymentStatus || "pending"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <p className="text-slate-400">UTR</p>
                    <p>{booking.utrNumber || "-"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => updateStatus(booking._id, "confirmed")}
                    disabled={booking.paymentStatus !== "verified"}
                    className="bg-green-600 hover:bg-green-700 py-2 rounded-lg text-sm disabled:opacity-50"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => updateStatus(booking._id, "cancelled")}
                    className="bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => updatePaymentStatus(booking._id, "verified")}
                    className="bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm"
                  >
                    Verify
                  </button>

                  <button
                    onClick={() => updatePaymentStatus(booking._id, "rejected")}
                    className="bg-orange-600 hover:bg-orange-700 py-2 rounded-lg text-sm"
                  >
                    Reject
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
