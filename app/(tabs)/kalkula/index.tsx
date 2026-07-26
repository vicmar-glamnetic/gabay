import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen, ScreenTitle } from "../../../components/Screen";
import { Card, ListRow, SectionHead, Txt } from "../../../components/ui";
import { CALCULATORS, HOLIDAY_ENTRY } from "../../../lib/data/calculators";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function KalkulaTab() {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen contentStyle={{ paddingTop: insets.top + th.space.md }}>
      <ScreenTitle
        eyebrow="Kalkula"
        title="Calculators"
        subtitle="Every result comes with the ledger behind it, so you can defend the number or challenge it."
      />

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Payroll" />
        <Card padded={false}>
          {CALCULATORS.map((c, i) => (
            <ListRow
              key={c.id}
              title={c.name}
              subtitle={c.blurb}
              onPress={() => router.push(c.href as never)}
              last={i === CALCULATORS.length - 1}
            />
          ))}
        </Card>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Calendar" />
        <Card padded={false}>
          <ListRow
            title={HOLIDAY_ENTRY.name}
            subtitle={HOLIDAY_ENTRY.blurb}
            onPress={() => router.push(HOLIDAY_ENTRY.href as never)}
            last
          />
        </Card>
        <Txt variant="rule">
          The holiday calendar lives here because it feeds the premium pay calculator —
          tapping a holiday opens it with the day type already set.
        </Txt>
      </View>
    </Screen>
  );
}
