import React from "react";
import { ScrollView, View, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DISCLAIMER } from "../lib/rates";
import { useTheme } from "../lib/theme/ThemeProvider";
import { useInsideTabs } from "../lib/theme/useTabBarHeight";
import { Txt } from "./ui";

/**
 * Every screen sits on ledger paper, respects safe areas top and bottom, and
 * carries the disclaimer in the footer. Pull to refresh is deliberately absent:
 * there is nothing to fetch, so it would be a lie.
 */
export function Screen({
  children,
  scroll = true,
  /** Extra bottom padding to clear a sticky result bar. */
  bottomInset = 0,
  contentStyle,
  footer = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bottomInset?: number;
  contentStyle?: StyleProp<ViewStyle>;
  footer?: boolean;
}) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const insideTabs = useInsideTabs();
  const bottomSafe = insideTabs ? 0 : insets.bottom;

  const body = (
    <View
      style={[
        {
          padding: th.space.lg,
          gap: th.space.xl,
          maxWidth: 780,
          width: "100%",
          alignSelf: "center",
        },
        contentStyle,
      ]}
    >
      {children}
      {footer ? <Disclaimer /> : null}
    </View>
  );

  if (!scroll) {
    return <View style={{ flex: 1, backgroundColor: th.c.paper }}>{body}</View>;
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: th.c.paper }}
      contentContainerStyle={{ paddingBottom: bottomSafe + bottomInset + th.space.xxxl }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {body}
    </ScrollView>
  );
}

export function Disclaimer() {
  const th = useTheme();
  return (
    <View
      style={{
        marginTop: th.space.lg,
        paddingTop: th.space.md,
        borderTopWidth: 1,
        borderTopColor: th.c.rule,
        borderStyle: "dashed",
      }}
    >
      <Txt variant="rule" style={{ lineHeight: th.fs(16) }}>
        {DISCLAIMER}
      </Txt>
    </View>
  );
}

/** Screen title block, used at the top of every pushed screen. */
export function ScreenTitle({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  const th = useTheme();
  return (
    <View style={{ gap: th.space.xs }}>
      {eyebrow ? <Txt variant="micro">{eyebrow}</Txt> : null}
      <Txt variant="display">{title}</Txt>
      {subtitle ? <Txt variant="body" color={th.c.muted}>{subtitle}</Txt> : null}
    </View>
  );
}
