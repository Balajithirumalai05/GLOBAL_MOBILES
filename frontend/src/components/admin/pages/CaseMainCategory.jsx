import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { Search, Plus, Pencil, Trash2, X, ChevronRight } from "lucide-react";

export default function CaseMainCategory() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const [name, setName] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchData = async () => {
    const res = await api.get("/admin/cases/main-categories");
    setRows(res.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    return rows.filter((r) =>
      (r.name || "").toLowerCase().includes(q.toLowerCase())
    );
  }, [rows, q]);

  /* ✅ ADD */
  const add = async () => {
    try {
      if (!name.trim()) return alert("Enter name (Eg: iPhone)");

      const fd = new FormData();
      fd.append("name", name);

      await api.post("/admin/cases/main-category", fd);

      setName("");
      fetchData();
      alert("Saved ✅");
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    }
  };

  /* ✅ EDIT */
  const openEdit = (row) => {
    setEditing(row);
    setEditName(row.name || "");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      if (!editing) return;
      if (!editName.trim()) return alert("Enter name");

      const fd = new FormData();
      fd.append("name", editName);

      await api.put(`/admin/cases/main-category/${editing.id}`, fd);

      setEditOpen(false);
      setEditing(null);
      setEditName("");
      fetchData();
      alert("Updated ✅");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  /* ✅ DELETE */
  const remove = async (id) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;

    await api.delete(`/admin/cases/main-category/${id}`);
    fetchData();
  };

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
            Case Main Category
          </h1>
          <p className="text-gray-600 font-semibold mt-2">
            Add phone names like iPhone, Samsung, Redmi...
          </p>
        </div>

        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19]">
          Total: {filtered.length}
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <h2 className="font-black text-xl text-[#0b0f19]">
          Add New Case Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <label className="text-sm font-extrabold text-gray-700">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Eg: iPhone"
              className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={add}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0b0f19] text-white font-extrabold hover:scale-[1.02] transition"
            >
              <Plus className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft px-6 py-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-[#9d4edd]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search phone categories..."
          className="w-full bg-transparent outline-none font-semibold text-[#0b0f19] placeholder:text-gray-400"
        />
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-14 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] font-extrabold">
            No categories found
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden hover:-translate-y-1 transition"
            >
              <button
                onClick={() => navigate(`/admin/case-models/${row.id}`)}
                className="w-full text-left"
              >
                <div className="p-6">
                  <div className="font-black text-[#0b0f19] text-xl truncate">
                    {row.name}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-2 inline-flex items-center gap-2">
                    Manage phones/models <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>

              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => openEdit(row)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 font-extrabold text-sm hover:border-[#9d4edd]/60 transition"
                >
                  <Pencil className="w-4 h-4 text-[#9d4edd]" />
                  Edit
                </button>

                <button
                  onClick={() => remove(row.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 font-extrabold text-sm text-red-700 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-[28px] bg-white border border-gray-200 shadow-[0_40px_120px_rgba(0,0,0,0.22)] overflow-hidden">
            <div className="p-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-gray-500">Edit</div>
                <div className="text-2xl font-black text-[#0b0f19]">
                  Case Main Category
                </div>
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-extrabold text-gray-700">
                  Name
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
                />
              </div>

              <button
                onClick={saveEdit}
                className="w-full rounded-2xl py-4 font-black bg-[#0b0f19] text-white hover:scale-[1.01] transition shadow-[0_20px_55px_rgba(0,0,0,0.22)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
