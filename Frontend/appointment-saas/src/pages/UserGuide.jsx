import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const UserGuide = ({ publicMode = false }) => {
  const guideSteps = [
    [
      "1. Sign Up",
      "Pehle apna account create karein. Business Name, Email, Phone Number aur Password enter karein. Business Name ke basis par aapka unique booking link generate hota hai.",
    ],
    [
      "2. Login",
      "Account banne ke baad Email aur Password se login karein. Login ke baad aap Dashboard par pahunch jayenge.",
    ],
    [
      "3. Owner Profile Setup",
      "Owner Profile page me Business Name, Phone Number, UPI ID aur Advance Amount set karein. Save Changes par click karein.",
    ],
    [
      "4. Services Add Karein",
      "Services page me Category, Service Name, Price aur Duration add karein. Ye services customer booking page par dikhengi.",
    ],
    [
      "5. Booking Link Share Karein",
      "Owner Profile ya Navbar se apna booking link copy karein aur WhatsApp, Instagram, Facebook ya website par share karein.",
    ],
    [
      "6. Customer Booking",
      "Customer booking link open karega, service select karega, date/time choose karega aur apni details submit karega.",
    ],
    [
      "7. Advance Payment",
      "Agar aapne advance amount set kiya hai to customer ko UPI ID dikhegi. Customer payment karke UTR Number submit karega.",
    ],
    [
      "8. Payment Verify Karein",
      "Bookings page me UTR Number check karein. Payment receive ho gayi ho to Verify Payment button par click karein.",
    ],
    [
      "9. Appointment Confirm / Cancel",
      "Payment verify hone ke baad Confirm button se booking confirm karein. Booking accept nahi karni ho to Cancel button use karein.",
    ],
    [
      "10. Dashboard",
      "Dashboard me Today's Bookings, Pending Approval, Confirmed Bookings aur Revenue jaise important stats dikhenge.",
    ],
    [
      "11. Customers Page",
      "Customers page me customer list, phone number aur booking count dekh sakte hain.",
    ],
  ];

  return (
    <div
      className={
        publicMode
          ? "bg-slate-950 min-h-screen text-white"
          : "flex bg-slate-950 min-h-screen text-white"
      }
    >
      {!publicMode && <Sidebar />}

      <div className="flex-1 min-w-0">
        {!publicMode && <Navbar />}

        {publicMode && (
          <div className="bg-slate-900 border-b border-slate-800 px-4 md:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-indigo-500">
              AppointmentPro
            </h1>

            <div className="flex gap-3">
              <Link
                to="/"
                className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        <div
          className={`w-full p-4 md:p-8 max-w-5xl ${
            publicMode ? "mx-auto" : "pt-24 md:pt-8"
          }`}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            AppointmentPro – Shop Owner User Guide <br />
            <span className="text-indigo-400">Welcome</span>
          </h1>

          <p className="text-slate-400 mb-8 leading-relaxed">
            AppointmentPro ek simple appointment booking system hai jiske
            through aap apne customers ki bookings manage kar sakte hain,
            payment verify kar sakte hain aur appointment confirm ya cancel kar
            sakte hain.
          </p>

          <div className="space-y-6">
            {guideSteps.map(([title, desc]) => (
              <div
                key={title}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5"
              >
                <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                  {title}
                </h2>

                <p className="text-slate-300 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-3">Best Practices</h2>

            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Advance payment mandatory rakhein.</li>
              <li>Payment verify karne ke baad hi booking confirm karein.</li>
              <li>Apna booking link social media par share karein.</li>
              <li>Daily bookings page check karein.</li>
              <li>Customer ke UTR Number ko verify karna na bhoolein.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
