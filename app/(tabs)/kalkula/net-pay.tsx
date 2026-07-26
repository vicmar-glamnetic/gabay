import React from "react";
import { View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, PickerField, Segmented } from "../../../components/Field";
import { Sheet, SheetOption } from "../../../components/Sheet";
import { Callout, Txt } from "../../../components/ui";
import { computeNetPay, type ContributionTiming } from "../../../lib/calc/netpay";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";
import { PAY_FREQUENCIES, PAY_FREQUENCY_LABEL, type PayFrequency } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

const FREQUENCY_HINT: Record<PayFrequency, string> = {
  monthly: "One cutoff a month.",
  "semi-monthly": "The 15th and the 30th. This is what most Philippine companies run.",
  weekly: "Monthly basic converted at 52 weeks a year.",
  daily: "Monthly basic converted at the 313-day factor.",
};

export default function NetPayScreen() {
  const th = useTheme();
  const restored = useRestoredInputs();
  useRecent("/kalkula/net-pay", "Contributions and net pay", "Payroll");

  const salary = useAmount(restored.salary ?? "30000");
  const allowance = useAmount(restored.allowance ?? "");
  const [frequency, setFrequency] = React.useState<PayFrequency>(
    (restored.frequency as PayFrequency) ?? "semi-monthly"
  );
  const [timing, setTiming] = React.useState<ContributionTiming>(
    (restored.timing as ContributionTiming) ?? "spread"
  );
  const [payer, setPayer] = React.useState<"employed" | "self-paying">(
    (restored.payer as "employed" | "self-paying") ?? "employed"
  );
  const [freqSheet, setFreqSheet] = React.useState(false);

  const result = computeNetPay({
    monthlyBasic: salary.value ?? 0,
    frequency,
    nonTaxableAllowance: allowance.value ?? 0,
    contributionTiming: timing,
    philHealthPayer: payer,
  });

  return (
    <>
      <CalcScaffold
        eyebrow="Payroll"
        title="Contributions and net pay"
        subtitle="What comes off a salary, why, and what lands in the account."
        kind="net-pay"
        href="/kalkula/net-pay"
        result={result}
        hapticKey={result.figures.taxBracketIndex}
        savedInputs={{
          salary: salary.text,
          allowance: allowance.text,
          frequency,
          timing,
          payer,
        }}
        inputs={
          <>
            <AmountField
              label="Monthly basic salary"
              hint="Basic pay only. Allowances go in the field below."
              value={salary.text}
              onChange={salary.setText}
            />

            <PickerField
              label="Pay frequency"
              value={PAY_FREQUENCY_LABEL[frequency]}
              hint={FREQUENCY_HINT[frequency]}
              onPress={() => setFreqSheet(true)}
            />

            {result.figures.periodsPerMonth !== 1 ? (
              <Segmented
                label="Contribution timing"
                value={timing}
                onChange={setTiming}
                options={[
                  { value: "spread", label: "Split across cutoffs" },
                  { value: "single", label: "Full on one cutoff" },
                ]}
              />
            ) : null}

            <Segmented
              label="PhilHealth"
              value={payer}
              onChange={setPayer}
              options={[
                { value: "employed", label: "Employed" },
                { value: "self-paying", label: "Self-paying" },
              ]}
            />

            <AmountField
              label="Non-taxable allowance"
              hint="Per cutoff. De minimis benefits and allowances that are not part of basic pay."
              value={allowance.text}
              onChange={allowance.setText}
              optional
            />
          </>
        }
        extra={
          <View style={{ gap: th.space.sm }}>
            <Callout tone="accent" title="Employer cost">
              <Txt variant="small">
                A {PAY_FREQUENCY_LABEL[frequency].toLowerCase()} payroll at this salary costs
                the employer more than the salary itself. The last section of the ledger
                shows the whole figure, including the Employees&apos; Compensation premium
                that never appears on an employee&apos;s payslip.
              </Txt>
            </Callout>
          </View>
        }
      />

      <Sheet
        visible={freqSheet}
        onClose={() => setFreqSheet(false)}
        title="Pay frequency"
        subtitle="BIR publishes a separate withholding table for each one."
        snap={0.55}
      >
        <View>
          {PAY_FREQUENCIES.map((f) => (
            <SheetOption
              key={f}
              label={PAY_FREQUENCY_LABEL[f]}
              hint={FREQUENCY_HINT[f]}
              selected={f === frequency}
              onPress={() => {
                setFrequency(f);
                setFreqSheet(false);
              }}
            />
          ))}
        </View>
      </Sheet>
    </>
  );
}
