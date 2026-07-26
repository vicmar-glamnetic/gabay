import React from "react";
import { View } from "react-native";

import { CalcScaffold } from "../../../components/CalcScaffold";
import { AmountField, PickerField } from "../../../components/Field";
import { Sheet, SheetOption } from "../../../components/Sheet";
import { Callout } from "../../../components/ui";
import { computeSeparationPay } from "../../../lib/calc/separation";
import { useAmount, useRecent, useRestoredInputs } from "../../../lib/hooks";
import { SEPARATION, type SeparationGroundId } from "../../../lib/rates";

export default function SeparationScreen() {
  const restored = useRestoredInputs();
  useRecent("/kalkula/separation", "Separation pay", "Payroll");

  const pay = useAmount(restored.pay ?? "25000");
  const years = useAmount(restored.years ?? "5");
  const months = useAmount(restored.months ?? "7");
  const [ground, setGround] = React.useState<SeparationGroundId>(
    (restored.ground as SeparationGroundId) ?? "redundancy"
  );
  const [sheet, setSheet] = React.useState(false);

  const g = SEPARATION.value.grounds.find((x) => x.id === ground)!;

  const result = computeSeparationPay({
    monthlyPay: pay.value ?? 0,
    years: years.value ?? 0,
    months: months.value ?? 0,
    ground,
  });

  return (
    <>
      <CalcScaffold
        eyebrow="Payroll"
        title="Separation pay"
        subtitle="For authorised causes under Labor Code Arts. 298 and 299."
        kind="separation"
        href="/kalkula/separation"
        result={result}
        hapticKey={result.figures.creditedYears}
        savedInputs={{ pay: pay.text, years: years.text, months: months.text, ground }}
        inputs={
          <>
            <AmountField label="Monthly pay" value={pay.text} onChange={pay.setText} />
            <AmountField
              label="Years of service"
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
            <PickerField
              label="Ground for separation"
              value={g.label}
              hint={g.basis}
              onPress={() => setSheet(true)}
            />
          </>
        }
        extra={
          <View style={{ gap: 8 }}>
            <Callout tone="warn" title="This covers authorised causes only">
              Dismissal for a just cause under Art. 297 — serious misconduct, gross neglect,
              fraud, and the like — carries no separation pay. Neither does resignation,
              unless a company policy, CBA or established practice provides for it.
            </Callout>
          </View>
        }
      />

      <Sheet
        visible={sheet}
        onClose={() => setSheet(false)}
        title="Ground for separation"
        subtitle="Labor Code Arts. 298 and 299"
        snap={0.7}
      >
        <View>
          {SEPARATION.value.grounds.map((x) => (
            <SheetOption
              key={x.id}
              label={x.label}
              hint={x.basis}
              selected={x.id === ground}
              onPress={() => {
                setGround(x.id);
                setSheet(false);
              }}
            />
          ))}
        </View>
      </Sheet>
    </>
  );
}
