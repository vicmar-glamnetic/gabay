import React, { createContext, useContext, useMemo } from "react";
import {
  AccessibilityInfo,
  PixelRatio,
  useColorScheme,
  useWindowDimensions,
} from "react-native";

import { fonts, palettes, radius, space, type as typeScale, type ColorScheme, type Palette } from "./tokens";
import { useAppStore } from "../store/useAppStore";

export type Theme = {
  scheme: ColorScheme;
  c: Palette;
  font: typeof fonts;
  space: typeof space;
  radius: typeof radius;
  /** Scales a base font size by the OS Dynamic Type setting, capped. */
  fs: (n: number) => number;
  type: typeof typeScale;
  /** True on tablet/desktop widths, where the list-detail split applies. */
  wide: boolean;
  width: number;
  reduceMotion: boolean;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const preference = useAppStore((s) => s.themePreference);
  const { width } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((v) => alive && setReduceMotion(v));
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const scheme: ColorScheme =
    preference === "system" ? (system === "dark" ? "dark" : "light") : preference;

  const value = useMemo<Theme>(() => {
    // Respect Dynamic Type, but cap the multiplier so a ledger still aligns at
    // the largest accessibility sizes. Rows reflow to two lines past 1.35.
    const scale = Math.min(PixelRatio.getFontScale(), 1.9);
    return {
      scheme,
      c: palettes[scheme],
      font: fonts,
      space,
      radius,
      type: typeScale,
      fs: (n: number) => Math.round(n * scale * 10) / 10,
      wide: width >= 760,
      width,
      reduceMotion,
    };
  }, [scheme, width, reduceMotion]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error("useTheme must be used inside ThemeProvider");
  return t;
}

/** True when the user is at a large accessibility text size and rows must stack. */
export function useStackedRows(): boolean {
  return PixelRatio.getFontScale() > 1.35;
}
