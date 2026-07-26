import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { confirmDestructive } from "../../../components/CalcActions";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { LedgerSheet } from "../../../components/Illustrations";
import { Callout, Card, Rule, Txt } from "../../../components/ui";
import { peso } from "../../../lib/calc/money";
import { useAppStore, type SavedComputation } from "../../../lib/store/useAppStore";
import { useTheme } from "../../../lib/theme/ThemeProvider";
import { HIT } from "../../../lib/theme/tokens";

export default function SavedScreen() {
  const th = useTheme();
  const saved = useAppStore((s) => s.saved);

  return (
    <Screen>
      <BackBar label="Ako" />
      <ScreenTitle
        eyebrow="Ako"
        title="Saved computations"
        subtitle="Reopens on the right screen with exactly what you typed."
      />

      {saved.length === 0 ? (
        <Card style={{ alignItems: "center", gap: th.space.sm, paddingVertical: th.space.xxl }}>
          <LedgerSheet />
          <Txt variant="title">Walang laman pa.</Txt>
          <Txt variant="small" style={{ textAlign: "center", maxWidth: 320 }}>
            Open any calculator, tap the result bar to see the ledger, then Save. Name it and
            you can come back to the same payslip check next cutoff without retyping a thing.
          </Txt>
        </Card>
      ) : (
        <Card padded={false}>
          {saved.map((s, i) => (
            <React.Fragment key={s.id}>
              <SavedRow item={s} />
              {i === saved.length - 1 ? null : <Rule style={{ marginLeft: th.space.lg }} />}
            </React.Fragment>
          ))}
        </Card>
      )}

      <Callout>
        Saved computations live on this phone only. They are not backed up and they are not
        sent anywhere, so deleting the app deletes them.
      </Callout>
    </Screen>
  );
}

function SavedRow({ item }: { item: SavedComputation }) {
  const th = useTheme();
  const router = useRouter();
  const remove = useAppStore((s) => s.deleteComputation);

  const open = () =>
    router.push({
      pathname: item.href as never,
      params: item.inputs as Record<string, string>,
    });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${item.headline.label} ${peso(item.headline.amount)}`}
      onPress={open}
      onLongPress={() =>
        confirmDestructive(
          "Delete this computation?",
          `“${item.name}” will be removed from this phone.`,
          () => remove(item.id)
        )
      }
      style={({ pressed }) => ({
        minHeight: HIT + 12,
        flexDirection: "row",
        alignItems: "center",
        gap: th.space.md,
        padding: th.space.lg,
        backgroundColor: pressed ? th.c.cardSunken : "transparent",
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="label">{item.name}</Txt>
        <Txt variant="rule">
          {item.headline.label} · {new Date(item.at).toLocaleDateString("en-PH")}
        </Txt>
      </View>
      <Txt variant="amount" color={th.c.accent} style={{ fontFamily: th.font.monoBold }}>
        {peso(item.headline.amount)}
      </Txt>
    </Pressable>
  );
}
