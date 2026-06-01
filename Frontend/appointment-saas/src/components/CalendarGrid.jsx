import { useEffect, useState } from "react";
import api from "../services/api";

const slots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];

const CalendarGrid = () => {
  const [bookings, setBookings] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

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

  const getBookingBySlot = (slot) => {
    return bookings.find((booking) => {
      const bookingDate = new Date(booking.bookingDate)
        .toISOString()
        .split("T")[0];

      return (
        booking.slotTime === slot &&
        bookingDate === selectedDate &&
        booking.status !== "cancelled"
      );
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Appointments ({selectedDate})</h2>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const booking = getBookingBySlot(slot);

          return (
            <div key={slot} className="border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-sm">{slot}</p>

              {booking ? (
                <div className="mt-3 bg-indigo-600 rounded-lg p-3">
                  <p className="font-semibold">{booking.clientName}</p>

                  <p className="text-sm">{booking.serviceId?.serviceName}</p>

                  <p className="text-xs mt-1">{booking.status}</p>
                </div>
              ) : (
                <div className="mt-3 text-green-400">Available</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
