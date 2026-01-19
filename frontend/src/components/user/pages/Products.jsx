import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { addToGuestCart } from "../../../utils/cart";
import { useAuth } from "../../../context/AuthContext";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  BadgePercent,
  X,
} from "lucide-react";

/* ================= SIMPLE SCROLL ANIMATION HOOK ================= */
function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    els.forEach((el) => el.setAttribute("data-reveal", "1"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-show");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ================= MONEY FORMAT ================= */
const formatMoney = (value) => {
  const n = Number(value || 0);
  return n.toFixed(2); // ✅ always 2 decimals like 49.50
};

/* ================= DISCOUNT CALC ================= */
const getDiscountedPrice = (price, discount) => {
  const p = Number(price || 0);
  const d = Number(discount || 0);

  if (!d || d <= 0) return p;

  const discounted = p - (p * d) / 100;
  return discounted; // keep decimals
};

const TYPES = ["type1", "type2", "type3", "type4", "type5"];

export default function Products() {
  const { subId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default"); // default | low | high

  /* ✅ modal states */
  const [openType, setOpenType] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [typeImages, setTypeImages] = useState({}); // {type1:path,...}

  useRevealOnScroll();

  useEffect(() => {
    if (!subId) return;
    api
      .get(`/catalog/products/sub/${subId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, [subId]);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let data = [...products];

    if (q.trim()) {
      data = data.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q.toLowerCase()) ||
          (p.subtitle || "").toLowerCase().includes(q.toLowerCase())
      );
    }

    if (sort === "low") data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") data.sort((a, b) => (b.price || 0) - (a.price || 0));

    return data;
  }, [products, q, sort]);

  /* ✅ open modal + fetch type images */
  const openTypeModal = async (product) => {
    setActiveProduct(product);
    setSelectedType("");
    setTypeImages({});
    setOpenType(true);

    try {
      const res = await api.get(
        `/admin/catalog/product/${product.id}/type-images`
      );
      setTypeImages(res.data || {});
    } catch (err) {
      console.error(err);
      setTypeImages({});
    }
  };

  const closeModal = () => {
    setOpenType(false);
    setActiveProduct(null);
    setSelectedType("");
    setTypeImages({});
  };

  /* ✅ Add to cart after selecting type (with image) */
  const confirmType = async () => {
    if (!activeProduct) return;

    if (!selectedType) {
      alert("Please select a type");
      return;
    }

    const selectedTypeImage = typeImages[selectedType];

    try {
      // guest
      if (!user) {
        addToGuestCart({
          ...activeProduct,
          selected_type: selectedType,
          selected_type_image: selectedTypeImage,
        });

        alert(`Added to cart (${selectedType})`);
        closeModal();
        return;
      }

      // logged in
      await api.post("/cart/add", {
        product_id: activeProduct.id,
        quantity: 1,
        type_name: selectedType,
      });

      alert(`Added to cart (${selectedType})`);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="bg-[#fcfcff] overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/20 pb-10">
        <div className="absolute -top-44 -left-44 w-[650px] h-[650px] bg-white/35 rounded-full blur-[170px] animate-pulseSlow" />
        <div className="absolute -bottom-56 -right-56 w-[720px] h-[720px] bg-[#9d4edd]/20 rounded-full blur-[190px] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="rounded-[40px] border border-white/45 bg-white/20 backdrop-blur-xl shadow-[0_30px_110px_rgba(0,0,0,0.15)] px-8 md:px-14 py-14 md:py-16 relative overflow-hidden hero-float">
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -left-52 top-0 w-64 h-full bg-white/20 skew-x-[-18deg] animate-shimmer" />
              </div>

              <div className="flex justify-center mb-8 relative chip-pop">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-extrabold bg-white/35 border border-white/40 hover:bg-white/55 transition"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight relative title-rise">
                Products{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.35)]">
                  Collection
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold relative subtitle-fade">
                Browse products inside this category. Choose your perfect
                accessory with best deals.
              </p>

              <div className="mt-10 flex justify-center flex-wrap gap-3 relative">
                {["Premium", "New", "Trending", "Best Offers"].map((t, i) => (
                  <span
                    key={t}
                    className="px-5 py-2 rounded-full text-sm font-extrabold bg-white/35 backdrop-blur border border-white/40 text-[#0b0f19] shadow-sm chip-pop"
                    style={{ animationDelay: `${i * 140}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-24 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
              Explore Products
            </h2>
            <p className="text-gray-600 mt-2">
              {filtered?.length || 0} product(s) found
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

        {filtered?.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] font-extrabold">
              <Sparkles className="w-5 h-5" /> No products found
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filtered.map((p, idx) => {
              const discount = Number(p.discount_percent || 0);
              const hasDiscount = discount > 0;
              const discountedPrice = getDiscountedPrice(p.price, discount);

              return (
                <div
                  key={p.id}
                  className="
                    reveal group relative overflow-hidden
                    rounded-3xl border border-gray-200 bg-white/85 backdrop-blur
                    shadow-soft hover:shadow-[0_30px_70px_rgba(157,78,221,0.12)]
                    transition hover:-translate-y-2
                  "
                  style={{ transitionDelay: `${idx * 35}ms` }}
                >
                  {/* image */}
                  <div
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="relative h-44 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={
                        p.image
                          ? `http://localhost:8000/${p.image}`
                          : "https://via.placeholder.com/400x300?text=No+Image"
                      }
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute -left-24 top-0 w-40 h-full bg-white/20 skew-x-[-20deg] animate-shimmer" />
                    </div>

                    {hasDiscount && (
                      <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0b0f19]/75 text-white text-xs font-extrabold backdrop-blur">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* body */}
                  <div className="p-5">
                    <h3 className="font-extrabold text-[#0b0f19] text-lg line-clamp-1">
                      {p.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {p.subtitle || "Best quality accessories for your device"}
                    </p>

                    {/* ✅ price with 2 decimals */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {hasDiscount ? (
                          <>
                            <span className="text-sm text-gray-400 line-through font-semibold">
                              ₹{formatMoney(p.price)}
                            </span>
                            <span className="text-xl font-black text-[#0b0f19]">
                              ₹{formatMoney(discountedPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-[#0b0f19]">
                            ₹{formatMoney(p.price)}
                          </span>
                        )}
                      </div>

                      <div
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="cursor-pointer inline-flex items-center gap-2 text-xs font-bold text-[#9d4edd]"
                      >
                        View <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* ✅ Add to Cart -> Type modal */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openTypeModal(p);
                      }}
                      className="mt-4 w-full bg-[#0b0f19] text-white py-3 rounded-2xl font-extrabold hover:scale-[1.02] transition shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                    >
                      Add to Cart
                    </button>

                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-extrabold text-[#0b0f19]/70">
                      <BadgePercent className="w-4 h-4 text-[#9d4edd]" />
                      Choose type before adding
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ✅ TYPE IMAGE MODAL */}
      {openType && activeProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-[34px] bg-white border border-gray-200 shadow-[0_40px_120px_rgba(0,0,0,0.22)] overflow-hidden">
            <div className="p-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-gray-500">Select Type</div>
                <div className="text-2xl font-black text-[#0b0f19]">
                  {activeProduct.name}
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {TYPES.filter((t) => !!typeImages[t]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`relative overflow-hidden rounded-2xl border transition text-left ${
                      selectedType === t
                        ? "border-[#9d4edd] ring-2 ring-[#9d4edd]/30"
                        : "border-gray-200 hover:border-[#d4af37]"
                    }`}
                  >
                    <div className="h-28 bg-gray-100">
                      <img
                        src={`http://localhost:8000/${typeImages[t]}`}
                        className="w-full h-full object-cover"
                        alt={t}
                      />
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-black text-[#0b0f19] uppercase">
                        {t}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {TYPES.filter((t) => !!typeImages[t]).length === 0 && (
                <div className="text-center py-10 text-gray-600 font-semibold">
                  No type images uploaded for this product.
                </div>
              )}

              <button
                disabled={!selectedType}
                onClick={confirmType}
                className={`mt-6 w-full rounded-2xl py-4 font-black transition shadow-[0_20px_55px_rgba(0,0,0,0.22)]
                  ${
                    selectedType
                      ? "bg-[#0b0f19] text-white hover:scale-[1.01]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                Confirm Add ({selectedType || "Select Type"})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ANIMATION CSS ================= */}
      <style>
        {`
          .reveal { opacity: 1; transform: translateY(0); transition: opacity .7s ease, transform .7s ease; }
          .reveal[data-reveal="1"] { opacity: 0; transform: translateY(22px); }
          .reveal-show { opacity: 1 !important; transform: translateY(0) !important; }

          @keyframes heroFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .hero-float { animation: heroFloat 6s ease-in-out infinite; }

          @keyframes rise { 0% { opacity: 0; transform: translateY(24px); } 100% { opacity: 1; transform: translateY(0); } }
          .title-rise { animation: rise .9s ease-out both; }
          .subtitle-fade { animation: rise 1.1s ease-out both; animation-delay: .15s; }

          @keyframes chipPop { 0% { opacity: 0; transform: translateY(10px) scale(.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
          .chip-pop { animation: chipPop .7s ease-out both; }

          @keyframes shimmer { 0% { transform: translateX(-140%) skewX(-20deg); } 100% { transform: translateX(260%) skewX(-20deg); } }
          .animate-shimmer { animation: shimmer 2.2s infinite; }

          @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: floaty 6s ease-in-out infinite; }

          @keyframes pulseSlow { 0%,100% { opacity: .45; } 50% { opacity: .8; } }
          .animate-pulseSlow { animation: pulseSlow 4s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
