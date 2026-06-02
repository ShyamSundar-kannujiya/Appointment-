import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data.customers);
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
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Customers</h1>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden md:block bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Bookings</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={index} className="border-t border-slate-800">
                    <td className="p-4">{customer.name}</td>
                    <td className="p-4">{customer.phone}</td>
                    <td className="p-4">{customer.bookings}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {customers.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No customers found
              </div>
            )}
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="md:hidden space-y-4">
            {customers.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                No customers found
              </div>
            )}
            {customers.map((customer, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-2"
              >
                <p className="font-semibold text-lg">{customer.name}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-slate-400">Phone</p>
                    <p>{customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Total Bookings</p>
                    <p>{customer.bookings}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
