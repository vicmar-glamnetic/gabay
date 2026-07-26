import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlamMoBa } from "../../../components/AlamMoBa";
import { RaiseItSection } from "../../../components/CalcScaffold";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, ListRow, SectionHead } from "../../../components/ui";
import { useTheme } from "../../../lib/theme/ThemeProvider";

const GROUPS: {
  header: string;
  items: { href: string; title: string; subtitle: string }[];
}[] = [
  {
    header: "What you are owed",
    items: [
      {
        href: "/karapatan/leave",
        title: "Leave entitlements",
        subtitle: "Service incentive, maternity, paternity, solo parent, VAWC, special leave for women",
      },
      {
        href: "/karapatan/minimum-wage",
        title: "Minimum wage checker",
        subtitle: "The daily floor for your region and sector, and the wage order that set it",
      },
      {
        href: "/karapatan/discounts",
        title: "Discount entitlements",
        subtitle: "Senior, PWD and solo parent — including the VAT treatment people get wrong",
      },
    ],
  },
  {
    header: "Your employment",
    items: [
      {
        href: "/karapatan/red-flags",
        title: "Contract and status check",
        subtitle: "Probation, regularisation, repeated fixed-term contracts, payslips and deductions",
      },
    ],
  },
  {
    header: "Health and working abroad",
    items: [
      {
        href: "/karapatan/philhealth",
        title: "PhilHealth benefits",
        subtitle: "Konsulta, case rates, Z Benefits, No Balance Billing, and a pre-admission checklist",
      },
      {
        href: "/karapatan/ofw",
        title: "OFW agency check",
        subtitle: "Four verification steps, the placement fee rules, and a red flag checklist",
      },
    ],
  },
];

export default function KarapatanTab() {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Screen contentStyle={{ paddingTop: insets.top + th.space.md }}>
      <ScreenTitle
        eyebrow="Karapatan"
        title="What you are entitled to"
        subtitle="Every entitlement here names the law it comes from. Nothing appears without its source."
      />

      <AlamMoBa />

      {GROUPS.map((g) => (
        <View key={g.header} style={{ gap: th.space.md }}>
          <SectionHead title={g.header} />
          <Card padded={false}>
            {g.items.map((item, i) => (
              <ListRow
                key={item.href}
                title={item.title}
                subtitle={item.subtitle}
                onPress={() => router.push(item.href as never)}
                last={i === g.items.length - 1}
              />
            ))}
          </Card>
        </View>
      ))}

      <Callout tone="neutral" title="What this tab does and does not do">
        Gabay states the rule and points you to where to ask. It does not tell you whether
        you have a case, predict what would happen, or characterise anyone&apos;s conduct.
        For anything that needs a view on your particular situation, talk to DOLE or to a
        lawyer.
      </Callout>

      <RaiseItSection />
    </Screen>
  );
}
