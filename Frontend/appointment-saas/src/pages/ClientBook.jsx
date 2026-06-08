import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { Copy } from "lucide-react";

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
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const advanceRequired =
    selectedService?.advancePaymentEnabled &&
    Number(selectedService?.advanceAmount || 0) > 0;

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
      setServices(res.data.services || []);
    } catch (error) {
      console.log(error);
    }
  };

  const resetBookingFlow = () => {
    setBookingId("");
    setUtrNumber("");
    setPaymentSubmitted(false);
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

      const createdBookingId = res.data.booking._id;

      setBookingId(createdBookingId);

      if (advanceRequired) {
        alert(
          "Booking request created. Please pay advance and submit UTR / Transaction ID.",
        );
      } else {
        alert("Booking request created successfully");
        navigate(`/track/${createdBookingId}`);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const submitPaymentProof = async () => {
    try {
      if (!bookingId) {
        return alert("Booking ID not found");
      }

      if (!utrNumber.trim()) {
        return alert("Please enter UTR / Transaction ID");
      }

      await api.post("/bookings/payment-proof", {
        bookingId,
        utrNumber,
      });

      setPaymentSubmitted(true);

      alert("Payment proof submitted successfully");

      navigate(`/track/${bookingId}`);
    } catch (error) {
      alert(error.response?.data?.message || "Payment proof submit failed");
    }
  };

  const copyUpiId = () => {
    if (!shop?.upiId) {
      return alert("UPI ID not available");
    }

    navigator.clipboard.writeText(shop.upiId);
    alert("UPI ID copied");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 p-6">
        <h1 className="text-3xl font-bold">
          {shop?.businessName || "Loading..."}
        </h1>

        <p className="text-slate-400">Book your appointment</p>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <h2 className="text-2xl font-semibold mb-4">Select Service</h2>

        <div className="grid md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              onClick={() => {
                setSelectedService(service);
                setSelectedDate("");
                setSelectedSlot("");
                setName("");
                setPhone("");
                resetBookingFlow();
              }}
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

              {service.advancePaymentEnabled &&
                Number(service.advanceAmount || 0) > 0 && (
                  <p className="text-yellow-400 mt-2 text-sm">
                    Advance Required: ₹{service.advanceAmount}
                  </p>
                )}
            </div>
          ))}
        </div>

        {selectedService && (
          <>
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="text-xl font-semibold">
                {selectedService.serviceName}
              </h3>

              <p className="text-slate-300 mt-2">
                Service Price:{" "}
                <span className="text-green-400">₹{selectedService.price}</span>
              </p>

              {advanceRequired ? (
                <p className="text-yellow-400 mt-2">
                  Advance Payment: ₹{selectedService.advanceAmount}
                </p>
              ) : (
                <p className="text-slate-400 mt-2">
                  No advance payment required
                </p>
              )}
            </div>

            {!bookingId && (
              <>
                <h2 className="text-2xl font-semibold mt-10 mb-4">
                  Select Date
                </h2>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                    resetBookingFlow();
                  }}
                  className="bg-slate-900 border border-slate-800 p-3 rounded-xl"
                />
              </>
            )}
          </>
        )}

        {selectedDate && !bookingId && (
          <>
            <h2 className="text-2xl font-semibold mt-10 mb-4">
              Select Time Slot
            </h2>

            <div className="grid md:grid-cols-4 gap-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => {
                    setSelectedSlot(slot);
                    resetBookingFlow();
                  }}
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

        {selectedSlot && !bookingId && (
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

              {advanceRequired && (
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <p className="text-yellow-400 font-semibold">
                    Advance ₹{selectedService.advanceAmount} required after
                    booking.
                  </p>

                  <p className="text-slate-400 text-sm mt-1">
                    Booking create hone ke baad UPI payment details dikhengi.
                  </p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </div>
        )}

        {bookingId && advanceRequired && (
          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold mb-3">Pay Advance</h2>

            <p className="text-slate-400 mb-5">
              Your booking request has been created. Please pay advance and
              submit UTR / Transaction ID to track your booking status.
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-5">
              <p className="text-slate-300">
                Amount:{" "}
                <span className="text-yellow-400 font-semibold">
                  ₹{selectedService.advanceAmount}
                </span>
              </p>

              <p className="text-slate-300 mt-2">
                UPI ID:{" "}
                <span className="text-indigo-400">{shop?.upiId || "N/A"}</span>
              </p>

              <button
                onClick={copyUpiId}
                className="mt-4 flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
              >
                <Copy size={16} />
                Copy UPI ID
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter UTR / Transaction ID"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full bg-slate-800 p-3 rounded-xl outline-none"
            />

            <button
              onClick={submitPaymentProof}
              disabled={paymentSubmitted}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 py-3 rounded-xl disabled:opacity-50"
            >
              {paymentSubmitted ? "Submitted" : "Submit Payment Proof"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBook;
