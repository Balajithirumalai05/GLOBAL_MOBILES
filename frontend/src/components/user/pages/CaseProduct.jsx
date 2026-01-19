import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { addToGuestCart } from "../../../utils/cart";
import { useAuth } from "../../../context/AuthContext";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";

const TYPES = ["type1", "type2", "type3", "type4", "type5"];

/* ================= PRICE HELPERS ================= */
const getDiscountedPrice = (price, discount) => {
  const p = Number(price || 0);
  const d = Number(discount || 0);
  if (!d || d <= 0) return p;
  return p - (p * d) / 100;
};

const formatMoney = (value) => Number(value || 0).toFixed(2);

export default function CaseProduct() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [caseProduct, setCaseProduct] = useState(null);

  const [variants, setVariants] = useState({}); // {type1:path,...}
  const [selectedType, setSelectedType] = useState("");

  const [mainCats, setMainCats] = useState([]);
  const [phones, setPhones] = useState([]);
  const [models, setModels] = useState([]);

  const [selectedMain, setSelectedMain] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  const [allowedModels, setAllowedModels] = useState([]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    if (!caseId) return;

    (async () => {
      try {
        const all = await api.get("/cases/products");
        const found = (all.data || []).find((x) => String(x.id) === String(caseId));
        setCaseProduct(found || null);

        const v = await api.get(`/cases/product/${caseId}/variants`);
        setVariants(v.data || {});
      } catch (err) {
        console.error(err);
      }
    })();
  }, [caseId]);

  /* ================= FETCH MAIN CATEGORIES ================= */
  useEffect(() => {
    api
      .get("/cases/main-categories")
      .then((res) => setMainCats(res.data))
      .catch((e) => console.error(e));
  }, []);

  /* ================= FETCH PHONES ================= */
  useEffect(() => {
    if (!selectedMain) {
      setPhones([]);
      setSelectedPhone("");
      return;
    }

    api
      .get(`/cases/phones/by-main/${selectedMain}`)
      .then((res) => setPhones(res.data))
      .catch((e) => console.error(e));
  }, [selectedMain]);

  /* ================= FETCH MODELS ================= */
  useEffect(() => {
    if (!selectedPhone) {
      setModels([]);
      setSelectedModel("");
      return;
    }

    api
      .get(`/cases/models/by-phone/${selectedPhone}`)
      .then((res) => setModels(res.data))
      .catch((e) => console.error(e));
  }, [selectedPhone]);

  /* ================= FETCH ALLOWED MODELS FOR THIS CASE PRODUCT ================= */
  useEffect(() => {
    if (!caseId) return;

    api
      .get(`/cases/product/${caseId}/allowed-models`)
      .then((res) => setAllowedModels(res.data || []))
      .catch((e) => console.error(e));
  }, [caseId]);

  /* ================= FILTER MODELS BASED ON MAPPING ================= */
  const filteredModels = useMemo(() => {
    if (!selectedMain || !selectedPhone) return [];

    const allowedIds = new Set(
      allowedModels
        .filter(
          (x) =>
            String(x.case_main_category_id) === String(selectedMain) &&
            String(x.case_phone_id) === String(selectedPhone)
        )
        .map((x) => String(x.case_model_id))
    );

    return models.filter((m) => allowedIds.has(String(m.id)));
  }, [models, allowedModels, selectedMain, selectedPhone]);

  /* ================= SELECT DEFAULT TYPE ================= */
  useEffect(() => {
    if (!selectedType) {
      const first = TYPES.find((t) => !!variants[t]);
      if (first) setSelectedType(first);
    }
  }, [variants, selectedType]);

  const submitAddToCart = async () => {
    if (!caseProduct) return;

    if (!selectedMain) return alert("Select Main Category");
    if (!selectedPhone) return alert("Select Phone Name");
    if (!selectedModel) return alert("Select Model");
    if (!selectedType) return alert("Select Variant Type");

    // ✅ optional: check selected model exists in mapping
    const ok = allowedModels.some(
      (x) => String(x.case_model_id) === String(selectedModel)
    );
    if (!ok) return alert("This case is not available for selected model");

    try {
      // guest cart
      if (!user) {
        addToGuestCart({
          id: `case_${caseProduct.id}_${selectedModel}_${selectedType}`,
          name: caseProduct.title,
          subtitle: caseProduct.subtitle,
          price: getDiscountedPrice(caseProduct.price, caseProduct.discount_percent),
          is_case: true,
          case_product_id: caseProduct.id,
          selected_type: selectedType,
          selected_variant_image: variants[selectedType],
          selected_main: selectedMain,
          selected_phone: selectedPhone,
          selected_model: selectedModel,
          quantity: 1,
        });

        alert("Added case to cart ✅");
        return;
      }

      // user cart -> you can create new endpoint later
      alert("User cart API not created for cases yet ✅ (guest works now)");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  if (!caseProduct) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center text-gray-600 font-semibold">
        Loading case...
      </div>
    );
  }

  const discount = Number(caseProduct.discount_percent || 0);
  const discounted = getDiscountedPrice(caseProduct.price, discount);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* header */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19] hover:bg-gray-50 transition"
        >
          <ArrowLeft className="w-4 h-4 text-[#9d4edd]" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* left: images */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6">
          <div className="text-xl font-black text-[#0b0f19]">
            {caseProduct.title}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-3">
            {/* thumbnails */}
            <div className="col-span-1 flex flex-col gap-3">
              {TYPES.filter((t) => !!variants[t]).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`rounded-2xl overflow-hidden border transition ${
                    selectedType === t
                      ? "border-[#9d4edd] ring-2 ring-[#9d4edd]/30"
                      : "border-gray-200 hover:border-[#d4af37]"
                  }`}
                >
                  <img
                    src={`http://localhost:8000/${variants[t]}`}
                    className="w-full h-16 object-cover"
                    alt={t}
                  />
                </button>
              ))}
            </div>

            {/* main image */}
            <div className="col-span-4 rounded-3xl overflow-hidden border border-gray-200 bg-gray-100">
              {selectedType && variants[selectedType] ? (
                <img
                  src={`http://localhost:8000/${variants[selectedType]}`}
                  className="w-full h-[420px] object-cover"
                  alt=""
                />
              ) : (
                <div className="w-full h-[420px] flex items-center justify-center font-extrabold text-gray-500">
                  <Sparkles className="w-5 h-5 mr-2" />
                  No variant images uploaded
                </div>
              )}
            </div>
          </div>
        </div>

        {/* right: selection */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-6">
          <div className="text-2xl font-black text-[#0b0f19]">
            {caseProduct.title}
          </div>

          <div className="text-sm text-gray-600 font-semibold mt-2">
            {caseProduct.subtitle || "Premium Phone Case"}
          </div>

          {/* price */}
          <div className="mt-5">
            {discount > 0 ? (
              <div className="flex items-center gap-3">
                <div className="text-lg font-extrabold text-gray-400 line-through">
                  ₹{formatMoney(caseProduct.price)}
                </div>
                <div className="text-3xl font-black text-[#0b0f19]">
                  ₹{formatMoney(discounted)}
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full text-[#1b1400] bg-gradient-to-r from-[#fff7c2] via-[#d4af37] to-[#a87412] border border-white/60 shadow-[0_12px_25px_rgba(212,175,55,0.28)]">
                  {discount}% OFF
                </span>
              </div>
            ) : (
              <div className="text-3xl font-black text-[#0b0f19]">
                ₹{formatMoney(caseProduct.price)}
              </div>
            )}
          </div>

          {/* selects */}
          <div className="mt-8 space-y-4">
            <select
              value={selectedMain}
              onChange={(e) => setSelectedMain(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 font-bold outline-none"
            >
              <option value="">Choose Main Category</option>
              {mainCats.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <select
              value={selectedPhone}
              onChange={(e) => setSelectedPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 font-bold outline-none"
              disabled={!selectedMain}
            >
              <option value="">Choose Phone Name</option>
              {phones.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 font-bold outline-none"
              disabled={!selectedPhone}
            >
              <option value="">Choose Model</option>
              {filteredModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            {/* variant types */}
            <div className="pt-2">
              <div className="font-black text-[#0b0f19] mb-2">
                Choose Variant
              </div>

              <div className="flex flex-wrap gap-3">
                {TYPES.filter((t) => !!variants[t]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-5 py-3 rounded-2xl border font-extrabold transition ${
                      selectedType === t
                        ? "bg-[#0b0f19] text-white border-[#0b0f19]"
                        : "bg-white border-gray-200 hover:border-[#9d4edd]"
                    }`}
                  >
                    {t.toUpperCase()}
                    <ChevronRight className="inline w-4 h-4 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* add */}
            <button
              onClick={submitAddToCart}
              className="w-full py-4 rounded-2xl bg-[#0b0f19] text-white font-black hover:scale-[1.01] transition shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
