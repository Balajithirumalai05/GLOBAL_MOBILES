import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { Search, Sparkles, ArrowRight, ChevronLeft } from "lucide-react";

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

export default function SubCategories() {
  const { mainId } = useParams();
  const navigate = useNavigate();

  const [subs, setSubs] = useState([]);
  const [q, setQ] = useState("");

  useRevealOnScroll();

  useEffect(() => {
    api
      .get(`/admin/catalog/sub-categories/by-main/${mainId}`)
      .then((res) => setSubs(res.data));
  }, [mainId]);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    if (!q.trim()) return subs;
    return subs.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
  }, [subs, q]);

  return (
    <div className="bg-[#fcfcff] overflow-x-hidden">

      {/* ================= HERO (NO CURVE + HERO ANIMATIONS ONLY) ================= */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/20 pb-10">
        {/* blobs */}
        <div className="absolute -top-44 -left-44 w-[650px] h-[650px] bg-white/35 rounded-full blur-[170px] animate-pulseSlow" />
        <div className="absolute -bottom-56 -right-56 w-[720px] h-[720px] bg-[#9d4edd]/20 rounded-full blur-[190px] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="rounded-[40px] border border-white/45 bg-white/20 backdrop-blur-xl shadow-[0_30px_110px_rgba(0,0,0,0.15)] px-8 md:px-14 py-12 md:py-14 relative overflow-hidden hero-float">

              {/* shimmer shine */}
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -left-52 top-0 w-64 h-full bg-white/20 skew-x-[-18deg] animate-shimmer" />
              </div>

              {/* back */}
              <div className="flex justify-center mb-8 relative chip-pop" style={{ animationDelay: "0ms" }}>
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-extrabold bg-white/35 border border-white/40 hover:bg-white/55 transition"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight relative title-rise">
                Collections{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.35)]">
                  We Offer
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold relative subtitle-fade">
                Choose a sub-category to view all products and models.
              </p>

              {/* chips */}
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

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-24 relative">

        {/* header + search */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">

          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#0b0f19] leading-tight">
              Explore{" "}
              <span className="relative inline-block">
                Models
                <span className="absolute left-0 -bottom-2 w-full h-[5px] rounded-full bg-gradient-to-r from-[#d4af37] to-[#9d4edd]" />
              </span>
            </h2>

            <p className="text-gray-600 mt-4 font-semibold">
              {filtered?.length || 0} sub-category(s) found
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-[460px]">
            <div
              className="
                flex items-center gap-3
                bg-white/80 backdrop-blur
                border border-gray-200
                rounded-3xl px-5 py-4
                shadow-[0_18px_50px_rgba(0,0,0,0.06)]
                focus-within:border-[#9d4edd]/60
                focus-within:shadow-[0_22px_60px_rgba(157,78,221,0.12)]
                transition
              "
            >
              <Search className="w-5 h-5 text-[#9d4edd]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sub-categories..."
                className="w-full bg-transparent outline-none text-[#0b0f19] placeholder:text-gray-400 font-semibold"
              />

              {/* result pill */}
              <div className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] text-xs font-extrabold">
                <Sparkles className="w-4 h-4" />
                {filtered?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* empty */}
        {filtered?.length === 0 ? (
          <div className="text-center py-24 text-gray-700">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] font-extrabold">
              <Sparkles className="w-5 h-5" /> No sub-categories found
            </div>
            <div className="mt-3 font-semibold text-gray-600">
              Try searching a different keyword.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {filtered.map((sub, idx) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/products/sub/${sub.id}`)}
                className="
                  reveal group cursor-pointer relative overflow-hidden
                  rounded-[32px] border border-gray-200
                  bg-white/70 backdrop-blur
                  shadow-[0_18px_50px_rgba(0,0,0,0.06)]
                  transition
                  hover:-translate-y-2
                  hover:border-[#d4af37]/60
                  hover:shadow-[0_35px_90px_rgba(212,175,55,0.18)]
                "
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                {/* image area */}
                <div className="relative h-44 bg-gray-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={`http://localhost:8000/${sub.image}`}
                    alt={sub.name}
                    className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute -left-24 top-0 w-40 h-full bg-white/20 skew-x-[-20deg] animate-shimmer" />
                  </div>

                  {/* premium badge */}
                 
                </div>

                {/* body */}
                <div className="p-5">
                  <h3 className="text-[#0b0f19] text-lg font-extrabold text-center line-clamp-1">
                    {sub.name}
                  </h3>

                  <div className="mt-3 flex justify-center text-xs font-extrabold text-[#9d4edd]">
                    Browse Products <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* ================= ANIMATION CSS ================= */}
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

          @keyframes shimmer {
            0% { transform: translateX(-140%) skewX(-20deg); }
            100% { transform: translateX(260%) skewX(-20deg); }
          }
          .animate-shimmer { animation: shimmer 2.2s infinite; }

          /* HERO animations */
          @keyframes heroFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .hero-float { animation: heroFloat 6s ease-in-out infinite; }

          @keyframes rise {
            0% { opacity: 0; transform: translateY(24px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .title-rise { animation: rise .9s ease-out both; }
          .subtitle-fade { animation: rise 1.1s ease-out both; animation-delay: .15s; }

          @keyframes chipPop {
            0% { opacity: 0; transform: translateY(10px) scale(.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .chip-pop { animation: chipPop .7s ease-out both; }

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
