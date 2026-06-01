import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
];

const ClientBook = () => {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchShop();
    fetchServices();
  }, []);

  const fetchShop = async () => {
    try {
      const res = await api.get(`/shops/${slug}`);

      setShop(res.data.shop);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get(`/shops/${slug}/services`);

      setServices(res.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {
    try {
      if (
        !selectedService ||
        !selectedDate ||
        !selectedSlot ||
        !name ||
        !phone
      ) {
        return alert("Please fill all fields");
      }

      setLoading(true);

      const res = await api.post("/bookings", {
        slug,
        serviceId: selectedService._id,
        clientName: name,
        clientPhone: phone,
        bookingDate: selectedDate,
        slotTime: selectedSlot,
      });

      alert(res.data.message);

      setSelectedService(null);
      setSelectedDate("");
      setSelectedSlot("");
      setName("");
      setPhone("");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold">
          {shop?.businessName || "Loading..."}
        </h1>

        <p className="text-slate-400">Book your appointment</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Select Service</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              onClick={() => setSelectedService(service)}
              className={`p-5 rounded-2xl cursor-pointer border transition ${
                selectedService?._id === service._id
                  ? "border-indigo-500 bg-slate-800"
                  : "border-slate-800 bg-slate-900"
              }`}
            >
              <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">
                {service.categoryName}
              </span>

              <h3 className="text-xl font-semibold mt-4">
                {service.serviceName}
              </h3>

              <p className="text-slate-400 mt-2">{service.duration} Minutes</p>

              <p className="text-green-400 mt-3">₹{service.price}</p>
            </div>
          ))}
        </div>

        {selectedService && (
          <>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Select Date</h2>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl"
            />
          </>
        )}

        {selectedDate && (
          <>
            <h2 className="text-2xl font-semibold mt-10 mb-4">
              Select Time Slot
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-xl ${
                    selectedSlot === slot ? "bg-indigo-600" : "bg-slate-900"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </>
        )}

        {selectedSlot && (
          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Confirm Booking</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 p-3 rounded-xl outline-none"
              />

              <input
                type="tel"
                placeholder="WhatsApp Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 p-3 rounded-xl outline-none"
              />

              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold"
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBook;
