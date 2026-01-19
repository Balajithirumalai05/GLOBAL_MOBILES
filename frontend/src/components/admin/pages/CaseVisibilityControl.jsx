import { useEffect, useState } from "react";
import api from "../../../api";
import {
  Eye,
  Smartphone,
  Layers3,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function CaseVisibilityControl() {
  const [caseCategories, setCaseCategories] = useState([]);
  const [phones, setPhones] = useState([]);
  const [models, setModels] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedCaseCat, setSelectedCaseCat] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/admin/cases/main-categories")
      .then((res) => setCaseCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const fetchPhones = async (caseCategoryId) => {
    try {
      const res = await api.get(
        `/admin/cases/phones/by-main/${caseCategoryId}`
      );
      setPhones(res.data);
      setModels([]);
      setVariants([]);
      setSelectedPhone("");
      setSelectedModel("");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModels = async (phoneId) => {
    try {
      const res = await api.get(`/admin/cases/models/by-phone/${phoneId}`);
      setModels(res.data);
      setVariants([]);
      setSelectedModel("");
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVariants = async (modelId) => {
    try {
      const res = await api.get(
        `/admin/cases/variants/by-model/${modelId}`
      );
      setVariants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TOGGLES ================= */
  const toggleCaseCategory = async (id, value) => {
    const fd = new FormData();
    fd.append("is_active", value);
    await api.put(`/admin/cases/main-category/${id}/toggle`, fd);
  };

  const togglePhone = async (id, value) => {
    const fd = new FormData();
    fd.append("is_active", value);
    await api.put(`/admin/cases/phone/${id}/toggle`, fd);
  };

  const toggleModel = async (id, value) => {
    const fd = new FormData();
    fd.append("is_active", value);
    await api.put(`/admin/cases/model/${id}/toggle`, fd);
  };

  const toggleVariant = async (id, value) => {
    const fd = new FormData();
    fd.append("is_active", value);
    await api.put(`/admin/cases/variant/${id}/toggle`, fd);
  };

  const switchUI = (checked) =>
    checked ? (
      <span className="inline-flex items-center gap-2 text-green-700 font-extrabold text-sm">
        <CheckCircle2 className="w-5 h-5" /> Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 text-red-700 font-extrabold text-sm">
        <XCircle className="w-5 h-5" /> Disabled
      </span>
    );

  return (
    <div className="space-y-10">
      {/* ================= CASE MAIN CATEGORY ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7">
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-[#9d4edd]" />
          <h2 className="text-xl font-black text-[#0b0f19]">
            Case Main Categories Visibility
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-2xl border border-gray-200 px-5 py-4"
            >
              <button
                onClick={() => {
                  setSelectedCaseCat(cat.id);
                  fetchPhones(cat.id);
                }}
                className="font-extrabold text-[#0b0f19] hover:text-[#9d4edd] transition"
              >
                {cat.name}
              </button>

              <label className="inline-flex items-center gap-3 cursor-pointer">
                {switchUI(cat.is_active)}
                <input
                  type="checkbox"
                  checked={!!cat.is_active}
                  onChange={(e) => {
                    toggleCaseCategory(cat.id, e.target.checked);
                    cat.is_active = e.target.checked;
                    setCaseCategories([...caseCategories]);
                  }}
                  className="w-5 h-5"
                />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* ================= PHONES ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-6 h-6 text-[#9d4edd]" />
          <h2 className="text-xl font-black text-[#0b0f19]">
            Phones (Click case category to load)
          </h2>
        </div>

        {phones.length === 0 ? (
          <div className="text-gray-500 font-semibold">
            Select a Case Category first
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phones.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-5 py-4"
              >
                <button
                  onClick={() => {
                    setSelectedPhone(p.id);
                    fetchModels(p.id);
                  }}
                  className="font-extrabold text-[#0b0f19] hover:text-[#9d4edd] transition"
                >
                  {p.name}
                </button>

                <label className="inline-flex items-center gap-3 cursor-pointer">
                  {switchUI(p.is_active)}
                  <input
                    type="checkbox"
                    checked={!!p.is_active}
                    onChange={(e) => {
                      togglePhone(p.id, e.target.checked);
                      p.is_active = e.target.checked;
                      setPhones([...phones]);
                    }}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= MODELS ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7">
        <div className="flex items-center gap-3 mb-6">
          <Layers3 className="w-6 h-6 text-[#9d4edd]" />
          <h2 className="text-xl font-black text-[#0b0f19]">
            Models (Click phone to load)
          </h2>
        </div>

        {models.length === 0 ? (
          <div className="text-gray-500 font-semibold">
            Select a Phone first
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-5 py-4"
              >
                <button
                  onClick={() => {
                    setSelectedModel(m.id);
                    fetchVariants(m.id);
                  }}
                  className="font-extrabold text-[#0b0f19] hover:text-[#9d4edd] transition"
                >
                  {m.name}
                </button>

                <label className="inline-flex items-center gap-3 cursor-pointer">
                  {switchUI(m.is_active)}
                  <input
                    type="checkbox"
                    checked={!!m.is_active}
                    onChange={(e) => {
                      toggleModel(m.id, e.target.checked);
                      m.is_active = e.target.checked;
                      setModels([...models]);
                    }}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= VARIANTS ================= */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7">
        <h2 className="text-xl font-black text-[#0b0f19] mb-6">
          Variants (Type1–Type5)
        </h2>

        {variants.length === 0 ? (
          <div className="text-gray-500 font-semibold">
            Select a Model first
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variants.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-2xl border border-gray-200 px-5 py-4"
              >
                <div className="font-extrabold text-[#0b0f19]">
                  {v.type_name}
                </div>

                <label className="inline-flex items-center gap-3 cursor-pointer">
                  {switchUI(v.is_active)}
                  <input
                    type="checkbox"
                    checked={!!v.is_active}
                    onChange={(e) => {
                      toggleVariant(v.id, e.target.checked);
                      v.is_active = e.target.checked;
                      setVariants([...variants]);
                    }}
                    className="w-5 h-5"
                  />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
