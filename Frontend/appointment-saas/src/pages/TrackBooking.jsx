import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

const TrackBooking = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
   fetchBooking();

   const interval = setInterval(() => {
     fetchBooking();
   }, 10000);

   return () => clearInterval(interval);
 }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/track/${id}`);
      setBooking(res.data.booking);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const statusColor =
    booking?.status === "confirmed"
      ? "text-green-400"
      : booking?.status === "cancelled"
        ? "text-red-400"
        : "text-yellow-400";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading booking status...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Booking not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-2">Booking Status</h1>

        <p className="text-slate-400 mb-6">
          Booking ID: <span className="text-indigo-400">{booking._id}</span>
        </p>

        <div className="bg-slate-800 rounded-xl p-5 mb-5">
          <p className="text-slate-400 text-sm">Current Status</p>
          <h2 className={`text-2xl font-bold mt-1 ${statusColor}`}>
            {booking.status?.toUpperCase()}
          </h2>
        </div>

        <div className="space-y-3 text-slate-300">
          <p>
            <strong>Customer:</strong> {booking.clientName}
          </p>
          <p>
            <strong>Service:</strong> {booking.serviceId?.serviceName}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(booking.bookingDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {booking.slotTime}
          </p>
          <p>
            <strong>Payment:</strong> {booking.paymentStatus || "pending"}
          </p>
          <p>
            <strong>UTR:</strong> {booking.utrNumber || "-"}
          </p>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Status link copied");
          }}
          className="w-full mt-4 bg-slate-800 hover:bg-slate-700 py-3 rounded-xl"
        >
          Copy Status Link
        </button>
        <p className="text-slate-400 mt-3 text-sm">
          Is link ko save kar lijiye. Aap baad me isi link se apni booking ka
          latest status check kar sakte hain.
        </p>

        <Link
          to="/"
          className="block text-center mt-6 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TrackBooking;
