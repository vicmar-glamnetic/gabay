import React from "react";
import { View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { Ledger } from "../../../components/Ledger";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { monthlyContributions } from "../../../lib/calc/contributions";
import { num, peso, pct } from "../../../lib/calc/money";
import { useRecent } from "../../../lib/hooks";
import {
  PAGIBIG,
  PAY_FREQUENCIES,
  PAY_FREQUENCY_LABEL,
  PHILHEALTH,
  RATES_VERSION_LABEL,
  RATE_SCHEDULES,
  SSS,
  WITHHOLDING,
  type Verified,
} from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function RatesScreen() {
  const th = useTheme();
  useRecent("/ako/rates", "Rates and sources", "Ako");

  const sample = monthlyContributions(30_000);

  return (
    <Screen>
      <BackBar label="Ako" />

      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: th.space.lg }}>
        <View style={{ flex: 1 }}>
          <ScreenTitle
            eyebrow="Ako"
            title="Rates and sources"
            subtitle="Every statutory figure the app uses, with the issuance it comes from."
          />
        </View>
        <Stamp date={SSS.lastVerified} />
      </View>

      <Callout tone="accent" title={RATES_VERSION_LABEL}>
        Every number in Gabay lives in one file. Nothing is computed from a figure that is
        not on this page, and nothing on this page appears without its source.
      </Callout>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Contributions" />
        <Ledger
          compact
          sections={[
            {
              title: "SSS",
              subtitle: SSS.source,
              lines: [
                { label: "Total rate", rule: "Of the monthly salary credit", raw: pct(SSS.value.totalRate) },
                { label: "Employee share", raw: pct(SSS.value.employeeRate) },
                { label: "Employer share", raw: pct(SSS.value.employerRate) },
                { label: "MSC floor", amount: SSS.value.mscFloor },
                { label: "MSC ceiling", amount: SSS.value.mscCeiling },
                { label: "MSC step", rule: "Salary rounds to the nearest step", amount: SSS.value.mscStep },
                {
                  label: "EC premium, employer",
                  rule: `₱${num(SSS.value.ecPremiumBelowThreshold, 0)} below a ₱${num(SSS.value.ecThresholdMsc, 0)} MSC, ₱${num(SSS.value.ecPremiumAtOrAboveThreshold, 0)} at or above`,
                  raw: `₱${num(SSS.value.ecPremiumBelowThreshold, 0)} / ₱${num(SSS.value.ecPremiumAtOrAboveThreshold, 0)}`,
                },
                { label: SSS.note!, note: true },
              ],
            },
            {
              title: "PhilHealth",
              subtitle: PHILHEALTH.source,
              lines: [
                { label: "Premium rate", raw: pct(PHILHEALTH.value.premiumRate) },
                { label: "Income floor", amount: PHILHEALTH.value.incomeFloor },
                { label: "Income ceiling", amount: PHILHEALTH.value.incomeCeiling },
                {
                  label: "Employee share of the premium",
                  rule: "Employed members only",
                  raw: pct(PHILHEALTH.value.employeeShareOfPremium),
                },
                { label: PHILHEALTH.note!, note: true },
              ],
            },
            {
              title: "Pag-IBIG",
              subtitle: PAGIBIG.source,
              lines: [
                {
                  label: "Employee rate",
                  rule: `1% at ₱${num(PAGIBIG.value.lowerBandCeiling, 0)} and below, 2% above`,
                  raw: "1% / 2%",
                },
                { label: "Employer rate", raw: pct(PAGIBIG.value.employerRate) },
                { label: "Maximum fund salary", amount: PAGIBIG.value.maxFundSalary },
                {
                  label: "Cap per side",
                  rule: "2% of the maximum fund salary",
                  amount: PAGIBIG.value.maxFundSalary * PAGIBIG.value.employerRate,
                },
              ],
            },
          ]}
        />
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Withholding tax" />
        <Txt variant="small">
          Four published tables, one per pay frequency. The base amounts are transcribed from
          the BIR table for each frequency, not derived by dividing the monthly figures — the
          published values carry rounding that division does not reproduce.
        </Txt>
        {PAY_FREQUENCIES.map((f) => (
          <Card key={f} style={{ gap: th.space.sm }}>
            <Txt variant="label">{PAY_FREQUENCY_LABEL[f]}</Txt>
            {WITHHOLDING.value[f].map((b, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}
              >
                <Txt variant="rule" style={{ width: 108 }}>
                  {i === 0 ? `₱${num(WITHHOLDING.value[f][1].over, 0)} and below` : `Over ₱${num(b.over, 0)}`}
                </Txt>
                <Txt variant="amount" style={{ flex: 1, fontSize: th.fs(13) }}>
                  {i === 0
                    ? "Exempt"
                    : `${b.base > 0 ? `${peso(b.base)} + ` : ""}${pct(b.rate)} of the excess`}
                </Txt>
              </View>
            ))}
          </Card>
        ))}
        <Txt variant="rule">{WITHHOLDING.source}</Txt>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Worked example" />
        <Ledger
          compact
          sections={[
            {
              title: "At a ₱30,000 monthly basic salary",
              subtitle: "The acceptance case the calculation layer is tested against",
              lines: [
                ...sample.sss.lines,
                ...sample.philhealth.lines,
                ...sample.pagibig.lines,
                {
                  label: "Total employee contributions",
                  amount: sample.employeeTotal,
                  negative: true,
                  strong: true,
                },
              ],
            },
          ]}
        />
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Maintenance schedule" />
        <Txt variant="small">
          What to watch, and roughly when. Each entry corresponds to one block in the single
          rates file — a circular means editing one place.
        </Txt>
        <Card padded={false}>
          {RATE_SCHEDULES.map(({ key, schedule }, i) => (
            <ScheduleRow
              key={key}
              name={key}
              schedule={schedule}
              last={i === RATE_SCHEDULES.length - 1}
            />
          ))}
        </Card>
      </View>
    </Screen>
  );
}

function ScheduleRow({
  name,
  schedule,
  last,
}: {
  name: string;
  schedule: Verified<unknown>;
  last?: boolean;
}) {
  const th = useTheme();
  return (
    <View
      style={{
        padding: th.space.lg,
        gap: 3,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: th.c.rule,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
        <Txt variant="label" style={{ flex: 1 }}>
          {name}
        </Txt>
        <Txt variant="rule">{schedule.lastVerified}</Txt>
      </View>
      <Txt variant="small">{schedule.source}</Txt>
      {schedule.reviewCadence ? (
        <Txt variant="rule" color={th.c.accent}>
          {schedule.reviewCadence}
        </Txt>
      ) : null}
    </View>
  );
}

/** The one deliberate flourish in the app: a rotated red rubber stamp. */
function Stamp({ date }: { date: string }) {
  const th = useTheme();
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`Last verified ${date}`}
      style={{
        transform: [{ rotate: "-9deg" }],
        borderWidth: 2.5,
        borderColor: th.c.stamp,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: "center",
        gap: 1,
        opacity: 0.9,
        marginTop: th.space.lg,
      }}
    >
      <Txt variant="micro" color={th.c.stamp} style={{ fontSize: th.fs(8.5) }}>
        Last verified
      </Txt>
      <Txt
        variant="amount"
        color={th.c.stamp}
        style={{ fontFamily: th.font.monoBold, fontSize: th.fs(13) }}
      >
        {date}
      </Txt>
    </View>
  );
}
