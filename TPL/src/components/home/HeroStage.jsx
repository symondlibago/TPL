import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONSULTS, CONSULT_ORDER } from "../data/consultations";
import { track, EVENTS } from "../../lib/analytics";
import { DEFAULT_ART } from "../../lib/categoryArt";

const EASE = [0.22, 0.61, 0.18, 1];


const HERO_TEXT = "desktop-only";

export const KIOSK_VARIANTS = {
  grid:      { wrap: "grid grid-cols-2 gap-4",   helpTile: true, card: () => ({ mode: "tile", span: "" }) },
  stack:     { wrap: "grid grid-cols-1 gap-3.5",                 card: () => ({ mode: "row", span: "" }) },
  spotlight: { wrap: "grid grid-cols-2 gap-4",   card: (i) => (i === 0 ? { mode: "row", span: "col-span-2", featured: true } : { mode: "tile", span: "" }) },
  list:      { wrap: "grid grid-cols-1 gap-2",                 card: () => ({ mode: "comprow", span: "" }) },
  mosaic:    { wrap: "grid grid-cols-2 gap-2", helpTile: true, compact: true, cornerFrame: true, card: () => ({ mode: "comptile", span: "" }) },
};
export const KIOSK_VARIANT_IDS = ["overlay", "desktop"];

function cornerClass(index, cols, rows) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  if (row === 0 && col === 0) return "rounded-tl-none";
  if (row === 0 && col === cols - 1) return "rounded-tr-none";
  if (row === rows - 1 && col === 0) return "rounded-bl-none";
  if (row === rows - 1 && col === cols - 1) return "rounded-br-none";
  return "";
}

function CategoryIcon({ size = 60, className = "", src = DEFAULT_ART }) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      style={{ height: size }}
      className={`nv-bob relative z-[3] w-auto shrink-0 object-contain drop-shadow-[0_12px_22px_rgba(15,22,34,0.45)] transition-transform duration-500 group-hover:scale-110 ${className}`}
    />
  );
}

function HelpChooseTile({ delay, compact = false, corner = "" }) {
  const R = "rounded-[calc(22px*var(--nv-r-scale,1))]";
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className="h-full"
    >
      <Link
        to="/start"
        onClick={() => track(EVENTS.QUIZ_STARTED, { source: "hero-kiosk-help" })}
        className={`group relative flex h-full flex-col justify-between overflow-hidden ${R} text-white nv-shadow-lg transition-all duration-500 hover:-translate-y-1.5 ${compact ? "min-h-[132px] p-4" : "min-h-[290px] p-8"} ${corner}`}
        style={{ background: "linear-gradient(150deg, var(--nv-primary), var(--nv-primary-deep))" }}
      >
        <span
          className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full opacity-50"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--nv-accent) 55%, transparent), transparent 70%)" }}
        />
        <span className={`relative z-[1] font-mono uppercase tracking-[0.14em] text-white/75 ${compact ? "text-[0.66rem]" : "text-[0.84rem]"}`}>
          Not sure where to start?
        </span>
        <div className="relative z-[1]">
          <h3 className={`font-display font-bold leading-tight ${compact ? "text-[1.2rem]" : "text-[2.1rem]"}`}>Take the 2-minute assessment</h3>
          {!compact && (
            <p className="mt-2 max-w-[26ch] text-[1.02rem] leading-snug text-white/80">
              Answer a few questions and we'll point you to the right care.
            </p>
          )}
          <span className={`inline-flex items-center gap-2 rounded-full bg-white font-semibold text-ink transition-all duration-300 group-hover:gap-3 ${compact ? "mt-2 px-3.5 py-2 text-[0.82rem]" : "mt-5 px-6 py-3.5 text-[1.02rem]"}`}>
            Start the assessment <ArrowRight size={compact ? 15 : 17} strokeWidth={2.4} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function GlassCard({ c, delay, mode = "auto", featured = false, className = "", corner = "" }) {
  if (mode !== "auto") {
    const compact = mode === "comprow" || mode === "comptile";
    const row = mode === "row" || mode === "comprow";
    return <BigGlassCard c={c} delay={delay} row={row} compact={compact} featured={featured} className={className} corner={corner} />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={`h-full ${className}`}
    >
      <Link
        to={`/treatments/${c.goalSlug}`}
        onClick={() => track(EVENTS.CATEGORY_SELECTED, { category: c.goalSlug, source: "hero" })}
        className="group relative flex h-full flex-row items-center gap-3.5 overflow-hidden rounded-[calc(18px*var(--nv-r-scale,1))] p-3.5 nv-shadow-lg transition-all duration-500 hover:-translate-y-1 sm:min-h-[212px] sm:flex-col sm:items-stretch sm:gap-0 sm:p-4 sm:hover:-translate-y-2"
      >
        <span className="nv-glass absolute inset-0 rounded-[calc(18px*var(--nv-r-scale,1))]" />
        {/* mobile only: a touch darker for contrast on the photo */}
        {/* scrim, not a panel — has to stay dark, the copy above it is white */}
        <span className="absolute inset-0 bg-scrim/45 sm:hidden" />

        {/* gloss sweep on hover (sm+ cards) */}
        <span className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden rounded-[calc(18px*var(--nv-r-scale,1))] sm:block">
          <span className="absolute left-0 top-0 h-full w-[60%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-accent/70 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
        </span>

        {/* category icon */}
        <CategoryIcon size={58} className="sm:mb-3 sm:self-start" />

        {/* tag · name */}
        <div className="relative z-[3] min-w-0 flex-1 sm:flex-none">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/80 drop-shadow-[0_1px_8px_rgba(15,22,34,0.4)] sm:text-[0.66rem]">
            {c.tag}
          </span>
          <h3 className="mt-0.5 font-display text-[1.22rem] font-bold leading-tight text-white drop-shadow-[0_1px_14px_rgba(15,22,34,0.55)] sm:mt-1.5 sm:text-[1.45rem]">
            {c.name}
          </h3>
        </div>

        {/* mobile trailing arrow — solid dark circle so it reads as a button */}
        <span className="relative z-[3] grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/55 bg-ink/45 text-white transition-colors group-hover:bg-ink/65 sm:hidden">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>

        {/* sm+ inline CTA */}
        <span className="relative z-[3] mt-auto hidden items-center gap-1.5 pt-2.5 text-[0.78rem] font-semibold text-white transition-all duration-500 group-hover:gap-2.5 drop-shadow-[0_1px_10px_rgba(15,22,34,0.45)] sm:inline-flex">
          Browse <ArrowRight size={13} strokeWidth={2.4} />
        </span>
      </Link>
    </motion.div>
  );
}

function BigGlassCard({ c, delay, row, compact = false, featured = false, className = "", corner = "" }) {
  const R = "rounded-[calc(22px*var(--nv-r-scale,1))]";

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay }}
        className={`h-full ${className}`}
      >
        <Link
          to={`/start/${c.slug}`}
          onClick={() => track(EVENTS.CATEGORY_SELECTED, { category: c.goalSlug, source: "hero-kiosk" })}
          className={`group relative flex h-full items-center gap-7 overflow-hidden ${R} p-8 nv-shadow-lg transition-all duration-500 hover:-translate-y-1.5`}
        >
          <span className={`nv-glass absolute inset-0 ${R}`} />
          {/* accent glow behind the pill */}
          <span
            className="pointer-events-none absolute -left-12 -top-16 h-60 w-60 rounded-full opacity-70"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--nv-accent) 40%, transparent), transparent 70%)" }}
          />
          {/* gloss sweep */}
          <span className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden ${R}`}>
            <span className="absolute left-0 top-0 h-full w-[60%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-accent/70 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
          </span>

          <CategoryIcon size={112} />

          <div className="relative z-[3] min-w-0 flex-1">
            <span className="font-mono text-[0.86rem] uppercase tracking-[0.14em] text-white/80 drop-shadow-[0_1px_8px_rgba(15,22,34,0.4)]">
              {c.tag}
            </span>
            <h3 className="mt-1.5 font-display text-[2.5rem] font-bold leading-[1.04] text-white drop-shadow-[0_1px_14px_rgba(15,22,34,0.55)]">
              {c.name}
            </h3>
            <p className="mt-2.5 max-w-[46ch] text-[1.08rem] leading-snug text-white/85 drop-shadow-[0_1px_10px_rgba(15,22,34,0.4)]">
              {c.blurb}
            </p>
          </div>

          <span className="relative z-[3] inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white px-7 py-4 text-[1.05rem] font-semibold text-ink transition-all duration-300 group-hover:gap-3.5 nv-shadow">
            Browse treatments <ArrowRight size={18} strokeWidth={2.4} />
          </span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={`h-full ${className}`}
    >
      <Link
        to={`/start/${c.slug}`}
        onClick={() => track(EVENTS.CATEGORY_SELECTED, { category: c.goalSlug, source: "hero-kiosk" })}
        className={`group relative flex h-full overflow-hidden ${R} nv-shadow-lg transition-all duration-500 hover:-translate-y-1.5 ${
          row
            ? (compact ? "flex-row items-center gap-4 p-4" : "flex-row items-center gap-6 p-7")
            : (compact ? "min-h-[132px] flex-row-reverse items-center gap-3 p-4" : "min-h-[290px] flex-col items-stretch p-8")
        } ${corner}`}
      >
        <span className={`nv-glass absolute inset-0 ${R} ${corner}`} />
        <span className={`pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden ${R} ${corner} sm:block`}>
          <span className="absolute left-0 top-0 h-full w-[60%] -translate-x-[180%] -skew-x-12 bg-linear-to-r from-transparent via-accent/70 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[230%]" />
        </span>

        <CategoryIcon
          size={row ? (compact ? 52 : 80) : (compact ? 80 : 96)}
          className={row ? "" : (compact ? "mr-2" : "mb-6 self-start")}
        />

        <div className="relative z-[3] min-w-0 flex-1">
          <span className={`font-mono uppercase tracking-[0.13em] text-white/80 drop-shadow-[0_1px_8px_rgba(15,22,34,0.4)] ${compact ? "text-[0.7rem]" : "text-[0.84rem]"}`}>
            {c.tag}
          </span>
          <h3 className={`mt-1 font-display font-bold leading-tight text-white drop-shadow-[0_1px_14px_rgba(15,22,34,0.55)] ${compact ? "text-[1.2rem]" : "text-[2.1rem]"}`}>
            {c.name}
          </h3>
          {!row && !compact && (
            <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[1.05rem] font-semibold text-white drop-shadow-[0_1px_10px_rgba(15,22,34,0.45)]">
              Browse <ArrowRight size={18} strokeWidth={2.4} />
            </span>
          )}
        </div>

        {row && (
          <span className={`relative z-[3] grid shrink-0 place-items-center rounded-full border border-white/45 text-white transition-colors group-hover:bg-white/15 ${compact ? "h-11 w-11" : "h-14 w-14"}`}>
            <ArrowRight size={compact ? 18 : 22} strokeWidth={2.2} />
          </span>
        )}
      </Link>
    </motion.div>
  );
}

function KioskPromoCard({ kiosk = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className={`overflow-hidden rounded-3xl ${kiosk ? "mt-3" : "mt-4"}`}
    >
      <video
        src="/feeling-your-best.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={`block w-full object-cover object-center ${kiosk ? "h-[320px]" : "h-[260px] sm:h-[340px] lg:h-[420px]"}`}
      />
    </motion.div>
  );
}

const BLANK_VIAL = "/products/tpl-vial-blank.webp";
const HERO_FEATURED = {
  tag: "Most requested",
  name: "Tirzepatide",
  desc: "Metabolic and weight management",
  // trimmed copy: the shared product-card render keeps its transparent margin,
  // which would make the vial read ~26% shorter than its box here.
  img: "/products/tpl-tirz-hero.webp",
  to: "/product/5",
};

const HERO_TREATMENTS = [
  { name: "Sermorelin", desc: "Growth hormone support", img: BLANK_VIAL, to: "/product/24" },
  { name: "Tesamorelin", desc: "Body composition", img: BLANK_VIAL, to: "/treatments" },
  { name: "Glutathione", desc: "Antioxidant infusion", img: "/products/tpl-glutathione-serum.webp", to: "/product/300" },
  { name: "PT-141", desc: "Libido and desire", img: "/products/tpl-pt141.webp", to: "/product/37" },
  { name: "Oxytocin", desc: "Mood and connection", img: BLANK_VIAL, to: "/treatments" },
  { name: "Copper peptide serum", desc: "Topical skin repair", img: "/products/tpl-copper-peptide.webp", to: "/treatments" },
];

// `large` = kiosk sizing. The kiosk is a walk-up display read from a distance, so it
// gets its own unprefixed scale rather than inheriting the desktop `lg:` values.
function ExploreTreatments({ large = false }) {
  return (
    <>
      <div className="flex items-baseline justify-between gap-4">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className={`font-mono uppercase tracking-[0.2em] text-muted ${large ? "text-[0.8rem]" : "text-[0.62rem]"}`}
        >
          Explore treatments
        </motion.span>
        <Link
          to="/treatments"
          onClick={() => track(EVENTS.BROWSE_TREATMENTS, { source: "hero-treatments" })}
          className={`group flex items-center gap-1.5 font-mono uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink ${
            large ? "text-[0.74rem]" : "text-[0.58rem] lg:text-[0.62rem]"
          }`}
        >
          All treatments
          <ArrowRight size={large ? 15 : 12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
        className={large ? "mt-5" : "mt-4"}
      >
        <Link
          to={HERO_FEATURED.to}
          className={`group relative flex items-center gap-3 overflow-hidden rounded-[calc(14px*var(--nv-r-scale,1))] transition-transform duration-300 hover:-translate-y-0.5 ${
            large ? "px-6 py-6" : "px-4 py-4 lg:py-5"
          }`}
          style={{ background: "linear-gradient(100deg, color-mix(in oklab, var(--nv-accent) 60%, var(--nv-surface)) 0%, color-mix(in oklab, var(--nv-accent) 80%, var(--nv-surface)) 100%)" }}
        >
          <span className="relative z-10 min-w-0 flex-1 text-left">
            <span className={`block font-mono uppercase tracking-[0.18em] text-ink/70 ${large ? "text-[0.72rem]" : "text-[0.5rem] lg:text-[0.58rem]"}`}>{HERO_FEATURED.tag}</span>
            <span
              className={`mt-0.5 block leading-tight text-ink ${large ? "text-[2.2rem]" : "text-[1.25rem] lg:text-[1.7rem]"}`}
              style={{ fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" }}
            >
              {HERO_FEATURED.name}
            </span>
            <span className={`mt-0.5 block leading-snug text-ink/75 ${large ? "text-[1.02rem]" : "text-[0.68rem] lg:text-[0.84rem]"}`}>{HERO_FEATURED.desc}</span>
          </span>
          {/* The phone keeps the vial inside the card at its natural height. The
              oversize-and-crop framing is desktop/kiosk only — note scale/translate
              need lg: prefixes or they leak down to phones. */}
          <span className={`relative z-0 shrink-0 self-stretch ${large ? "w-40" : "w-12 lg:w-36"}`}>
            <img
              src={HERO_FEATURED.img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`absolute left-1/2 w-auto max-w-none origin-bottom -translate-x-1/2 object-contain object-bottom transition-transform duration-500 ${
                large
                  ? "-bottom-16 h-[calc(100%+3.5rem)] translate-y-12 scale-[1.6] group-hover:scale-[1.68]"
                  : "bottom-0 h-full translate-y-0 scale-100 group-hover:scale-105 lg:-bottom-14 lg:h-[calc(100%+3rem)] lg:translate-y-11 lg:scale-[1.6] lg:group-hover:scale-[1.68]"
              }`}
            />
          </span>
          <ArrowRight size={large ? 26 : 18} className="relative z-10 shrink-0 text-ink transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
      <div className={`grid grid-cols-2 items-stretch ${large ? "mt-4 gap-4" : "mt-3 gap-3 lg:gap-3.5"}`}>
        {HERO_TREATMENTS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.26 + i * 0.05 }}
            className="h-full min-w-0"
          >
            <Link
              to={t.to}
              className={`group relative flex h-full items-center gap-2 overflow-hidden rounded-[calc(12px*var(--nv-r-scale,1))] border border-line bg-surface nv-shadow transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 ${
                large ? "px-5 py-5" : "px-3 py-3.5 lg:py-4"
              }`}
            >
              <span className="relative z-10 flex min-w-0 flex-1 flex-col items-start text-left">
                <span className={`font-semibold leading-tight text-ink transition-colors group-hover:text-primary ${large ? "text-[1.24rem]" : "text-[0.78rem] lg:text-[0.94rem]"}`}>
                  {t.name}
                </span>
                <span className={`mt-0.5 leading-snug text-muted ${large ? "text-[0.9rem]" : "text-[0.6rem] lg:text-[0.72rem]"}`}>{t.desc}</span>
                <span className={`mt-1.5 block h-0.5 rounded-full bg-accent/60 ${large ? "w-7" : "w-5"}`} />
              </span>
              {t.img && (
                <span className={`relative z-0 shrink-0 self-stretch ${large ? "w-28" : "w-10 lg:w-24"}`}>
                  <img
                    src={t.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className={`absolute left-1/2 w-auto max-w-none origin-bottom -translate-x-1/2 object-contain object-bottom transition-transform duration-500 ${
                      large
                        ? "-bottom-11 h-[calc(100%+3rem)] translate-y-9 scale-[1.4] group-hover:scale-[1.48]"
                        : "bottom-0 h-full translate-y-0 scale-100 group-hover:scale-105 lg:-bottom-9 lg:h-[calc(100%+2.5rem)] lg:translate-y-8 lg:scale-[1.4] lg:group-hover:scale-[1.48]"
                    }`}
                  />
                </span>
              )}
              <ArrowRight size={large ? 20 : 14} className="relative z-10 shrink-0 text-ink transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}

function GoalRow({ tag, name, to, onClick, icon = null, art = DEFAULT_ART, delay = 0, big = false, snug = false }) {
  const tight = !big && !snug;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className="h-full min-w-0"
    >
      <Link
        to={to}
        onClick={onClick}
        className={`group flex h-full items-center justify-start border-b border-line transition-colors hover:border-primary/40 ${
          big ? "gap-5 py-5" : tight ? "gap-1.5 py-3 lg:gap-3.5 lg:py-3" : "gap-3.5 py-3"
        }`}
      >
        <span className={`grid shrink-0 place-items-center rounded-full border border-line bg-surface nv-shadow transition-transform duration-300 group-hover:scale-105 ${big ? "h-18 w-18" : tight ? "h-9 w-9 lg:h-11 lg:w-11" : "h-11 w-11"}`}>
          {icon || <img src={art} alt="" aria-hidden="true" loading="lazy" className={`w-auto object-contain ${big ? "h-10" : tight ? "h-5 lg:h-6" : "h-6"}`} />}
        </span>
        <span className="min-w-0 text-left">
          <span className={`block font-mono uppercase tracking-[0.16em] text-accent ${big ? "text-[0.78rem]" : tight ? "text-[0.46rem] leading-tight tracking-[0.04em] lg:text-[0.6rem] lg:tracking-[0.16em]" : "text-[0.6rem]"}`}>{tag}</span>
          <span
            className={`block text-ink transition-colors group-hover:text-primary lg:truncate lg:leading-snug ${big ? "text-[1.42rem]" : snug ? "text-[0.98rem]" : tight ? "text-[0.82rem] leading-tight lg:text-[1.06rem]" : "text-[1.06rem] leading-snug"}`}
            style={{ fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" }}
          >
            {name}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

function HeroHeadline({ compact = false, wide = false, minimal = false }) {
  const justify = compact ? "justify-center" : wide ? "justify-start" : "justify-center lg:justify-start";
  const mx = compact ? "mx-auto" : wide ? "" : "mx-auto lg:mx-0";
  return (
    <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
      {/* eyebrow */}
      <span className={`flex items-center gap-3 font-mono text-[0.66rem] uppercase tracking-[0.22em] text-accent ${justify}`}>
        <span className="h-px w-6 bg-accent" aria-hidden="true" /> Physician-formulated care
      </span>

      <h1
        className={`nv-weight-keep mt-4 max-w-[15ch] font-medium leading-[1.08] tracking-[-0.01em] text-ink ${mx} ${
          compact ? "text-[clamp(1.9rem,5vw,2.6rem)]" : "text-[clamp(1.9rem,3.4vw,2.8rem)]"
        }`}
        style={{ fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" }}
      >
        Modern healthcare, <em className="whitespace-nowrap italic text-accent">built around you</em>
      </h1>

      {minimal ? null : (
      <p className={`mt-4 max-w-[42ch] leading-relaxed text-muted ${mx} ${compact ? "text-[0.95rem]" : "text-[clamp(0.95rem,1.1vw,1.02rem)]"}`}>
        Personalized treatment plans designed by licensed medical providers.
      </p>
      )}

      {/* CTAs */}
      <div className={`flex flex-wrap items-center gap-5 ${minimal ? "hidden" : ""} ${compact ? "mt-6" : "mt-6"} ${justify}`}>
        <Link
          to="/treatments"
          onClick={() => track(EVENTS.BROWSE_TREATMENTS, { source: "hero" })}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[0.95rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow"
        >
          Get started <ArrowRight size={15} strokeWidth={2.4} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <a href="#how" className="group inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-ink transition-colors hover:text-primary">
          See how it works <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
function EditorialHero({ compact = false, forceWide = false }) {
  const wide = forceWide;
  const isKiosk = compact || wide;
  const showText = isKiosk ? HERO_TEXT === "all" : HERO_TEXT !== "none";
  const webTextLgOnly = !isKiosk && HERO_TEXT === "desktop-only";
  const mobileText = !isKiosk && HERO_TEXT !== "none";
  return (
    <section className="relative isolate overflow-hidden bg-bg">
      {/* right-side ambient video — soft-blended into the background */}
      {!compact && (
        <div className={`pointer-events-none absolute inset-y-0 right-0 ${wide ? "block w-[80%]" : "hidden w-[65%] lg:block"}`}>
          <video
            src={wide ? "/right-side-portrait.mp4" : "/right-vid.mp4"}
            autoPlay loop muted playsInline
            className="h-full w-full object-cover object-right"
          />
          <span
            className="absolute inset-y-0 -left-0.5 right-0"
            style={{
              background: wide
                ? "linear-gradient(90deg, var(--nv-bg) 0%, var(--nv-bg) 30%, color-mix(in oklab, var(--nv-bg) 97%, transparent) 36%, color-mix(in oklab, var(--nv-bg) 90%, transparent) 44%, color-mix(in oklab, var(--nv-bg) 78%, transparent) 53%, color-mix(in oklab, var(--nv-bg) 62%, transparent) 62%, color-mix(in oklab, var(--nv-bg) 45%, transparent) 71%, color-mix(in oklab, var(--nv-bg) 29%, transparent) 79%, color-mix(in oklab, var(--nv-bg) 15%, transparent) 87%, color-mix(in oklab, var(--nv-bg) 5%, transparent) 93%, transparent 98%)"
                : "linear-gradient(90deg, var(--nv-bg) 0%, var(--nv-bg) 6%, color-mix(in oklab, var(--nv-bg) 97%, transparent) 11%, color-mix(in oklab, var(--nv-bg) 90%, transparent) 18%, color-mix(in oklab, var(--nv-bg) 78%, transparent) 26%, color-mix(in oklab, var(--nv-bg) 62%, transparent) 34%, color-mix(in oklab, var(--nv-bg) 45%, transparent) 42%, color-mix(in oklab, var(--nv-bg) 29%, transparent) 49%, color-mix(in oklab, var(--nv-bg) 15%, transparent) 56%, color-mix(in oklab, var(--nv-bg) 5%, transparent) 61%, transparent 66%)",
            }}
          />
        </div>
      )}

      {!compact && !wide && (
        <div className="pointer-events-none relative lg:hidden">
          {/* No bottom gradient — client asked for a clean edge where the video meets
              the page, rather than the old fade into the background colour. */}
          <video
            src="/right-vid.mp4"
            autoPlay loop muted playsInline
            className={`block w-full object-cover ${mobileText ? "h-72 sm:h-80" : "h-104 sm:h-136"}`}
          />
        </div>
      )}

      {/* Overlay layout — full-bleed portrait video with the headline on top */}
      {compact && (
        <div className="relative">
          <video src="/right-side-portrait.mp4" autoPlay loop muted playsInline className="block h-120 w-full object-cover" />
          {/* video stays clean — only a short blend at the very bottom into the page bg */}
          <span
            className="absolute inset-x-0 -bottom-0.5 h-28"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--nv-bg) 55%, transparent) 60%, var(--nv-bg) 100%)",
            }}
          />
          {showText && (
            <div className="absolute inset-0 z-10 mx-auto flex max-w-2xl flex-col items-center justify-center px-6 text-center">
              {/* readability comes from the panel behind the text, not a full-video fade */}
              <div className="rounded-[calc(24px*var(--nv-r-scale,1))] bg-bg/85 px-7 py-8 backdrop-blur-sm nv-shadow sm:px-10">
                <HeroHeadline compact />
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`mx-auto flex max-w-375 flex-col justify-center px-5 md:px-10 ${compact ? "pb-8" : wide ? "pb-[clamp(2.2rem,4.5vw,3.6rem)] pt-[clamp(2.2rem,4.5vw,3.6rem)]" : "pb-[clamp(2.2rem,4.5vw,3.6rem)] lg:min-h-168 lg:py-[clamp(3rem,6vw,5.5rem)]"}`}>
        <div className={`relative z-10 ${compact ? "mx-auto max-w-2xl text-center" : wide ? "w-[66%] text-left" : "mx-auto mt-0 max-w-140 pt-7 text-center lg:mx-0 lg:w-1/2 lg:pt-0 lg:text-left"}`}>
          {!compact && showText && (
            <>
              {webTextLgOnly && (
                <div className="lg:hidden">
                  <HeroHeadline minimal />
                </div>
              )}
              <div className={webTextLgOnly ? "hidden lg:block" : undefined}>
                <HeroHeadline wide={wide} />
              </div>
            </>
          )}

          {/* explore by goal — the rule and the label are desktop/kiosk only; the
              client's phone design goes straight from the headline into the cards */}
          <div
            className={
              compact || wide
                ? `border-t border-line ${compact ? "mt-2 pt-4" : "mt-7 pt-5"}`
                : "mt-6 lg:mt-7 lg:border-t lg:border-line lg:pt-5"
            }
          >
            {/* Every variant now shows the treatment shortlist. `compact` is the
                kiosk overlay, which gets the larger walk-up scale; `wide` (tablet)
                is above the lg breakpoint so it picks up the desktop sizing. */}
            <ExploreTreatments large={compact} />
          </div>

        </div>
      </div>
    </section>
  );
}

export default function HeroStage({ kioskVariant = null }) {
  if (kioskVariant === "desktop") return <EditorialHero forceWide />;
  return <EditorialHero compact={!!kioskVariant} />;
}

/* Kiosk hero — unchanged: photo backdrop + the client-selected card layout. */
function KioskHero({ kiosk }) {
  const stageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  return (
    <section ref={stageRef} className="relative isolate overflow-hidden">
      {/* Ken-burns background photo + parallax */}
      <motion.div style={{ y: bgY }} className="absolute -inset-[8%] -z-30 will-change-transform">
        <img
          src="/home-hero.avif"
          alt=""
          aria-hidden="true"
          className="nv-kenburns h-full w-full object-cover [object-position:62%_38%] [filter:grayscale(0.45)_saturate(0.85)_contrast(1.02)]"
        />
      </motion.div>
      {/* Palette-tinted gradient veils */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(120% 90% at 20% 10%, color-mix(in oklab, var(--nv-bg) 95%, transparent), color-mix(in oklab, var(--nv-bg) 55%, transparent) 45%, transparent 72%), linear-gradient(180deg, color-mix(in oklab, var(--nv-bg) 50%, transparent), color-mix(in oklab, var(--nv-accent) 22%, transparent) 38%, color-mix(in oklab, var(--nv-primary) 34%, transparent))",
        }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--nv-primary) 20%, transparent))" }}
      />

      <div className={`mx-auto max-w-[1500px] px-5 md:px-10 ${kiosk ? "pb-5 pt-3" : "pb-[clamp(48px,7vw,88px)] pt-[clamp(16px,3vw,36px)]"}`}>
        {/* Hero row — centered in the kiosk/tablet layout, left-aligned otherwise */}
        <div className={`flex flex-col ${kiosk ? "mb-4 items-center gap-3 text-center" : "mb-[clamp(30px,4vw,50px)] items-start justify-between gap-7 md:flex-row md:items-end"}`}>
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <h1
              className={`nv-weight-keep max-w-[16ch] font-medium leading-[1.02] tracking-[-0.01em] text-ink ${kiosk ? "mx-auto text-[clamp(1.55rem,4.4vw,2.2rem)]" : "text-[clamp(2.3rem,5.8vw,4.3rem)]"}`}
              style={{ fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif" }}
            >
              Modern healthcare,{" "}
              <span className="nv-em font-medium">built around you</span>
            </h1>
            <p className={`max-w-[42ch] leading-relaxed text-muted ${kiosk ? "mx-auto mt-2 text-[clamp(0.82rem,1.1vw,0.95rem)]" : "mt-[18px] text-[clamp(1rem,1.3vw,1.1rem)]"}`}>
              Personalized treatment plans designed by licensed medical providers.
            </p>
          </motion.div>

          {/* In kiosk mode the category cards are the primary CTA — hide the
              redundant button so the hero fits on one screen. */}
          {!kiosk && (
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.12 }}
              className="shrink-0"
            >
              <Link
                to="/treatments"
                onClick={() => track(EVENTS.BROWSE_TREATMENTS, { source: "hero" })}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-[calc(14px*var(--nv-r-scale,1))] border-[1.5px] border-primary/55 px-4 py-2.5 text-[0.9rem] font-bold tracking-tight text-ink transition-colors duration-300 hover:border-primary hover:text-on-primary sm:px-5 sm:py-3 sm:text-[0.98rem]"
              >
                <span
                  className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0"
                  style={{ background: "linear-gradient(135deg, var(--nv-primary), var(--nv-primary-deep))" }}
                />
                <span className="relative z-10">Browse all treatments</span>
                <span className="relative z-10 grid h-[22px] w-[22px] place-items-center rounded-full border-[1.5px] border-current transition-transform duration-300 group-hover:translate-x-1">
                  <ArrowRight size={12} strokeWidth={2.6} />
                </span>
              </Link>
            </motion.div>
          )}
        </div>
        {kiosk ? (
          (() => {
            const cells = CONSULT_ORDER.length + (kiosk.helpTile ? 1 : 0);
            const rows = Math.ceil(cells / 2);
            return (
              <div className={kiosk.wrap}>
                {CONSULT_ORDER.map((key, i) => {
                  const { mode, span, featured } = kiosk.card(i);
                  const corner = kiosk.cornerFrame ? cornerClass(i, 2, rows) : "";
                  return <GlassCard key={key} c={CONSULTS[key]} delay={(i % 5) * 0.06} mode={mode} featured={featured} className={span} corner={corner} />;
                })}
                {kiosk.helpTile && (
                  <HelpChooseTile
                    delay={CONSULT_ORDER.length * 0.06}
                    compact={kiosk.compact}
                    corner={kiosk.cornerFrame ? cornerClass(CONSULT_ORDER.length, 2, rows) : ""}
                  />
                )}
              </div>
            );
          })()
        ) : (
          <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-3 sm:gap-[clamp(0.7rem,1.2vw,1rem)] lg:grid-cols-5">
            {CONSULT_ORDER.map((key, i) => (
              <GlassCard key={key} c={CONSULTS[key]} delay={(i % 5) * 0.06} />
            ))}
          </div>
        )}

        {/* Wide card — Smart Kiosk promo (looping video) */}
        <KioskPromoCard kiosk={!!kiosk} />
      </div>
    </section>
  );
}