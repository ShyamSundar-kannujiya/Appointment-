import { useEffect, useState } from "react";
import { Copy, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const res = await api.get("/auth/me");

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const liveLink = user ? `http://localhost:5173/book/${user.slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(liveLink);

    alert("Link Copied");
  };

  const logout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      <div>
        <p className="text-slate-400 text-sm">Your Live Booking Link</p>

        <div className="flex items-center gap-3">
          <span className="text-indigo-400">{liveLink}</span>

          <button onClick={copyLink} className="bg-slate-800 p-2 rounded-lg">
            <Copy size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
          {user?.businessName?.charAt(0)}
        </div>

        <button onClick={logout} className="bg-red-600 p-2 rounded-lg">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
