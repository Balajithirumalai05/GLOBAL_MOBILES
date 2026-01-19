import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { Search, Sparkles, ArrowRight, BadgePercent } from "lucide-react";

/* ================= DISCOUNT CALC ================= */
const getDiscountedPrice = (price, discount) => {
  const p = Number(price || 0);
  const d = Number(discount || 0);
  if (!d || d <= 0) return p;
  return p - (p * d) / 100;
};

const formatMoney = (value) => {
  const n = Number(value || 0);
  return n.toFixed(2);
};

export default function Cases() {
  const navigate = useNavigate();

  const [cases, setCases] = useState([]);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    api
      .get("/cases/products")
      .then((res) => setCases(res.data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = useMemo(() => {
    let data = [...cases];

    if (q.trim()) {
      data = data.filter((c) =>
        `${c.title || ""} ${c.subtitle || ""}`
          .toLowerCase()
          .includes(q.toLowerCase())
      );
    }

    if (sort === "low") data.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sort === "high") data.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sort === "discount")
      data.sort(
        (a, b) => (b.discount_percent || 0) - (a.discount_percent || 0)
      );

    return data;
  }, [cases, q, sort]);

  return (
    <div className="bg-[#fcfcff] overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/20 pb-10">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="rounded-[40px] border border-white/45 bg-white/20 backdrop-blur-xl shadow-[0_30px_110px_rgba(0,0,0,0.15)] px-8 md:px-14 py-14 md:py-16 relative overflow-hidden">
              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight">
                Phone{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.35)]">
                  Cases
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold">
                Pick your favorite case, choose phone model and variant, add to
                cart.
              </p>

              <div className="mt-10 flex justify-center flex-wrap gap-3">
                {["Premium", "New", "Trending", "Best Deals"].map((t) => (
                  <span
                    key={t}
                    className="px-5 py-2 rounded-full text-sm font-extrabold bg-white/35 backdrop-blur border border-white/40 text-[#0b0f19] shadow-sm"
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
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
              Explore Cases
            </h2>
            <p className="text-gray-600 mt-2 font-semibold">
              {filtered.length} case(s) found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-[320px]">
              <div className="flex items-center gap-3 bg-white/85 backdrop-blur border border-gray-200 rounded-3xl px-5 py-4 shadow-soft">
                <Search className="w-5 h-5 text-[#9d4edd]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search cases..."
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
          </div>
        </div>
      </section>

      {/* ================= CASES GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] font-extrabold">
              <Sparkles className="w-5 h-5" /> No cases found
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {filtered.map((c) => {
              const discount = Number(c.discount_percent || 0);
              const discounted = getDiscountedPrice(c.price, discount);

              return (
                <div
                  key={c.id}
                  className="
                    group relative overflow-hidden
                    rounded-[32px] border border-gray-200 bg-white/85 backdrop-blur
                    shadow-[0_18px_50px_rgba(0,0,0,0.06)]
                    hover:-translate-y-2 transition
                    hover:border-[#d4af37]/60
                    hover:shadow-[0_35px_90px_rgba(212,175,55,0.18)]
                  "
                >
                  <div className="p-5">
                    {discount > 0 && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0b0f19]/80 text-white text-xs font-extrabold">
                        <BadgePercent className="w-4 h-4 text-[#d4af37]" />
                        {discount}% OFF
                      </div>
                    )}

                    <h3 className="mt-4 font-extrabold text-[#0b0f19] text-lg line-clamp-1">
                      {c.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {c.subtitle || "Premium Phone Case"}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {discount > 0 ? (
                          <>
                            <span className="text-sm text-gray-400 line-through font-semibold">
                              ₹{formatMoney(c.price)}
                            </span>
                            <span className="text-xl font-black text-[#0b0f19]">
                              ₹{formatMoney(discounted)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-[#0b0f19]">
                            ₹{formatMoney(c.price)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/cases/${c.id}`)}
                        className="inline-flex items-center gap-2 text-xs font-bold text-[#9d4edd]"
                      >
                        View <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => navigate(`/cases/${c.id}`)}
                      className="
                        mt-5 w-full bg-[#0b0f19] text-white py-3 rounded-2xl
                        font-extrabold hover:scale-[1.02] transition
                        shadow-[0_18px_40px_rgba(0,0,0,0.18)]
                      "
                    >
                      Choose Model
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
