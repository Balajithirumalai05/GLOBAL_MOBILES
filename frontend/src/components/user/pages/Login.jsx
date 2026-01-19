import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import { getGuestCart, clearGuestCart } from "../../../utils/cart";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password");
      return;
    }

    try {
      // ✅ LOGIN
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);

      // ✅ TRY MERGING CART (NON-BLOCKING)
      try {
        const guestCart = getGuestCart();

        for (const item of guestCart) {
          await api.post("/cart/add", {
            product_id: item.id,
            quantity: item.qty,
          });
        }

        clearGuestCart();
      } catch (cartErr) {
        console.warn("Cart merge failed:", cartErr);
      }

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fcfcff] px-6 py-16 overflow-hidden relative">

      {/* soft blobs background */}
      <div className="absolute -top-44 -left-44 w-[600px] h-[600px] bg-[#d4af37]/20 rounded-full blur-[150px]" />
      <div className="absolute -bottom-44 -right-44 w-[650px] h-[650px] bg-[#9d4edd]/15 rounded-full blur-[170px]" />

      {/* login card */}
      <div
        className="
          relative w-full max-w-md
          rounded-[32px]
          border border-gray-200
          bg-white/80 backdrop-blur-xl
          shadow-[0_30px_90px_rgba(0,0,0,0.08)]
          p-10
        "
      >
        {/* header */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center mb-5">
            <Sparkles className="w-7 h-7 text-[#9d4edd]" />
          </div>

          <h2 className="text-3xl font-black text-[#0b0f19]">
            Welcome Back
          </h2>
          <p className="text-gray-600 mt-2 font-semibold">
            Login to continue shopping.
          </p>
        </div>

        {/* error */}
        {error && (
          <div className="mt-8 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold">
            {error}
          </div>
        )}

        {/* form */}
        <div className="mt-8 space-y-5">

          {/* email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9d4edd]" />
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
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* login button */}
          <button
            onClick={submit}
            className="
              w-full py-4 rounded-2xl
              bg-[#0b0f19] text-white
              font-extrabold tracking-wide
              hover:scale-[1.02]
              transition
              shadow-[0_20px_50px_rgba(0,0,0,0.20)]
            "
          >
            Login
          </button>
        </div>

        {/* footer */}
        <p className="text-sm mt-7 text-center font-semibold text-gray-600">
          No account?{" "}
          <Link to="/register" className="text-[#9d4edd] font-extrabold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
