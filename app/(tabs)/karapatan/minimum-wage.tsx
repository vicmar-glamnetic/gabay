import React from "react";
import { Linking, ScrollView, View } from "react-native";

import { BackBar, RaiseItSection } from "../../../components/CalcScaffold";
import { AmountField, PickerField } from "../../../components/Field";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Sheet, SheetOption } from "../../../components/Sheet";
import { Button, Callout, Card, SectionHead, Txt, VerifyTag } from "../../../components/ui";
import { peso } from "../../../lib/calc/money";
import {
  compareToWageFloor,
  WAGE_CAVEATS,
  WAGE_REGIONS,
  WAGE_SECTORS,
  type WageSector,
} from "../../../lib/calc/minimumWage";
import { useAmount, useRecent } from "../../../lib/hooks";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function MinimumWageScreen() {
  const th = useTheme();
  useRecent("/karapatan/minimum-wage", "Minimum wage checker", "Karapatan");

  const [regionId, setRegionId] = React.useState("ncr");
  const [sector, setSector] = React.useState<WageSector>("non-agriculture");
  const [regionSheet, setRegionSheet] = React.useState(false);
  const [sectorSheet, setSectorSheet] = React.useState(false);
  const rate = useAmount("");

  const region = WAGE_REGIONS.find((r) => r.id === regionId)!;
  const sectorLabel = WAGE_SECTORS.find((s) => s.id === sector)!;
  const comparison = compareToWageFloor(regionId, sector, rate.value);

  return (
    <>
      <Screen>
        <BackBar label="Karapatan" />
        <ScreenTitle
          eyebrow="Karapatan"
          title="Minimum wage checker"
          subtitle="Seventeen regional boards set these independently, and they move often."
        />

        <Card style={{ gap: th.space.lg }}>
          <PickerField
            label="Region"
            value={region.name}
            hint={region.covers}
            onPress={() => setRegionSheet(true)}
          />
          <PickerField
            label="Sector"
            value={sectorLabel.label}
            hint={sectorLabel.hint}
            onPress={() => setSectorSheet(true)}
          />
          <AmountField
            label="Your daily rate"
            hint="For eight hours of work. A monthly salary has to be converted using your company's day factor first."
            value={rate.text}
            onChange={rate.setText}
            optional
          />
        </Card>

        <View style={{ gap: th.space.md }}>
          <SectionHead title="The current floor" />
          {comparison?.floor.dailyFloor === null ? (
            <Card
              style={{
                gap: th.space.md,
                borderColor: th.c.stamp,
                borderWidth: 1,
                backgroundColor: th.c.stampSoft,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
                <Txt variant="micro" color={th.c.stamp}>
                  Figure not loaded
                </Txt>
                <VerifyTag label="CHECK NWPC" />
              </View>
              <Txt variant="body">
                Gabay does not carry a wage floor for {region.name} in this build. Regional
                wage orders are issued by seventeen boards independently and change often, and
                an out-of-date number here could send someone to their employer over nothing —
                or reassure them when they should be asking.
              </Txt>
              <Txt variant="small">
                Check the current wage order for {region.board} on the National Wages and
                Productivity Commission site. Each board publishes its own page with the
                daily rate, the wage order number and its effectivity date.
              </Txt>
              <Button
                label={`Open the ${region.board} page`}
                onPress={() => Linking.openURL(region.url)}
              />
              <Txt variant="rule">{region.board}</Txt>
            </Card>
          ) : (
            <Card style={{ gap: th.space.sm }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
                <Txt variant="amountLarge">{peso(comparison?.floor.dailyFloor ?? 0)}</Txt>
                <VerifyTag />
              </View>
              <Txt variant="body">{comparison?.message}</Txt>
              <Txt variant="rule">{comparison?.source}</Txt>
            </Card>
          )}

          {comparison?.verdict === "below" ? (
            <Callout tone="warn" title="Worth raising">
              {comparison.message} Ask your employer which wage order they are applying and
              whether the establishment holds an exemption. Coverage exemptions do exist.
            </Callout>
          ) : null}
        </View>

        <View style={{ gap: th.space.sm }}>
          <SectionHead title="Before you act on a number" />
          {WAGE_CAVEATS.map((c, i) => (
            <Callout key={i}>{c}</Callout>
          ))}
        </View>

        <RaiseItSection />
      </Screen>

      <Sheet
        visible={regionSheet}
        onClose={() => setRegionSheet(false)}
        title="Region"
        subtitle="Pick the region where you work, not where you live."
        snap={0.85}
      >
        <View style={{ flex: 1 }}>
          <RegionList
            selected={regionId}
            onSelect={(id) => {
              setRegionId(id);
              setRegionSheet(false);
            }}
          />
        </View>
      </Sheet>

      <Sheet
        visible={sectorSheet}
        onClose={() => setSectorSheet(false)}
        title="Sector"
        snap={0.45}
      >
        <View>
          {WAGE_SECTORS.map((s) => (
            <SheetOption
              key={s.id}
              label={s.label}
              hint={s.hint}
              selected={s.id === sector}
              onPress={() => {
                setSector(s.id);
                setSectorSheet(false);
              }}
            />
          ))}
        </View>
      </Sheet>
    </>
  );
}

function RegionList({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <ScrollView>
      {WAGE_REGIONS.map((r) => (
        <SheetOption
          key={r.id}
          label={r.name}
          hint={r.covers}
          selected={r.id === selected}
          onPress={() => onSelect(r.id)}
        />
      ))}
    </ScrollView>
  );
}
