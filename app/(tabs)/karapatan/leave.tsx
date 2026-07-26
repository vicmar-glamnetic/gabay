import React from "react";
import { View } from "react-native";

import { BackBar, RaiseItSection } from "../../../components/CalcScaffold";
import { Segmented, ToggleField } from "../../../components/Field";
import { Ledger } from "../../../components/Ledger";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { computeMaternityLeave, type DeliveryType } from "../../../lib/calc/maternity";
import { LEAVE_ENTITLEMENTS, type LeaveEntitlement } from "../../../lib/data/karapatan";
import { useRecent } from "../../../lib/hooks";
import { MATERNITY } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function LeaveScreen() {
  const th = useTheme();
  useRecent("/karapatan/leave", "Leave entitlements", "Karapatan");

  return (
    <Screen>
      <BackBar label="Karapatan" />
      <ScreenTitle
        eyebrow="Karapatan"
        title="Leave entitlements"
        subtitle="Six statutory leaves. Who qualifies, how many days, whether it is paid, and what to file."
      />

      <MaternityCalculator />

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Every statutory leave" />
        {LEAVE_ENTITLEMENTS.map((l) => (
          <LeaveCard key={l.id} leave={l} />
        ))}
      </View>

      <Callout tone="neutral" title="Company leave is separate">
        Vacation and sick leave beyond these are granted by company policy or a CBA, not by
        statute. Where a company already grants at least five days of leave a year, that
        satisfies the service incentive leave requirement — it is not five days on top.
      </Callout>

      <RaiseItSection />
    </Screen>
  );
}

function MaternityCalculator() {
  const th = useTheme();
  const [delivery, setDelivery] = React.useState<DeliveryType>("live-birth");
  const [solo, setSolo] = React.useState(false);
  const [transfer, setTransfer] = React.useState(false);
  const [extension, setExtension] = React.useState(false);

  const result = computeMaternityLeave({
    delivery,
    soloParent: solo,
    transferredDays: transfer ? MATERNITY.value.transferableDays : 0,
    takeUnpaidExtension: extension,
  });

  return (
    <View style={{ gap: th.space.md }}>
      <SectionHead title="Maternity leave calculator" />
      <Card style={{ gap: th.space.lg }}>
        <Segmented
          label="Delivery"
          value={delivery}
          onChange={setDelivery}
          options={[
            { value: "live-birth", label: "Live birth" },
            { value: "miscarriage", label: "Miscarriage" },
          ]}
        />
        {delivery === "live-birth" ? (
          <>
            <ToggleField
              label="Solo parent"
              hint={`An additional ${MATERNITY.value.soloParentAdditionalDays} days · RA 11210 in relation to RA 8972`}
              value={solo}
              onChange={setSolo}
            />
            <ToggleField
              label={`Transfer ${MATERNITY.value.transferableDays} days to the father or an alternate caregiver`}
              hint="Requires written notice to the employer · RA 11210 Sec. 6"
              value={transfer}
              onChange={setTransfer}
            />
            <ToggleField
              label={`Take the ${MATERNITY.value.optionalExtensionDaysUnpaid}-day unpaid extension`}
              hint="On written notice at least 45 days before the end of the leave"
              value={extension}
              onChange={setExtension}
            />
          </>
        ) : null}

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: th.space.sm,
            paddingTop: th.space.sm,
          }}
        >
          <Txt variant="amountLarge">{result.figures.paidDays}</Txt>
          <Txt variant="body" color={th.c.muted}>
            paid calendar days
            {result.figures.transferred > 0
              ? `, of which the mother keeps ${result.figures.motherDays}`
              : ""}
          </Txt>
        </View>
      </Card>

      <Ledger sections={result.sections} compact />

      {result.notes.map((n, i) => (
        <Callout key={i}>{n}</Callout>
      ))}
    </View>
  );
}

function LeaveCard({ leave }: { leave: LeaveEntitlement }) {
  const th = useTheme();
  return (
    <Card style={{ gap: th.space.md }}>
      <View style={{ gap: 2 }}>
        <Txt variant="title">{leave.name}</Txt>
        <Txt variant="rule" color={th.c.accent}>
          {leave.law}
        </Txt>
      </View>

      <View style={{ gap: th.space.sm }}>
        <Field label="How many days" value={leave.days} />
        <Field label="Paid?" value={leave.paid} />
        <Field label="Who qualifies" value={leave.who} />
      </View>

      <View style={{ gap: th.space.xs }}>
        <Txt variant="micro">What to file</Txt>
        {leave.toFile.map((f, i) => (
          <View key={i} style={{ flexDirection: "row", gap: th.space.sm }}>
            <Txt variant="body" color={th.c.ruleStrong} style={{ fontFamily: th.font.mono }}>
              ☐
            </Txt>
            <Txt variant="body" style={{ flex: 1, fontSize: th.fs(15) }}>
              {f}
            </Txt>
          </View>
        ))}
      </View>

      {leave.notes?.length ? (
        <View style={{ gap: th.space.xs }}>
          {leave.notes.map((n, i) => (
            <Txt key={i} variant="small">
              · {n}
            </Txt>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  const th = useTheme();
  return (
    <View style={{ gap: 1 }}>
      <Txt variant="micro">{label}</Txt>
      <Txt variant="body" style={{ fontSize: th.fs(15) }}>
        {value}
      </Txt>
    </View>
  );
}
