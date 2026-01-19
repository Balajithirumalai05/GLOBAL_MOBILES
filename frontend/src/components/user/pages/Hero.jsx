import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

/* ================= SLIDER IMAGES ================= */
const images = [
  "/assets/hero1.png",
  "/assets/hero2.png",
  "/assets/hero3.png",
  "/assets/hero4.png",
  "/assets/hero5.png",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [zoomIn, setZoomIn] = useState(true);

  useEffect(() => {
    let zoomTimer;
    let slideTimer;

    const startCycle = () => {
      setZoomIn(true);

      zoomTimer = setTimeout(() => {
        setZoomIn(false);
      }, 1200);

      slideTimer = setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 2400);
    };

    startCycle();
    const interval = setInterval(startCycle, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(zoomTimer);
      clearTimeout(slideTimer);
    };
  }, []);

  return (
    <section className="w-screen relative overflow-hidden bg-gradient-to-br from-[#fff3c4] via-[#d4af37] to-[#9d4edd]/20">
      {/* ✅ PREMIUM BLOBS */}
      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-white/35 rounded-full blur-[170px]" />
      <div className="absolute -bottom-52 -right-52 w-[720px] h-[720px] bg-[#9d4edd]/20 rounded-full blur-[190px]" />

      {/* ✅ SOFT RADIAL HIGHLIGHT */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-2 items-center gap-20">
        {/* ================= TEXT ================= */}
        <div>
          {/* ✅ WAVE TEXT H1 */}
          <h1 className="wave-text text-5xl md:text-6xl font-extrabold text-brand-dark leading-tight mb-6 animate-title">
            {"Premium Mobile".split("").map((ch, i) => (
              <span key={i}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
            <br />
            {"Accessories".split("").map((ch, i) => (
              <span key={i + 100}>{ch === " " ? "\u00A0" : ch}</span>
            ))}
          </h1>

          {/* normal paragraph */}
          <p className="text-lg text-brand-dark/80 mb-10 max-w-xl animate-subtitle">
            Earbuds • Smart Watches • Chargers • Cables • Covers
            <br className="hidden md:block" />
            Built for style, protection & performance.
          </p>

          {/* buttons */}
          <div className="flex flex-wrap gap-6 animate-buttons">
            <Link
              to="/products"
              className="bg-brand-dark text-white px-10 py-4 rounded-full font-bold shadow-soft hover:scale-105 transition"
            >
              Shop Now
            </Link>

            <Link
              to="/categories"
              className="border-2 border-brand-dark px-10 py-4 rounded-full font-bold hover:bg-brand-dark hover:text-white transition"
            >
              Browse Categories
            </Link>
          </div>
        </div>

        {/* ================= IMAGE SLIDER ================= */}
        <div className="relative flex justify-center">
          {/* ✅ premium glass circle */}
          <div
            className={`relative w-80 h-80 md:w-96 md:h-96 rounded-full
              bg-white/25 backdrop-blur-xl border border-white/40
              shadow-[0_30px_120px_rgba(0,0,0,0.18)]
              overflow-hidden flex items-center justify-center
              transition-transform duration-[1200ms] ease-in-out
              ${zoomIn ? "scale-110" : "scale-100"}
            `}
          >
            {/* images */}
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                className={`
                  absolute inset-0 w-full h-full object-cover
                  transition-all duration-700
                  ${i === index ? "opacity-100 scale-105" : "opacity-0 scale-95"}
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
