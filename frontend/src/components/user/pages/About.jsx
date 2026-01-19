import { Sparkles, ShieldCheck, Truck, BadgePercent, HeartHandshake } from "lucide-react";

export default function About() {
  return (
    <div className="bg-[#fcfcff] overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section className="w-full relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/20 pb-10">
        {/* blobs */}
        <div className="absolute -top-44 -left-44 w-[650px] h-[650px] bg-white/35 rounded-full blur-[170px] animate-pulseSlow" />
        <div className="absolute -bottom-56 -right-56 w-[720px] h-[720px] bg-[#9d4edd]/20 rounded-full blur-[190px] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="rounded-[40px] border border-white/45 bg-white/20 backdrop-blur-xl shadow-[0_30px_110px_rgba(0,0,0,0.15)] px-8 md:px-14 py-14 md:py-16 relative overflow-hidden hero-float">

              {/* shimmer */}
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -left-52 top-0 w-64 h-full bg-white/20 skew-x-[-18deg] animate-shimmer" />
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight relative title-rise">
                About{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.35)]">
                  Global Mobiles
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold relative subtitle-fade">
                Trusted mobile accessories store delivering premium quality at affordable prices.
              </p>

              {/* chips */}
              <div className="mt-10 flex justify-center flex-wrap gap-3 relative">
                {["Premium Quality", "Best Offers", "Trusted Store", "Fast Delivery"].map((t, i) => (
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

      {/* ================= ABOUT CONTENT ================= */}
      <section className="max-w-6xl mx-auto px-6 mt-10 pb-24">

        {/* intro card */}
        <div className="rounded-[32px] border border-gray-200 bg-white/85 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10 md:p-14">
          <h2 className="text-3xl font-black text-[#0b0f19]">
            Who We Are
          </h2>

          <p className="text-gray-600 leading-relaxed mt-4 font-semibold">
            Global Mobiles is a trusted mobile accessories store providing
            high-quality products at affordable prices. Our mission is to
            make premium accessories accessible to everyone.
          </p>

          <p className="text-gray-600 leading-relaxed mt-4 font-semibold">
            From stylish covers and tempered glass to chargers, earphones and smart watches —
            we carefully select products that deliver durability, performance and value.
          </p>
        </div>

        {/* mini stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {[
            { icon: ShieldCheck, title: "Trusted Quality", desc: "Only verified accessories & materials" },
            { icon: BadgePercent, title: "Best Deals", desc: "Affordable pricing with offers" },
            { icon: Truck, title: "Fast Delivery", desc: "Quick doorstep shipping support" },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-[28px] border border-gray-200 bg-white/85 backdrop-blur shadow-[0_18px_55px_rgba(0,0,0,0.06)] p-9 hover:shadow-[0_28px_70px_rgba(157,78,221,0.10)] transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center mb-6">
                <s.icon className="w-7 h-7 text-[#9d4edd]" />
              </div>
              <h3 className="font-black text-lg text-[#0b0f19]">{s.title}</h3>
              <p className="text-gray-600 font-semibold mt-2">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* why choose us */}
        <div className="mt-20 rounded-[36px] border border-gray-200 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.08)] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#fff7db] via-white to-[#f7f0ff]" />
          <div className="relative p-12 md:p-14">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#9d4edd]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-[#0b0f19]">
                Why Customers Choose Us
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 text-gray-700 mt-10 ml-4">
              {[
                "Accessories for all major brands",
                "Durable products with premium finish",
                "Customer satisfaction & trusted service",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 font-semibold">
                  <HeartHandshake className="w-5 h-5 text-[#9d4edd] mt-1" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ================= ANIMATION CSS ================= */}
      <style>
        {`
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
