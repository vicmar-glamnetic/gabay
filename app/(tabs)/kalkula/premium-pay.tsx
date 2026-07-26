import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, PickerField, ToggleField } from "../../../components/Field";
import { Sheet, SheetOption } from "../../../components/Sheet";
import { Callout } from "../../../components/ui";
import { computePremiumPay } from "../../../lib/calc/premium";
import { useAmount, useRecent } from "../../../lib/hooks";
import { DAY_TYPES, type DayTypeId } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function PremiumPayScreen() {
  const th = useTheme();
  const params = useLocalSearchParams<{ dayType?: string; holiday?: string }>();
  useRecent("/kalkula/premium-pay", "Holiday, overtime and night pay", "Payroll");

  const daily = useAmount("1000");
  const hours = useAmount("8");
  const ot = useAmount("");
  const night = useAmount("");
  const [dayType, setDayType] = React.useState<DayTypeId>(
    (params.dayType as DayTypeId) ?? "regular-holiday"
  );
  const [worked, setWorked] = React.useState(true);
  const [presentBefore, setPresentBefore] = React.useState(true);
  const [sheet, setSheet] = React.useState(false);

  const rule = DAY_TYPES.find((d) => d.id === dayType)!;

  const result = computePremiumPay({
    dailyRate: daily.value ?? 0,
    dayType,
    reportedForWork: worked,
    hoursWorked: hours.value ?? 8,
    overtimeHours: ot.value ?? 0,
    nightHours: night.value ?? 0,
    presentDayBefore: presentBefore,
  });

  return (
    <>
      <CalcScaffold
        eyebrow="Payroll"
        title="Holiday, overtime and night pay"
        subtitle="Pay for one day, by day type."
        kind="premium-pay"
        href="/kalkula/premium-pay"
        result={result}
        hapticKey={dayType}
        savedInputs={{
          daily: daily.text,
          hours: hours.text,
          ot: ot.text,
          night: night.text,
          dayType,
          worked: String(worked),
        }}
        inputs={
          <>
            <AmountField
              label="Daily rate"
              hint="For a monthly-paid employee, the monthly salary divided by the company's day factor."
              value={daily.text}
              onChange={daily.setText}
            />

            <PickerField
              label="Day type"
              value={rule.label}
              hint={rule.workedRule}
              onPress={() => setSheet(true)}
            />

            <ToggleField
              label="Reported for work"
              hint={worked ? rule.workedRule : rule.unworkedRule}
              value={worked}
              onChange={setWorked}
            />

            {worked ? (
              <>
                <AmountField
                  label="Hours worked"
                  hint="Up to 8. Anything beyond is overtime."
                  value={hours.text}
                  onChange={hours.setText}
                  prefix={null}
                  suffix="hours"
                />
                <AmountField
                  label="Overtime hours"
                  value={ot.text}
                  onChange={ot.setText}
                  prefix={null}
                  suffix="hours"
                  optional
                />
                <AmountField
                  label="Night hours"
                  hint="Hours worked between 10:00 PM and 6:00 AM · Labor Code Art. 86"
                  value={night.text}
                  onChange={night.setText}
                  prefix={null}
                  suffix="hours"
                  optional
                />
              </>
            ) : rule.unworkedRate > 0 ? (
              <ToggleField
                label="Present, or on paid leave, the working day before"
                hint="Holiday pay for an unworked regular holiday depends on this · Labor Code Art. 94"
                value={presentBefore}
                onChange={setPresentBefore}
              />
            ) : null}
          </>
        }
        extra={
          <View style={{ gap: th.space.sm }}>
            <Callout tone="warn" title="Local holidays">
              LGUs declare their own local holidays on top of the national list. Within that
              city or province the same premiums apply, but they will not appear in the 2026
              calendar in this app.
            </Callout>
          </View>
        }
      />

      <Sheet
        visible={sheet}
        onClose={() => setSheet(false)}
        title="Day type"
        subtitle="Labor Code Book III"
        snap={0.7}
      >
        <View>
          {DAY_TYPES.map((d) => (
            <SheetOption
              key={d.id}
              label={d.label}
              hint={`Worked: ${d.workedRule}. Not worked: ${d.unworkedRule.toLowerCase()}.`}
              selected={d.id === dayType}
              onPress={() => {
                setDayType(d.id);
                setSheet(false);
              }}
            />
          ))}
        </View>
      </Sheet>
    </>
  );
}
