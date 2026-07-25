import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldAlert, X, Check } from "lucide-react";
import { productsData, isCompounded } from "../data/products";
import { productPath } from "../../lib/slug";
import { ComplianceBadges, CompoundedDisclaimer } from "../Compliance";
import { getLenis } from "../../lib/smoothScroll";
import BackButton from "../ui/BackButton";

const EASE = [0.16, 1, 0.3, 1];

// Tube/cream renders sit small inside a landscape frame — scale them up in the card.
const isTube = (img = "") => /rapamycintropical|ghcku/.test(img);

function ProductCard({ p, delay, floatDelay = 0, onQuickView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      onClick={() => onQuickView(p)}
      className="group relative flex cursor-pointer flex-col rounded-[calc(22px*var(--nv-r-scale,1))] border border-line bg-surface p-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:nv-shadow-lg sm:p-6 md:p-4 lg:p-6"
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.13em] text-accent">{p.categoryName}</span>
        <span className="text-[13px] font-semibold text-muted">{p.price}</span>
      </div>
      {/* fixed-height zones keep image + description aligned across all cards */}
      <h3 className="min-h-8 wrap-break-word text-[0.7rem] font-bold leading-snug text-ink sm:min-h-12 sm:text-[1.05rem] md:text-[0.85rem] lg:text-[1rem]">{p.name}</h3>
      <div className="mt-1.5 flex min-h-8 flex-wrap content-start items-center gap-1 sm:mt-2 sm:min-h-14 sm:gap-1.5">
        {p.dosageForm && (
          <span className="w-fit rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.06em] text-muted sm:px-2.5 sm:py-1 sm:text-[0.6rem] sm:tracking-[0.1em]">
            {p.dosageForm}
          </span>
        )}
        <ComplianceBadges compounded={isCompounded(p)} />
      </div>

      <div className="my-2 flex h-20 items-center justify-center px-2 sm:my-5 sm:h-36 md:h-24 lg:h-32">
        {/* wrapper carries the idle vertical float so the img keeps its hover transform */}
        <span className="nv-float flex h-full w-full items-center justify-center" style={{ animationDelay: `${floatDelay}s` }}>
          <img
            src={p.img}
            alt={p.name}
            loading="lazy"
            className={`pointer-events-none h-full w-full object-contain mix-blend-multiply drop-shadow-xl transition-transform duration-500 ease-out ${
              isTube(p.img)
                ? "scale-150 group-hover:scale-[1.6]"
                : "group-hover:-translate-y-1.5 group-hover:scale-105"
            }`}
          />
        </span>
      </div>

      <p className="mb-2.5 line-clamp-2 min-h-7 text-[0.65rem] leading-snug text-muted sm:mb-5 sm:min-h-11 sm:leading-relaxed sm:text-[0.85rem] md:text-[0.75rem] lg:text-[0.82rem]">{p.subtitle}</p>

      {/* Quick view — opens a preview modal so patients know the product before consulting */}
      <button
        onClick={(e) => { e.stopPropagation(); onQuickView(p); }}
        className="group/btn mt-auto flex items-center justify-center gap-1.5 rounded-full bg-primary py-1.5 text-[11.5px] font-semibold text-on-primary transition-all hover:bg-primary-deep nv-shadow sm:py-3 sm:text-[13.5px]"
      >
        Quick view
        <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover/btn:translate-x-0.5" />
      </button>
      <button
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 mt-2 flex w-full items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-muted transition-colors hover:text-ink"
      >
        <ShieldAlert size={13} className="text-primary/70" /> Important safety info
      </button>
    </motion.div>
  );
}

/* Quick-view preview — image + key details so a patient knows what the product is
   before being routed into the full product page to start a consultation. */
function QuickViewModal({ product, onClose }) {
  useEffect(() => {
    if (!product) return;
    const lenis = getLenis();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (lenis) lenis.stop();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      if (lenis) lenis.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          data-lenis-prevent
          className="fixed inset-0 z-[120] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[90vh] w-full max-w-[780px] overflow-y-auto rounded-[calc(28px*var(--nv-r-scale,1))] border border-line bg-surface nv-shadow-lg nv-scroll"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface-2/80 text-muted backdrop-blur transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* image */}
              <div className="relative flex min-h-[240px] items-center justify-center overflow-hidden bg-linear-to-br from-surface to-surface-2 p-8 md:min-h-full">
                <span
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(58% 52% at 50% 42%, color-mix(in oklab, var(--nv-accent) 26%, transparent), transparent 70%)" }}
                />
                <img src={product.img} alt={product.name} className="relative max-h-[260px] w-auto object-contain mix-blend-multiply drop-shadow-2xl" />
              </div>

              {/* info */}
              <div className="flex flex-col p-6 md:p-8">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">{product.categoryName}</span>
                <h3 className="mt-2 font-display text-[1.4rem] font-extrabold leading-tight tracking-tight">{product.name}</h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="font-display text-[1.6rem] font-extrabold leading-none">{product.price}</span>
                  {product.dosageForm && (
                    <span className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted">{product.dosageForm}</span>
                  )}
                </div>

                <ComplianceBadges compounded={isCompounded(product)} className="mt-3" />
                <p className="mt-4 text-[0.9rem] leading-relaxed text-muted">{product.subtitle}</p>

                {product.highlights?.length > 0 && (
                  <ul className="mt-4 grid gap-2">
                    {product.highlights.slice(0, 4).map((h) => (
                      <li key={h.text} className="flex items-center gap-2 text-[0.86rem] font-medium text-ink">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><Check size={11} strokeWidth={3} /></span>
                        {h.text}
                      </li>
                    ))}
                  </ul>
                )}

                <Link
                  to={productPath(product)}
                  onClick={onClose}
                  className="group/cta mt-6 flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-[0.95rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow"
                >
                  View full details <ArrowRight size={16} className="transition-transform group-hover/cta:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Product ids pinned to the front of a category's listing (marketing priority).
// Empty since the final-offerings catalog swap — repopulate with new ids as needed.
const PINNED_FIRST = {};

export default function TreatmentShop({ category, showBack = false }) {
  const [quickView, setQuickView] = useState(null);
  const pinned = PINNED_FIRST[category] || [];
  const products = productsData
    .filter((p) => p.categorySlug === category)
    .sort((a, b) => {
      const ai = pinned.indexOf(a.id);
      const bi = pinned.indexOf(b.id);
      if (ai === -1 && bi === -1) return 0;      // both unpinned → keep original order
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;                            // both pinned → pinned order
    });
  if (!products.length) return null;
  const name = products[0].categoryName;

  return (
    <section id="shop" className="scroll-mt-24 bg-surface-2 pb-[clamp(2.5rem,5.5vw,5rem)] pt-2">
      <div className="mx-auto max-w-[1180px] px-5 md:px-10">
        {/* Back sits inline-left of the centered header from sm up — no stacked
            row above the title, so the header starts at the section's top edge */}
        <div className="relative mb-5 text-center sm:mb-6">
          {showBack && (
            <div className="mb-2 text-left sm:absolute sm:left-0 sm:top-0 sm:mb-0">
              <BackButton />
            </div>
          )}
          <span className="nv-eyebrow">Prescription treatments</span>
          <h2 className="mt-1.5 text-[1.4rem] font-extrabold leading-tight sm:mt-2 sm:text-[clamp(1.8rem,4vw,2.6rem)]">
            {name}
          </h2>
          <p className="mx-auto mt-1.5 max-w-[44ch] text-[0.78rem] text-muted sm:mt-2 sm:text-[1.02rem]">
            Pick a treatment to start your visit — a licensed provider confirms the right fit before anything ships.
          </p>
        </div>

        {/* 2-up on phones, 3-up from tablet/kiosk width, keeps the list scannable */}
        <div className="grid grid-cols-2 gap-[clamp(0.9rem,1.6vw,1.25rem)] md:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} delay={(i % 3) * 0.05} floatDelay={-(i % 4) * 0.9} onQuickView={setQuickView} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/treatments"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-[0.95rem] font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-primary"
          >
            Explore other goals <ArrowRight size={15} />
          </Link>
        </div>

        {/* required compounded-drug + GLP-1 marketing disclaimers */}
        <CompoundedDisclaimer className="mx-auto mt-10 max-w-[680px] border-t border-line pt-6 text-center" />
      </div>

      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </section>
  );
}
