import type { StaticImageData } from "next/image";
import pinkArgonauts from "@/assets/work/pink-argonauts-golf-ticket.jpg";
import threeMDisplay from "@/assets/work/3m-a-la-carte-display.jpg";
import nexcare from "@/assets/work/nexcare-packaging-dispenser.jpg";
import grohe from "@/assets/work/grohe-eurosmart-literature.jpg";
import scotchBrite from "@/assets/work/scotch-brite-mobile-app.jpg";
import hpBus from "@/assets/work/hp-bus-wraps.jpg";
import feuGolf from "@/assets/work/feu-nrmf-green-gold-cup.jpg";
import heritage from "@/assets/work/heritage-place-brochure.jpg";
import twisterInstore from "@/assets/work/3m-twister-instore.jpg";
import twisterRender from "@/assets/work/3m-twister-render.jpg";
import scotchBritePacks from "@/assets/work/scotch-brite-packaging.jpg";
import ppscStage from "@/assets/work/ppsc-ballroom-stage.jpg";
import ppscWide from "@/assets/work/ppsc-ballroom-wide.jpg";
import ppscChandeliers from "@/assets/work/ppsc-stage-chandeliers.jpg";
import pharmacistBallroom from "@/assets/work/pharmacist-leads-ballroom.jpg";
import boracayFireworks from "@/assets/work/boracay-beach-fireworks.jpg";
import beachDusk from "@/assets/work/beach-event-dusk.jpg";
import beachNight from "@/assets/work/beach-event-night.jpg";
import symposiumQuiz from "@/assets/work/symposium-quiz-game.jpg";
import symposiumAudience from "@/assets/work/symposium-audience.jpg";
import pcpHeroWall from "@/assets/work/pcp-hero-exhibit-wall.jpg";
import pcpOnsite from "@/assets/work/pcp-onsite-registration.jpg";
import pcpPrereg from "@/assets/work/pcp-preregistration.jpg";

/**
 * Portfolio images. The first set is cropped from the Brand Kit portfolio board (~470 px). The 2026-10-16 set is
 * cropped from GLI's "Work Experiences" deck screenshots (300-800 px): only GLI's own, non-Rx work; sponsor logos on
 * signage are blurred; client-identifying shots (e.g. a named stage) and other companies' work are excluded.
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
  twisterInstore: { src: twisterInstore, alt: "Tall twisted product tower display on a supermarket floor with a promo counter and staff", caption: "Twister display, installed in store", client: "3m", rx: false, fit: "cover" },
  twisterRender: { src: twisterRender, alt: "3D render of a tall wire-frame twister display tower on a printed base", caption: "Twister display, 3D render for approval", client: "3m", rx: false, fit: "contain" },
  scotchBritePacks: { src: scotchBritePacks, alt: "Range of scrub-sponge packs in green, yellow and red packaging", caption: "Scrub-sponge packaging range", client: "3m", rx: false, fit: "contain" },
  ppscStage: { src: ppscStage, alt: "Convention plenary hall with a lit stage, side screens and round banquet tables", caption: "Plenary hall staging, PICC", client: "mead-johnson", rx: false, fit: "cover" },
  ppscWide: { src: ppscWide, alt: "Wide view of a red-carpeted plenary hall set for a convention dinner", caption: "Hall set for the convention dinner", client: "mead-johnson", rx: false, fit: "cover" },
  ppscChandeliers: { src: ppscChandeliers, alt: "Stage with three screens under chandeliers, seen across a full banquet hall", caption: "Stage and screens under the chandeliers", client: "mead-johnson", rx: false, fit: "cover" },
  pharmacistBallroom: { src: pharmacistBallroom, alt: "Hotel ballroom full of delegates at round tables facing a lit stage and four screens", caption: "Learning programme ballroom, Crowne Plaza", client: "pfizer", rx: false, fit: "cover" },
  boracayFireworks: { src: boracayFireworks, alt: "Fireworks over a beachfront stage at night", caption: "Beachfront stage at night, Boracay", client: "janssen", rx: false, fit: "cover" },
  beachDusk: { src: beachDusk, alt: "Beach set at dusk with low tables, flags and a sound desk", caption: "Beach event set-up at dusk, Batangas", rx: false, fit: "cover" },
  beachNight: { src: beachNight, alt: "Guests at low tables on the sand under coloured flags and lights at night", caption: "Beach fellowship night, Batangas", rx: false, fit: "cover" },
  symposiumQuiz: { src: symposiumQuiz, alt: "Hosts running an on-screen quiz game for a seated symposium audience", caption: "Quiz game at a medical symposium", rx: false, fit: "cover" },
  symposiumAudience: { src: symposiumAudience, alt: "Large seated audience at a medical symposium in a hotel function room", caption: "Symposium audience", rx: false, fit: "cover" },
  pcpHeroWall: { src: pcpHeroWall, alt: "Convention exhibit wall with framed panels and a large portrait mural", caption: "Exhibit wall, PCP 37th Annual Convention, PICC 2007", rx: false, fit: "cover" },
  pcpOnsite: { src: pcpOnsite, alt: "On-site registration counter with blue pillars and queue barriers in a convention lobby", caption: "On-site registration, PCP Convention 2007", rx: false, fit: "cover" },
  pcpPrereg: { src: pcpPrereg, alt: "Long pre-registration counter with delegates in a convention hall", caption: "Pre-registration counters, PCP Convention 2008", rx: false, fit: "cover" },
} satisfies Record<string, WorkImage>;

export const WORK_IMAGES: { [K in keyof typeof IMAGES]: WorkImage } = IMAGES;
