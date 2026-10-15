import type { StaticImageData } from "next/image";
import pinkArgonauts from "@/assets/work/pink-argonauts-golf-ticket.jpg";
import threeMDisplay from "@/assets/work/3m-a-la-carte-display.jpg";
import nexcare from "@/assets/work/nexcare-packaging-dispenser.jpg";
import grohe from "@/assets/work/grohe-eurosmart-literature.jpg";
import scotchBrite from "@/assets/work/scotch-brite-mobile-app.jpg";
import hpBus from "@/assets/work/hp-bus-wraps.jpg";
import feuGolf from "@/assets/work/feu-nrmf-green-gold-cup.jpg";
import heritage from "@/assets/work/heritage-place-brochure.jpg";

/**
 * Portfolio images (preview set). Cropped from the Brand Kit portfolio board, about 470 px wide: fine for
 * cards and the hero collage, too small for full-width galleries. Replace with GLI originals (Q-08, R-02).
 * Prescription-product (Rx) images are deliberately NOT in the repo until GLI clears them (BRD FR-032).
 *
 * `fit: "contain"` = artwork on a white board (render/packshot); shown on Mist without cropping.
 */
export type WorkImage = { src: StaticImageData; alt: string; caption: string; client?: string; rx: boolean; fit: "cover" | "contain" };

const IMAGES = {
  pinkArgonauts: { src: pinkArgonauts, alt: "Golf tournament ticket with a perforated stub, pink and green event design", caption: "Charity golf tournament ticket, 2025", rx: false, fit: "cover" },
  threeMDisplay: { src: threeMDisplay, alt: "3D render of a red-roofed trolley display and a bathroom-product display module", caption: "In-store display modules (3D renders)", client: "3m", rx: false, fit: "contain" },
  nexcare: { src: nexcare, alt: "Anti-fever gel patch packaging and a matching counter dispenser", caption: "Packaging and counter dispenser", client: "3m", rx: false, fit: "contain" },
  grohe: { src: grohe, alt: "Kitchen mixer tap rinsing vegetables, from a product literature spread", caption: "Product literature adapted for the Philippine market", client: "lixil", rx: false, fit: "cover" },
  scotchBrite: { src: scotchBrite, alt: "Tablet screens from a cleaning-product mobile game", caption: "Mobile game screens", client: "3m", rx: false, fit: "contain" },
  hpBus: { src: hpBus, alt: "Mock-ups of bus wraps and pull-up banners for an all-in-one computer campaign", caption: "Bus wraps and service-centre banners", client: "hp", rx: false, fit: "contain" },
  feuGolf: { src: feuGolf, alt: "Gold and green event poster for a golf tournament for a cause, January 2025", caption: "Green & Gold Cup event identity, January 2025", client: "feu-nrmf-medical-alumni", rx: false, fit: "cover" },
  heritage: { src: heritage, alt: "Tri-fold real-estate brochure with green leaf artwork", caption: "Real-estate brochure suite", rx: false, fit: "contain" },
} satisfies Record<string, WorkImage>;

export const WORK_IMAGES: { [K in keyof typeof IMAGES]: WorkImage } = IMAGES;
