import React from "react";
import { View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, Segmented, ToggleField } from "../../../components/Field";
import { Callout } from "../../../components/ui";
import { computeRetirementPay } from "../../../lib/calc/retirement";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";

export default function RetirementScreen() {
  const restored = useRestoredInputs();
  useRecent("/kalkula/retirement", "Retirement pay", "Payroll");

  const [basis, setBasis] = React.useState<"daily" | "monthly">(
    (restored.basis as "daily" | "monthly") ?? "monthly"
  );
  const pay = useAmount(restored.pay ?? "30000");
  const years = useAmount(restored.years ?? "20");
  const months = useAmount(restored.months ?? "");
  const age = useAmount(restored.age ?? "62");
  const [hasPlan, setHasPlan] = React.useState(restored.hasPlan === "true");

  const result = computeRetirementPay({
    basis,
    pay: pay.value ?? 0,
    years: years.value ?? 0,
    months: months.value ?? 0,
    age: age.value,
    hasCompanyPlan: hasPlan,
  });

  return (
    <CalcScaffold
      eyebrow="Payroll"
      title="Retirement pay"
      subtitle="The statutory minimum under RA 7641, and where 22.5 days comes from."
      kind="retirement"
      href="/kalkula/retirement"
      result={result}
      hapticKey={result.figures.creditedYears}
      savedInputs={{
        basis,
        pay: pay.text,
        years: years.text,
        months: months.text,
        age: age.text,
        hasPlan: String(hasPlan),
      }}
      inputs={
        <>
          <Segmented
            label="Pay basis"
            value={basis}
            onChange={setBasis}
            options={[
              { value: "monthly", label: "Monthly salary" },
              { value: "daily", label: "Daily rate" },
            ]}
          />
          <AmountField
            label={basis === "monthly" ? "Latest monthly salary" : "Latest daily rate"}
            hint={
              basis === "monthly"
                ? "Converted at 30 days. Companies also use 26, 313/12 or 365/12 — ask which divisor yours uses."
                : "The latest salary rate."
            }
            value={pay.text}
            onChange={pay.setText}
          />
          <AmountField
            label="Years of service"
            hint="With the same employer. At least five years is required."
            value={years.text}
            onChange={years.setText}
            prefix={null}
            suffix="years"
          />
          <AmountField
            label="Additional months"
            hint="A fraction of at least six months counts as one whole year."
            value={months.text}
            onChange={months.setText}
            prefix={null}
            suffix="months"
            optional
          />
          <AmountField
            label="Age at retirement"
            hint="Optional retirement from 60, compulsory at 65 · Labor Code Art. 302"
            value={age.text}
            onChange={age.setText}
            prefix={null}
            suffix="years old"
            optional
          />
          <ToggleField
            label="The company has a retirement plan"
            hint="If it exists and is more favourable than RA 7641, the plan governs and this figure does not apply."
            value={hasPlan}
            onChange={setHasPlan}
          />
        </>
      }
      extra={
        hasPlan ? (
          <View style={{ gap: 8 }}>
            <Callout tone="warn" title="A company plan changes the answer">
              Where a retirement plan, CBA or established company practice is more favourable
              than RA 7641, that plan governs. The figure below is the statutory floor, useful
              only as a comparison against what the plan offers.
            </Callout>
          </View>
        ) : null
      }
    />
  );
}
