import { useState } from "react";
import api from "../../../api";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, User, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password");
      return;
    }

    try {
      const res = await api.post("/admin/auth/login", {
        username,
        password,
      });

      localStorage.setItem("admin_token", res.data.access_token);
      navigate("/admin");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcff] px-6 py-16 overflow-hidden relative">
      {/* blobs */}
      <div className="absolute -top-44 -left-44 w-[650px] h-[650px] bg-[#d4af37]/18 rounded-full blur-[170px]" />
      <div className="absolute -bottom-52 -right-52 w-[720px] h-[720px] bg-[#9d4edd]/15 rounded-full blur-[190px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.60),transparent_60%)]" />

      {/* card */}
      <div className="relative w-full max-w-md">
        <div className="rounded-[34px] border border-gray-200 bg-white/80 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.08)] p-10 overflow-hidden">
          {/* shimmer */}
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <div className="absolute -left-52 top-0 w-64 h-full bg-white/25 skew-x-[-18deg] animate-shimmer" />
          </div>

          {/* header */}
          <div className="relative text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center mb-5">
              <ShieldCheck className="w-7 h-7 text-[#9d4edd]" />
            </div>

            <div
              className="
                inline-flex items-center gap-2
                px-5 py-2 rounded-full
                text-xs font-black tracking-wide
                text-[#1b1400]
                bg-gradient-to-r from-[#fff7c2] via-[#d4af37] to-[#a87412]
                border border-white/60
                shadow-[0_16px_40px_rgba(212,175,55,0.35)]
                overflow-hidden
              "
            >
              <span className="absolute inset-0 -translate-x-full bg-white/35 skew-x-[-20deg] animate-badgeShine" />
              <span className="relative">ADMIN PANEL</span>
              <Sparkles className="w-4 h-4 text-[#0b0f19]" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-[#0b0f19]">
              Admin Login
            </h2>
            <p className="mt-2 text-gray-600 font-semibold">
              Access dashboard & manage products.
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="relative mt-8 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          {/* inputs */}
          <div className="relative mt-8 space-y-5">
            {/* username */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9d4edd]" />
              <input
                className="
                  w-full pl-12 pr-4 py-4 rounded-2xl
                  bg-white/70 border border-gray-200
                  outline-none font-semibold text-[#0b0f19]
                  placeholder:text-gray-400
                  focus:border-[#9d4edd]/60
                  focus:shadow-[0_12px_30px_rgba(157,78,221,0.14)]
                  transition
                "
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9d4edd]" />
              <input
                type={show ? "text" : "password"}
                className="
                  w-full pl-12 pr-12 py-4 rounded-2xl
                  bg-white/70 border border-gray-200
                  outline-none font-semibold text-[#0b0f19]
                  placeholder:text-gray-400
                  focus:border-[#9d4edd]/60
                  focus:shadow-[0_12px_30px_rgba(157,78,221,0.14)]
                  transition
                "
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setShow((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
              >
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* login btn */}
            <button
              onClick={login}
              className="
                w-full py-4 rounded-2xl
                bg-[#0b0f19] text-white
                font-extrabold tracking-wide
                hover:scale-[1.02] transition
                shadow-[0_20px_50px_rgba(0,0,0,0.20)]
              "
            >
              Login
            </button>

            {/* optional link */}
            <div className="text-center text-sm font-semibold text-gray-600">
              Go to{" "}
              <Link
                to="/"
                className="text-[#9d4edd] font-extrabold hover:underline"
              >
                User Website
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* animations */}
      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-140%) skewX(-20deg); }
            100% { transform: translateX(260%) skewX(-20deg); }
          }
          .animate-shimmer { animation: shimmer 2.2s infinite; }

          @keyframes badgeShine {
            0% { transform: translateX(-160%) skewX(-20deg); }
            100% { transform: translateX(220%) skewX(-20deg); }
          }
          .animate-badgeShine { animation: badgeShine 3s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
