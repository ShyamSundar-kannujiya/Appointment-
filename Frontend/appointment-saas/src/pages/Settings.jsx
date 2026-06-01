import { useState } from "react";

const Settings = () => {
  const [shopName, setShopName] = useState("Shyam Tattoo Studio");

  const [phone, setPhone] = useState("9876543210");

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

        <button className="bg-indigo-600 px-5 py-3 rounded-xl hover:bg-indigo-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
