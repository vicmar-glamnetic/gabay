import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { peso } from "../lib/calc/money";
import type { CalcResult } from "../lib/calc/types";
import { useTheme } from "../lib/theme/ThemeProvider";
import { useInsideTabs } from "../lib/theme/useTabBarHeight";
import { Ledger } from "./Ledger";
import { Sheet } from "./Sheet";
import { Txt } from "./ui";

/**
 * Nobody should have to scroll to see the number they came for. The headline
 * figure pins above the tab bar while the user scrolls the inputs, and expands
 * into the full ledger on tap.
 */

/** Eases a figure to its new value. Reduce-motion snaps instead. */
function useCountTransition(value: number, disabled: boolean): number {
  const [display, setDisplay] = React.useState(value);
  const from = React.useRef(value);
  const raf = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (disabled || Math.abs(value - from.current) < 0.005) {
      from.current = value;
      setDisplay(value);
      return;
    }
    const start = Date.now();
    const startValue = from.current;
    const delta = value - startValue;
    const duration = 260;

    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(startValue + delta * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      from.current = value;
    };
  }, [value, disabled]);

  return display;
}

export function StickyResultBar<T>({
  result,
  title,
  actions,
  /** Bracket index or equivalent; a change fires a light haptic. */
  hapticKey,
  /** Fires the warning pattern instead, for the payslip checker. */
  warn,
  headlineRaw,
}: {
  result: CalcResult<T>;
  title: string;
  actions?: React.ReactNode;
  hapticKey?: string | number;
  warn?: boolean;
  headlineRaw?: string;
}) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const insideTabs = useInsideTabs();
  const [open, setOpen] = React.useState(false);
  const shown = useCountTransition(result.headline.amount, th.reduceMotion || !!headlineRaw);
  const lastKey = React.useRef(hapticKey);

  React.useEffect(() => {
    if (hapticKey === undefined || Platform.OS === "web") return;
    if (lastKey.current === undefined) {
      lastKey.current = hapticKey;
      return;
    }
    if (lastKey.current !== hapticKey) {
      lastKey.current = hapticKey;
      if (warn) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [hapticKey, warn]);

  return (
    <>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: th.c.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: th.c.ruleStrong,
          // The tab bar sits below this and has already taken the home-indicator
          // inset, so adding it again would float the bar off the bottom.
          paddingBottom: insideTabs ? th.space.md : insets.bottom || th.space.md,
          shadowColor: th.c.shadow,
          shadowOpacity: th.scheme === "dark" ? 0.4 : 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -3 },
          elevation: 12,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${result.headline.label}, ${
            headlineRaw ?? peso(result.headline.amount)
          }. Tap to see the full breakdown.`}
          onPress={() => setOpen(true)}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: th.space.md,
            paddingHorizontal: th.space.lg,
            paddingVertical: th.space.md,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View style={{ flex: 1, gap: 1 }}>
            <Txt variant="micro">{result.headline.label}</Txt>
            <Txt
              variant="amountLarge"
              color={warn ? th.c.stamp : th.c.accent}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {headlineRaw ?? peso(shown)}
            </Txt>
            {result.headline.rule ? (
              <Txt variant="rule" numberOfLines={1}>
                {result.headline.rule}
              </Txt>
            ) : null}
          </View>
          <View
            style={{
              paddingHorizontal: th.space.md,
              paddingVertical: th.space.sm,
              borderRadius: th.radius.pill,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: th.c.rule,
              backgroundColor: th.c.cardSunken,
            }}
          >
            <Txt variant="micro" color={th.c.ink}>
              Ledger
            </Txt>
          </View>
        </Pressable>
      </View>

      <Sheet visible={open} onClose={() => setOpen(false)} title={title} snap={0.88}>
        <ScrollView
          contentContainerStyle={{ padding: th.space.lg, gap: th.space.xl }}
          style={{ backgroundColor: th.c.paper }}
        >
          <Ledger sections={result.sections} />
          {result.notes.length ? (
            <View style={{ gap: th.space.sm }}>
              <Txt variant="section">Notes</Txt>
              {result.notes.map((n, i) => (
                <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
                  <Txt variant="small" color={th.c.ruleStrong}>
                    ·
                  </Txt>
                  <Txt variant="small" style={{ flex: 1 }}>
                    {n}
                  </Txt>
                </View>
              ))}
            </View>
          ) : null}
          {actions ? <View style={{ gap: th.space.sm }}>{actions}</View> : null}
        </ScrollView>
      </Sheet>
    </>
  );
}

/** Height to reserve at the bottom of a calculator screen. */
export const STICKY_BAR_HEIGHT = 96;
