import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-[#fcfcff] overflow-x-hidden">
      
      {/* ✅ FIXED SIDEBAR */}
      <div className="fixed left-0 top-0 h-screen w-[280px] z-50">
        <Sidebar />
      </div>

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1 ml-[280px] min-h-screen p-6 md:p-10 relative">
        
        {/* premium background blobs */}
        <div className="absolute -top-44 -left-44 w-[600px] h-[600px] bg-[#d4af37]/12 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-56 -right-56 w-[700px] h-[700px] bg-[#9d4edd]/10 rounded-full blur-[190px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.60),transparent_65%)] pointer-events-none" />

        {/* ✅ content wrapper */}
        <div className="relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
