import { useState } from "react";
import api from "../services/api";

const Settings = () => {
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await api.put("/auth/profile", {
        businessName: shopName,
        phone,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save settings");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 max-w-xl">
        <div className="mb-4">
          <label className="block mb-2">Shop Name</label>
          <input
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-800 p-3 rounded-xl outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-indigo-600 px-5 py-3 rounded-xl hover:bg-indigo-700"
        >
          Save Changes
        </button>

        {saved && (
          <p className="mt-3 text-green-400">
            ✅ Settings updated successfully
          </p>
        )}
      </div>
    </div>
  );
};

export default Settings;
