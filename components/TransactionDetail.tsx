import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { LINK_CAVEAT } from "../lib/data/agencyLinks";
import type { Transaction, TransactionCategory } from "../lib/data/transactions";
import { FEE_CAVEAT } from "../lib/rates";
import { useAppStore } from "../lib/store/useAppStore";
import { useTheme } from "../lib/theme/ThemeProvider";
import { HIT } from "../lib/theme/tokens";
import {
  BahayKubo,
  Jeepney,
  LedgerSheet,
  OfficeQueue,
  PayEnvelope,
  TamaStamp,
} from "./Illustrations";
import { RichText } from "./RichText";
import { Callout, Card, SectionHead, Txt, VerifyTag } from "./ui";

/** A drawing per category, so each transaction has a face rather than a header. */
function CategoryArt({ category }: { category: TransactionCategory }) {
  switch (category) {
    case "Travel":
      return <Jeepney />;
    case "Business":
      return <PayEnvelope size={96} />;
    case "Employment":
      return <BahayKubo />;
    case "Civil registry":
    case "Identity":
      return <LedgerSheet size={104} />;
    default:
      return <OfficeQueue />;
  }
}

/**
 * Shared empty array. Defaulting inside the selector — `s.checklists[id] ?? []`
 * — allocates a new array on every render, so the store's equality check never
 * matches and React loops until it bails out. The default has to live outside.
 */
const NO_ITEMS: string[] = [];

export function TransactionDetail({ transaction: t }: { transaction: Transaction }) {
  const th = useTheme();
  const checked = useAppStore((s) => s.checklists[t.id]) ?? NO_ITEMS;
  const toggle = useAppStore((s) => s.toggleChecklistItem);
  const reset = useAppStore((s) => s.resetChecklist);

  const done = t.bring.filter((b) => checked.includes(b)).length;
  const total = t.bring.length;
  const ready = done === total && total > 0;
  const wasReady = React.useRef(ready);

  React.useEffect(() => {
    if (ready && !wasReady.current && Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    wasReady.current = ready;
  }, [ready]);

  const onToggle = (item: string) => {
    toggle(t.id, item);
    if (Platform.OS !== "web") Haptics.selectionAsync();
  };

  return (
    <View style={{ gap: th.space.xl }}>
      <View style={{ gap: th.space.xs }}>
        <View style={{ alignItems: "center", paddingVertical: th.space.sm }}>
          <CategoryArt category={t.category} />
        </View>
        <Txt variant="micro">
          {t.category} · {t.agency}
        </Txt>
        <Txt variant="display">{t.name}</Txt>
        <Txt variant="body" color={th.c.muted}>
          {t.why}
        </Txt>
      </View>

      <Card style={{ gap: th.space.md }}>
        <Meta label="Processing time" value={t.time} />
        <Meta
          label="Fee"
          value={t.fee}
          tag={<VerifyTag />}
          hint="Fees change by circular and vary by office and purpose."
        />
        <Meta
          label="Can it be done online?"
          value={
            t.online === true
              ? "Yes"
              : t.online === false
                ? "No — personal appearance required"
                : t.online
          }
        />
      </Card>

      {/* ------------------------------ checklist ------------------------------ */}
      <View style={{ gap: th.space.md }}>
        <SectionHead
          title="What to bring"
          action={
            done > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Reset the checklist"
                onPress={() => reset(t.id)}
                hitSlop={10}
              >
                <Txt variant="micro" color={th.c.accent}>
                  Reset
                </Txt>
              </Pressable>
            ) : undefined
          }
        />

        <Progress done={done} total={total} ready={ready} />

        <Card padded={false}>
          {t.bring.map((item, i) => (
            <CheckItem
              key={item}
              label={item}
              checked={checked.includes(item)}
              onPress={() => onToggle(item)}
              last={i === t.bring.length - 1}
            />
          ))}
        </Card>

        {ready ? (
          <Card
            style={{
              alignItems: "center",
              gap: th.space.sm,
              paddingVertical: th.space.xl,
              borderColor: th.c.accent,
              borderWidth: 1.5,
              backgroundColor: th.c.accentSoft,
            }}
          >
            <TamaStamp label="HANDA" />
            <Txt variant="title">Handa ka na.</Txt>
            <Txt variant="small" style={{ textAlign: "center", maxWidth: 320 }}>
              All {total} items ticked. Check the fee with the office before you travel —
              that is the one thing on this page that moves.
            </Txt>
          </Card>
        ) : null}
      </View>

      {/* -------------------------------- steps -------------------------------- */}
      <View style={{ gap: th.space.md }}>
        <SectionHead title="The steps, in order" />
        <Card style={{ gap: th.space.md }}>
          {t.steps.map((s, i) => (
            <View key={i} style={{ flexDirection: "row", gap: th.space.md }}>
              <Txt
                variant="amount"
                color={th.c.accent}
                style={{ width: 22, fontFamily: th.font.monoBold }}
              >
                {i + 1}
              </Txt>
              <View style={{ flex: 1 }}>
                <RichText>{s}</RichText>
              </View>
            </View>
          ))}
        </Card>
        <Txt variant="rule">{LINK_CAVEAT}</Txt>
      </View>

      {/* --------------------------- turned away for --------------------------- */}
      <View style={{ gap: th.space.md }}>
        <SectionHead title="Why people get turned away" />
        <View
          style={{
            borderWidth: 1.5,
            borderColor: th.c.stamp,
            backgroundColor: th.c.stampSoft,
            borderRadius: th.radius.lg,
            padding: th.space.lg,
            gap: th.space.md,
          }}
        >
          <Txt variant="small" color={th.c.stamp} style={{ fontFamily: th.font.sansMedium }}>
            The reasons people make a second trip. Check these before you leave the house.
          </Txt>
          {t.turnedAwayFor.map((r, i) => (
            <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
              <Txt variant="body" color={th.c.stamp} style={{ fontFamily: th.font.monoBold }}>
                ✕
              </Txt>
              <Txt variant="body" style={{ flex: 1, fontSize: th.fs(15) }}>
                {r}
              </Txt>
            </View>
          ))}
        </View>
      </View>

      <Callout tone="warn" title="Before you make a long trip">
        {FEE_CAVEAT} Requirements and step order in this guide are stable and nationwide;
        the fee is the part that moves. Call the office or check the agency site to confirm
        the current amount and whether your branch has any extra local requirement.
      </Callout>
    </View>
  );
}

/* ------------------------------ pieces ------------------------------ */

function Progress({ done, total, ready }: { done: number; total: number; ready: boolean }) {
  const th = useTheme();
  const pct = total === 0 ? 0 : done / total;

  return (
    <View
      style={{ gap: th.space.sm }}
      accessibilityRole="progressbar"
      accessibilityLabel={`${done} of ${total} items ready`}
      accessibilityValue={{ min: 0, max: total, now: done }}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
        <Txt
          variant="amount"
          color={ready ? th.c.accent : th.c.ink}
          style={{ fontFamily: th.font.monoBold, fontSize: th.fs(16) }}
        >
          {done} / {total}
        </Txt>
        <Txt variant="small" style={{ flex: 1 }}>
          {ready
            ? "Everything ticked."
            : done === 0
              ? "Tick each one as you get it. This is saved on your phone."
              : `${total - done} to go.`}
        </Txt>
      </View>
      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: th.c.rule,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${Math.round(pct * 100)}%`,
            height: "100%",
            borderRadius: 3,
            backgroundColor: ready ? th.c.accent : th.c.ruleStrong,
          }}
        />
      </View>
    </View>
  );
}

function CheckItem({
  label,
  checked,
  onPress,
  last,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  const th = useTheme();
  return (
    <>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: HIT + 6,
          flexDirection: "row",
          alignItems: "flex-start",
          gap: th.space.md,
          padding: th.space.lg,
          backgroundColor: pressed
            ? th.c.cardSunken
            : checked
              ? th.c.accentSoft
              : "transparent",
        })}
      >
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 1.8,
            borderColor: checked ? th.c.accent : th.c.ruleStrong,
            backgroundColor: checked ? th.c.accent : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 1,
          }}
        >
          {checked ? (
            <Txt variant="small" color={th.c.accentInk} style={{ fontFamily: th.font.monoBold }}>
              ✓
            </Txt>
          ) : null}
        </View>
        <Txt
          variant="body"
          style={{
            flex: 1,
            fontSize: th.fs(15),
            textDecorationLine: checked ? "line-through" : "none",
            opacity: checked ? 0.6 : 1,
          }}
        >
          {label}
        </Txt>
      </Pressable>
      {last ? null : (
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: th.c.rule, marginLeft: th.space.lg }} />
      )}
    </>
  );
}

function Meta({
  label,
  value,
  tag,
  hint,
}: {
  label: string;
  value: string;
  tag?: React.ReactNode;
  hint?: string;
}) {
  const th = useTheme();
  return (
    <View style={{ gap: 2 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
        <Txt variant="micro">{label}</Txt>
        {tag}
      </View>
      <Txt variant="body" style={{ fontSize: th.fs(15) }}>
        {value}
      </Txt>
      {hint ? <Txt variant="rule">{hint}</Txt> : null}
    </View>
  );
}
