import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Button, Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { OFW_RED_FLAGS, scoreRedFlags, type RedFlag } from "../../../lib/calc/ofw";
import { OFW_FEE_RULES, OFW_STEPS } from "../../../lib/data/karapatan";
import { useRecent } from "../../../lib/hooks";
import { OFW } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";
import { HIT } from "../../../lib/theme/tokens";

/**
 * Gabay holds NO agency names, licence numbers or licence statuses. A fabricated
 * "licensed" result can cost someone their placement fee, so verification always
 * links out to the official DMW check. The app's contribution is the red flag
 * logic and the process walkthrough.
 */
export default function OfwScreen() {
  const th = useTheme();
  useRecent("/karapatan/ofw", "OFW agency check", "Karapatan");

  const [flags, setFlags] = React.useState<string[]>([]);
  const verdict = scoreRedFlags(flags);
  const toggle = (id: string) =>
    setFlags((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const tone =
    verdict.level === "stop" ? th.c.stamp : verdict.level === "caution" ? th.c.warn : th.c.accent;

  return (
    <Screen>
      <BackBar label="Karapatan" />
      <ScreenTitle
        eyebrow="Karapatan"
        title="OFW agency check"
        subtitle="Verify before you pay. This is the step people skip and it is the one that costs money."
      />

      <Card
        style={{
          gap: th.space.md,
          borderColor: th.c.accent,
          borderWidth: 1,
          backgroundColor: th.c.accentSoft,
        }}
      >
        <Txt variant="micro" color={th.c.accent}>
          Verification happens at the source
        </Txt>
        <Txt variant="body">
          Gabay does not carry a list of agencies, licence numbers or licence statuses, and
          it never will. A wrong &ldquo;licensed&rdquo; answer here could cost you your
          placement fee. Check the name yourself against the official DMW list.
        </Txt>
        <Button
          label="Open the DMW licensed agencies list"
          onPress={() => Linking.openURL(OFW.value.verificationUrl)}
        />
      </Card>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="The four steps" />
        {OFW_STEPS.map((s, i) => (
          <Card key={s.title} style={{ gap: th.space.sm }}>
            <View style={{ flexDirection: "row", gap: th.space.md }}>
              <Txt
                variant="amount"
                color={th.c.accent}
                style={{ fontFamily: th.font.monoBold, width: 22 }}
              >
                {i + 1}
              </Txt>
              <View style={{ flex: 1, gap: th.space.xs }}>
                <Txt variant="label">{s.title}</Txt>
                <Txt variant="body" style={{ fontSize: th.fs(15) }}>
                  {s.detail}
                </Txt>
                <Txt variant="rule" color={th.c.accent}>
                  {s.action}
                </Txt>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="What may lawfully be charged" />
        <Card style={{ gap: th.space.md }}>
          {OFW_FEE_RULES.map((r) => (
            <View key={r.label} style={{ gap: 2 }}>
              <Txt variant="label">{r.label}</Txt>
              <Txt variant="body" style={{ fontSize: th.fs(15) }}>
                {r.rule}
              </Txt>
              <Txt variant="rule" color={th.c.accent}>
                {r.law}
              </Txt>
            </View>
          ))}
        </Card>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Red flag checklist" />
        <Txt variant="small">
          Tick anything that has happened. Three of these are enough on their own to stop.
        </Txt>

        <Card
          style={{
            gap: th.space.sm,
            borderColor: tone,
            borderWidth: 1.5,
            backgroundColor:
              verdict.level === "stop"
                ? th.c.stampSoft
                : verdict.level === "caution"
                  ? th.c.warnSoft
                  : th.c.card,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
            <Txt variant="title" color={tone} style={{ flex: 1 }}>
              {verdict.headline}
            </Txt>
            <Txt variant="amount" color={tone} style={{ fontFamily: th.font.monoBold }}>
              {verdict.score}/{verdict.maxScore}
            </Txt>
          </View>
          <Txt variant="body" style={{ fontSize: th.fs(15) }}>
            {verdict.body}
          </Txt>
          <Txt variant="rule">
            Any single 3-point flag, or a total of {OFW.value.stopScore} or more, returns a
            stop verdict.
          </Txt>
        </Card>

        <Card padded={false}>
          {OFW_RED_FLAGS.map((f, i) => (
            <FlagRow
              key={f.id}
              flag={f}
              checked={flags.includes(f.id)}
              onPress={() => toggle(f.id)}
              last={i === OFW_RED_FLAGS.length - 1}
            />
          ))}
        </Card>
      </View>

      <Callout tone="stop" title="If you have already paid">
        Keep every receipt, message and document. Report the recruiter to the Department of
        Migrant Workers, which handles complaints on illegal recruitment. Gabay does not
        assess your situation or predict what will happen — DMW does that.
      </Callout>
    </Screen>
  );
}

function FlagRow({
  flag,
  checked,
  onPress,
  last,
}: {
  flag: RedFlag;
  checked: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  const th = useTheme();
  const severe = flag.weight >= 3;
  const tone = severe ? th.c.stamp : flag.weight === 2 ? th.c.warn : th.c.muted;

  return (
    <>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={`${flag.label}, weight ${flag.weight}`}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: HIT,
          flexDirection: "row",
          gap: th.space.md,
          padding: th.space.lg,
          backgroundColor: pressed
            ? th.c.cardSunken
            : checked
              ? severe
                ? th.c.stampSoft
                : th.c.warnSoft
              : "transparent",
        })}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            borderWidth: 1.5,
            borderColor: checked ? tone : th.c.ruleStrong,
            backgroundColor: checked ? tone : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          {checked ? (
            <Txt variant="small" color={th.c.card} style={{ fontFamily: th.font.monoBold }}>
              ✓
            </Txt>
          ) : null}
        </View>
        <View style={{ flex: 1, gap: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: th.space.sm }}>
            <Txt variant="label" style={{ flex: 1 }}>
              {flag.label}
            </Txt>
            <View
              style={{
                paddingHorizontal: 5,
                paddingVertical: 1,
                borderRadius: 3,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: tone,
              }}
            >
              <Txt variant="micro" color={tone}>
                {flag.weight} {severe ? "· stop" : ""}
              </Txt>
            </View>
          </View>
          <Txt variant="small">{flag.detail}</Txt>
          <Txt variant="rule" color={th.c.accent}>
            {flag.basis}
          </Txt>
        </View>
      </Pressable>
      {last ? null : <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: th.c.rule }} />}
    </>
  );
}
