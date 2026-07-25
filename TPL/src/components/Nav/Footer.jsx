import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const TikTokIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.55a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.0z" />
  </svg>
);

const social = "grid h-10 w-10 place-items-center rounded-full bg-white/10 text-on-panel transition-colors hover:bg-accent hover:text-panel";

export default function Footer() {
  return (
    <footer className="mt-auto w-full bg-panel pb-10 pt-16 text-on-panel/75 md:pt-24">
      <div className="mx-auto max-w-[1340px] px-6 md:px-10">
        <div className="mb-12 grid grid-cols-2 gap-x-6 gap-y-9 md:mb-20 md:grid-cols-4 md:gap-10 lg:gap-16">
          <div className="col-span-2 lg:col-span-1 md:pr-8">
            <span className="inline-flex w-fit rounded-2xl bg-surface px-5 py-3.5 nv-shadow">
              <img src="/logo.png" alt="The Peptide Lounge" className="h-[42px] w-auto" />
            </span>
            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-on-panel/60">
              Personalized supplements and treatments, formulated by licensed physicians and delivered to your door.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="https://www.facebook.com/thepeptidelounge" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={social}><Facebook size={18} strokeWidth={1.5} /></a>
              <a href="https://www.instagram.com/thepeptidelounge" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={social}><Instagram size={18} strokeWidth={1.5} /></a>
              <a href="https://www.tiktok.com/@thepeptidelounge" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={social}><TikTokIcon size={18} /></a>
              <a href="https://x.com/thepeptidelounge" target="_blank" rel="noopener noreferrer" aria-label="X" className={social}><Twitter size={18} strokeWidth={1.5} /></a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent md:mb-6">Treatments</h4>
            <ul className="space-y-3 text-[14px] text-on-panel/60 md:space-y-4">
              <li><Link to="/treatments" className="transition-colors hover:text-on-panel">All Treatments</Link></li>
              <li><Link to="/treatments/weight-loss" className="transition-colors hover:text-on-panel">Weight Loss</Link></li>
              <li><Link to="/treatments/unisex-anti-aging-rx" className="transition-colors hover:text-on-panel">Anti-Aging</Link></li>
              <li><Link to="/treatments/unisex-skin-health" className="transition-colors hover:text-on-panel">Skin Health</Link></li>
              <li><Link to="/treatments/mens-health" className="transition-colors hover:text-on-panel">Sexual Health</Link></li>
              <li><Link to="/treatments/unisex-sports-medicine" className="transition-colors hover:text-on-panel">Sports Medicine</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent md:mb-6">Company</h4>
            <ul className="space-y-3 text-[14px] text-on-panel/60 md:space-y-4">
              <li><Link to="/#how" className="transition-colors hover:text-on-panel">How it works</Link></li>
              <li><Link to="/kiosk" className="transition-colors hover:text-on-panel">Smart Kiosk</Link></li>
              <li><Link to="/supplements" className="transition-colors hover:text-on-panel">Supplements</Link></li>
              <li><Link to="/#reviews" className="transition-colors hover:text-on-panel">Reviews</Link></li>
              <li><Link to="/#faq" className="transition-colors hover:text-on-panel">FAQ</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-on-panel">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.13em] text-accent md:mb-6">Legal</h4>
            <ul className="space-y-3 text-[14px] text-on-panel/60 md:space-y-4">
              <li><Link to="/legal/privacy-policy" className="transition-colors hover:text-on-panel">Privacy policy</Link></li>
              <li><Link to="/legal/hipaa-notice-of-privacy-practices" className="transition-colors hover:text-on-panel">Notice of Privacy Practices</Link></li>
              <li><Link to="/legal/terms-and-conditions" className="transition-colors hover:text-on-panel">Terms &amp; conditions</Link></li>
              <li><Link to="/legal/telehealth-consent" className="transition-colors hover:text-on-panel">Telehealth consent</Link></li>
              <li><Link to="/legal/consumer-health-data" className="transition-colors hover:text-on-panel">Consumer Health Data</Link></li>
              <li><Link to="/legal/sitemap" className="transition-colors hover:text-on-panel">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-[13px] text-on-panel/50 md:flex-row md:items-center md:justify-between md:pt-10">
          <p>©2026 The Peptide Lounge Inc. All rights reserved.</p>
          <a
            href="mailto:privacy@thepeptidelounge.com?subject=Do%20Not%20Sell%20or%20Share%20My%20Personal%20Information&body=I%20am%20requesting%20to%20opt%20out%20of%20the%20sale%20or%20sharing%20of%20my%20personal%20information.%20Please%20process%20this%20request%20for%20the%20email%20address%20on%20file."
            className="font-medium text-on-panel/70 underline underline-offset-2 transition-colors hover:text-on-panel"
          >
            Do Not Sell or Share My Personal Information
          </a>
        </div>

        <div className="mt-8 max-w-6xl space-y-2 text-left text-[10px] leading-relaxed text-on-panel/40 md:text-[11px]">
          <p>
            Compounded drug products are not approved or evaluated for safety, effectiveness, or quality
            by the FDA. Prescription required. The Peptide Lounge does not manufacture drug products.
          </p>
          <p>
            The medication you receive may differ in appearance from the website images. Results not
            guaranteed and side effects may occur.
          </p>
          <p>
            Prescription products require an online evaluation by a licensed medical professional.
            Medications are prescribed by licensed physicians as part of our programs. For prescription
            items, The Peptide Lounge will arrange a consultation with a qualified healthcare provider.
          </p>
          <p>
            Most online visits are quick, but appointment length may vary based on
            the patient's medical needs and the treating clinician's independent professional judgment.
            The provider — not The Peptide Lounge or its management services organization — determines how long each
            clinical evaluation takes.
          </p>
        </div>
      </div>
    </footer>
  );
}
