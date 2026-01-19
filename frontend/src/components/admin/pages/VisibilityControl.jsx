import { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import { Search, Eye, EyeOff, Layers, Package } from "lucide-react";

/* ================= TOGGLE SWITCH ================= */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-8 rounded-full transition border ${
        checked
          ? "bg-[#0b0f19] border-[#0b0f19]"
          : "bg-gray-200 border-gray-300"
      }`}
      type="button"
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow transition ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function VisibilityControl() {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedSub, setSelectedSub] = useState("");

  const [loadingMain, setLoadingMain] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const [productSearch, setProductSearch] = useState("");

  /* ================= FETCH MAIN ================= */
  useEffect(() => {
    (async () => {
      try {
        setLoadingMain(true);
        const res = await api.get("/admin/catalog/main-categories");
        setMainCategories(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMain(false);
      }
    })();
  }, []);

  /* ================= FETCH SUB ================= */
  const fetchSubCategories = async (mainId) => {
    if (!mainId) return setSubCategories([]);
    try {
      setLoadingSub(true);
      const res = await api.get(`/admin/catalog/sub-categories/by-main/${mainId}`);
      setSubCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setSubCategories([]);
    } finally {
      setLoadingSub(false);
    }
  };

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async (subId) => {
    if (!subId) return setProducts([]);
    try {
      setLoadingProducts(true);
      const res = await api.get(`/admin/catalog/products/by-sub-category/${subId}`);
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ================= TOGGLES ================= */
  const toggleMain = async (id, value) => {
    const fd = new FormData();
    fd.append("is_active", value);
    await api.put(`/admin/catalog/main-category/${id}/toggle`, fd);

    setMainCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: value } : c))
    );
  };

  const toggleSub = async (id, value) => {
    const fd = new FormData();
    fd.append("is_active", value);
    await api.put(`/admin/catalog/sub-category/${id}/toggle`, fd);

    setSubCategories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: value } : s))
    );
  };

  const toggleProduct = async (id, value) => {
    const fd = new FormData();
    fd.append("is_available", value);
    await api.put(`/admin/catalog/product/${id}/toggle`, fd);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_available: value } : p))
    );
  };

  /* ================= FILTERED PRODUCTS ================= */
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    return products.filter((p) =>
      (p.name || "").toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  return (
    <div className="space-y-10">
      {/* ================= PAGE HEADER ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <h1 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
          Visibility Control
        </h1>
        <p className="mt-2 text-gray-600 font-semibold">
          Manage which categories and products are visible in your store.
        </p>
      </div>

      {/* ================= MAIN CATEGORY ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-[#9d4edd]" />
              </div>
              <div>
                <h2 className="font-black text-xl text-[#0b0f19]">Main Categories</h2>
                <p className="text-sm text-gray-600 font-semibold">
                  Enable / disable main category visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19]">
            Total: {mainCategories.length}
          </div>
        </div>

        {loadingMain ? (
          <div className="mt-7 text-gray-600 font-semibold">Loading main categories...</div>
        ) : mainCategories.length === 0 ? (
          <div className="mt-7 text-gray-600 font-semibold">No main categories found.</div>
        ) : (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            {mainCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-3xl border border-gray-200 p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-black text-[#0b0f19] truncate">{cat.name}</div>

                  <div className="mt-2 inline-flex items-center gap-2">
                    {cat.is_active ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-green-50 text-green-700 border border-green-200">
                        <Eye className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-600 border border-gray-200">
                        <EyeOff className="w-4 h-4" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <Toggle
                  checked={!!cat.is_active}
                  onChange={(val) => toggleMain(cat.id, val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SUB CATEGORY ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h2 className="font-black text-xl text-[#0b0f19]">Sub Categories</h2>
            <p className="text-sm text-gray-600 font-semibold mt-1">
              Choose a main category to control sub category visibility.
            </p>
          </div>

          <div className="w-full sm:w-[360px]">
            <select
              value={selectedMain}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedMain(id);
                setSelectedSub("");
                setProducts([]);
                fetchSubCategories(id);
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-soft font-bold text-[#0b0f19] outline-none"
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {!selectedMain ? (
          <div className="mt-7 text-gray-600 font-semibold">
            Select a main category to load sub categories.
          </div>
        ) : loadingSub ? (
          <div className="mt-7 text-gray-600 font-semibold">Loading sub categories...</div>
        ) : subCategories.length === 0 ? (
          <div className="mt-7 text-gray-600 font-semibold">
            No sub categories found for this main category.
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            {subCategories.map((sub) => (
              <div
                key={sub.id}
                className="rounded-3xl border border-gray-200 p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-black text-[#0b0f19] truncate">{sub.name}</div>

                  <div className="mt-2 inline-flex items-center gap-2">
                    {sub.is_active ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-green-50 text-green-700 border border-green-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-600 border border-gray-200">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <Toggle checked={!!sub.is_active} onChange={(val) => toggleSub(sub.id, val)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#9d4edd]" />
            </div>
            <div>
              <h2 className="font-black text-xl text-[#0b0f19]">Products</h2>
              <p className="text-sm text-gray-600 font-semibold mt-1">
                Choose a sub category to control product availability.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-[360px]">
            <select
              value={selectedSub}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedSub(id);
                fetchProducts(id);
              }}
              className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-soft font-bold text-[#0b0f19] outline-none"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* search */}
        {selectedSub && (
          <div className="mt-6 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-soft">
            <Search className="w-5 h-5 text-[#9d4edd]" />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-transparent outline-none font-semibold text-[#0b0f19] placeholder:text-gray-400"
            />
          </div>
        )}

        {!selectedSub ? (
          <div className="mt-7 text-gray-600 font-semibold">
            Select a sub category to load products.
          </div>
        ) : loadingProducts ? (
          <div className="mt-7 text-gray-600 font-semibold">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-7 text-gray-600 font-semibold">No products found.</div>
        ) : (
          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-3xl border border-gray-200 p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="font-black text-[#0b0f19] truncate">{p.name}</div>

                  <div className="mt-2 inline-flex items-center gap-2">
                    {p.is_available ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-green-50 text-green-700 border border-green-200">
                        Available
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-red-50 text-red-700 border border-red-200">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                <Toggle
                  checked={!!p.is_available}
                  onChange={(val) => toggleProduct(p.id, val)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
