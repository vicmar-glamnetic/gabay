import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";

import { useTheme } from "../lib/theme/ThemeProvider";
import { HIT } from "../lib/theme/tokens";

/* --------------------------------- Text --------------------------------- */

type Variant =
  | "wordmark"
  | "display"
  | "title"
  | "section"
  | "body"
  | "label"
  | "small"
  | "rule"
  | "micro"
  | "amount"
  | "amountLarge";

export function Txt({
  variant = "body",
  color,
  mono,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string; mono?: boolean }) {
  const th = useTheme();
  const s = th.type;

  const map: Record<Variant, TextStyle> = {
    wordmark: {
      fontFamily: th.font.condensedBold,
      fontSize: th.fs(s.wordmark.size),
      lineHeight: th.fs(s.wordmark.lineHeight),
      letterSpacing: s.wordmark.letterSpacing,
      color: th.c.ink,
    },
    display: {
      fontFamily: th.font.condensedBold,
      fontSize: th.fs(s.display.size),
      lineHeight: th.fs(s.display.lineHeight),
      letterSpacing: s.display.letterSpacing,
      color: th.c.ink,
    },
    title: {
      fontFamily: th.font.condensedBold,
      fontSize: th.fs(s.title.size),
      lineHeight: th.fs(s.title.lineHeight),
      letterSpacing: s.title.letterSpacing,
      color: th.c.ink,
    },
    section: {
      fontFamily: th.font.condensedBold,
      fontSize: th.fs(s.section.size),
      lineHeight: th.fs(s.section.lineHeight),
      letterSpacing: s.section.letterSpacing,
      textTransform: "uppercase",
      color: th.c.muted,
    },
    body: {
      fontFamily: th.font.sans,
      fontSize: th.fs(s.body.size),
      lineHeight: th.fs(s.body.lineHeight),
      color: th.c.ink,
    },
    label: {
      fontFamily: th.font.sansMedium,
      fontSize: th.fs(s.label.size),
      lineHeight: th.fs(s.label.lineHeight),
      color: th.c.ink,
    },
    small: {
      fontFamily: th.font.sans,
      fontSize: th.fs(s.small.size),
      lineHeight: th.fs(s.small.lineHeight),
      color: th.c.muted,
    },
    rule: {
      fontFamily: th.font.mono,
      fontSize: th.fs(s.rule.size),
      lineHeight: th.fs(s.rule.lineHeight),
      color: th.c.muted,
    },
    micro: {
      fontFamily: th.font.monoMedium,
      fontSize: th.fs(s.micro.size),
      lineHeight: th.fs(s.micro.lineHeight),
      letterSpacing: s.micro.letterSpacing,
      textTransform: "uppercase",
      color: th.c.muted,
    },
    amount: {
      fontFamily: th.font.monoMedium,
      fontSize: th.fs(s.body.size),
      lineHeight: th.fs(s.body.lineHeight),
      color: th.c.ink,
      fontVariant: ["tabular-nums"],
    },
    amountLarge: {
      fontFamily: th.font.monoBold,
      fontSize: th.fs(30),
      lineHeight: th.fs(36),
      color: th.c.accent,
      fontVariant: ["tabular-nums"],
    },
  };

  return (
    <Text
      {...rest}
      style={[map[variant], mono ? { fontFamily: th.font.mono } : null, color ? { color } : null, style]}
    />
  );
}

/* --------------------------------- Card --------------------------------- */

export function Card({
  children,
  style,
  sunken,
  padded = true,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  sunken?: boolean;
  padded?: boolean;
}) {
  const th = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: sunken ? th.c.cardSunken : th.c.card,
          borderRadius: th.radius.lg,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: th.c.rule,
          padding: padded ? th.space.lg : 0,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ------------------------------ Section head ------------------------------ */

export function SectionHead({
  title,
  action,
  style,
}: {
  title: string;
  action?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const th = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: th.space.sm,
          gap: th.space.sm,
        },
        style,
      ]}
    >
      <Txt variant="section" style={{ flexShrink: 1 }}>
        {title}
      </Txt>
      {action}
    </View>
  );
}

/* ---------------------------------- Chip ---------------------------------- */

export function Chip({
  label,
  selected,
  onPress,
  count,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  count?: number;
}) {
  const th = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => ({
        minHeight: HIT - 8,
        justifyContent: "center",
        paddingHorizontal: th.space.md,
        paddingVertical: th.space.sm,
        borderRadius: th.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: selected ? th.c.accent : th.c.rule,
        backgroundColor: selected ? th.c.accent : th.c.card,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <Txt
        variant="small"
        style={{
          fontFamily: th.font.sansMedium,
          color: selected ? th.c.accentInk : th.c.ink,
        }}
      >
        {label}
        {count !== undefined ? `  ${count}` : ""}
      </Txt>
    </Pressable>
  );
}

/* -------------------------------- Verify tag ------------------------------ */

export function VerifyTag({ label = "VERIFY" }: { label?: string }) {
  const th = useTheme();
  return (
    <View
      accessibilityLabel="Verify this figure with the agency"
      style={{
        paddingHorizontal: 5,
        paddingVertical: 1,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: th.c.stamp,
        backgroundColor: th.c.stampSoft,
      }}
    >
      <Txt variant="micro" color={th.c.stamp} style={{ fontSize: th.fs(9.5) }}>
        {label}
      </Txt>
    </View>
  );
}

/* --------------------------------- Callout -------------------------------- */

/**
 * True when children are bare strings or numbers and so must be wrapped in a
 * <Txt>. Interpolated copy — `{CONSTANT} more words` — arrives as an ARRAY of
 * strings, not one string, and React Native throws on a text node inside a
 * <View>. Checking only `typeof children === "string"` misses that case.
 */
function isPlainText(children: React.ReactNode): boolean {
  const parts = React.Children.toArray(children);
  return (
    parts.length > 0 &&
    parts.every((c) => typeof c === "string" || typeof c === "number")
  );
}

export function Callout({
  tone = "neutral",
  title,
  children,
  style,
}: {
  tone?: "neutral" | "warn" | "stop" | "accent";
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const th = useTheme();
  const tones = {
    neutral: { border: th.c.rule, bg: th.c.cardSunken, ink: th.c.ink },
    warn: { border: th.c.warn, bg: th.c.warnSoft, ink: th.c.warn },
    stop: { border: th.c.stamp, bg: th.c.stampSoft, ink: th.c.stamp },
    accent: { border: th.c.accent, bg: th.c.accentSoft, ink: th.c.accent },
  }[tone];

  return (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: tones.border,
          backgroundColor: tones.bg,
          borderRadius: th.radius.md,
          padding: th.space.md,
          gap: th.space.xs,
        },
        style,
      ]}
    >
      {title ? (
        <Txt variant="micro" color={tones.ink}>
          {title}
        </Txt>
      ) : null}
      {isPlainText(children) ? (
        <Txt variant="small" color={th.c.ink}>
          {children}
        </Txt>
      ) : (
        children
      )}
    </View>
  );
}

/* --------------------------------- Divider -------------------------------- */

export function Rule({ strong, style }: { strong?: boolean; style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth, backgroundColor: strong ? th.c.ruleStrong : th.c.rule },
        style,
      ]}
    />
  );
}

/** The double rule that sits above a ledger total. */
export function DoubleRule({ style }: { style?: StyleProp<ViewStyle> }) {
  const th = useTheme();
  return (
    <View style={[{ gap: 2 }, style]}>
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: th.c.ruleStrong }} />
      <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: th.c.ruleStrong }} />
    </View>
  );
}

/* --------------------------------- Buttons -------------------------------- */

export function Button({
  label,
  onPress,
  tone = "accent",
  small,
  icon,
  disabled,
  style,
  ...rest
}: PressableProps & {
  label: string;
  tone?: "accent" | "quiet" | "stop";
  small?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const th = useTheme();
  const tones = {
    accent: { bg: th.c.accent, ink: th.c.accentInk, border: th.c.accent },
    quiet: { bg: "transparent", ink: th.c.ink, border: th.c.ruleStrong },
    stop: { bg: th.c.stampSoft, ink: th.c.stamp, border: th.c.stamp },
  }[tone];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      {...rest}
      style={({ pressed }) => [
        {
          minHeight: HIT,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: th.space.sm,
          paddingHorizontal: small ? th.space.md : th.space.xl,
          paddingVertical: small ? th.space.sm : th.space.md,
          borderRadius: th.radius.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: tones.border,
          backgroundColor: tones.bg,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {icon}
      <Txt variant="label" color={tones.ink} style={{ fontFamily: th.font.sansSemi }}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** A full-width tappable row with a chevron, used for every index list. */
export function ListRow({
  title,
  subtitle,
  meta,
  onPress,
  leading,
  last,
}: {
  title: string;
  subtitle?: string;
  meta?: React.ReactNode;
  onPress?: () => void;
  leading?: React.ReactNode;
  last?: boolean;
}) {
  const th = useTheme();
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: HIT + 8,
          flexDirection: "row",
          alignItems: "center",
          gap: th.space.md,
          paddingVertical: th.space.md,
          paddingHorizontal: th.space.lg,
          backgroundColor: pressed ? th.c.cardSunken : "transparent",
        })}
      >
        {leading}
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="label">{title}</Txt>
          {subtitle ? <Txt variant="small">{subtitle}</Txt> : null}
        </View>
        {meta}
        <Txt variant="body" color={th.c.ruleStrong} style={{ fontFamily: th.font.mono }}>
          {Platform.OS === "web" ? "›" : "›"}
        </Txt>
      </Pressable>
      {last ? null : <Rule style={{ marginLeft: th.space.lg }} />}
    </>
  );
}
