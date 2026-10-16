import { WORK_IMAGES, type WorkImage } from "./work-images";

/**
 * Tile image per service (S5). `null` = no permitted, non-Rx image yet: the tile uses a typographic proof instead.
 * Pharma, booth and merchandise tiles wait for GLI-cleared images (pharma/booth originals are Rx-sensitive).
 */
export const SERVICE_MEDIA: Record<string, WorkImage | null> = {
  "pharma-and-medical-materials": null,
  "booth-design-and-fabrication": null,
  "events-conventions-and-launches": WORK_IMAGES.ppscStage,
  "retail-display-and-posm": WORK_IMAGES.twisterInstore,
  "packaging-design": WORK_IMAGES.nexcare,
  "print-and-collateral": WORK_IMAGES.heritage,
  "large-format-signage-and-wraps": WORK_IMAGES.hpBus,
  "avp-interactive-games-and-apps": WORK_IMAGES.scotchBrite,
  "brand-and-graphic-design": WORK_IMAGES.pinkArgonauts,
  "merchandise-and-apparel": null,
};

/** Home grid order (Document 4 §2): pharma lead tile first. */
export const HOME_SERVICE_ORDER = [
  "pharma-and-medical-materials",
  "booth-design-and-fabrication",
  "events-conventions-and-launches",
  "retail-display-and-posm",
  "packaging-design",
  "print-and-collateral",
  "large-format-signage-and-wraps",
  "avp-interactive-games-and-apps",
  "brand-and-graphic-design",
  "merchandise-and-apparel",
];

/**
 * Extra "from the floor" photos per service page (GLI's own non-Rx work from the Work Experiences deck).
 * Rendered as a gallery on the service page when present.
 */
export const SERVICE_GALLERY: Record<string, WorkImage[]> = {
  "events-conventions-and-launches": [
    WORK_IMAGES.ppscChandeliers,
    WORK_IMAGES.pcpHeroWall,
    WORK_IMAGES.pcpPrereg,
    WORK_IMAGES.pcpOnsite,
    WORK_IMAGES.beachDusk,
    WORK_IMAGES.beachNight,
    WORK_IMAGES.symposiumAudience,
    WORK_IMAGES.boracayFireworks,
  ],
  "avp-interactive-games-and-apps": [WORK_IMAGES.symposiumQuiz],
  "retail-display-and-posm": [WORK_IMAGES.twisterRender, WORK_IMAGES.twisterInstore],
  "packaging-design": [WORK_IMAGES.scotchBritePacks, WORK_IMAGES.nexcare],
};
