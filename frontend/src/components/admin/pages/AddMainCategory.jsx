import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { Search, Pencil, Trash2, X } from "lucide-react";

export default function AddMainCategory() {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [q, setQ] = useState("");

  const navigate = useNavigate();

  const fetchCategories = async () => {
    const res = await api.get("/admin/catalog/main-categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setPreview(`http://localhost:8000/${editing.image}`);
      setImage(null);
    }
  }, [editing]);

  const onPickFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setImage(null);
    setPreview(null);
  };

  const submit = async () => {
    if (!name.trim()) return alert("Enter category name");

    const fd = new FormData();
    fd.append("name", name);
    if (image) fd.append("image", image);

    if (editing) {
      await api.put(`/admin/catalog/main-category/${editing.id}`, fd);
      setEditing(null);
    } else {
      await api.post("/admin/catalog/main-category", fd);
    }

    resetForm();
    fetchCategories();
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await api.delete(`/admin/catalog/main-category/${id}`);
    fetchCategories();
  };

  const removeImage = async () => {
    await api.delete(`/admin/catalog/main-category/${editing.id}/image`);
    setPreview(null);
  };

  const filtered = useMemo(() => {
    if (!q.trim()) return categories;
    return categories.filter((c) =>
      (c.name || "").toLowerCase().includes(q.toLowerCase())
    );
  }, [categories, q]);

  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
            Main Categories
          </h1>
          <p className="text-gray-600 font-semibold mt-2">
            Add and manage categories for your shop.
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19]">
          Total: {filtered.length}
        </div>
      </div>

      {/* ================= FORM (TOP) ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="font-black text-xl text-[#0b0f19]">
            {editing ? "Edit Main Category" : "Add Main Category"}
          </h2>

          {editing && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 font-extrabold text-sm transition"
            >
              <X className="w-4 h-4" />
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* name */}
          <div className="md:col-span-1">
            <label className="text-sm font-extrabold text-gray-700">
              Category Name
            </label>
            <input
              className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
              placeholder="Eg: Covers"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* image */}
          <div className="md:col-span-1">
            <label className="text-sm font-extrabold text-gray-700">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="mt-3 w-full text-sm font-semibold"
              onChange={(e) => onPickFile(e.target.files?.[0])}
            />
            <div className="text-xs text-gray-500 font-semibold mt-2">
              PNG / JPG recommended
            </div>
          </div>

          {/* submit */}
          <div className="md:col-span-1 flex items-end">
            <button
              onClick={submit}
              className="
                w-full py-4 rounded-2xl
                bg-[#0b0f19] text-white font-extrabold
                hover:scale-[1.02] transition
              "
            >
              {editing ? "Update Category" : "Save Category"}
            </button>
          </div>
        </div>

        {/* preview (below) */}
        {preview && (
          <div className="mt-6 relative rounded-3xl overflow-hidden border border-gray-200 max-w-md">
            <img src={preview} alt="preview" className="w-full h-44 object-cover" />

            {editing && (
              <button
                onClick={removeImage}
                className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-white/90 border border-gray-200 flex items-center justify-center hover:scale-105 transition"
                title="Remove Image"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= SEARCH (BELOW FORM) ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft px-6 py-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#9d4edd]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search categories..."
          className="w-full bg-transparent outline-none font-semibold text-[#0b0f19] placeholder:text-gray-400"
        />
      </div>

      {/* ================= LIST (BOTTOM) ================= */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-14 text-center">
          <div
            className="
              inline-flex items-center gap-2 px-5 py-2 rounded-full
              bg-[#9d4edd]/10 text-[#9d4edd] font-extrabold
            "
          >
            No categories found
          </div>
          <div className="mt-3 text-gray-600 font-semibold text-sm">
            Try searching something else.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden hover:-translate-y-1 transition"
            >
              {/* image click */}
              <button
                onClick={() => navigate(`/admin/sub-category/${cat.id}`)}
                className="w-full text-left"
              >
                <div className="relative h-44 bg-gray-100">
                  <img
                    src={`http://localhost:8000/${cat.image}`}
                    className="w-full h-full object-cover"
                    alt={cat.name}
                  />

                  {/* gold label */}
                  <div
                    className="
                      absolute top-3 left-3 px-4 py-2 rounded-2xl
                      text-xs font-black text-[#1b1400]
                      bg-gradient-to-r from-[#fff7c2] via-[#d4af37] to-[#a87412]
                      shadow-[0_14px_35px_rgba(212,175,55,0.35)]
                      border border-white/60
                    "
                  >
                    MAIN
                  </div>
                </div>

                <div className="p-5">
                  <div className="font-black text-[#0b0f19] text-lg truncate">
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">
                    Open sub-categories →
                  </div>
                </div>
              </button>

              {/* actions */}
              <div className="px-5 pb-5 flex gap-3">
                <button
                  onClick={() => setEditing(cat)}
                  className="
                    flex-1 inline-flex items-center justify-center gap-2
                    px-4 py-3 rounded-2xl border border-gray-200
                    font-extrabold text-sm
                    hover:border-[#9d4edd]/60 transition
                  "
                >
                  <Pencil className="w-4 h-4 text-[#9d4edd]" />
                  Edit
                </button>

                <button
                  onClick={() => remove(cat.id)}
                  className="
                    inline-flex items-center justify-center gap-2
                    px-4 py-3 rounded-2xl
                    bg-red-50 border border-red-200
                    font-extrabold text-sm text-red-700
                    hover:bg-red-100 transition
                  "
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
