import { useEffect, useMemo, useRef, useState } from "react";
import {
  Headphones,
  Watch,
  Cable,
  BatteryCharging,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-react";

const ORBIT_ICONS = [
  { Icon: Headphones, color: "#9d4edd" },
  { Icon: Watch, color: "#d4af37" },
  { Icon: Cable, color: "#9d4edd" },
  { Icon: BatteryCharging, color: "#d4af37" },
  { Icon: ShieldCheck, color: "#9d4edd" },
  { Icon: Smartphone, color: "#d4af37" },
  { Icon: Zap, color: "#9d4edd" },
  { Icon: Sparkles, color: "#d4af37" },
];

const IMAGES = [
  "/assets/subhero1.png",
  "/assets/subhero2.png",
  "/assets/subhero3.png",
];

export default function SubHero3DShowcase() {
  const wrapRef = useRef(null);
  const orbitRef = useRef(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [active, setActive] = useState(0);
  const [orbitSize, setOrbitSize] = useState(460);

  // auto rotate images
  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % IMAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // hover tilt
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const px = (x / r.width) * 2 - 1;
      const py = (y / r.height) * 2 - 1;

      setTilt({
        rx: -(py * 7),
        ry: px * 10,
      });
    };

    const leave = () => setTilt({ rx: 0, ry: 0 });

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, []);

  // orbit size responsive
  useEffect(() => {
    const el = orbitRef.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setOrbitSize(Math.min(r.width, r.height));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ✅ evenly spaced orbit positions
  const orbitItems = useMemo(() => {
    const total = ORBIT_ICONS.length;

    // ✅ increased radius so icons don't touch the bubble
    const radius = orbitSize / 2 + 10;

    return ORBIT_ICONS.map((it, i) => {
      const angle = (i / total) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      return { ...it, x, y };
    });
  }, [orbitSize]);

  return (
    <section className="relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0">
        <div className="absolute -top-44 -left-44 w-[620px] h-[620px] bg-[#d4af37]/22 rounded-full blur-[160px] animate-blobA" />
        <div className="absolute -bottom-48 -right-48 w-[760px] h-[760px] bg-[#9d4edd]/16 rounded-full blur-[180px] animate-blobB" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.85),transparent_60%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24">
        {/* label */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-gray-200 shadow-soft text-xs font-extrabold text-[#0b0f19]">
            <Sparkles className="w-4 h-4 text-[#9d4edd]" />
            Premium Hologram Showcase
          </div>
        </div>

        {/* main card */}
        <div
          ref={wrapRef}
          className="relative mt-10 rounded-[44px] border border-gray-200 bg-white/55 backdrop-blur-xl shadow-[0_35px_120px_rgba(0,0,0,0.10)] overflow-hidden"
        >
          {/* shine */}
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <div className="absolute -left-60 top-0 w-72 h-full bg-white/35 skew-x-[-18deg] animate-shimmer" />
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 p-10 md:p-14 items-center">
            {/* LEFT */}
            <div>
              <h3 className="text-3xl md:text-5xl font-black text-[#0b0f19] leading-tight">
                Accessories that feel
                <span className="block text-[#9d4edd] drop-shadow-[0_10px_28px_rgba(157,78,221,0.28)]">
                  Premium ✨
                </span>
              </h3>

              <p className="mt-4 text-gray-700 font-semibold max-w-lg leading-relaxed">
                Smooth 8-icon orbit around the hologram bubble — perfectly spaced,
                no overlap.
              </p>
            </div>

            {/* RIGHT */}
            <div className="relative flex justify-center md:justify-end">
              <div
                ref={orbitRef}
                className="relative w-[340px] h-[340px] md:w-[460px] md:h-[460px]"
                style={{
                  transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 140ms ease-out",
                }}
              >
                {/* orbit rings */}
                <div className="absolute inset-[60px] rounded-full border border-black/10 opacity-70 z-[5]" />
                <div className="absolute inset-[88px] rounded-full border border-black/10 opacity-40 z-[5]" />

                {/* ✅ orbit icons (always above bubble) */}
                <div className="absolute inset-0 z-[60] pointer-events-none animate-orbitPerfect">
                  {orbitItems.map((it, i) => (
                    <div
                      key={i}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        transform: `translate(calc(-50% + ${it.x}px), calc(-50% + ${it.y}px))`,
                      }}
                    >
                      <div className="orbitIconPerfect">
                        <it.Icon className="w-6 h-6" style={{ color: it.color }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* ✅ hologram bubble under icons */}
                <div className="absolute inset-10 z-[10] rounded-full border border-white/60 bg-gradient-to-br from-white/50 via-white/25 to-white/10 backdrop-blur-xl shadow-[0_45px_140px_rgba(0,0,0,0.18)] overflow-hidden">
                  {/* internal shine */}
                  <div className="absolute inset-0 opacity-70">
                    <div className="absolute -left-44 top-0 w-56 h-full bg-white/30 skew-x-[-18deg] animate-shimmerSlow" />
                  </div>

                  {/* rotating images */}
                  {IMAGES.map((img, idx) => (
                    <img
                      key={img}
                      src={img}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
                        ${
                          idx === active
                            ? "opacity-100 scale-[1.04]"
                            : "opacity-0 scale-[0.96]"
                        }`}
                    />
                  ))}

                  {/* vignette */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.25))]" />
                </div>

                {/* base glow */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[78%] h-16 bg-[#d4af37]/35 blur-[35px] rounded-full z-[1]" />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[60%] h-16 bg-[#9d4edd]/18 blur-[40px] rounded-full z-[1]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          .orbitIconPerfect{
            width: 50px;
            height: 50px;
            border-radius: 18px;
            background: rgba(255,255,255,0.92);
            border: 1px solid rgba(229,231,235,1);
            box-shadow: 0 18px 55px rgba(0,0,0,0.14);
            display:flex;
            align-items:center;
            justify-content:center;

            /* ✅ floating above bubble */
            transform: translateZ(30px);
          }

          @keyframes orbitPerfect {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-orbitPerfect{
            animation: orbitPerfect 12s linear infinite;
          }

          @keyframes shimmer {
            0% { transform: translateX(-140%) skewX(-18deg); }
            100% { transform: translateX(260%) skewX(-18deg); }
          }
          .animate-shimmer { animation: shimmer 2.2s infinite; }

          @keyframes shimmerSlow {
            0% { transform: translateX(-150%) skewX(-18deg); opacity: .2; }
            100% { transform: translateX(240%) skewX(-18deg); opacity: .9; }
          }
          .animate-shimmerSlow { animation: shimmerSlow 3.4s ease-in-out infinite; }

          @keyframes blobA {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(22px, 14px); }
          }
          @keyframes blobB {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(-24px, -16px); }
          }
          .animate-blobA { animation: blobA 10s ease-in-out infinite; }
          .animate-blobB { animation: blobB 12s ease-in-out infinite; }
        `}
      </style>
    </section>
  );
}
