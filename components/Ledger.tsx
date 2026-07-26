import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { peso } from "../lib/calc/money";
import type { LedgerLine, LedgerSection } from "../lib/calc/types";
import { useStackedRows, useTheme } from "../lib/theme/ThemeProvider";
import { DoubleRule, Txt } from "./ui";

/**
 * The signature element. Dotted leaders between label and amount, a double rule
 * above the total, the total set large in mono pine. It has to read well as a
 * standalone screenshot, so nothing here depends on surrounding chrome.
 */

const LEADER = "·".repeat(200);

function Leader() {
  const th = useTheme();
  return (
    <Txt
      variant="rule"
      numberOfLines={1}
      ellipsizeMode="clip"
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={{
        flex: 1,
        color: th.c.rule,
        letterSpacing: 2,
        marginHorizontal: 6,
        transform: [{ translateY: -3 }],
      }}
    >
      {LEADER}
    </Txt>
  );
}

function Amount({ line }: { line: LedgerLine }) {
  const th = useTheme();
  const [copied, setCopied] = React.useState(false);

  const text =
    line.raw !== undefined
      ? line.raw
      : line.amount !== undefined
        ? line.negative && line.amount > 0
          ? `−${peso(line.amount)}`
          : peso(line.amount)
        : "";

  if (!text) return null;

  const color = line.negative
    ? th.c.stamp
    : line.strong
      ? th.c.accent
      : th.c.ink;

  const onLongPress = async () => {
    if (line.amount === undefined && line.raw === undefined) return;
    await Clipboard.setStringAsync(text.replace(/[−₱,]/g, ""));
    if (Platform.OS !== "web") Haptics.selectionAsync();
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Pressable
      onLongPress={onLongPress}
      delayLongPress={350}
      accessibilityRole="text"
      accessibilityHint="Long press to copy"
      accessibilityLabel={`${line.label}, ${text}`}
    >
      <Txt
        variant="amount"
        color={color}
        style={{
          fontFamily: line.strong ? th.font.monoBold : th.font.monoMedium,
          fontSize: th.fs(line.strong ? 17 : 15),
        }}
      >
        {copied ? "copied" : text}
      </Txt>
    </Pressable>
  );
}

function Line({ line }: { line: LedgerLine }) {
  const th = useTheme();
  const stacked = useStackedRows();

  if (line.note) {
    return (
      <View style={{ paddingVertical: th.space.xs, gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
          <Txt variant="small" style={{ flex: 1, fontStyle: "italic" }}>
            {line.label}
          </Txt>
          {line.raw ? (
            <Txt variant="rule" color={th.c.muted}>
              {line.raw}
            </Txt>
          ) : null}
        </View>
        {line.rule ? <Txt variant="rule">{line.rule}</Txt> : null}
      </View>
    );
  }

  return (
    <View style={{ paddingVertical: th.space.xs + 1 }}>
      {line.strong ? <DoubleRule style={{ marginBottom: th.space.sm }} /> : null}
      <View
        style={{
          flexDirection: stacked ? "column" : "row",
          alignItems: stacked ? "flex-start" : "baseline",
        }}
      >
        <Txt
          variant={line.strong ? "label" : "body"}
          style={{
            fontSize: th.fs(line.strong ? 16 : 15),
            flexShrink: 1,
            maxWidth: stacked ? "100%" : "68%",
          }}
        >
          {line.label}
        </Txt>
        {stacked ? null : <Leader />}
        <Amount line={line} />
      </View>
      {line.rule ? (
        <Txt variant="rule" style={{ marginTop: 2, maxWidth: "94%" }}>
          {line.rule}
        </Txt>
      ) : null}
    </View>
  );
}

export function Ledger({
  sections,
  compact,
}: {
  sections: LedgerSection[];
  compact?: boolean;
}) {
  const th = useTheme();
  return (
    <View style={{ gap: compact ? th.space.lg : th.space.xxl }}>
      {sections.map((section, i) => (
        <View key={`${section.title}-${i}`}>
          <View style={{ marginBottom: th.space.sm }}>
            <Txt variant="section">{section.title}</Txt>
            {section.subtitle ? (
              <Txt variant="small" style={{ marginTop: 2 }}>
                {section.subtitle}
              </Txt>
            ) : null}
          </View>
          <View
            style={{
              backgroundColor: th.c.card,
              borderRadius: th.radius.lg,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: th.c.rule,
              paddingHorizontal: th.space.lg,
              paddingVertical: th.space.md,
            }}
          >
            {section.lines.map((l, j) => (
              <Line key={`${l.label}-${j}`} line={l} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

/** The headline figure, set large in mono pine. Used inside the sticky bar. */
export function Headline({
  label,
  amount,
  rule,
  raw,
}: {
  label: string;
  amount: number;
  rule?: string;
  raw?: string;
}) {
  const th = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <Txt variant="micro">{label}</Txt>
      <Txt variant="amountLarge">{raw ?? peso(amount)}</Txt>
      {rule ? <Txt variant="rule">{rule}</Txt> : null}
    </View>
  );
}
