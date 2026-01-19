import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Truck,
  BadgePercent,
  ChevronRight,
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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useRevealOnScroll();

  useEffect(() => {
    api.get("/catalog/categories").then((res) => setCategories(res.data));
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return categories;
    return categories.filter((c) =>
      c.name.toLowerCase().includes(q.toLowerCase())
    );
  }, [categories, q]);

  return (
    <div className="space-y-24 bg-[#fcfcff] overflow-x-hidden">

      {/* ================= HERO (NO CURVE + INSIDE ANIMATIONS) ================= */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/25">
        {/* Soft animated blobs */}
        <div className="absolute -top-44 -left-44 w-[650px] h-[650px] bg-white/35 rounded-full blur-[170px] animate-pulseSlow" />
        <div className="absolute -bottom-56 -right-56 w-[720px] h-[720px] bg-[#9d4edd]/20 rounded-full blur-[190px] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />

        {/* HERO CONTENT */}
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="max-w-5xl mx-auto text-center">

            {/* Glass Card */}
            <div className="rounded-[40px] border border-white/45 bg-white/20 backdrop-blur-xl shadow-[0_30px_110px_rgba(0,0,0,0.15)] px-8 md:px-14 py-14 md:py-16 relative overflow-hidden hero-float">

              {/* subtle shine */}
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -left-52 top-0 w-64 h-full bg-white/20 skew-x-[-18deg] animate-shimmer" />
              </div>

              {/* chip row */}
              <div className="flex justify-center gap-3 mb-10 flex-wrap relative">
                {["Covers", "Tempers", "Chargers", "Watches", "Earphones"].map((t, i) => (
                  <span
                    key={t}
                    className="px-5 py-2 rounded-full text-sm font-extrabold
                    bg-white/35 backdrop-blur border border-white/40
                    text-[#0b0f19] shadow-sm
                    hover:bg-white/55 transition
                    chip-pop"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* heading */}
              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight relative title-rise">
                Shop by{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.38)]">
                  Category
                </span>
              </h1>

              {/* sub heading */}
              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold relative subtitle-fade">
                Explore premium mobile accessories made for{" "}
                <span className="font-black text-[#0b0f19]">protection</span>,{" "}
                <span className="font-black text-[#0b0f19]">style</span> and{" "}
                <span className="font-black text-[#0b0f19]">performance</span>.
              </p>

              {/* CTA */}
              <div className="mt-12 flex justify-center gap-5 flex-wrap relative btn-rise">
                <button
                  onClick={() => navigate("/products")}
                  className="px-10 py-4 rounded-full font-extrabold bg-[#0b0f19] text-white
                  shadow-[0_22px_60px_rgba(0,0,0,0.25)]
                  hover:scale-[1.04] transition hero-btn-glow"
                >
                  Browse Products <ChevronRight className="inline w-5 h-5 ml-1" />
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="px-10 py-4 rounded-full font-extrabold border-2 border-[#0b0f19]
                  text-[#0b0f19] hover:bg-[#0b0f19] hover:text-white transition"
                >
                  Home Page
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ================= MINI STATS STRIP ================= */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {[
            { icon: ShieldCheck, title: "Trusted Quality", desc: "Premium materials & finish" },
            { icon: BadgePercent, title: "Best Offers", desc: "Deals updated daily" },
            { icon: Truck, title: "Fast Delivery", desc: "Quick doorstep shipping" }
          ].map((s, i) => (
            <div
              key={i}
              className="reveal bg-white/80 backdrop-blur rounded-3xl border border-gray-200 p-7 shadow-soft hover:shadow-[0_30px_70px_rgba(157,78,221,0.12)] transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-[#9d4edd]" />
                </div>
                <div>
                  <div className="font-extrabold text-[#0b0f19]">{s.title}</div>
                  <div className="text-sm text-gray-600">{s.desc}</div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* ================= CATEGORY SECTION (SEARCH IN RIGHT CORNER) ================= */}
      <section className="max-w-7xl mx-auto px-6 relative">

  {/* soft background tint */}
  <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-[#d4af37]/10 rounded-full blur-[140px]" />
  <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-[#9d4edd]/10 rounded-full blur-[150px]" />

  {/* heading + search */}
  <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">

    {/* Heading */}
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-[#0b0f19] leading-tight">
        Explore{" "}
        <span className="relative inline-block">
          Categories
          <span className="absolute left-0 -bottom-2 w-full h-[5px] rounded-full bg-gradient-to-r from-[#d4af37] to-[#9d4edd]" />
        </span>
      </h2>

      <p className="text-gray-600 mt-4 font-semibold">
        Select a category to continue to sub-categories & models.
      </p>

      {/* small info chips */}
      <div className="mt-5 flex flex-wrap gap-3">
        {["Premium Picks", "Trending", "Best Value"].map((t) => (
          <span
            key={t}
            className="px-4 py-2 rounded-full text-xs font-extrabold
            bg-white/70 backdrop-blur border border-gray-200
            text-[#0b0f19] shadow-sm"
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    {/* SEARCH */}
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
          placeholder="Search categories..."
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
        <Sparkles className="w-5 h-5" /> No categories found
      </div>
      <div className="mt-3 font-semibold text-gray-600">
        Try searching a different keyword.
      </div>
    </div>
  ) : (
    <div className="relative grid grid-cols-2 md:grid-cols-4 gap-10">

      {filtered.map((cat, idx) => (
        <div
          key={cat.id}
          onClick={() => navigate(`/category/${cat.id}`)}
          className="
            reveal group cursor-pointer relative overflow-hidden
            rounded-[32px] border border-gray-200 h-64
            bg-white/70 backdrop-blur
            shadow-[0_18px_50px_rgba(0,0,0,0.06)]
            transition
            hover:-translate-y-2
            hover:border-[#d4af37]/60
            hover:shadow-[0_35px_90px_rgba(212,175,55,0.18)]
          "
          style={{ transitionDelay: `${idx * 40}ms` }}
        >
          {/* IMAGE */}
          <img
            src={`http://localhost:8000/${cat.image}`}
            alt={cat.name}
            className="
              absolute inset-0 w-full h-full object-cover
              transition-transform duration-700
              group-hover:scale-110
            "
          />

          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* shimmer */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition">
            <div className="absolute -left-24 top-0 w-40 h-full bg-white/20 skew-x-[-20deg] animate-shimmer" />
          </div>

          {/* PREMIUM BADGE (Luxury Bigger) */}
          <div
  className="
    absolute top-4 left-4 px-3 py-1.5 rounded-full
    text-xs font-extrabold tracking-wide
    text-black
    bg-gradient-to-r from-[#fff3b0] via-[#d4af37] to-[#b8891d]
    shadow-[0_10px_25px_rgba(212,175,55,0.35)]
    border border-[#ffffff]/40
    backdrop-blur
  "
>
  Premium
</div>


          {/* bottom glass strip */}
          <div className="absolute bottom-0 w-full p-6">
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-5 py-4">
              <h3 className="text-white text-lg font-extrabold tracking-wide line-clamp-1">
                {cat.name}
              </h3>

              <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-white/90">
                Browse Models <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* extra animation for badge shine */}
  <style>
    {`
      @keyframes badgeShine {
        0% { transform: translateX(-160%) skewX(-20deg); }
        100% { transform: translateX(220%) skewX(-20deg); }
      }
      .animate-badgeShine {
        animation: badgeShine 3s ease-in-out infinite;
      }
    `}
  </style>
</section>


      {/* ================= TRUST STRIP ================= */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="reveal rounded-3xl border border-gray-200 bg-gradient-to-r from-[#fff7db] via-white to-[#f7f0ff] p-10 shadow-soft">
          <h3 className="text-2xl md:text-3xl font-black text-[#0b0f19] mb-8 text-center">
            Why Customers Choose Us
          </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700">
          {[
            "Premium accessories only",
            "Trusted quality & durability",
            "Perfect fit for all major brands"
          ].map((text, i) => (
            <div key={i} className="flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-[#9d4edd] mt-1" />
              <span className="font-semibold">{text}</span>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="reveal rounded-3xl overflow-hidden border border-gray-200 shadow-soft relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7e6a1] via-white to-[#9d4edd]/10" />
          <div className="relative p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-[#0b0f19]">
                Ready to shop accessories?
              </h3>
              <p className="text-gray-700 mt-3 max-w-xl font-medium">
                Browse all products with best offers, premium quality and fast delivery.
              </p>
            </div>

            <button
              onClick={() => navigate("/products")}
              className="px-10 py-4 rounded-full font-black bg-[#0b0f19] text-white hover:scale-[1.04] transition shadow-[0_20px_50px_rgba(0,0,0,0.20)]"
            >
              Browse Products →
            </button>
          </div>
        </div>
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
          .btn-rise { animation: rise 1.2s ease-out both; animation-delay: .25s; }

          @keyframes chipPop {
            0% { opacity: 0; transform: translateY(10px) scale(.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .chip-pop { animation: chipPop .7s ease-out both; }

          .hero-btn-glow:hover {
            box-shadow: 0 24px 70px rgba(157, 78, 221, 0.22);
          }

          @keyframes shimmer {
            0% { transform: translateX(-140%) skewX(-20deg); }
            100% { transform: translateX(260%) skewX(-20deg); }
          }
          .animate-shimmer { animation: shimmer 2.2s infinite; }

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
