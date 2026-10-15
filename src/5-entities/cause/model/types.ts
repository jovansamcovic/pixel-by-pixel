export type CauseLocale = "sr" | "en";

export type CauseSlug = "inkubator" | "prihvatiliste" | "dom-zdravlja";

export type CauseIconName = "incubator" | "home" | "clinic";

export type CauseStepStatus = "done" | "current" | "upcoming";

export type CauseItem = {
  label: string;
  /** Cena u RSD; `null` dok ponuda nije poznata. */
  price: number | null;
};

export type CauseStep = {
  title: string;
  description: string;
  status: CauseStepStatus;
};

export type CauseContent = {
  /** Pun naziv (lista, strana namene) */
  title: string;
  /** Kratak naziv (ispod prstena, aria-label) */
  shortTitle: string;
  /** Jedna rečenica za listu ispod srca */
  summary: string;
  /** Naslov strane namene — emotivni, ne tehnički */
  headline: string;
  lead: string;
  story: string[];
  quote?: { text: string; author: string };
  /** Tekst ispod videa u dijalogu */
  videoText: string;
  items: CauseItem[];
  steps: CauseStep[];
};

export type CauseVideo = {
  /** Vertikalni video 9:16, 30–60 s */
  src: string;
  poster: string;
  /** WebVTT titlovi — video se često gleda bez zvuka */
  captions?: Partial<Record<CauseLocale, string>>;
};

export type Cause = {
  slug: CauseSlug;
  /** Procenat svake donacije koji ide ovoj nameni (zbir svih = 100) */
  share: number;
  /** Cilj u RSD */
  goal: number;
  color: string;
  icon: CauseIconName;
  cover: string;
  gallery: string[];
  video: CauseVideo;
  content: Record<CauseLocale, CauseContent>;
};

export type CauseProgress = {
  raised: number;
  goal: number;
  /** 0–100, zaokruženo */
  percent: number;
};
