import type { Cause, CauseSlug } from "./types";

/**
 * MOCK podaci dok backend ne postoji.
 * Sve u [ZAGRADAMA] i svi iznosi su primeri — zameni pravim podacima.
 * Redosled je i redosled prstenova oko srca (prvi ide gore u sredinu).
 */
export const CAUSES: Cause[] = [
  {
    slug: "inkubator",
    share: 50,
    goal: 3_000_000, // PRIMER
    color: "#E52336",
    icon: "incubator",
    cover: "/causes/inkubator/cover.jpg",
    gallery: [
      "/causes/inkubator/gallery-1.jpg",
      "/causes/inkubator/gallery-2.jpg",
      "/causes/inkubator/gallery-3.jpg",
    ],
    video: {
      src: "/causes/inkubator/video.mp4",
      poster: "/causes/inkubator/poster.jpg",
      captions: {
        sr: "/causes/inkubator/captions.sr.vtt",
        en: "/causes/inkubator/captions.en.vtt",
      },
    },
    content: {
      sr: {
        title: "Inkubator za porodilište",
        shortTitle: "Inkubator",
        summary: "Novi inkubator za bebe rođene prerano u [USTANOVA].",
        headline: "Topao početak za najmanje",
        lead: "Novi inkubator za odeljenje neonatologije u [USTANOVA], Kragujevac.",
        story: [
          "[2–3 rečenice iz ugla osoblja: koliko beba godišnje stigne prerano i kakvu opremu odeljenje ima danas.]",
          "[Šta se menja kada inkubator stigne — za bebe, roditelje i osoblje.]",
        ],
        quote: {
          text: "[Kratak citat medicinske sestre ili roditelja.]",
          author: "[Ime], [uloga]",
        },
        videoText:
          "Medicinska sestra objašnjava zašto je novi inkubator važan za bebe rođene prerano.",
        items: [
          { label: "Inkubator [MODEL]", price: null },
          { label: "Monitor vitalnih funkcija", price: null },
          { label: "Isporuka i obuka osoblja", price: null },
        ],
        steps: [
          { title: "Prikupljanje", description: "Akcija je u toku.", status: "current" },
          { title: "Nabavka", description: "Ponude i račun objavljujemo ovde.", status: "upcoming" },
          { title: "Isporuka", description: "Fotografije i video sa predaje.", status: "upcoming" },
          { title: "Prva beba u novom inkubatoru", description: "Poruka osoblja svim donatorima.", status: "upcoming" },
        ],
      },
      en: {
        title: "Maternity ward incubator",
        shortTitle: "Incubator",
        summary: "A new incubator for premature babies at [INSTITUTION].",
        headline: "A warm start for the smallest",
        lead: "A new incubator for the neonatal ward at [INSTITUTION], Kragujevac.",
        story: [
          "[2–3 sentences from the staff: how many babies arrive early each year and what equipment the ward has today.]",
          "[What changes once the incubator arrives — for babies, parents and staff.]",
        ],
        quote: {
          text: "[A short quote from a nurse or a parent.]",
          author: "[Name], [role]",
        },
        videoText: "A nurse explains why a new incubator matters for babies born too early.",
        items: [
          { label: "Incubator [MODEL]", price: null },
          { label: "Vital signs monitor", price: null },
          { label: "Delivery and staff training", price: null },
        ],
        steps: [
          { title: "Fundraising", description: "The campaign is live.", status: "current" },
          { title: "Purchase", description: "Quotes and the invoice will be published here.", status: "upcoming" },
          { title: "Delivery", description: "Photos and video from the handover.", status: "upcoming" },
          { title: "First baby in the new incubator", description: "A message from the staff to all donors.", status: "upcoming" },
        ],
      },
    },
  },
  {
    slug: "prihvatiliste",
    share: 20,
    goal: 1_000_000, // PRIMER
    color: "#F9A743",
    icon: "home",
    cover: "/causes/prihvatiliste/cover.jpg",
    gallery: [
      "/causes/prihvatiliste/gallery-1.jpg",
      "/causes/prihvatiliste/gallery-2.jpg",
    ],
    video: {
      src: "/causes/prihvatiliste/video.mp4",
      poster: "/causes/prihvatiliste/poster.jpg",
    },
    content: {
      sr: {
        title: "Prihvatilište za decu",
        shortTitle: "Prihvatilište",
        summary: "Renoviranje kupatila i dnevnog boravka.",
        headline: "Dom u kome je lepo odrastati",
        lead: "Renoviranje kupatila i dnevnog boravka u [NAZIV PRIHVATILIŠTA].",
        story: [
          "[Ko živi u prihvatilištu i koliko dugo deca obično ostaju.]",
          "[Kako kupatilo i dnevni boravak izgledaju danas i zašto je to važno za svakodnevicu dece.]",
        ],
        quote: {
          text: "[Kratak citat vaspitača.]",
          author: "[Ime], [uloga]",
        },
        videoText:
          "Upoznaj vaspitače. Pokazujemo kupatilo i dnevni boravak danas i šta će se promeniti.",
        items: [
          { label: "Renoviranje kupatila", price: null },
          { label: "Nameštaj za dnevni boravak", price: null },
          { label: "Radovi i materijal", price: null },
        ],
        steps: [
          { title: "Prikupljanje", description: "Akcija je u toku.", status: "current" },
          { title: "Radovi", description: "Izvođač, predračun i račun objavljujemo ovde.", status: "upcoming" },
          { title: "Pre i posle", description: "Fotografije renoviranih prostorija.", status: "upcoming" },
        ],
      },
      en: {
        title: "Children's shelter",
        shortTitle: "Shelter",
        summary: "Renovating the bathroom and the living room.",
        headline: "A home where it's good to grow up",
        lead: "Renovating the bathroom and living room at [SHELTER NAME].",
        story: [
          "[Who lives at the shelter and how long children usually stay.]",
          "[What the bathroom and living room look like today and why it matters day to day.]",
        ],
        quote: {
          text: "[A short quote from a caregiver.]",
          author: "[Name], [role]",
        },
        videoText:
          "Meet the caregivers. See the bathroom and living room today and what will change.",
        items: [
          { label: "Bathroom renovation", price: null },
          { label: "Living room furniture", price: null },
          { label: "Labour and materials", price: null },
        ],
        steps: [
          { title: "Fundraising", description: "The campaign is live.", status: "current" },
          { title: "Works", description: "Contractor, quote and invoice published here.", status: "upcoming" },
          { title: "Before and after", description: "Photos of the renovated rooms.", status: "upcoming" },
        ],
      },
    },
  },
  {
    slug: "dom-zdravlja",
    share: 30,
    goal: 1_500_000, // PRIMER
    color: "#1E4153",
    icon: "clinic",
    cover: "/causes/dom-zdravlja/cover.jpg",
    gallery: [
      "/causes/dom-zdravlja/gallery-1.jpg",
      "/causes/dom-zdravlja/gallery-2.jpg",
    ],
    video: {
      src: "/causes/dom-zdravlja/video.mp4",
      poster: "/causes/dom-zdravlja/poster.jpg",
    },
    content: {
      sr: {
        title: "Dom zdravlja",
        shortTitle: "Dom zdravlja",
        summary: "[ŠTA SE NABAVLJA] za dečje odeljenje.",
        headline: "Brži pregled, manje čekanja",
        lead: "[ŠTA SE NABAVLJA] za dečje odeljenje Doma zdravlja Kragujevac.",
        story: [
          "[Šta dečjem odeljenju danas nedostaje.]",
          "[Kako će nova oprema promeniti preglede za decu i roditelje.]",
        ],
        quote: {
          text: "[Kratak citat pedijatra.]",
          author: "[Ime], [uloga]",
        },
        videoText: "Pedijatar pokazuje šta nedostaje i kako će nova oprema skratiti čekanje.",
        items: [
          { label: "[OPREMA 1]", price: null },
          { label: "[OPREMA 2]", price: null },
        ],
        steps: [
          { title: "Prikupljanje", description: "Akcija je u toku.", status: "current" },
          { title: "Nabavka", description: "Ponude i račun objavljujemo ovde.", status: "upcoming" },
          { title: "Isporuka", description: "Fotografije opreme u upotrebi.", status: "upcoming" },
        ],
      },
      en: {
        title: "Health centre",
        shortTitle: "Health centre",
        summary: "[EQUIPMENT] for the children's ward.",
        headline: "Faster check-ups, shorter waits",
        lead: "[EQUIPMENT] for the children's ward of the Kragujevac Health Centre.",
        story: [
          "[What the children's ward is missing today.]",
          "[How the new equipment will change check-ups for children and parents.]",
        ],
        quote: {
          text: "[A short quote from a paediatrician.]",
          author: "[Name], [role]",
        },
        videoText: "A paediatrician shows what's missing and how new equipment will cut waiting times.",
        items: [
          { label: "[EQUIPMENT 1]", price: null },
          { label: "[EQUIPMENT 2]", price: null },
        ],
        steps: [
          { title: "Fundraising", description: "The campaign is live.", status: "current" },
          { title: "Purchase", description: "Quotes and the invoice published here.", status: "upcoming" },
          { title: "Delivery", description: "Photos of the equipment in use.", status: "upcoming" },
        ],
      },
    },
  },
];

if (process.env.NODE_ENV !== "production") {
  const total = CAUSES.reduce((sum, cause) => sum + cause.share, 0);
  if (total !== 100) {
    console.warn(`[causes] Zbir procenata je ${total}, a treba da bude 100.`);
  }
}

export const getCauseBySlug = (slug: string): Cause | undefined =>
  CAUSES.find((cause) => cause.slug === slug);

export const isCauseSlug = (slug: string): slug is CauseSlug =>
  CAUSES.some((cause) => cause.slug === slug);
