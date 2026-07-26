import React from "react";
import { Image, View, type StyleProp, type ViewStyle } from "react-native";

import { t } from "../lib/i18n";
import { useTheme } from "../lib/theme/ThemeProvider";
import { Txt } from "./ui";

/**
 * The mark beside the wordmark.
 *
 * Uses the plated icon rather than the bare guidepost. The mark's own colours —
 * cream pole, sage flag — are drawn to sit on the green plate, and against the
 * light-mode paper they measure 1.03:1 and 1.23:1, which is invisible. On the
 * plate they read in both themes.
 *
 * The image is decorative: the adjacent text already says "Gabay", so it is
 * hidden from assistive tech to avoid announcing the name twice.
 */
export function Wordmark({
  size,
  style,
}: {
  /** Height of the mark in points. The text scales with it. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const th = useTheme();
  const box = th.fs(size ?? 30);

  return (
    <View
      accessibilityRole="header"
      accessibilityLabel={t("app.wordmark")}
      style={[
        { flexDirection: "row", alignItems: "center", gap: th.space.sm },
        style,
      ]}
    >
      <Image
        source={require("../assets/mark.png")}
        accessibilityElementsHidden
        importantForAccessibility="no"
        resizeMode="contain"
        style={{ width: box, height: box, borderRadius: box * 0.239 }}
      />
      <Txt variant="wordmark" accessibilityElementsHidden importantForAccessibility="no">
        {t("app.wordmark")}
      </Txt>
    </View>
  );
}
