import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#0b0f19] text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* ===== Top Section ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Global <span className="text-[#d4af37]">Mobiles</span>
            </h3>

            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
              Premium mobile accessories at affordable prices.
              Covers, chargers, earbuds and smart watches — trusted quality.
            </p>

            {/* Social */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#d4af37]/40 hover:text-white transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#d4af37]/40 hover:text-white transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-[#d4af37]/40 hover:text-white transition"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              {[
                { name: "Home", to: "/" },
                { name: "Categories", to: "/categories" },
                { name: "Products", to: "/products" },
                { name: "About", to: "/about" },
                { name: "Contact", to: "/contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-gray-400 hover:text-white transition inline-flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] opacity-40 group-hover:opacity-100 transition" />
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
              Support
            </h4>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/refund"
                  className="text-gray-400 hover:text-white transition"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-gray-400 hover:text-white transition"
                >
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-5">
              Contact
            </h4>

            <div className="space-y-4 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#d4af37] mt-0.5" />
                Tirunelveli, Tamil Nadu
              </p>
              <p className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#d4af37]" />
                +91 98765 43210
              </p>
              <p className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#d4af37]" />
                globalmobiles@gmail.com
              </p>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-white mb-3">
                Get updates & offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-[#d4af37]/60 transition"
                />
                <button className="px-5 py-3 rounded-xl font-extrabold bg-[#d4af37] text-black hover:opacity-90 transition">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Strip ===== */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-300 font-semibold">Global Mobiles</span>.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-gray-500">Designed for Premium Shopping</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
