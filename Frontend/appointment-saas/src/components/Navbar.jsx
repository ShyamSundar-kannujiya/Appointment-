import { useEffect, useState } from "react";
import { Copy, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export const useNavbarData = () => {
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

  const liveLink = user ? `${window.location.origin}/book/${user.slug}` : "";

  const copyLink = () => {
    navigator.clipboard.writeText(liveLink);
    alert("Link Copied");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return { user, liveLink, copyLink, logout };
};

const Navbar = () => {
  const { user, liveLink, copyLink, logout } = useNavbarData();

  return (
    <div className="hidden md:flex bg-slate-900 border-b border-slate-800 px-6 py-4 justify-between items-center">
      <div>
        <p className="text-slate-400 text-sm">Your shop link</p>
        <div className="flex items-center gap-3">
          <span className="text-indigo-400 text-sm">{liveLink}</span>
          <button onClick={copyLink} className="bg-slate-800 p-2 rounded-lg">
            <Copy size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          title={user?.businessName}
          className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-lg cursor-pointer"
        >
          {user?.businessName?.charAt(0)?.toUpperCase()}
        </div>
        <button onClick={logout} className="bg-red-600 p-2 rounded-lg">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;