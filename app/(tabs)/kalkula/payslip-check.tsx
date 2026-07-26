import React from "react";
import { StyleSheet, View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, PickerField, Segmented } from "../../../components/Field";
import { TamaStamp } from "../../../components/Illustrations";
import { Sheet, SheetOption } from "../../../components/Sheet";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { peso } from "../../../lib/calc/money";
import type { ContributionTiming } from "../../../lib/calc/netpay";
import { checkPayslip, type PayslipRow } from "../../../lib/calc/payslip";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";
import { PAY_FREQUENCIES, PAY_FREQUENCY_LABEL, type PayFrequency } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function PayslipCheckScreen() {
  const th = useTheme();
  const restored = useRestoredInputs();
  useRecent("/kalkula/payslip-check", "Payslip checker", "Payroll");

  const gross = useAmount(restored.gross ?? "30000");
  const sss = useAmount(restored.sss ?? "");
  const philhealth = useAmount(restored.philhealth ?? "");
  const pagibig = useAmount(restored.pagibig ?? "");
  const tax = useAmount(restored.tax ?? "");
  const net = useAmount(restored.net ?? "");
  const [frequency, setFrequency] = React.useState<PayFrequency>(
    (restored.frequency as PayFrequency) ?? "monthly"
  );
  const [timing, setTiming] = React.useState<ContributionTiming>(
    (restored.timing as ContributionTiming) ?? "spread"
  );
  const [sheet, setSheet] = React.useState(false);

  const result = checkPayslip({
    periodGross: gross.value ?? 0,
    frequency,
    contributionTiming: timing,
    actual: {
      sss: sss.value,
      philhealth: philhealth.value,
      pagibig: pagibig.value,
      tax: tax.value,
      net: net.value,
    },
  });

  const f = result.figures;

  return (
    <>
      <CalcScaffold
        eyebrow="Payroll"
        title="Payslip checker"
        subtitle="Enter what your payslip says. Every field is optional — check one line or all of them."
        kind="payslip-check"
        href="/kalkula/payslip-check"
        result={result}
        warn={f.mismatchCount > 0}
        hapticKey={`${f.mismatchCount}-${f.checkedCount}`}
        headlineRaw={
          f.checkedCount === 0
            ? "—"
            : f.mismatchCount === 0
              ? "All match"
              : peso(Math.abs(f.totalDifference))
        }
        savedInputs={{
          gross: gross.text,
          frequency,
          timing,
          sss: sss.text,
          philhealth: philhealth.text,
          pagibig: pagibig.text,
          tax: tax.text,
          net: net.text,
        }}
        inputs={
          <>
            <AmountField
              label="Gross basic pay on this payslip"
              hint="The gross for this one cutoff, not the annual or monthly figure."
              value={gross.text}
              onChange={gross.setText}
            />
            <PickerField
              label="Pay frequency"
              value={PAY_FREQUENCY_LABEL[frequency]}
              hint={`Monthly equivalent: ${peso(f.monthlyEquivalent)}`}
              onPress={() => setSheet(true)}
            />
            {frequency !== "monthly" ? (
              <Segmented
                label="How does your company take the contributions?"
                value={timing}
                onChange={setTiming}
                options={[
                  { value: "spread", label: "Split across cutoffs" },
                  { value: "single", label: "Full on one cutoff" },
                ]}
              />
            ) : null}

            <View style={{ gap: th.space.xs }}>
              <Txt variant="section">What your payslip says</Txt>
              <Txt variant="small">Leave anything blank that you do not want to check.</Txt>
            </View>

            <AmountField label="SSS" value={sss.text} onChange={sss.setText} optional />
            <AmountField
              label="PhilHealth"
              value={philhealth.text}
              onChange={philhealth.setText}
              optional
            />
            <AmountField label="Pag-IBIG" value={pagibig.text} onChange={pagibig.setText} optional />
            <AmountField
              label="Withholding tax"
              value={tax.text}
              onChange={tax.setText}
              optional
            />
            <AmountField label="Net pay" value={net.text} onChange={net.setText} optional />
          </>
        }
        extra={
          <View style={{ gap: th.space.md }}>
            <SectionHead title="The comparison" />
            {f.checkedCount === 0 ? (
              <Callout>
                Enter any one figure from your payslip above. You do not have to fill in the
                rest.
              </Callout>
            ) : f.mismatchCount === 0 ? (
              <Card
                style={{
                  alignItems: "center",
                  gap: th.space.sm,
                  paddingVertical: th.space.xl,
                  borderColor: th.c.accent,
                  borderWidth: 1,
                }}
              >
                <TamaStamp />
                <Txt variant="title">
                  {f.checkedCount === 1 ? "Tama ang isa." : "Tama lahat."}
                </Txt>
                <Txt variant="small" style={{ textAlign: "center", maxWidth: 320 }}>
                  {f.checkedCount === 1
                    ? "The one figure you entered matches the current statutory schedule."
                    : `All ${f.checkedCount} figures you entered match the current statutory schedules.`}{" "}
                  Nothing to raise with anyone.
                </Txt>
                <View style={{ gap: th.space.sm, width: "100%", marginTop: th.space.sm }}>
                  {f.rows
                    .filter((r) => r.verdict !== "not-entered")
                    .map((row) => (
                      <DiffRow key={row.key} row={row} />
                    ))}
                </View>
              </Card>
            ) : (
              <View style={{ gap: th.space.sm }}>
                {f.rows
                  .filter((r) => r.verdict !== "not-entered")
                  .map((row) => (
                    <DiffRow key={row.key} row={row} />
                  ))}
              </View>
            )}

            {f.mismatchCount > 0 ? (
              <Callout tone="accent" title="Before you raise it">
                A difference does not mean your employer is wrong. This check cannot see your
                allowances, mid-period adjustments, or the basis payroll used. Ask HR which
                basis they used for the deduction and for which period — that question
                usually settles it.
              </Callout>
            ) : null}
          </View>
        }
      />

      <Sheet
        visible={sheet}
        onClose={() => setSheet(false)}
        title="Pay frequency"
        subtitle="This picks which BIR withholding table applies."
        snap={0.55}
      >
        <View>
          {PAY_FREQUENCIES.map((x) => (
            <SheetOption
              key={x}
              label={PAY_FREQUENCY_LABEL[x]}
              selected={x === frequency}
              onPress={() => {
                setFrequency(x);
                setSheet(false);
              }}
            />
          ))}
        </View>
      </Sheet>
    </>
  );
}

function DiffRow({ row }: { row: PayslipRow }) {
  const th = useTheme();
  const match = row.verdict === "match";
  const tone = match ? th.c.accent : th.c.stamp;

  return (
    <Card
      style={{
        borderColor: tone,
        borderWidth: 1,
        backgroundColor: match ? th.c.card : th.c.stampSoft,
        gap: th.space.sm,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
        <Txt variant="label" style={{ flex: 1 }}>
          {row.label}
        </Txt>
        <View
          style={{
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: tone,
          }}
        >
          <Txt variant="micro" color={tone}>
            {match ? "Match" : row.verdict === "over" ? "Overdeducted" : "Underdeducted"}
          </Txt>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: th.space.lg }}>
        <Figure label="Expected" value={peso(row.expected)} />
        <Figure label="On your payslip" value={peso(row.actual ?? 0)} />
        <Figure
          label="Difference"
          value={`${(row.difference ?? 0) > 0 ? "+" : ""}${peso(row.difference ?? 0)}`}
          color={match ? th.c.muted : tone}
        />
      </View>

      <Txt variant="body" style={{ fontSize: th.fs(14.5) }}>
        {row.message}
      </Txt>
      <Txt variant="rule">{row.rule}</Txt>

      {row.explanations.length ? (
        <View style={{ gap: 2, marginTop: th.space.xs }}>
          <Txt variant="micro">Common reasons for a gap like this</Txt>
          {row.explanations.map((e, i) => (
            <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
              <Txt variant="small" color={th.c.ruleStrong}>
                ·
              </Txt>
              <Txt variant="small" style={{ flex: 1 }}>
                {e}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

function Figure({ label, value, color }: { label: string; value: string; color?: string }) {
  const th = useTheme();
  return (
    <View style={{ gap: 1 }}>
      <Txt variant="micro">{label}</Txt>
      <Txt variant="amount" color={color} style={{ fontSize: th.fs(15) }}>
        {value}
      </Txt>
    </View>
  );
}
