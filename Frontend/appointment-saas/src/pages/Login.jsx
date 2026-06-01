import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

          <p className="text-slate-400 mt-2">
            Login to manage your appointments
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 ">
          <div>
            <label className="text-slate-300 text-sm">Email</label>

            <div className="mt-2 flex items-center bg-slate-800 rounded-xl px-3">
              <Mail size={18} className="text-slate-400" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none py-3"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm">Password</label>

            <div className="mt-2 flex items-center bg-slate-800 rounded-xl px-3">
              <Lock size={18} className="text-slate-400" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none py-3"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-xl font-semibold text-white"
          >
            Login
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:text-indigo-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
