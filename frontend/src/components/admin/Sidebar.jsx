import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Layers,
  Eye,
  Smartphone,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const linkClass = ({ isActive }) =>
  `group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition
   ${
     isActive
       ? "bg-white text-[#0b0f19] shadow-soft"
       : "text-gray-300 hover:bg-white/10 hover:text-white"
   }`;

export default function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <aside className="w-72 bg-[#0b0f19] text-white min-h-screen p-5 flex flex-col justify-between">
      {/* TOP */}
      <div>
        {/* BRAND */}
        <div className="mb-8">
          <div className="text-2xl font-black tracking-tight">
            Global Mobiles
          </div>
          <div className="text-xs font-bold text-gray-400 mt-1">
            Admin Panel
          </div>
        </div>

        {/* MENU */}
        <nav className="space-y-2">
          {/* MAIN */}
          <div className="text-xs font-black uppercase tracking-widest text-gray-500 px-2 mt-2">
            Catalog
          </div>

          <NavLink to="/admin/main-category" className={linkClass}>
            <Layers className="w-5 h-5 text-[#d4af37]" />
            Main Categories
          </NavLink>

          <NavLink to="/admin/visibility" className={linkClass}>
            <Eye className="w-5 h-5 text-[#9d4edd]" />
            Visibility Control
          </NavLink>

          {/* CASES */}
          <div className="text-xs font-black uppercase tracking-widest text-gray-500 px-2 mt-6">
            Cases
          </div>

          <NavLink to="/admin/case-main-category" className={linkClass}>
            <Smartphone className="w-5 h-5 text-[#d4af37]" />
            Case Main Category
          </NavLink>

          {/* later we will add more pages */}
          <NavLink to="/admin/case-visibility" className={linkClass}>
            <ShieldCheck className="w-5 h-5 text-[#9d4edd]" />
            Case Visibility
          </NavLink>
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="pt-6 border-t border-white/10">
        <button
          onClick={logout}
          className="
            w-full inline-flex items-center justify-center gap-2
            px-4 py-3 rounded-2xl
            bg-red-600 hover:bg-red-700
            font-extrabold text-sm transition
          "
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>

        <div className="mt-4 text-[11px] text-gray-500 font-semibold text-center">
          © {new Date().getFullYear()} Global Mobiles
        </div>
      </div>
    </aside>
  );
}
