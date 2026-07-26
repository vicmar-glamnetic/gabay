import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BackBar, RaiseItSection } from "../../../components/CalcScaffold";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, SectionHead, Txt } from "../../../components/ui";
import { CONTRACT_FLAGS } from "../../../lib/data/karapatan";
import { useRecent } from "../../../lib/hooks";
import { useTheme } from "../../../lib/theme/ThemeProvider";
import { HIT } from "../../../lib/theme/tokens";

/**
 * A checklist that flags patterns, not a legal conclusion. Ticking every box
 * still produces "here is the rule, here is where to ask" — never "you have a
 * case" and never a characterisation of the employer's conduct.
 */
export default function RedFlagsScreen() {
  const th = useTheme();
  useRecent("/karapatan/red-flags", "Contract and status check", "Karapatan");

  const [checked, setChecked] = React.useState<string[]>([]);
  const toggle = (id: string) =>
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const flagged = CONTRACT_FLAGS.filter((f) => checked.includes(f.id));

  return (
    <Screen>
      <BackBar label="Karapatan" />
      <ScreenTitle
        eyebrow="Karapatan"
        title="Contract and status check"
        subtitle="Tick anything that matches your situation. Each one names the rule it comes from."
      />

      <Callout tone="neutral" title="What this is">
        A checklist of patterns worth asking about, with the rule beside each. It is not an
        assessment of your situation and it does not tell you whether anything is wrong —
        only DOLE or a lawyer can do that, with the facts in front of them.
      </Callout>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="The checklist" />
        <Card padded={false}>
          {CONTRACT_FLAGS.map((f, i) => (
            <CheckRow
              key={f.id}
              label={f.label}
              detail={f.detail}
              law={f.law}
              checked={checked.includes(f.id)}
              onPress={() => toggle(f.id)}
              last={i === CONTRACT_FLAGS.length - 1}
            />
          ))}
        </Card>
      </View>

      {flagged.length > 0 ? (
        <View style={{ gap: th.space.md }}>
          <SectionHead title={`${flagged.length} flagged`} />
          <Card style={{ gap: th.space.md }}>
            <Txt variant="body">
              You ticked {flagged.length} item{flagged.length === 1 ? "" : "s"}. Here is the
              rule behind each, so you can ask about it precisely rather than in general
              terms.
            </Txt>
            {flagged.map((f) => (
              <View key={f.id} style={{ gap: 2 }}>
                <Txt variant="label">{f.label}</Txt>
                <Txt variant="small">{f.detail}</Txt>
                <Txt variant="rule" color={th.c.accent}>
                  {f.law}
                </Txt>
              </View>
            ))}
          </Card>
          <Callout tone="accent" title="A useful first question">
            Ask HR, in writing, which provision they are applying and what the standards for
            regularisation were at the time you were hired. That question is specific enough
            to get a specific answer, and the answer is usually the whole story.
          </Callout>
        </View>
      ) : null}

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Two things worth knowing regardless" />
        <Card style={{ gap: th.space.md }}>
          <View style={{ gap: 2 }}>
            <Txt variant="label">Six months is the ceiling on probation</Txt>
            <Txt variant="small">
              Probationary employment shall not exceed six months from the date the employee
              started working, unless covered by an apprenticeship agreement stipulating a
              longer period. An employee allowed to work after the probationary period is
              considered a regular employee.
            </Txt>
            <Txt variant="rule" color={th.c.accent}>
              Labor Code Art. 296
            </Txt>
          </View>
          <View style={{ gap: 2 }}>
            <Txt variant="label">The standards must be told to you at hiring</Txt>
            <Txt variant="small">
              The employer must make known the reasonable standards for regularisation at the
              time of engagement. Where they were not communicated, the employee is deemed a
              regular employee.
            </Txt>
            <Txt variant="rule" color={th.c.accent}>
              Labor Code Art. 296; Omnibus Rules Book VI
            </Txt>
          </View>
        </Card>
      </View>

      <RaiseItSection />
    </Screen>
  );
}

function CheckRow({
  label,
  detail,
  law,
  checked,
  onPress,
  last,
}: {
  label: string;
  detail: string;
  law: string;
  checked: boolean;
  onPress: () => void;
  last?: boolean;
}) {
  const th = useTheme();
  return (
    <>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: HIT,
          flexDirection: "row",
          gap: th.space.md,
          padding: th.space.lg,
          backgroundColor: pressed ? th.c.cardSunken : checked ? th.c.warnSoft : "transparent",
        })}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            borderWidth: 1.5,
            borderColor: checked ? th.c.warn : th.c.ruleStrong,
            backgroundColor: checked ? th.c.warn : "transparent",
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
          <Txt variant="label">{label}</Txt>
          <Txt variant="small">{detail}</Txt>
          <Txt variant="rule" color={th.c.accent}>
            {law}
          </Txt>
        </View>
      </Pressable>
      {last ? null : <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: th.c.rule }} />}
    </>
  );
}
