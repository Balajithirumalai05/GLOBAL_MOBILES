import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CaseModels() {
  const { mainId } = useParams();
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [phones, setPhones] = useState([]);
  const [models, setModels] = useState([]);

  const [activePhone, setActivePhone] = useState(null);

  const [qPhone, setQPhone] = useState("");
  const [qModel, setQModel] = useState("");

  // add
  const [phoneName, setPhoneName] = useState("");
  const [modelName, setModelName] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editType, setEditType] = useState(""); // "phone" | "model"
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState("");

  /* ================= FETCH ================= */
  const fetchPhones = async () => {
    const res = await api.get(`/admin/cases/phones/by-main/${mainId}`);
    setPhones(res.data || []);
  };

  const fetchModels = async (phoneId) => {
    const res = await api.get(`/admin/cases/models/by-phone/${phoneId}`);
    setModels(res.data || []);
  };

  useEffect(() => {
    if (!mainId) return;
    fetchPhones();
  }, [mainId]);

  /* ================= FILTER ================= */
  const filteredPhones = useMemo(() => {
    if (!qPhone.trim()) return phones;
    return phones.filter((p) =>
      (p.name || "").toLowerCase().includes(qPhone.toLowerCase())
    );
  }, [phones, qPhone]);

  const filteredModels = useMemo(() => {
    if (!qModel.trim()) return models;
    return models.filter((m) =>
      (m.name || "").toLowerCase().includes(qModel.toLowerCase())
    );
  }, [models, qModel]);

  /* ================= PHONE CRUD ================= */
  const addPhone = async () => {
    try {
      if (!phoneName.trim()) return alert("Enter phone name (Eg: iPhone 16)");

      const fd = new FormData();
      fd.append("name", phoneName);
      fd.append("case_main_category_id", mainId);

      await api.post("/admin/cases/phone", fd);

      setPhoneName("");
      fetchPhones();
      alert("Phone added ✅");
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  const deletePhone = async (id) => {
    const ok = window.confirm("Delete this phone?");
    if (!ok) return;

    await api.delete(`/admin/cases/phone/${id}`);

    // reset models if deleted active phone
    if (activePhone?.id === id) {
      setActivePhone(null);
      setModels([]);
    }

    fetchPhones();
  };

  /* ================= MODEL CRUD ================= */
  const addModel = async () => {
    try {
      if (!activePhone) return alert("Select a phone first");
      if (!modelName.trim()) return alert("Enter model name (Eg: 16 Pro)");

      const fd = new FormData();
      fd.append("name", modelName);
      fd.append("case_phone_id", activePhone.id);

      await api.post("/admin/cases/model", fd);

      setModelName("");
      fetchModels(activePhone.id);
      alert("Model added ✅");
    } catch (err) {
      console.error(err);
      alert("Failed ❌");
    }
  };

  const deleteModel = async (id) => {
    const ok = window.confirm("Delete this model?");
    if (!ok) return;

    await api.delete(`/admin/cases/model/${id}`);
    if (activePhone) fetchModels(activePhone.id);
  };

  /* ================= EDIT ================= */
  const openEdit = (type, row) => {
    setEditType(type);
    setEditing(row);
    setEditValue(row?.name || "");
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      if (!editing) return;
      if (!editValue.trim()) return alert("Enter name");

      const fd = new FormData();
      fd.append("name", editValue);

      if (editType === "phone") {
        await api.put(`/admin/cases/phone/${editing.id}`, fd);
        fetchPhones();
      }

      if (editType === "model") {
        await api.put(`/admin/cases/model/${editing.id}`, fd);
        if (activePhone) fetchModels(activePhone.id);
      }

      setEditOpen(false);
      setEditing(null);
      setEditValue("");
      alert("Updated ✅");
    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <button
            onClick={() => navigate("/admin/case-main-category")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19] hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-4 h-4 text-[#9d4edd]" />
            Back
          </button>

          <h1 className="mt-5 text-3xl md:text-4xl font-black text-[#0b0f19]">
            Phones & Models
          </h1>

          <p className="text-gray-600 font-semibold mt-2">
            Add phones (ex: iPhone 16) → then add models (ex: 16 Pro).
          </p>
        </div>
      </div>

      {/* ================= PHONES SECTION ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <h2 className="font-black text-xl text-[#0b0f19]">Phones</h2>

        {/* add phone */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2">
            <label className="text-sm font-extrabold text-gray-700">
              Phone Name
            </label>
            <input
              value={phoneName}
              onChange={(e) => setPhoneName(e.target.value)}
              placeholder="Eg: iPhone 16"
              className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={addPhone}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0b0f19] text-white font-extrabold hover:scale-[1.02] transition"
            >
              <Plus className="w-5 h-5" />
              Add Phone
            </button>
          </div>
        </div>

        {/* search phone */}
        <div className="mt-7 bg-white rounded-2xl border border-gray-200 px-5 py-3 flex items-center gap-3 shadow-soft">
          <Search className="w-5 h-5 text-[#9d4edd]" />
          <input
            value={qPhone}
            onChange={(e) => setQPhone(e.target.value)}
            placeholder="Search phones..."
            className="w-full bg-transparent outline-none font-semibold text-[#0b0f19] placeholder:text-gray-400"
          />
        </div>

        {/* phone cards */}
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
          {filteredPhones.map((p) => (
            <div
              key={p.id}
              className={`rounded-3xl border overflow-hidden shadow-soft bg-white hover:-translate-y-1 transition
                ${
                  activePhone?.id === p.id
                    ? "border-[#9d4edd] ring-2 ring-[#9d4edd]/25"
                    : "border-gray-200"
                }
              `}
            >
              <button
                onClick={() => {
                  setActivePhone(p);
                  fetchModels(p.id);
                }}
                className="w-full text-left"
              >
                <div className="p-6">
                  <div className="font-black text-xl text-[#0b0f19] truncate">
                    {p.name}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-2 inline-flex items-center gap-2">
                    Manage models <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>

              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={() => openEdit("phone", p)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 font-extrabold text-sm hover:border-[#9d4edd]/60 transition"
                >
                  <Pencil className="w-4 h-4 text-[#9d4edd]" />
                  Edit
                </button>

                <button
                  onClick={() => deletePhone(p.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 font-extrabold text-sm text-red-700 hover:bg-red-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPhones.length === 0 && (
          <div className="mt-8 text-center text-gray-600 font-semibold">
            No phones found.
          </div>
        )}
      </div>

      {/* ================= MODELS SECTION ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <h2 className="font-black text-xl text-[#0b0f19]">
          Models {activePhone ? `(${activePhone.name})` : ""}
        </h2>

        {!activePhone ? (
          <div className="mt-6 text-gray-600 font-semibold">
            Select a phone above to view / add models.
          </div>
        ) : (
          <>
            {/* add model */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-2">
                <label className="text-sm font-extrabold text-gray-700">
                  Model Name
                </label>
                <input
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="Eg: 16 Pro"
                  className="mt-2 w-full border border-gray-200 rounded-2xl px-5 py-4 font-semibold outline-none focus:border-[#9d4edd]/60 transition"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={addModel}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0b0f19] text-white font-extrabold hover:scale-[1.02] transition"
                >
                  <Plus className="w-5 h-5" />
                  Add Model
                </button>
              </div>
            </div>

            {/* search model */}
            <div className="mt-7 bg-white rounded-2xl border border-gray-200 px-5 py-3 flex items-center gap-3 shadow-soft">
              <Search className="w-5 h-5 text-[#9d4edd]" />
              <input
                value={qModel}
                onChange={(e) => setQModel(e.target.value)}
                placeholder="Search models..."
                className="w-full bg-transparent outline-none font-semibold text-[#0b0f19] placeholder:text-gray-400"
              />
            </div>

            {/* model cards */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
              {filteredModels.map((m) => (
                <div
                  key={m.id}
                  className="rounded-3xl border border-gray-200 bg-white shadow-soft overflow-hidden hover:-translate-y-1 transition"
                >
                  <div className="p-6">
                    <div className="font-black text-xl text-[#0b0f19] truncate">
                      {m.name}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold mt-2">
                      Model under {activePhone.name}
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex gap-3">
                    <button
                      onClick={() => openEdit("model", m)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 font-extrabold text-sm hover:border-[#9d4edd]/60 transition"
                    >
                      <Pencil className="w-4 h-4 text-[#9d4edd]" />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteModel(m.id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 font-extrabold text-sm text-red-700 hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <div className="mt-8 text-center text-gray-600 font-semibold">
                No models found.
              </div>
            )}
          </>
        )}
      </div>

      {/* ================= EDIT MODAL ================= */}
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
                  {editType === "phone" ? "Phone Name" : "Model Name"}
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
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
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
