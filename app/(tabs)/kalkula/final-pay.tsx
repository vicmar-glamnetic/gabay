import React from "react";
import { View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField } from "../../../components/Field";
import { Callout } from "../../../components/ui";
import { computeFinalPay } from "../../../lib/calc/finalpay";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";

export default function FinalPayScreen() {
  const restored = useRestoredInputs();
  useRecent("/kalkula/final-pay", "Final pay", "Payroll");

  const salary = useAmount(restored.salary ?? "30000");
  const unpaidDays = useAmount(restored.unpaidDays ?? "10");
  const leaveDays = useAmount(restored.leaveDays ?? "5");
  const earned = useAmount(restored.earned ?? "150000");
  const separation = useAmount(restored.separation ?? "");
  const accountabilities = useAmount(restored.accountabilities ?? "");

  const result = computeFinalPay({
    monthlySalary: salary.value ?? 0,
    unpaidDays: unpaidDays.value ?? 0,
    unusedLeaveDays: leaveDays.value ?? 0,
    basicEarnedThisYear: earned.value ?? 0,
    separationPay: separation.value ?? 0,
    accountabilities: accountabilities.value ?? 0,
  });

  return (
    <CalcScaffold
      eyebrow="Payroll"
      title="Final pay"
      subtitle="Last pay on separation, whether you resigned or were separated."
      kind="final-pay"
      href="/kalkula/final-pay"
      result={result}
      savedInputs={{
        salary: salary.text,
        unpaidDays: unpaidDays.text,
        leaveDays: leaveDays.text,
        earned: earned.text,
        separation: separation.text,
        accountabilities: accountabilities.text,
      }}
      inputs={
        <>
          <AmountField label="Monthly salary" value={salary.text} onChange={salary.setText} />
          <AmountField
            label="Unpaid days worked"
            hint="Days worked in the last cutoff that have not been paid."
            value={unpaidDays.text}
            onChange={unpaidDays.setText}
            prefix={null}
            suffix="days"
          />
          <AmountField
            label="Unused leave days"
            hint="Service incentive leave is convertible to cash if unused · Labor Code Art. 95"
            value={leaveDays.text}
            onChange={leaveDays.setText}
            prefix={null}
            suffix="days"
          />
          <AmountField
            label="Basic salary earned this year"
            hint="Used for the pro-rated 13th month pay."
            value={earned.text}
            onChange={earned.setText}
          />
          <AmountField
            label="Separation pay"
            hint="From the separation pay calculator, if the separation was for an authorised cause."
            value={separation.text}
            onChange={separation.setText}
            optional
          />
          <AmountField
            label="Accountabilities"
            hint="Cash advances, company loans, unreturned equipment. These must be documented."
            value={accountabilities.text}
            onChange={accountabilities.setText}
            optional
          />
        </>
      }
      extra={
        <View style={{ gap: 8 }}>
          <Callout tone="accent" title="Two rules worth knowing">
            Final pay is to be released within 30 calendar days of separation, and a
            Certificate of Employment must be issued within 3 days of the request. The
            certificate is not conditional on clearance being finished · DOLE Labor
            Advisory 06-20.
          </Callout>
        </View>
      }
    />
  );
}
