import { Link } from "react-router-dom";
import Hero from "./Hero";
import {
  ShieldCheck,
  Tag,
  Truck,
  Headphones,
  Plug,
  Watch,
  Cable,
  Sparkles
} from "lucide-react";
import SubHero from "./SubHero";

export default function Home() {
  return (
    <div className="bg-[#fcfcff] space-y-28 overflow-hidden">

      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 relative">
        {/* very light background tint */}
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-[#d4af37]/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-28 -right-20 w-[420px] h-[420px] bg-[#9d4edd]/10 rounded-full blur-[140px]" />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: ShieldCheck,
              title: "Premium Quality",
              desc: "Carefully selected durable accessories",
            },
            {
              icon: Tag,
              title: "Best Prices",
              desc: "Honest pricing with real value",
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Quick & safe doorstep delivery",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="
                rounded-3xl p-10
                border border-gray-200
                bg-white/80 backdrop-blur
                shadow-[0_15px_35px_rgba(0,0,0,0.05)]
                hover:border-[#9d4edd]/60
                hover:shadow-[0_20px_50px_rgba(157,78,221,0.08)]
                transition
              "
            >
              <div
                className="
                  w-14 h-14 mb-6 rounded-2xl
                  bg-[#d4af37]/20
                  flex items-center justify-center
                "
              >
                <f.icon className="w-6 h-6 text-[#9d4edd]" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {f.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
            <SubHero />


      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-6 relative">
        <div className="flex justify-between items-center mb-14">
          <h2 className="text-3xl font-semibold text-gray-900">
            Popular Categories
          </h2>

          <Link
            to="/categories"
            className="text-sm font-semibold text-[#9d4edd] hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { name: "Earphones", icon: Headphones },
            { name: "Chargers", icon: Plug },
            { name: "Smart Watches", icon: Watch },
            { name: "Cables", icon: Cable },
          ].map((cat, i) => (
            <div
              key={i}
              className="
                p-8 rounded-3xl
                border border-gray-200
                bg-white/80 backdrop-blur
                shadow-[0_14px_35px_rgba(0,0,0,0.05)]
                hover:border-[#d4af37]/70
                hover:shadow-[0_20px_55px_rgba(212,175,55,0.10)]
                transition cursor-pointer
              "
            >
              <div
                className="
                  w-14 h-14 mb-5 rounded-2xl
                  bg-[#9d4edd]/12
                  flex items-center justify-center
                "
              >
                <cat.icon className="w-6 h-6 text-[#d4af37]" />
              </div>

              <h3 className="font-semibold text-gray-900">
                {cat.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Explore products →
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 relative overflow-hidden">
        {/* soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff8dd] via-white to-[#f6efff]" />
        <div className="absolute -top-40 left-1/3 w-[520px] h-[520px] bg-[#9d4edd]/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 right-1/4 w-[560px] h-[560px] bg-[#d4af37]/12 rounded-full blur-[170px]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-16">
            Why Global Mobiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 text-gray-700">
            {[
              "Accessories for all major brands",
              "Trusted by thousands of customers",
              "Secure payments & easy returns",
            ].map((text, i) => (
              <div
                key={i}
                className="
                  rounded-3xl border border-gray-200
                  bg-white/70 backdrop-blur
                  p-10 shadow-[0_18px_45px_rgba(0,0,0,0.06)]
                "
              >
                <div className="flex gap-3 items-start">
                  <Sparkles className="w-5 h-5 mt-1 text-[#9d4edd]" />
                  <span className="font-semibold">{text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-28">
        <div
          className="
            rounded-[40px]
            border border-gray-200
            bg-gradient-to-r from-[#fff7dc] via-white to-[#f6efff]
            p-14 md:p-16 text-center
            shadow-[0_22px_60px_rgba(0,0,0,0.06)]
          "
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Upgrade Your Mobile Experience
          </h2>

          <p className="text-gray-600 mb-12 font-medium">
            Performance, protection & style — perfectly balanced.
          </p>

          <Link
            to="/products"
            className="
              inline-flex items-center gap-2
              bg-[#0b0f19]
              text-white
              px-14 py-4 rounded-full
              font-semibold
              hover:scale-[1.03]
              transition
              shadow-[0_18px_45px_rgba(0,0,0,0.18)]
            "
          >
            Explore Products →
          </Link>
        </div>
      </section>

    </div>
  );
}
