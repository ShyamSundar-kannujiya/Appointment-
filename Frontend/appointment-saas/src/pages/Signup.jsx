import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, Phone, Lock } from "lucide-react";
import api from "../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const slug = businessName.trim().toLowerCase().replace(/\s+/g, "-");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/register", {
        businessName,
        email,
        phone,
        password,
      });

      alert(res.data.message || "Account Created Successfully");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>

          <p className="text-slate-400 mt-2">
            Launch your appointment booking business
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Business Name */}

          <div>
            <label className="text-slate-300 text-sm">Business Name</label>

            <div className="mt-2 flex items-center bg-slate-800 rounded-xl px-3">
              <Building2 size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Shyam Tattoo Studio"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-transparent outline-none p-3 text-white"
                required
              />
            </div>
          </div>

          {/* Email */}

          <div>
            <label className="text-slate-300 text-sm">Email</label>

            <div className="mt-2 flex items-center bg-slate-800 rounded-xl px-3">
              <Mail size={18} className="text-slate-400" />

              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none p-3 text-white"
                required
              />
            </div>
          </div>

          {/* Phone */}

          <div>
            <label className="text-slate-300 text-sm">Phone Number</label>

            <div className="mt-2 flex items-center bg-slate-800 rounded-xl px-3">
              <Phone size={18} className="text-slate-400" />

              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent outline-none p-3 text-white"
                required
              />
            </div>
          </div>

          {/* Password */}

          <div>
            <label className="text-slate-300 text-sm">Password</label>

            <div className="mt-2 flex items-center bg-slate-800 rounded-xl px-3">
              <Lock size={18} className="text-slate-400" />

              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none p-3 text-white"
                required
              />
            </div>
          </div>

          {/* Slug Preview */}

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm mb-1">Your Booking Link</p>

            <p className="text-indigo-400 break-all">
              http://localhost:5173/book/
              {slug || "your-business-name"}
            </p>
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-xl font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
