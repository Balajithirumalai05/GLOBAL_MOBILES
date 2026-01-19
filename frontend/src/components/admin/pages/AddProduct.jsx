import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Pencil,
  X,
  ImagePlus,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const TYPES = ["type1", "type2", "type3", "type4", "type5"];

/* ================= DISCOUNT CALC ================= */
const getDiscountedPrice = (price, discount) => {
  const p = Number(price || 0);
  const d = Number(discount || 0);
  if (!d || d <= 0) return p;
  return p - (p * d) / 100;
};

/* ================= PRICE FORMAT ================= */
const formatMoney = (value) => {
  const n = Number(value || 0);
  return n.toFixed(2); // ✅ always 2 decimals
};

export default function AddProduct() {
  const { subId } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  /* ---------- ADD FORM STATE ---------- */
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    discount_percent: "",
  });

  /* ✅ type images for ADD (upload before saving) */
  const [typeFiles, setTypeFiles] = useState({}); // {type1:file,...}
  const [typePreviews, setTypePreviews] = useState({}); // for UI preview

  /* ---------- LIST HELPERS ---------- */
  const [productTypeImages, setProductTypeImages] = useState({});
  const [sliderIndex, setSliderIndex] = useState({});

  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");

  /* ---------- EDIT MODAL ---------- */
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    discount_percent: "",
  });

  const [editTypeFiles, setEditTypeFiles] = useState({});
  const [editTypeImages, setEditTypeImages] = useState({}); // saved images
  const [editTypePreviews, setEditTypePreviews] = useState({}); // previews for newly selected

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = async () => {
    const res = await api.get(`/admin/catalog/products/by-sub-category/${subId}`);
    setProducts(res.data || []);

    // fetch type images per product
    const imgsMap = {};
    await Promise.all(
      (res.data || []).map(async (p) => {
        try {
          const r = await api.get(`/admin/catalog/product/${p.id}/type-images`);
          imgsMap[p.id] = r.data || {};
        } catch {
          imgsMap[p.id] = {};
        }
      })
    );

    setProductTypeImages(imgsMap);

    // init slider index
    const indexMap = {};
    (res.data || []).forEach((p) => (indexMap[p.id] = 0));
    setSliderIndex(indexMap);
  };

  useEffect(() => {
    if (!subId) return;
    fetchProducts();
  }, [subId]);

  /* ================= SLIDER HELPERS ================= */
  const getSliderImages = (productId) => {
    const imgsObj = productTypeImages[productId] || {};
    return TYPES.filter((t) => !!imgsObj[t]).map((t) => ({
      type: t,
      image: imgsObj[t],
    }));
  };

  const prevSlide = (productId) => {
    const imgs = getSliderImages(productId);
    if (imgs.length <= 1) return;

    setSliderIndex((prev) => {
      const current = prev[productId] || 0;
      const next = current === 0 ? imgs.length - 1 : current - 1;
      return { ...prev, [productId]: next };
    });
  };

  const nextSlide = (productId) => {
    const imgs = getSliderImages(productId);
    if (imgs.length <= 1) return;

    setSliderIndex((prev) => {
      const current = prev[productId] || 0;
      const next = current === imgs.length - 1 ? 0 : current + 1;
      return { ...prev, [productId]: next };
    });
  };

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let data = [...products];

    if (q.trim()) {
      data = data.filter((p) =>
        `${p.name || ""} ${p.subtitle || ""}`.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (sort === "low") data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") data.sort((a, b) => (b.price || 0) - (a.price || 0));

    return data;
  }, [products, q, sort]);

  /* ================= ADD: TYPE FILE PICKER ================= */
  const onPickTypeFile = (type, file, mode = "add") => {
    if (!file) return;

    if (mode === "add") {
      setTypeFiles((prev) => ({ ...prev, [type]: file }));
      setTypePreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
      return;
    }

    setEditTypeFiles((prev) => ({ ...prev, [type]: file }));
    setEditTypePreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const removePickedTypeFile = (type, mode = "add") => {
    if (mode === "add") {
      setTypeFiles((prev) => {
        const cp = { ...prev };
        delete cp[type];
        return cp;
      });
      setTypePreviews((prev) => {
        const cp = { ...prev };
        delete cp[type];
        return cp;
      });
      return;
    }

    setEditTypeFiles((prev) => {
      const cp = { ...prev };
      delete cp[type];
      return cp;
    });
    setEditTypePreviews((prev) => {
      const cp = { ...prev };
      delete cp[type];
      return cp;
    });
  };

  /* ================= SAVE NEW PRODUCT (WITH IMAGES SAME TIME) ================= */
  const saveNewProduct = async () => {
    try {
      if (!form.name.trim()) return alert("Enter product name");
      if (!form.price) return alert("Enter product price");

      // 1) create product
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append("sub_category_id", subId);

      const res = await api.post("/admin/catalog/product", fd);
      const productId = res.data.id;

      // 2) upload images immediately
      for (const type of Object.keys(typeFiles)) {
        const imgFd = new FormData();
        imgFd.append("type_name", type);
        imgFd.append("image", typeFiles[type]);
        await api.post(`/admin/catalog/product/${productId}/type-image`, imgFd);
      }

      alert("Product + Images saved ✅");

      // reset add form
      setForm({ name: "", subtitle: "", price: "", discount_percent: "" });
      setTypeFiles({});
      setTypePreviews({});

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    }
  };

  /* ================= DELETE PRODUCT ================= */
  const deleteProduct = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    await api.delete(`/admin/catalog/product/${id}`);
    fetchProducts();
  };

  /* ================= OPEN EDIT MODAL ================= */
  const openEdit = async (p) => {
    setEditing(p);
    setEditOpen(true);

    setEditForm({
      name: p.name || "",
      subtitle: p.subtitle || "",
      price: p.price ?? "",
      discount_percent: p.discount_percent ?? "",
    });

    setEditTypeFiles({});
    setEditTypePreviews({});
    setEditTypeImages({});

    try {
      const res = await api.get(`/admin/catalog/product/${p.id}/type-images`);
      setEditTypeImages(res.data || {});
    } catch {
      setEditTypeImages({});
    }
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditing(null);
    setEditForm({ name: "", subtitle: "", price: "", discount_percent: "" });
    setEditTypeFiles({});
    setEditTypePreviews({});
    setEditTypeImages({});
  };

  /* ================= EDIT: SAVE ================= */
  const saveEdit = async () => {
    try {
      if (!editing) return;
      if (!editForm.name.trim()) return alert("Enter product name");
      if (!editForm.price) return alert("Enter price");

      const fd = new FormData();
      Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
      fd.append("sub_category_id", subId);

      await api.put(`/admin/catalog/product/${editing.id}`, fd);

      // upload newly selected type images
      for (const type of Object.keys(editTypeFiles)) {
        const imgFd = new FormData();
        imgFd.append("type_name", type);
        imgFd.append("image", editTypeFiles[type]);
        await api.post(`/admin/catalog/product/${editing.id}/type-image`, imgFd);
      }

      alert("Updated ✅");
      closeEdit();
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  /* ================= EDIT: DELETE TYPE IMAGE ================= */
  const deleteTypeImage = async (type) => {
    if (!editing) return;
    await api.delete(`/admin/catalog/product/${editing.id}/type-image/${type}`);
    setEditTypeImages((prev) => {
      const cp = { ...prev };
      delete cp[type];
      return cp;
    });
  };

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19] hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#9d4edd]" />
            Back
          </button>

          <h1 className="mt-5 text-3xl md:text-4xl font-black text-[#0b0f19]">
            Products
          </h1>
          <p className="text-gray-600 font-semibold mt-2">
            Add products + upload images in one save.
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19]">
          Total: {filtered.length}
        </div>
      </div>

      {/* ================= ADD FORM ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-black text-xl text-[#0b0f19]">Add Product</h2>

          <div className="text-sm font-extrabold text-gray-600 inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#9d4edd]" />
            You can upload type images before saving
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[
            { key: "name", label: "Product Name", placeholder: "Eg: Charger 20W" },
            { key: "subtitle", label: "Subtitle", placeholder: "Eg: Fast charging" },
            { key: "price", label: "Price (₹)", placeholder: "Eg: 499" },
            { key: "discount_percent", label: "Discount %", placeholder: "Eg: 10" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-extrabold text-gray-700">{f.label}</label>
              <input
                type={f.key === "price" || f.key === "discount_percent" ? "number" : "text"}
                className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            </div>
          ))}
        </div>

        {/* ✅ TYPE IMAGE PICKERS FOR ADD */}
        <div className="mt-8">
          <div className="font-black text-[#0b0f19] text-lg mb-4">Type Images</div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {TYPES.map((type) => {
              const file = typeFiles[type];
              const preview = typePreviews[type];

              return (
                <div
                  key={type}
                  className="relative rounded-3xl border border-gray-200 bg-white overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <div className="text-xs font-black uppercase text-gray-900">{type}</div>
                    <div className="w-8 h-8 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
                      <ImagePlus className="w-4 h-4 text-[#9d4edd]" />
                    </div>
                  </div>

                  {file ? (
                    <div className="relative h-28 bg-gray-100">
                      <img src={preview} className="w-full h-full object-cover" alt="" />
                      <button
                        onClick={() => removePickedTypeFile(type, "add")}
                        className="absolute top-2 right-2 w-9 h-9 rounded-2xl bg-white/95 border border-gray-200 shadow flex items-center justify-center hover:scale-105 transition"
                      >
                        <X className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <label className="block cursor-pointer p-5">
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => onPickTypeFile(type, e.target.files?.[0], "add")}
                      />
                      <div className="rounded-2xl border-2 border-dashed border-gray-300 hover:bg-gray-50 p-5 text-center">
                        <div className="text-sm font-black text-[#0b0f19]">Upload</div>
                        <div className="text-xs font-semibold text-gray-500 mt-1">
                          Click to select
                        </div>
                      </div>
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-4">
          <button
            onClick={saveNewProduct}
            className="px-8 py-4 rounded-2xl bg-[#0b0f19] text-white font-extrabold hover:scale-[1.02] transition"
          >
            Save Product
          </button>

          <button
            onClick={() => {
              setForm({ name: "", subtitle: "", price: "", discount_percent: "" });
              setTypeFiles({});
              setTypePreviews({});
            }}
            className="px-8 py-4 rounded-2xl border border-gray-200 bg-white font-extrabold text-[#0b0f19] hover:bg-gray-50 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* ================= PRODUCT LIST ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-7">
          <div>
            <h3 className="font-black text-xl text-[#0b0f19]">Products List</h3>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              Same card size like Products.jsx
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px]">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-soft">
                <Search className="w-5 h-5 text-[#9d4edd]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none text-[#0b0f19] placeholder:text-gray-400 font-semibold"
                />
              </div>
            </div>

            <div className="w-full sm:w-[220px]">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-soft font-bold text-[#0b0f19] outline-none"
              >
                <option value="default">Sort: Default</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-gray-600 font-semibold">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filtered.map((p) => {
              const imgs = getSliderImages(p.id);
              const index = sliderIndex[p.id] || 0;
              const slide = imgs[index];

              const discount = Number(p.discount_percent || 0);
              const discounted = getDiscountedPrice(p.price, discount);

              return (
                <div
                  key={p.id}
                  className="
                    group relative overflow-hidden
                    rounded-3xl border border-gray-200 bg-white/90 backdrop-blur
                    shadow-soft hover:shadow-[0_30px_70px_rgba(157,78,221,0.12)]
                    transition hover:-translate-y-2
                  "
                >
                  {/* image slider (height increased ✅) */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {slide ? (
                      <img
                        src={`http://localhost:8000/${slide.image}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-extrabold text-gray-500">
                        No Images
                      </div>
                    )}

                    {slide?.type && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-black">
                        {slide.type.toUpperCase()}
                      </div>
                    )}

                    {imgs.length > 1 && (
                      <>
                        <button
                          onClick={() => prevSlide(p.id)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-gray-200 shadow flex items-center justify-center hover:scale-105 transition"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => nextSlide(p.id)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 border border-gray-200 shadow flex items-center justify-center hover:scale-105 transition"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* body */}
                  <div className="p-5">
                    <div className="font-extrabold text-[#0b0f19] text-lg truncate">
                      {p.name}
                    </div>

                    <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {p.subtitle || "No subtitle"}
                    </div>

                    {/* price */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {discount > 0 ? (
                          <>
                            <span className="text-sm text-gray-400 line-through font-semibold">
                              ₹{formatMoney(p.price)}
                            </span>
                            <span className="text-xl font-black text-[#0b0f19]">
                              ₹{formatMoney(discounted)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-[#0b0f19]">
                            ₹{formatMoney(p.price)}
                          </span>
                        )}
                      </div>

                      {discount > 0 && (
                        <span className="text-xs font-black px-3 py-1 rounded-full text-[#1b1400] bg-gradient-to-r from-[#fff7c2] via-[#d4af37] to-[#a87412] border border-white/60 shadow-[0_12px_25px_rgba(212,175,55,0.28)]">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* actions */}
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3 font-extrabold bg-[#9d4edd]/10 text-[#9d4edd] hover:bg-[#9d4edd]/15 transition"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl py-3 font-extrabold bg-red-50 text-red-700 hover:bg-red-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editOpen && editing && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeEdit}
          />
          <div className="relative w-full max-w-3xl rounded-[34px] bg-white border border-gray-200 shadow-[0_40px_120px_rgba(0,0,0,0.22)] overflow-hidden">
            {/* top */}
            <div className="p-6 flex items-start justify-between gap-4 border-b border-gray-200">
              <div>
                <div className="text-sm font-bold text-gray-500">Edit Product</div>
                <div className="text-2xl font-black text-[#0b0f19]">
                  {editing.name}
                </div>
              </div>

              <button
                onClick={closeEdit}
                className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* body */}
            <div className="p-6 space-y-6">
              {/* fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: "name", label: "Product Name" },
                  { key: "subtitle", label: "Subtitle" },
                  { key: "price", label: "Price" },
                  { key: "discount_percent", label: "Discount %" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-sm font-extrabold text-gray-700">
                      {f.label}
                    </label>
                    <input
                      type={f.key === "price" || f.key === "discount_percent" ? "number" : "text"}
                      className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
                      value={editForm[f.key]}
                      onChange={(e) =>
                        setEditForm({ ...editForm, [f.key]: e.target.value })
                      }
                    />
                  </div>
                ))}
              </div>

              {/* edit type images */}
              <div>
                <div className="font-black text-[#0b0f19] text-lg mb-4">
                  Type Images
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                  {TYPES.map((type) => {
                    const picked = editTypeFiles[type];
                    const pickedPreview = editTypePreviews[type];
                    const saved = editTypeImages[type];

                    return (
                      <div
                        key={type}
                        className="relative rounded-3xl border border-gray-200 bg-white overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                          <div className="text-xs font-black uppercase text-gray-900">{type}</div>
                          <div className="w-8 h-8 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
                            <ImagePlus className="w-4 h-4 text-[#9d4edd]" />
                          </div>
                        </div>

                        {(picked || saved) ? (
                          <div className="relative h-28 bg-gray-100">
                            <img
                              src={
                                picked
                                  ? pickedPreview
                                  : `http://localhost:8000/${saved}`
                              }
                              className="w-full h-full object-cover"
                              alt=""
                            />

                            <button
                              onClick={() =>
                                picked
                                  ? removePickedTypeFile(type, "edit")
                                  : deleteTypeImage(type)
                              }
                              className="absolute top-2 right-2 w-9 h-9 rounded-2xl bg-white/95 border border-gray-200 shadow flex items-center justify-center hover:scale-105 transition"
                              title="Remove"
                            >
                              <X className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        ) : (
                          <label className="block cursor-pointer p-5">
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) =>
                                onPickTypeFile(type, e.target.files?.[0], "edit")
                              }
                            />
                            <div className="rounded-2xl border-2 border-dashed border-gray-300 hover:bg-gray-50 p-5 text-center">
                              <div className="text-sm font-black text-[#0b0f19]">
                                Upload
                              </div>
                              <div className="text-xs font-semibold text-gray-500 mt-1">
                                Click to select
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* buttons */}
              <div className="flex gap-4">
                <button
                  onClick={saveEdit}
                  className="flex-1 px-8 py-4 rounded-2xl bg-[#0b0f19] text-white font-extrabold hover:scale-[1.01] transition"
                >
                  Save Changes
                </button>

                <button
                  onClick={closeEdit}
                  className="px-8 py-4 rounded-2xl border border-gray-200 bg-white font-extrabold text-[#0b0f19] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
