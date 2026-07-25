 
export const CATEGORY_ART = {
  "weight-loss": "/products/tpl-tirz-niacinamide-68mg.webp",
  "unisex-anti-aging-rx": "/products/tpl-nad-10ml.webp",
  "unisex-skin-health": "/products/tpl-glutathione-30ml.webp",
  "unisex-sports-medicine": "/products/tpl-nad-6ml.webp",
  "mens-health": "/products/tpl-bremelanotide.webp",
  supplements: "/products/tpl-nad-10ml.webp",
};

export const DEFAULT_ART = "/products/tpl-nad-10ml.webp";

export const categoryArt = (slug) => CATEGORY_ART[slug] || DEFAULT_ART;
