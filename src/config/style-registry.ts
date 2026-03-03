/**
 * Style Registry – single source of truth for all style/theme variables.
 * Position-based color palette (no semantic names in schema).
 * Section-owned dividers; fonts, radius, shadows in general.
 * See docs/STYLE_VARIABLES_INVENTORY.md.
 */

/** One cell in the palette matrix. Identified by index; name/comment are display-only. */
export type PaletteCell = {
  hex: string;
  name?: string;
  comment?: string;
};

/** Divider below a section: style + colors by palette index. */
export type SectionDivider = {
  style: "wavy" | "wavy2" | "sawtooth" | "blob";
  topColorIndex: number;
  bottomColorIndex: number;
};

/** Image asset: path (URL or asset path), size, border. */
export type ImageStyle = {
  path: string;
  width?: string;
  height?: string;
  borderWidth?: number;
  borderColorIndex?: number;
  borderRadius?: string;
};

/** General/global styles. */
export type GeneralStyles = {
  palette: {
    rows: number;
    cols: number;
    cells: PaletteCell[];
  };
  fonts: Array<{
    name: string; // Font family name (e.g., "Playfair Display", "DM Sans", "Heyam")
    isDefault?: boolean; // First font in list is default for all page
  }>;
  radius: {
    default: string;
  };
  shadow: {
    soft: string;
    card: string;
    cardHover: string;
    playful: string;
  };
  gradient: {
    warm: string;
    soft: string;
    candy: string;
  };
};

/** Section with optional divider (owned by this section). */
export type SectionStyleBase = {
  divider?: SectionDivider;
};

export type HeroStyles = SectionStyleBase & {
  section: { backgroundIndex: number; patternOpacity?: number };
  badge: { backgroundIndex: number; textColorIndex: number; borderRadius: string };
  quote: { fontSize: string; textColorIndex: number };
  heading: { fontSize: string; fontFamily: string; textColorIndex: number };
  description: { textColorIndex: number };
  primaryButton: { backgroundType: "gradient"; gradientKey: string; textColorIndex: number; borderRadius: string };
  secondaryButton: { borderColorIndex: number; backgroundIndex: number; textColorIndex: number; borderRadius: string };
  footer: { textColorIndex: number };
  image: ImageStyle;
};

export type NavStyles = {
  bar: { backgroundType: "gradient"; gradientKey: string; textColorIndex: number };
  logo: { fontFamily: string };
  link: { textColorIndex: number; hoverBackgroundIndex: number; hoverTextIndex: number };
  cta: { borderRadius: string };
};

export type WhyStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  card: Array<{ backgroundIndex: number; accentColorIndex: number }>;
  cardBorderRadius: string;
  cardShadow: string;
  ctaButton: { gradientKey: string; textColorIndex: number; borderRadius: string };
  images: ImageStyle[];
};

export type HowItWorksStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  stepCard: Array<{ circleBackgroundIndex: number }>;
  stepImageSize: string;
  stepBadgeGradient: string;
  images: ImageStyle[];
};

export type CompatibilityTestStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  triggerButton: { backgroundIndex: number; textColorIndex: number; borderRadius: string };
  /** Question panel and result panel backgrounds. */
  questionCard: { backgroundIndex: number };
  resultCard: { backgroundIndex: number };
};

export type WhatYouReceiveStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  /** Palette index per product card (fill color). */
  cards: Array<{ backgroundIndex: number }>;
};

export type PastEditionsStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  /** Palette index per edition card (cycle: 4 colors). */
  cards: Array<{ backgroundIndex: number }>;
};

export type ExperienceStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  /** Palette index per experience step card. */
  cards: Array<{ backgroundIndex: number }>;
};

export type TestimonialsStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  /** Palette index per testimonial card. */
  cards: Array<{ backgroundIndex: number }>;
};

export type PricingStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  card: { backgroundIndex: number; borderRadius: string; shadow: string };
  cardBorderByAccent: Record<string, number>;
  badge: { backgroundIndex: number };
  /** Bottom labels (e.g. shipping, commitment) background colors. */
  bottomBadges: Array<{ backgroundIndex: number }>;
  ctaButton: { gradientKey: string; textColorIndex: number; borderRadius: string };
};

export type FaqStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  /** Accordion item panel background. */
  item: { backgroundIndex: number };
};

export type FinalCtaStyles = SectionStyleBase & {
  section: { backgroundIndex: number };
  heading: { fontSize: string };
  ctaButton: { gradientKey: string; textColorIndex: number; borderRadius: string };
};

export type FooterStyles = {
  section: { backgroundIndex: number };
  heading: { textColorIndex: number };
  link: { textColorIndex: number; hoverColorIndex: number };
  input: { borderColorIndex: number };
  bottomBar: { borderColorIndex: number };
};

export type LoginStyles = {
  page: { backgroundIndex: number };
  heading: { fontSize: string };
  error: { backgroundIndex: number; textColorIndex: number };
};

export type PageStyles = {
  backgroundIndex?: number;
  page?: { backgroundIndex: number };
};

/** Default palette: indices match STYLE_VARIABLES_INVENTORY (position-based). Hex from current index.css. */
const DEFAULT_PALETTE_CELLS: PaletteCell[] = [
  { hex: "#faf8f5", name: "Background", comment: "Page, cards, inputs" },
  { hex: "#2d2620", name: "Foreground", comment: "Body text, headings" },
  { hex: "#f26b4d", name: "Primary", comment: "CTAs, accents" },
  { hex: "#ffffff", name: "Primary fg", comment: "Text on primary" },
  { hex: "#d8738f", name: "Secondary", comment: "Secondary buttons" },
  { hex: "#ffffff", name: "Secondary fg", comment: "" },
  { hex: "#e8e4de", name: "Muted", comment: "Muted bg" },
  { hex: "#2eb399", name: "Accent", comment: "Teal/mint accent" },
  { hex: "#ffd9cc", name: "Peach", comment: "Hero, nav hover, dividers" },
  { hex: "#f5a88a", name: "Peach strong", comment: "Sections, dividers" },
  { hex: "#e6d9f5", name: "Lavender", comment: "Cards, dividers" },
  { hex: "#b8e6d9", name: "Mint", comment: "Cards, sections" },
  { hex: "#ffeb99", name: "Sunshine", comment: "Badges, cards" },
  { hex: "#ffffff", name: "Card", comment: "Card surfaces" },
  { hex: "#ddd8d0", name: "Border", comment: "Borders, inputs" },
  { hex: "#fecaca", name: "Destructive", comment: "Error states" },
  { hex: "#f5c4d4", name: "Bubblegum", comment: "Gradient candy" },
];

const DEFAULT_DIVIDER = (top: number, bottom: number, style: SectionDivider["style"]): SectionDivider => ({
  style,
  topColorIndex: top,
  bottomColorIndex: bottom,
});

export const STYLE_REGISTRY = {
  general: {
    palette: {
      rows: 4,
      cols: 5,
      cells: [
        {
          hex: "#faf8f5",
          name: "Background",
          comment: "Page, cards, inputs"
        },
        {
          hex: "#2d2620",
          name: "Foreground",
          comment: "Body text, headings"
        },
        {
          hex: "#f26b4d",
          name: "Primary",
          comment: "CTAs, accents"
        },
        {
          hex: "#ffffff",
          name: "Primary fg",
          comment: "Text on primary"
        },
        {
          hex: "#d8738f",
          name: "Secondary",
          comment: "Secondary buttons"
        },
        {
          hex: "#ffffff",
          name: "Secondary fg",
          comment: ""
        },
        {
          hex: "#e8e4de",
          name: "Muted",
          comment: "Muted bg"
        },
        {
          hex: "#2eb399",
          name: "Accent",
          comment: "Teal/mint accent"
        },
        {
          hex: "#ffd9cc",
          name: "Peach",
          comment: "Hero, nav hover, dividers"
        },
        {
          hex: "#f5a88a",
          name: "Peach strong",
          comment: "Sections, dividers"
        },
        {
          hex: "#e6d9f5",
          name: "Lavender",
          comment: "Cards, dividers"
        },
        {
          hex: "#b8e6d9",
          name: "Mint",
          comment: "Cards, sections"
        },
        {
          hex: "#ffeb99",
          name: "Sunshine",
          comment: "Badges, cards"
        },
        {
          hex: "#ffffff",
          name: "Card",
          comment: "Card surfaces"
        },
        {
          hex: "#ddd8d0",
          name: "Border",
          comment: "Borders, inputs"
        },
        {
          hex: "#fecaca",
          name: "Destructive",
          comment: "Error states"
        },
        {
          hex: "#f5c4d4",
          name: "Bubblegum",
          comment: "Gradient candy"
        }
      ]
    },
    fonts: [
      {
        name: "Playfair Display",
        isDefault: true
      },
      {
        name: "DM Sans"
      },
      {
        name: "Heyam"
      },
      {
        name: "CHICKEN Pie"
      }
    ],
    radius: {
      default: "1rem"
    },
    shadow: {
      soft: "0 4px 20px -4px rgba(242, 107, 77, 0.2)",
      card: "0 8px 30px -8px rgba(45, 38, 32, 0.1)",
      cardHover: "0 16px 40px -8px rgba(242, 107, 77, 0.25)",
      playful: "6px 6px 0px rgba(242, 107, 77, 0.3)"
    },
    gradient: {
      warm: "linear-gradient(135deg, #f26b4d, #d8738f)",
      soft: "linear-gradient(135deg, #faf8f5, #f5eef2)",
      candy: "linear-gradient(135deg, #f5c4d4, #e6d9f5, #99d4f0)"
    }
  },
  page: {
    backgroundIndex: 0
  },
  nav: {
    bar: {
      backgroundType: "gradient",
      gradientKey: "warm",
      textColorIndex: 3
    },
    logo: {
      fontFamily: "display"
    },
    link: {
      textColorIndex: 1,
      hoverBackgroundIndex: 8,
      hoverTextIndex: 2
    },
    cta: {
      borderRadius: "9999px"
    }
  },
  hero: {
    section: {
      backgroundIndex: 8,
      patternOpacity: 0.6
    },
    badge: {
      backgroundIndex: 2,
      textColorIndex: 3,
      borderRadius: "9999px"
    },
    quote: {
      fontSize: "1.125rem",
      textColorIndex: 1
    },
    heading: {
      fontSize: "3rem",
      fontFamily: "display",
      textColorIndex: 1
    },
    description: {
      textColorIndex: 6
    },
    primaryButton: {
      backgroundType: "gradient",
      gradientKey: "warm",
      textColorIndex: 3,
      borderRadius: "9999px"
    },
    secondaryButton: {
      borderColorIndex: 2,
      backgroundIndex: 0,
      textColorIndex: 2,
      borderRadius: "9999px"
    },
    footer: {
      textColorIndex: 1
    },
    image: {
      path: "hero-image1.png",
      width: "100%",
      height: "450px",
      borderWidth: 4,
      borderColorIndex: 0,
      borderRadius: "1.5rem"
    },
    divider: {
      style: "wavy",
      topColorIndex: 8,
      bottomColorIndex: 0
    }
  },
  why: {
    section: {
      backgroundIndex: 0
    },
    card: [
      {
        backgroundIndex: 8,
        accentColorIndex: 2
      },
      {
        backgroundIndex: 10,
        accentColorIndex: 4
      },
      {
        backgroundIndex: 11,
        accentColorIndex: 7
      }
    ],
    cardBorderRadius: "1.5rem",
    cardShadow: "playful",
    ctaButton: {
      gradientKey: "warm",
      textColorIndex: 3,
      borderRadius: "9999px"
    },
    images: [
      {
        path: "AlgoQueFuncioneParaTuPiel_01.JPG"
      },
      {
        path: "comprasilusion3.jpg"
      },
      {
        path: "problem-1.jpg"
      }
    ],
    divider: {
      style: "blob",
      topColorIndex: 0,
      bottomColorIndex: 9
    }
  },
  howItWorks: {
    section: {
      backgroundIndex: 9
    },
    stepCard: [
      {
        circleBackgroundIndex: 8
      },
      {
        circleBackgroundIndex: 10
      },
      {
        circleBackgroundIndex: 11
      },
      {
        circleBackgroundIndex: 12
      }
    ],
    stepImageSize: "18rem",
    stepBadgeGradient: "warm",
    images: [
      {
        path: "step-1.jpg"
      },
      {
        path: "step-2.jpg"
      },
      {
        path: "step-3.jpg"
      },
      {
        path: "step-4.jpg"
      }
    ],
    divider: {
      style: "wavy2",
      topColorIndex: 9,
      bottomColorIndex: 10
    }
  },
  compatibilityTest: {
    section: {
      backgroundIndex: 10
    },
    triggerButton: {
      backgroundIndex: 2,
      textColorIndex: 3,
      borderRadius: "9999px"
    },
    divider: {
      style: "wavy",
      topColorIndex: 10,
      bottomColorIndex: 8
    }
  },
  whatYouReceive: {
    section: {
      backgroundIndex: 8
    },
    cards: [
      {
        backgroundIndex: 9
      },
      {
        backgroundIndex: 10
      },
      {
        backgroundIndex: 16
      },
      {
        backgroundIndex: 12
      },
      {
        backgroundIndex: 4
      }
    ],
    divider: {
      style: "blob",
      topColorIndex: 8,
      bottomColorIndex: 0
    }
  },
  pastEditions: {
    section: {
      backgroundIndex: 0
    },
    cards: [
      { backgroundIndex: 8 },
      { backgroundIndex: 10 },
      { backgroundIndex: 11 },
      { backgroundIndex: 12 },
    ],
    divider: {
      style: "sawtooth" as const,
      topColorIndex: 0,
      bottomColorIndex: 9
    }
  },
  experience: {
    section: {
      backgroundIndex: 9
    },
    cards: [
      { backgroundIndex: 8 },
      { backgroundIndex: 10 },
      { backgroundIndex: 11 },
      { backgroundIndex: 12 },
    ],
    divider: {
      style: "wavy2" as const,
      topColorIndex: 9,
      bottomColorIndex: 12
    }
  },
  testimonials: {
    section: {
      backgroundIndex: 12
    },
    cards: [
      { backgroundIndex: 8 },
      { backgroundIndex: 10 },
      { backgroundIndex: 16 },
    ],
    divider: {
      style: "wavy" as const,
      topColorIndex: 12,
      bottomColorIndex: 8
    }
  },
  pricing: {
    section: {
      backgroundIndex: 8
    },
    card: {
      backgroundIndex: 13,
      borderRadius: "1.5rem",
      shadow: "playful"
    },
    cardBorderByAccent: {
      lavender: 10,
      peach: 2,
      mint: 7
    },
    badge: {
      backgroundIndex: 12
    },
    bottomBadges: [
      { backgroundIndex: 11 },
      { backgroundIndex: 12 },
    ],
    ctaButton: {
      gradientKey: "warm",
      textColorIndex: 3,
      borderRadius: "9999px"
    },
    divider: {
      style: "blob" as const,
      topColorIndex: 8,
      bottomColorIndex: 10
    }
  },
  faq: {
    section: {
      backgroundIndex: 10
    },
    item: {
      backgroundIndex: 13
    },
    divider: {
      style: "wavy2" as const,
      topColorIndex: 10,
      bottomColorIndex: 9
    }
  },
  finalCta: {
    section: {
      backgroundIndex: 9
    },
    heading: {
      fontSize: "3rem"
    },
    ctaButton: {
      gradientKey: "warm",
      textColorIndex: 3,
      borderRadius: "9999px"
    },
    divider: {
      style: "wavy",
      topColorIndex: 9,
      bottomColorIndex: 0
    }
  },
  footer: {
    section: {
      backgroundIndex: 0
    },
    heading: {
      textColorIndex: 1
    },
    link: {
      textColorIndex: 6,
      hoverColorIndex: 2
    },
    input: {
      borderColorIndex: 8
    },
    bottomBar: {
      borderColorIndex: 8
    }
  },
  login: {
    page: {
      backgroundIndex: 0
    },
    heading: {
      fontSize: "1.5rem"
    },
    error: {
      backgroundIndex: 15,
      textColorIndex: 15
    }
  },
  register: {
    page: {
      backgroundIndex: 0
    },
    heading: {
      fontSize: "1.5rem"
    },
    error: {
      backgroundIndex: 15,
      textColorIndex: 15
    }
  },
  forgotPassword: {
    page: {
      backgroundIndex: 0
    },
    heading: {
      fontSize: "1.5rem"
    }
  },
  resetPassword: {
    page: {
      backgroundIndex: 0
    },
    heading: {
      fontSize: "1.5rem"
    },
    error: {
      backgroundIndex: 15,
      textColorIndex: 15
    }
  },
  dashboard: {
    page: {
      backgroundIndex: 0
    }
  },
  checkout: {
    page: {
      backgroundIndex: 0
    }
  },
  account: {
    page: {
      backgroundIndex: 0
    }
  }
};

export type StyleRegistry = typeof STYLE_REGISTRY;
