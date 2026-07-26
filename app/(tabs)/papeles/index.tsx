import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MagnifyPaper } from "../../../components/Illustrations";
import { TransactionDetail } from "../../../components/TransactionDetail";
import { Disclaimer } from "../../../components/Screen";
import { Card, Chip, ListRow, Txt } from "../../../components/ui";
import {
  searchTransactions,
  TRANSACTION_CATEGORIES,
  TRANSACTIONS,
  type Transaction,
  type TransactionCategory,
} from "../../../lib/data/transactions";
import { useDebounced } from "../../../lib/hooks";
import { FEE_CAVEAT } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";
import { useInsideTabs } from "../../../lib/theme/useTabBarHeight";

/**
 * List on the left, detail on the right. On phone widths the list collapses
 * above the detail — tapping a row pushes the detail screen instead.
 */
export default function PapelesTab() {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomSafe = useInsideTabs() ? 0 : insets.bottom;

  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<TransactionCategory | "All">("All");
  const [selected, setSelected] = React.useState<string>(TRANSACTIONS[0].id);
  const debounced = useDebounced(query);

  const results = searchTransactions(debounced, category);
  const detail = results.find((r) => r.id === selected) ?? results[0];

  const open = (t: Transaction) => {
    if (th.wide) setSelected(t.id);
    else router.push(`/papeles/${t.id}` as never);
  };

  const list = (
    <View style={{ gap: th.space.md }}>
      <View style={{ gap: th.space.xs }}>
        <Txt variant="display">Papeles</Txt>
        <Txt variant="body" color={th.c.muted}>
          What to bring, in what order, and why people get sent home.
        </Txt>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: th.space.sm,
          minHeight: 46,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: th.c.ruleStrong,
          borderRadius: th.radius.md,
          backgroundColor: th.c.card,
          paddingHorizontal: th.space.md,
        }}
      >
        <Txt variant="body" color={th.c.muted}>
          ⌕
        </Txt>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Passport, NBI, birth certificate…"
          placeholderTextColor={th.c.ruleStrong}
          accessibilityLabel="Search government transactions"
          returnKeyType="search"
          style={{
            flex: 1,
            paddingVertical: th.space.sm,
            fontFamily: th.font.sans,
            fontSize: th.fs(16),
            color: th.c.ink,
          }}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: th.space.sm, paddingRight: th.space.lg }}
      >
        <Chip label="All" selected={category === "All"} onPress={() => setCategory("All")} />
        {TRANSACTION_CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </ScrollView>

      {results.length === 0 ? (
        <Card style={{ alignItems: "center", gap: th.space.sm, paddingVertical: th.space.xl }}>
          <MagnifyPaper />
          <Txt variant="title">Wala pa rito.</Txt>
          <Txt variant="small" style={{ textAlign: "center", maxWidth: 340 }}>
            Nothing matches “{query}”. The guide covers nationwide transactions only —
            LGU-specific requirements are deliberately left out, since they differ in every
            city.
          </Txt>
        </Card>
      ) : (
        <Card padded={false}>
          {results.map((t, i) => (
            <ListRow
              key={t.id}
              title={t.name}
              subtitle={`${t.agency} · ${t.time.split(".")[0]}`}
              onPress={() => open(t)}
              last={i === results.length - 1}
              meta={
                th.wide && detail?.id === t.id ? (
                  <Txt variant="micro" color={th.c.accent}>
                    Showing
                  </Txt>
                ) : undefined
              }
            />
          ))}
        </Card>
      )}

      <Txt variant="rule">{FEE_CAVEAT}</Txt>
    </View>
  );

  if (!th.wide) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: th.c.paper }}
        contentContainerStyle={{
          padding: th.space.lg,
          paddingTop: insets.top + th.space.md,
          paddingBottom: bottomSafe + 48,
          gap: th.space.xl,
          maxWidth: 780,
          width: "100%",
          alignSelf: "center",
        }}
        keyboardShouldPersistTaps="handled"
      >
        {list}
        <Disclaimer />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: th.c.paper }}>
      <ScrollView
        style={{ flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: th.c.rule }}
        contentContainerStyle={{
          padding: th.space.lg,
          paddingTop: insets.top + th.space.md,
          paddingBottom: bottomSafe + 48,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {list}
      </ScrollView>
      <ScrollView
        style={{ flex: 1.25 }}
        contentContainerStyle={{
          padding: th.space.lg,
          paddingTop: insets.top + th.space.md,
          paddingBottom: bottomSafe + 48,
          gap: th.space.xl,
        }}
      >
        {detail ? <TransactionDetail transaction={detail} /> : null}
        <Disclaimer />
      </ScrollView>
    </View>
  );
}
