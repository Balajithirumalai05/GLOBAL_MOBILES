import { Routes, Route, Navigate } from "react-router-dom";

/* ================= ADMIN ================= */
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./components/admin/pages/AdminLogin";
import AddMainCategory from "./components/admin/pages/AddMainCategory";
import AddSubCategory from "./components/admin/pages/AddSubCategory";
import AddProduct from "./components/admin/pages/AddProduct";
import VisibilityControl from "./components/admin/pages/VisibilityControl";

/* ✅ CASES (ADMIN) */
import CaseMainCategory from "./components/admin/pages/CaseMainCategory";
import CaseModels from "./components/admin/pages/CaseModels";
import CaseVisibilityControl from "./components/admin/pages/CaseVisibilityControl";

/* ================= USER ================= */
import UserLayout from "./components/user/layout/UserLayout";
import Home from "./components/user/pages/Home";
import Categories from "./components/user/pages/Categories";
import SubCategories from "./components/user/pages/SubCategories";
import Products from "./components/user/pages/Products";
import AllProducts from "./components/user/pages/AllProducts";
import About from "./components/user/pages/About";
import Contact from "./components/user/pages/Contact";
import Login from "./components/user/pages/Login";
import Register from "./components/user/pages/Register";
import Cart from "./components/user/pages/Cart";
import Cases from "./components/user/pages/Cases";
import CaseProduct from "./components/user/pages/CaseProduct";

export default function App() {
  return (
    <Routes>
      {/* ================= USER SIDE ================= */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:mainId" element={<SubCategories />} />
        <Route path="products/sub/:subId" element={<Products />} />
        <Route path="products" element={<AllProducts />} />

        {/* ✅ CASES (USER) */}
        <Route path="cases" element={<Cases />} />
        <Route path="case/:id" element={<CaseProduct />} />

        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* ================= ADMIN LOGIN ================= */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= ADMIN SIDE ================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="main-category" replace />} />

        {/* ✅ EXISTING */}
        <Route path="main-category" element={<AddMainCategory />} />
        <Route path="sub-category/:mainId" element={<AddSubCategory />} />
        <Route path="product/:subId" element={<AddProduct />} />
        <Route path="visibility" element={<VisibilityControl />} />

        {/* ✅ CASES (ADMIN) */}
        <Route path="case-main-category" element={<CaseMainCategory />} />
        <Route path="case-models/:mainId" element={<CaseModels />} />
        <Route path="case-visibility" element={<CaseVisibilityControl />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
