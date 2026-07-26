import React from "react";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, Segmented } from "../../../components/Field";
import { computeThirteenthMonth, type ThirteenthMode } from "../../../lib/calc/thirteenth";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";

export default function ThirteenthMonthScreen() {
  const restored = useRestoredInputs();
  useRecent("/kalkula/thirteenth-month", "13th month pay", "Payroll");

  const [mode, setMode] = React.useState<ThirteenthMode>(
    (restored.mode as ThirteenthMode) ?? "salary"
  );
  const salary = useAmount(restored.salary ?? "30000");
  const months = useAmount(restored.months ?? "12");
  const total = useAmount(restored.total ?? "");
  const unpaid = useAmount(restored.unpaid ?? "");

  const result = computeThirteenthMonth({
    mode,
    monthlySalary: salary.value ?? 0,
    monthsWorked: months.value ?? 12,
    totalBasicEarned: total.value ?? 0,
    unpaidAbsences: unpaid.value ?? 0,
  });

  return (
    <CalcScaffold
      eyebrow="Payroll"
      title="13th month pay"
      subtitle="A legal entitlement, not a bonus. Total basic salary earned ÷ 12."
      kind="thirteenth-month"
      href="/kalkula/thirteenth-month"
      result={result}
      savedInputs={{ mode, salary: salary.text, months: months.text, total: total.text, unpaid: unpaid.text }}
      inputs={
        <>
          <Segmented
            label="How do you want to enter it?"
            value={mode}
            onChange={setMode}
            options={[
              { value: "salary", label: "Salary × months" },
              { value: "total", label: "Total basic earned" },
            ]}
          />

          {mode === "salary" ? (
            <>
              <AmountField
                label="Monthly basic salary"
                value={salary.text}
                onChange={salary.setText}
              />
              <AmountField
                label="Months worked this year"
                hint="Anyone who worked at least one month in the calendar year is entitled, pro-rated."
                value={months.text}
                onChange={months.setText}
                prefix={null}
                suffix="months"
              />
            </>
          ) : (
            <AmountField
              label="Total basic salary earned this year"
              hint="Basic pay only. Overtime, holiday premium, night differential and allowances are excluded."
              value={total.text}
              onChange={total.setText}
            />
          )}

          <AmountField
            label="Unpaid absences"
            hint="Peso value of days without pay. These do not form part of basic salary earned."
            value={unpaid.text}
            onChange={unpaid.setText}
            optional
          />
        </>
      }
    />
  );
}
