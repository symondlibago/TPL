import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, Check, ArrowRight, MessageSquare, ShieldCheck, ChevronDown } from "lucide-react";
import Seo from "../components/Seo";
import Navbar from "../components/Nav/Navbar";
import Footer from "../components/Nav/Footer";
import PageHero from "../components/shop/PageHero";
import Reveal from "../components/ui/Reveal";
import { track, EVENTS } from "../lib/analytics";

const DETAILS = [
  { icon: Mail, label: "Email", value: "care@thepeptidelounge.com", href: "mailto:care@thepeptidelounge.com" },
  { icon: Clock, label: "Hours", value: "Mon–Fri, 8am–8pm ET" },
];

const field =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-[0.96rem] text-ink outline-none transition-all placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/15";

const TOPICS = ["General", "My protocol", "An order", "Getting started", "Billing"];

/** Themed dropdown — replaces the native <select> so the menu matches the brand. */
function TopicSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`${field} flex items-center justify-between text-left ${open ? "border-primary ring-2 ring-primary/15" : ""}`}
      >
        <span>{value}</span>
        <ChevronDown size={18} className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-line bg-surface p-1.5 nv-shadow-lg"
          >
            {TOPICS.map((opt) => {
              const on = opt === value;
              return (
                <li key={opt} role="option" aria-selected={on}>
                  <button
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[0.95rem] transition-colors ${
                      on ? "bg-surface-2 font-semibold text-primary" : "text-ink hover:bg-surface-2"
                    }`}
                  >
                    {opt}
                    {on && <Check size={15} className="text-primary" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    // Record the submission (topic only — never name/email/message).
    track(EVENTS.CONTACT_SUBMITTED, { topic: form.topic });
    // Front-end demo: no backend wired. Surface a success state.
    setSent(true);
  };

  return (
    <main className="min-h-screen w-full bg-bg text-ink">
      <Seo
        title="Contact Us"
        description="Get in touch with the Peptide Lounge care team — questions about treatments, orders, kiosk partnerships or anything else."
        path="/contact"
      />
      <Navbar />

      <PageHero
        showBack
        eyebrow="Contact"
        title="We're here to help."
        subtitle="Questions about your protocol, an order, or getting started? Message our care team — a real person replies, usually within one business day."
        chips={["Reply within 1 business day", "HIPAA-compliant", "U.S.-licensed providers"]}
      />

      <section className="mx-auto max-w-[1140px] px-5 py-[clamp(2.8rem,6vw,4.5rem)] md:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-[calc(28px*var(--nv-r-scale,1))] border border-line bg-surface nv-shadow-lg">
            <div className="grid md:grid-cols-[0.82fr_1.18fr]">
              {/* --- Dark info panel --- */}
              <div className="relative order-2 overflow-hidden bg-panel p-[clamp(1.6rem,3.4vw,2.6rem)] text-ink md:order-1">
                {/* decorative glows */}
                <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/25 blur-3xl" />
                <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-primary/50 blur-3xl" />

                <div className="relative flex h-full flex-col">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent">Talk to us</span>
                  <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight">
                    A care team that actually answers
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-[0.96rem] leading-relaxed text-ink/80">
                    Reach the care team directly no phone trees, no bots reading from a script.
                  </p>

                  {/* contact methods */}
                  <div className="mt-7 flex flex-col gap-2.5">
                    {DETAILS.map((d) => {
                      const Inner = (
                        <>
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                            <d.icon size={18} strokeWidth={1.9} />
                          </span>
                          <span className="flex min-w-0 flex-col">
                            <span className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">{d.label}</span>
                            <span className="truncate text-[0.98rem] font-semibold text-ink">{d.value}</span>
                          </span>
                        </>
                      );
                      return d.href ? (
                        <a
                          key={d.label}
                          href={d.href}
                          className="group flex items-center gap-3.5 rounded-2xl border border-ink/12 bg-ink/[0.04] px-3.5 py-3 transition-colors hover:bg-ink/8"
                        >
                          {Inner}
                          <ArrowRight size={15} className="ml-auto shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                        </a>
                      ) : (
                        <div key={d.label} className="flex items-center gap-3.5 rounded-2xl border border-ink/12 bg-ink/[0.04] px-3.5 py-3">
                          {Inner}
                        </div>
                      );
                    })}
                  </div>

                  {/* response promise */}
                  <div className="mt-5 flex items-center gap-3 rounded-2xl border border-ink/12 bg-ink/[0.04] px-4 py-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                      <MessageSquare size={16} strokeWidth={2} />
                    </span>
                    <p className="text-[0.88rem] leading-snug text-ink/80">
                      Most messages get a reply the <span className="font-semibold text-ink">same business day</span>.
                    </p>
                  </div>

                  <p className="mt-6 text-[0.76rem] leading-relaxed text-muted">
                    For a medical emergency, call 911. This inbox isn't monitored for urgent clinical needs.
                  </p>
                </div>
              </div>

              {/* --- Form --- */}
              <div className="order-1 p-[clamp(1.5rem,3.4vw,2.8rem)] md:order-2">
                {sent ? (
                  <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
                      <Check size={30} strokeWidth={2.4} />
                    </span>
                    <h2 className="text-[1.7rem] font-extrabold tracking-tight">Message sent.</h2>
                    <p className="max-w-[40ch] text-muted">
                      Thanks, {form.name || "there"} — our care team will reply to{" "}
                      <span className="font-semibold text-ink">{form.email || "your email"}</span> shortly.
                    </p>
                    <button
                      onClick={() => { setSent(false); setForm({ name: "", email: "", topic: "General", message: "" }); }}
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-2.5 text-[0.92rem] font-semibold transition-colors hover:border-primary hover:text-primary"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <h2 className="text-[1.45rem] font-extrabold tracking-tight">Send us a message</h2>
                      <p className="mt-1.5 text-[0.92rem] text-muted">Fill this out and we'll get right back to you.</p>
                    </div>
                    <form onSubmit={onSubmit} className="flex flex-col gap-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className="flex flex-col gap-1.5">
                          <span className="text-[0.82rem] font-semibold text-muted">Full name</span>
                          <input required value={form.name} onChange={update("name")} className={field} placeholder="Jane Doe" />
                        </label>
                        <label className="flex flex-col gap-1.5">
                          <span className="text-[0.82rem] font-semibold text-muted">Email</span>
                          <input required type="email" value={form.email} onChange={update("email")} className={field} placeholder="jane@email.com" />
                        </label>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[0.82rem] font-semibold text-muted">Topic</span>
                        <TopicSelect value={form.topic} onChange={(v) => setForm((f) => ({ ...f, topic: v }))} />
                      </div>
                      <label className="flex flex-col gap-1.5">
                        <span className="text-[0.82rem] font-semibold text-muted">Message</span>
                        <textarea required rows={5} value={form.message} onChange={update("message")} className={`${field} resize-none`} placeholder="How can we help?" />
                      </label>
                      <button
                        type="submit"
                        className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-[0.96rem] font-semibold text-on-primary transition-all hover:-translate-y-0.5 hover:bg-primary-deep nv-shadow"
                      >
                        Send message <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </button>
                      <p className="flex items-center justify-center gap-1.5 text-[0.78rem] text-muted">
                        <ShieldCheck size={13} className="text-primary" /> Your details are private and never sold.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
