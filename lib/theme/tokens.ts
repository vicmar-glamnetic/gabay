/**
 * The reference world is the Philippine payslip and the accounting ledger:
 * ledger-green paper, pine ink, a rubber stamp in red. Dark mode is derived,
 * not inverted — the paper becomes a deep ink green, the rules stay visible,
 * and the accent brightens so it still reads against it.
 */

export type ColorScheme = "light" | "dark";

export type Palette = {
  paper: string;
  card: string;
  cardSunken: string;
  ink: string;
  muted: string;
  rule: string;
  ruleStrong: string;
  accent: string;
  accentSoft: string;
  accentInk: string;
  stamp: string;
  stampSoft: string;
  warn: string;
  warnSoft: string;
  tabBar: string;
  overlay: string;
  shadow: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  light: {
    paper: "#E9EDE6",
    card: "#FCFDFB",
    cardSunken: "#F1F4EF",
    ink: "#17231D",
    muted: "#5A6A61",
    rule: "#C6D0C4",
    ruleStrong: "#9DAB9C",
    accent: "#0E5744",
    accentSoft: "#DCE8E1",
    accentInk: "#FCFDFB",
    stamp: "#A63A2B",
    stampSoft: "#F4E2DE",
    warn: "#8A6420",
    warnSoft: "#F3EBD8",
    tabBar: "#FCFDFB",
    overlay: "rgba(23, 35, 29, 0.44)",
    shadow: "#17231D",
  },
  dark: {
    paper: "#0F1713",
    card: "#17231D",
    cardSunken: "#131D18",
    ink: "#E7EDE7",
    muted: "#9AA9A0",
    rule: "#2C3B33",
    ruleStrong: "#42544A",
    accent: "#4FBF9B",
    accentSoft: "#173028",
    accentInk: "#0F1713",
    stamp: "#E0705C",
    stampSoft: "#2E1C18",
    warn: "#D9AF63",
    warnSoft: "#2A2318",
    tabBar: "#131D18",
    overlay: "rgba(0, 0, 0, 0.6)",
    shadow: "#000000",
  },
};

/**
 * Typography.
 *
 * Roboto and Roboto Mono — the Android system family, and about as familiar as
 * a UI typeface gets. Deliberately unremarkable: it is the font people already
 * read everything else in, so it draws no attention to itself and carries none
 * of the technical-startup association that made the earlier picks feel
 * generated.
 *
 * Roboto Mono carries every figure and every rule string, and has proper
 * tabular numerals so ledger columns align.
 *
 * Swapping the family is a one-line change here plus the loader in app/_layout.
 */
/** Base type scale at the default Dynamic Type setting. Scaled at render. */
export const type = {
  wordmark: { size: 26, lineHeight: 30, letterSpacing: -0.4 },
  display: { size: 34, lineHeight: 38, letterSpacing: -0.6 },
  title: { size: 22, lineHeight: 27, letterSpacing: -0.2 },
  section: { size: 13, lineHeight: 16, letterSpacing: 1.1 },
  body: { size: 16, lineHeight: 23 },
  label: { size: 15, lineHeight: 20 },
  small: { size: 13, lineHeight: 18 },
  rule: { size: 11.5, lineHeight: 15.5 },
  micro: { size: 10.5, lineHeight: 14, letterSpacing: 0.6 },
} as const;

export const fonts = {
  sans: "Roboto",
  sansMedium: "RobotoMedium",
  sansSemi: "RobotoBold",
  // Headings use plain Roboto Bold rather than a condensed cut, which keeps the
  // app looking like every other app rather than like a designed artefact.
  condensed: "RobotoMedium",
  condensedBold: "RobotoBold",
  mono: "RobotoMono",
  monoMedium: "RobotoMonoMedium",
  monoBold: "RobotoMonoBold",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
} as const;

/** Minimum touch target, enforced on every interactive element. */
export const HIT = 44;
