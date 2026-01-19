import { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import { addToGuestCart } from "../../../utils/cart";
import { useAuth } from "../../../context/AuthContext";
import { Search, Sparkles, BadgePercent, ArrowRight, X } from "lucide-react";

const TYPES = ["type1", "type2", "type3", "type4", "type5"];

/* ================= SIMPLE SCROLL REVEAL ================= */
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

/* ================= PRICE FORMAT ================= */
const formatMoney = (value) => {
  const n = Number(value || 0);
  return n.toFixed(2); // ✅ always show 2 decimals
};

/* ================= DISCOUNT CALC ================= */
const getDiscountedPrice = (price, discount) => {
  const p = Number(price || 0);
  const d = Number(discount || 0);

  if (!d || d <= 0) return p;

  const discounted = p - (p * d) / 100;
  return discounted; // keep decimals here
};

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");
  const [onlyOffers, setOnlyOffers] = useState(false);

  /* ✅ TYPE MODAL STATES */
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [typeImages, setTypeImages] = useState({});
  const [selectedType, setSelectedType] = useState("");

  const { user } = useAuth();

  useRevealOnScroll();

  useEffect(() => {
    api.get("/catalog/products").then((res) => setProducts(res.data));
  }, []);

  /* ================= FILTER + SORT ================= */
  const filtered = useMemo(() => {
    let data = [...products];

    if (q.trim()) {
      data = data.filter((p) =>
        `${p.name || ""} ${p.subtitle || ""}`
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    }

    if (onlyOffers) {
      data = data.filter((p) => Number(p.discount_percent || 0) > 0);
    }

    if (sort === "low") data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") data.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "discount")
      data.sort(
        (a, b) => (b.discount_percent || 0) - (a.discount_percent || 0)
      );

    return data;
  }, [products, q, sort, onlyOffers]);

  /* ✅ Open modal + fetch product types */
  const openTypeModal = async (product) => {
    setSelectedProduct(product);
    setSelectedType("");
    setTypeImages({});
    setTypeModalOpen(true);

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
    setTypeModalOpen(false);
    setSelectedProduct(null);
    setSelectedType("");
    setTypeImages({});
  };

  /* ✅ Confirm add */
  const confirmAddToCart = async () => {
    if (!selectedProduct) return;

    if (!selectedType) {
      alert("Please select a type (type1–type5)");
      return;
    }

    try {
      // guest cart
      if (!user) {
        addToGuestCart({
          ...selectedProduct,
          selected_type: selectedType,
        });
        alert(`Added to cart (${selectedType})`);
        closeModal();
        return;
      }

      // user cart
      await api.post("/cart/add", {
        product_id: selectedProduct.id,
        quantity: 1,
        type_name: selectedType, // ✅ IMPORTANT
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
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/20 pb-12">
        <div className="absolute -top-44 -left-44 w-[650px] h-[650px] bg-white/35 rounded-full blur-[170px] animate-pulseSlow" />
        <div className="absolute -bottom-56 -right-56 w-[720px] h-[720px] bg-[#9d4edd]/20 rounded-full blur-[190px] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-20 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="rounded-[40px] border border-white/45 bg-white/20 backdrop-blur-xl shadow-[0_30px_110px_rgba(0,0,0,0.15)] px-8 md:px-14 py-12 md:py-14 relative overflow-hidden hero-float">
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -left-52 top-0 w-64 h-full bg-white/20 skew-x-[-18deg] animate-shimmer" />
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight relative title-rise">
                All{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.35)]">
                  Products
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold relative subtitle-fade">
                Browse the full collection of premium mobile accessories with
                best deals.
              </p>

              <div className="mt-10 flex justify-center flex-wrap gap-3 relative">
                {["Premium", "Trending", "Offers", "New Arrivals"].map((t, i) => (
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

      {/* ================= TOOLBAR ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
              Explore Collection
            </h2>
            <p className="text-gray-600 mt-2 font-semibold">
              {filtered?.length || 0} product(s) found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px]">
              <div className="flex items-center gap-3 bg-white/85 backdrop-blur border border-gray-200 rounded-3xl px-5 py-4 shadow-soft focus-within:border-[#9d4edd]/60 transition">
                <Search className="w-5 h-5 text-[#9d4edd]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-transparent outline-none text-[#0b0f19] placeholder:text-gray-400 font-semibold"
                />
              </div>
            </div>

            <div className="w-full sm:w-[240px]">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-white/85 backdrop-blur border border-gray-200 rounded-3xl px-5 py-4 shadow-soft font-bold text-[#0b0f19] outline-none"
              >
                <option value="default">Sort: Default</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
                <option value="discount">Discount: High</option>
              </select>
            </div>

            <button
              onClick={() => setOnlyOffers((p) => !p)}
              className={`w-full sm:w-auto px-6 py-4 rounded-3xl border shadow-soft font-extrabold transition ${
                onlyOffers
                  ? "bg-[#0b0f19] text-white border-[#0b0f19]"
                  : "bg-white/85 backdrop-blur text-[#0b0f19] border-gray-200 hover:bg-white"
              }`}
            >
              <BadgePercent className="inline w-5 h-5 mr-2 text-[#d4af37]" />
              Offers
            </button>
          </div>
        </div>
      </section>

      {/* ================= PRODUCTS GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] font-extrabold">
              <Sparkles className="w-5 h-5" /> No products found
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filtered.map((p, idx) => {
              const discount = Number(p.discount_percent || 0);
              const discountedPrice = getDiscountedPrice(p.price, discount);

              return (
                <div
                  key={p.id}
                  className="
                    reveal group relative overflow-hidden
                    rounded-[32px] border border-gray-200 bg-white/85 backdrop-blur
                    shadow-[0_18px_50px_rgba(0,0,0,0.06)]
                    hover:-translate-y-2 transition
                    hover:border-[#d4af37]/60
                    hover:shadow-[0_35px_90px_rgba(212,175,55,0.18)]
                  "
                  style={{ transitionDelay: `${idx * 40}ms` }}
                >
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={
                        p.image
                          ? `http://localhost:8000/${p.image}`
                          : "https://via.placeholder.com/400x300"
                      }
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                      <div className="absolute -left-24 top-0 w-40 h-full bg-white/20 skew-x-[-20deg] animate-shimmer" />
                    </div>

                    {discount > 0 && (
                      <div className="absolute top-4 left-4 z-10 px-4 py-2.5 rounded-2xl text-sm font-black tracking-wide text-[#1b1400] bg-gradient-to-r from-[#fff7c2] via-[#d4af37] to-[#a87412] border border-white/60 ring-1 ring-[#d4af37]/35 shadow-[0_18px_45px_rgba(212,175,55,0.42)] overflow-hidden">
                        <span className="absolute inset-0 -translate-x-full bg-white/35 skew-x-[-20deg] animate-badgeShine" />
                        <span className="relative">{discount}% OFF</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-extrabold text-[#0b0f19] text-lg line-clamp-1">
                      {p.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {p.subtitle || "Premium quality accessory"}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      {/* ✅ FIXED PRICE UI WITH 2 DECIMALS */}
                      <div className="flex items-center gap-2">
                        {discount > 0 ? (
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

                      <div className="inline-flex items-center gap-1 text-xs font-bold text-[#9d4edd]">
                        View <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>

                    <button
                      onClick={() => openTypeModal(p)}
                      className="
                        mt-4 w-full bg-[#0b0f19] text-white py-3 rounded-2xl
                        font-extrabold hover:scale-[1.02] transition
                        shadow-[0_18px_40px_rgba(0,0,0,0.18)]
                      "
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ✅ TYPE MODAL */}
      {typeModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-[34px] bg-white border border-gray-200 shadow-[0_40px_120px_rgba(0,0,0,0.22)] overflow-hidden">
            <div className="p-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-gray-500">
                  Select Type
                </div>
                <div className="text-2xl font-black text-[#0b0f19]">
                  {selectedProduct.name}
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
                onClick={confirmAddToCart}
                className="mt-6 w-full rounded-2xl py-4 font-black bg-[#0b0f19] text-white hover:scale-[1.01] transition shadow-[0_20px_55px_rgba(0,0,0,0.22)]"
              >
                Confirm Add ({selectedType || "Select Type"})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ANIMATIONS ================= */}
      <style>
        {`
          .reveal {
            opacity: 1;
            transform: translateY(0);
            transition: opacity .7s ease, transform .7s ease;
          }
          .reveal[data-reveal="1"] {
            opacity: 0;
            transform: translateY(22px);
          }
          .reveal-show {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }

          @keyframes heroFloat {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .hero-float { animation: heroFloat 6s ease-in-out infinite; }

          @keyframes rise {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .title-rise { animation: rise .9s ease-out both; }
          .subtitle-fade { animation: rise 1.1s ease-out both; animation-delay: .15s; }
          .chip-pop { animation: rise .8s ease-out both; }

          @keyframes shimmer {
            0% { transform: translateX(-140%) skewX(-20deg); }
            100% { transform: translateX(260%) skewX(-20deg); }
          }
          .animate-shimmer { animation: shimmer 2.2s infinite; }

          @keyframes badgeShine {
            0% { transform: translateX(-160%) skewX(-20deg); }
            100% { transform: translateX(220%) skewX(-20deg); }
          }
          .animate-badgeShine { animation: badgeShine 3s ease-in-out infinite; }

          @keyframes floaty {
            0%,100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float { animation: floaty 6s ease-in-out infinite; }

          @keyframes pulseSlow {
            0%,100% { opacity: .45; }
            50% { opacity: .8; }
          }
          .animate-pulseSlow { animation: pulseSlow 4s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}
