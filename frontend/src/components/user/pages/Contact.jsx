import { MapPin, Phone, Mail, Send, Sparkles } from "lucide-react";

export default function Contact() {
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

              {/* shimmer shine */}
              <div className="absolute inset-0 opacity-60 pointer-events-none">
                <div className="absolute -left-52 top-0 w-64 h-full bg-white/20 skew-x-[-18deg] animate-shimmer" />
              </div>

              <h1 className="text-5xl md:text-6xl font-black text-[#0b0f19] leading-[1.1] tracking-tight relative title-rise">
                Contact{" "}
                <span className="text-[#9d4edd] drop-shadow-[0_10px_26px_rgba(157,78,221,0.35)]">
                  Us
                </span>
              </h1>

              <p className="mt-6 text-lg md:text-xl text-[#0b0f19]/80 max-w-3xl mx-auto font-semibold relative subtitle-fade">
                Have questions? Need help choosing an accessory? Reach us anytime.
              </p>

              {/* chips */}
              <div className="mt-10 flex justify-center flex-wrap gap-3 relative">
                {["Fast Response", "Trusted Store", "Best Support", "Premium Accessories"].map((t, i) => (
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
      <section className="max-w-7xl mx-auto px-6 mt-10 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ================= LEFT: CONTACT INFO ================= */}
        <div className="rounded-[32px] border border-gray-200 bg-white/85 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10 md:p-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#9d4edd]" />
            </div>
            <h2 className="text-3xl font-black text-[#0b0f19]">
              Get In Touch
            </h2>
          </div>

          <p className="text-gray-600 font-semibold mt-4 leading-relaxed">
            We’re here to help you with products, offers, orders and delivery.
            Feel free to contact us anytime.
          </p>

          <div className="mt-10 space-y-5">

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#9d4edd]" />
              </div>
              <div>
                <div className="font-black text-[#0b0f19]">Address</div>
                <div className="text-gray-600 font-semibold mt-1">
                  Tirunelveli, Tamil Nadu
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#9d4edd]" />
              </div>
              <div>
                <div className="font-black text-[#0b0f19]">Phone</div>
                <div className="text-gray-600 font-semibold mt-1">
                  +91 98765 43210
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#9d4edd]" />
              </div>
              <div>
                <div className="font-black text-[#0b0f19]">Email</div>
                <div className="text-gray-600 font-semibold mt-1">
                  globalmobiles@gmail.com
                </div>
              </div>
            </div>

          </div>

          {/* map */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-gray-200 shadow-soft">
            <iframe
              title="map"
              className="w-full h-64"
              src="https://maps.google.com/maps?q=Tirunelveli&t=&z=13&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </div>
        </div>

        {/* ================= RIGHT: FORM ================= */}
        <div className="rounded-[32px] border border-gray-200 bg-white/85 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10 md:p-12">
          <h2 className="text-3xl font-black text-[#0b0f19]">
            Send Message
          </h2>
          <p className="text-gray-600 font-semibold mt-3">
            We’ll reply to you as soon as possible.
          </p>

          <form className="mt-10 space-y-5">
            {/* name */}
            <input
              placeholder="Your Name"
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70 border border-gray-200
                outline-none font-semibold text-[#0b0f19]
                placeholder:text-gray-400
                focus:border-[#9d4edd]/60
                focus:shadow-[0_12px_30px_rgba(157,78,221,0.14)]
                transition
              "
            />

            {/* email */}
            <input
              placeholder="Email"
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70 border border-gray-200
                outline-none font-semibold text-[#0b0f19]
                placeholder:text-gray-400
                focus:border-[#9d4edd]/60
                focus:shadow-[0_12px_30px_rgba(157,78,221,0.14)]
                transition
              "
            />

            {/* msg */}
            <textarea
              placeholder="Message"
              className="
                w-full px-5 py-4 rounded-2xl
                bg-white/70 border border-gray-200
                outline-none font-semibold text-[#0b0f19]
                placeholder:text-gray-400
                focus:border-[#9d4edd]/60
                focus:shadow-[0_12px_30px_rgba(157,78,221,0.14)]
                transition
                min-h-[140px]
              "
            />

            <button
              type="button"
              className="
                w-full py-4 rounded-2xl
                bg-[#0b0f19] text-white
                font-extrabold tracking-wide
                hover:scale-[1.02]
                transition
                shadow-[0_20px_50px_rgba(0,0,0,0.20)]
                inline-flex items-center justify-center gap-2
              "
            >
              <Send className="w-5 h-5" /> Send Message
            </button>
          </form>
        </div>
      </section>

      {/* ================= ANIMATION CSS ================= */}
      <style>
        {`
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
