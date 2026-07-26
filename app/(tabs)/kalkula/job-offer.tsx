import React from "react";
import { View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, Segmented } from "../../../components/Field";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { peso } from "../../../lib/calc/money";
import { compareOffers, computeJobOffer } from "../../../lib/calc/netpay";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function JobOfferScreen() {
  const th = useTheme();
  const restored = useRestoredInputs();
  useRecent("/kalkula/job-offer", "Job offer preview", "Payroll");

  const [mode, setMode] = React.useState<"single" | "compare">(
    (restored.mode as "single" | "compare") ?? "single"
  );
  const offerA = useAmount(restored.offerA ?? "35000");
  const offerB = useAmount(restored.offerB ?? "42000");

  const single = computeJobOffer({
    monthlyBasic: offerA.value ?? 0,
    frequency: "monthly",
  });
  const comparison = compareOffers(
    { monthlyBasic: offerA.value ?? 0, frequency: "monthly" },
    { monthlyBasic: offerB.value ?? 0, frequency: "monthly" }
  );

  const result = mode === "single" ? single : comparison.a;

  return (
    <CalcScaffold
      eyebrow="Payroll"
      title="Job offer preview"
      subtitle="What an offered salary actually pays, after everything statutory comes off."
      kind="job-offer"
      href="/kalkula/job-offer"
      result={result}
      hapticKey={`${mode}-${result.figures.taxBracketIndex}`}
      savedInputs={{ mode, offerA: offerA.text, offerB: offerB.text }}
      inputs={
        <>
          <Segmented
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "single", label: "One offer" },
              { value: "compare", label: "Compare two" },
            ]}
          />
          <AmountField
            label={mode === "single" ? "Offered monthly salary" : "First offer"}
            hint="Monthly basic. Allowances and variable pay are not included."
            value={offerA.text}
            onChange={offerA.setText}
          />
          {mode === "compare" ? (
            <AmountField
              label="Second offer"
              value={offerB.text}
              onChange={offerB.setText}
            />
          ) : null}
        </>
      }
      extra={
        mode === "compare" ? (
          <View style={{ gap: th.space.md }}>
            <SectionHead title="Side by side" />
            <Card style={{ gap: th.space.md }}>
              <View style={{ flexDirection: "row", gap: th.space.md }}>
                <OfferColumn
                  label="First offer"
                  gross={offerA.value ?? 0}
                  net={comparison.a.figures.net}
                  annual={comparison.a.figures.annualNet}
                  tax={comparison.a.figures.tax}
                  winner={comparison.netDifference < 0}
                />
                <View style={{ width: 1, backgroundColor: th.c.rule }} />
                <OfferColumn
                  label="Second offer"
                  gross={offerB.value ?? 0}
                  net={comparison.b.figures.net}
                  annual={comparison.b.figures.annualNet}
                  tax={comparison.b.figures.tax}
                  winner={comparison.netDifference > 0}
                />
              </View>
              <Txt variant="body">{comparison.verdict}</Txt>
              <Txt variant="rule">
                Both figures use the monthly BIR table and the current SSS, PhilHealth and
                Pag-IBIG schedules.
              </Txt>
            </Card>
            {comparison.reversal ? (
              <Callout tone="warn" title="The higher gross does not win here">
                Once the brackets and the contribution ceilings are applied, the larger
                headline salary leaves less in hand. Worth checking the non-cash parts of
                each offer before deciding.
              </Callout>
            ) : null}
            <Callout>
              The ledger below is for the first offer. Switch to one-offer mode to see the
              full breakdown for either figure.
            </Callout>
          </View>
        ) : null
      }
    />
  );
}

function OfferColumn({
  label,
  gross,
  net,
  annual,
  tax,
  winner,
}: {
  label: string;
  gross: number;
  net: number;
  annual: number;
  tax: number;
  winner: boolean;
}) {
  const th = useTheme();
  return (
    <View style={{ flex: 1, gap: th.space.sm }}>
      <Txt variant="micro" color={winner ? th.c.accent : th.c.muted}>
        {label}
        {winner ? "  ✓" : ""}
      </Txt>
      <View>
        <Txt variant="rule">Gross monthly</Txt>
        <Txt variant="amount">{peso(gross)}</Txt>
      </View>
      <View>
        <Txt variant="rule">Take-home monthly</Txt>
        <Txt variant="amount" color={th.c.accent} style={{ fontFamily: th.font.monoBold, fontSize: th.fs(19) }}>
          {peso(net)}
        </Txt>
      </View>
      <View>
        <Txt variant="rule">Withholding tax</Txt>
        <Txt variant="amount" color={th.c.stamp}>
          −{peso(tax)}
        </Txt>
      </View>
      <View>
        <Txt variant="rule">Annual, with 13th month</Txt>
        <Txt variant="amount">{peso(annual)}</Txt>
      </View>
    </View>
  );
}
