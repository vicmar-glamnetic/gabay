import React from "react";
import { View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { AmountField, Segmented, ToggleField } from "../../../components/Field";
import { Ledger } from "../../../components/Ledger";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { computeDiscount, type DiscountKind } from "../../../lib/calc/discounts";
import { DISCOUNT_ENTITLEMENTS, type DiscountEntitlement } from "../../../lib/data/karapatan";
import { useAmount, useRecent } from "../../../lib/hooks";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function DiscountsScreen() {
  const th = useTheme();
  useRecent("/karapatan/discounts", "Discount entitlements", "Karapatan");

  const [kind, setKind] = React.useState<DiscountKind>("senior");
  const [includesVat, setIncludesVat] = React.useState(true);
  const price = useAmount("1000");

  const result = computeDiscount({
    postedPrice: price.value ?? 0,
    kind,
    priceIncludesVat: includesVat,
  });

  return (
    <Screen>
      <BackBar label="Karapatan" />
      <ScreenTitle
        eyebrow="Karapatan"
        title="Discount entitlements"
        subtitle="Senior citizen, PWD and solo parent — and the VAT treatment retail gets wrong most often."
      />

      <Callout tone="stop" title="The most common retail error in the country">
        The discount is computed on the VAT-exclusive price, and the sale is exempt from VAT.
        If a receipt shows the discount taken off first and 12% VAT added back on top, the
        computation is wrong · RA 9994, RA 10754.
      </Callout>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Check a bill" />
        <Card style={{ gap: th.space.lg }}>
          <Segmented
            label="Which discount"
            value={kind}
            onChange={setKind}
            options={[
              { value: "senior", label: "Senior" },
              { value: "pwd", label: "PWD" },
              { value: "solo-parent", label: "Solo parent" },
            ]}
          />
          <AmountField
            label="Posted price"
            hint="What is on the menu, the shelf tag or the bill."
            value={price.text}
            onChange={price.setText}
          />
          <ToggleField
            label="The posted price already includes VAT"
            hint="This is the usual case in Philippine retail."
            value={includesVat}
            onChange={setIncludesVat}
          />
        </Card>

        <Ledger sections={result.sections} compact />

        {result.notes.map((n, i) => (
          <Callout key={i}>{n}</Callout>
        ))}
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="What each discount covers" />
        {DISCOUNT_ENTITLEMENTS.map((d) => (
          <DiscountCard key={d.id} discount={d} />
        ))}
      </View>
    </Screen>
  );
}

function DiscountCard({ discount: d }: { discount: DiscountEntitlement }) {
  const th = useTheme();
  return (
    <Card style={{ gap: th.space.md }}>
      <View style={{ gap: 2 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
          <Txt variant="title" style={{ flex: 1 }}>
            {d.name}
          </Txt>
          <Txt variant="amount" color={th.c.accent} style={{ fontFamily: th.font.monoBold }}>
            {d.rate}
          </Txt>
        </View>
        <Txt variant="rule" color={th.c.accent}>
          {d.law}
        </Txt>
      </View>

      <View style={{ gap: 2 }}>
        <Txt variant="micro">VAT treatment</Txt>
        <Txt variant="body" style={{ fontSize: th.fs(15) }}>
          {d.vat}
        </Txt>
      </View>

      <View style={{ gap: 2 }}>
        <Txt variant="micro">What it covers</Txt>
        {d.covers.map((c, i) => (
          <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
            <Txt variant="small" color={th.c.ruleStrong}>
              ·
            </Txt>
            <Txt variant="body" style={{ flex: 1, fontSize: th.fs(15) }}>
              {c}
            </Txt>
          </View>
        ))}
      </View>

      <View style={{ gap: 2 }}>
        <Txt variant="micro">What to present</Txt>
        <Txt variant="body" style={{ fontSize: th.fs(15) }}>
          {d.id_required}
        </Txt>
      </View>

      <View style={{ gap: th.space.xs }}>
        {d.notes.map((n, i) => (
          <Txt key={i} variant="small">
            · {n}
          </Txt>
        ))}
      </View>
    </Card>
  );
}
