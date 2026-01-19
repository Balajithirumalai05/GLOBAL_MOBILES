import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-white">
      
      {/* ✅ FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-[999]">
        <Navbar />
      </div>

      {/* ✅ Add padding-top equal to navbar height */}
      <main className="pt-[80px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
