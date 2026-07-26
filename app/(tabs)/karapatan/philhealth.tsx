import React from "react";
import { View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { AmountField, Segmented } from "../../../components/Field";
import { Ledger } from "../../../components/Ledger";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, SectionHead, Txt, VerifyTag } from "../../../components/ui";
import { philHealthContribution, type PhilHealthPayer } from "../../../lib/calc/contributions";
import { peso } from "../../../lib/calc/money";
import {
  CASE_RATES,
  CASE_RATE_NOTICE,
  PHILHEALTH_ADMISSION_CHECKLIST,
  PHILHEALTH_BENEFITS,
} from "../../../lib/data/karapatan";
import { useAmount, useRecent } from "../../../lib/hooks";
import { PHILHEALTH } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function PhilHealthScreen() {
  const th = useTheme();
  useRecent("/karapatan/philhealth", "PhilHealth benefits", "Karapatan");

  const [payer, setPayer] = React.useState<PhilHealthPayer>("employed");
  const income = useAmount("30000");
  const c = philHealthContribution(income.value ?? 0, payer);

  return (
    <Screen>
      <BackBar label="Karapatan" />
      <ScreenTitle
        eyebrow="Karapatan"
        title="PhilHealth"
        subtitle="What your premium is, and what it actually buys."
      />

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Premium calculator" />
        <Card style={{ gap: th.space.lg }}>
          <Segmented
            label="Membership"
            value={payer}
            onChange={setPayer}
            options={[
              { value: "employed", label: "Employed" },
              { value: "self-paying", label: "Self-paying / OFW" },
            ]}
          />
          <AmountField
            label="Monthly basic income"
            hint={`Floor ₱${PHILHEALTH.value.incomeFloor.toLocaleString()}, ceiling ₱${PHILHEALTH.value.incomeCeiling.toLocaleString()} · RA 11223`}
            value={income.text}
            onChange={income.setText}
          />
          <View style={{ gap: 2 }}>
            <Txt variant="micro">
              {payer === "employed" ? "Your share, monthly" : "You pay, monthly"}
            </Txt>
            <Txt variant="amountLarge">{peso(c.employee)}</Txt>
            <Txt variant="rule">
              {payer === "employed"
                ? `Half of a ${peso(c.total)} premium; your employer pays the other ${peso(c.employer)}`
                : `The whole ${peso(c.total)} premium — self-paying members have no employer half`}
            </Txt>
          </View>
        </Card>

        <Ledger sections={[{ title: "How it is computed", subtitle: PHILHEALTH.source, lines: c.lines }]} compact />

        {c.notes.map((n, i) => (
          <Callout key={i}>{n}</Callout>
        ))}
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="What the premium buys" />
        {PHILHEALTH_BENEFITS.map((b) => (
          <Card key={b.id} style={{ gap: th.space.md }}>
            <View style={{ gap: 2 }}>
              <Txt variant="title">{b.name}</Txt>
              <Txt variant="rule" color={th.c.accent}>
                {b.law}
              </Txt>
            </View>
            <Txt variant="body" style={{ fontSize: th.fs(15) }}>
              {b.what}
            </Txt>
            <View style={{ gap: 2 }}>
              <Txt variant="micro">How to actually use it</Txt>
              {b.howToUse.map((h, i) => (
                <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
                  <Txt
                    variant="small"
                    color={th.c.accent}
                    style={{ fontFamily: th.font.monoBold, width: 16 }}
                  >
                    {i + 1}
                  </Txt>
                  <Txt variant="body" style={{ flex: 1, fontSize: th.fs(15) }}>
                    {h}
                  </Txt>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Case rate amounts" />
        {CASE_RATES.length === 0 ? (
          <Card
            style={{
              gap: th.space.sm,
              borderColor: th.c.stamp,
              borderWidth: 1,
              backgroundColor: th.c.stampSoft,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
              <Txt variant="micro" color={th.c.stamp}>
                Not carried in this app
              </Txt>
              <VerifyTag label="ASK THE DESK" />
            </View>
            <Txt variant="body">{CASE_RATE_NOTICE}</Txt>
          </Card>
        ) : (
          <Card padded={false}>
            {CASE_RATES.map((r) => (
              <View key={r.code} style={{ padding: th.space.lg, gap: 2 }}>
                <Txt variant="label">{r.condition}</Txt>
                <Txt variant="amount">{peso(r.amount)}</Txt>
                <Txt variant="rule">
                  {r.code} · {r.circular}, effective {r.effective}
                </Txt>
              </View>
            ))}
          </Card>
        )}
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Pre-admission checklist" />
        <Card style={{ gap: th.space.sm }}>
          {PHILHEALTH_ADMISSION_CHECKLIST.map((c, i) => (
            <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
              <Txt variant="body" color={th.c.ruleStrong} style={{ fontFamily: th.font.mono }}>
                ☐
              </Txt>
              <Txt variant="body" style={{ flex: 1, fontSize: th.fs(15) }}>
                {c}
              </Txt>
            </View>
          ))}
        </Card>
        <Callout tone="accent" title="The one that matters most">
          Say you are a PhilHealth member at admission, not at discharge. Claims filed after
          the fact are far harder to process, and some hospitals will not adjust the bill
          once it is final.
        </Callout>
      </View>
    </Screen>
  );
}
