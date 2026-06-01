import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../services/api";

const Services = () => {
  const [categoryName, setCategoryName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");

      setServices(res.data.services);
    } catch (error) {
      console.log(error);
    }
  };

  const addService = async () => {
    try {
      if (!categoryName || !serviceName || !price || !duration) {
        return alert("Please fill all fields");
      }

      setLoading(true);

      await api.post("/services", {
        categoryName,
        serviceName,
        price,
        duration,
      });

      setCategoryName("");
      setServiceName("");
      setPrice("");
      setDuration("");

      fetchServices();
    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);

      fetchServices();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Services</h1>

        {/* FORM */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Add New Service</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl outline-none"
            />

            <input
              type="text"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl outline-none"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl outline-none"
            />

            <input
              type="number"
              placeholder="Duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-slate-800 p-3 rounded-xl outline-none"
            />
          </div>

          <button
            onClick={addService}
            disabled={loading}
            className="mt-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-xl"
          >
            <Plus size={18} />
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>

        {/* SERVICES */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
            >
              <span className="text-xs bg-indigo-600 px-3 py-1 rounded-full">
                {service.categoryName}
              </span>

              <h3 className="text-xl font-semibold mt-4">
                {service.serviceName}
              </h3>

              <div className="mt-5 space-y-2">
                <p className="text-slate-300">
                  Price :
                  <span className="text-green-400 ml-2">₹{service.price}</span>
                </p>

                <p className="text-slate-300">
                  Duration :<span className="ml-2">{service.duration} min</span>
                </p>
              </div>

              <button
                onClick={() => deleteService(service._id)}
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
