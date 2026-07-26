import { useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { CalcResult } from "../lib/calc/types";
import { useTheme } from "../lib/theme/ThemeProvider";
import { CalcActions } from "./CalcActions";
import { Ledger } from "./Ledger";
import { Screen, ScreenTitle } from "./Screen";
import { StickyResultBar, STICKY_BAR_HEIGHT } from "./StickyResultBar";
import { Callout, Card, SectionHead, Txt } from "./ui";

/**
 * Every calculator screen has the same shape: a back affordance, a title, the
 * inputs, the ledger inline, and the sticky result bar pinned above the tab bar.
 * Built once here so the eight calculators stay consistent.
 */
export function CalcScaffold<T>({
  title,
  subtitle,
  eyebrow,
  inputs,
  result,
  kind,
  href,
  savedInputs,
  hapticKey,
  warn,
  headlineRaw,
  extra,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  inputs: React.ReactNode;
  result: CalcResult<T>;
  kind: string;
  href: string;
  savedInputs: Record<string, unknown>;
  hapticKey?: string | number;
  warn?: boolean;
  headlineRaw?: string;
  /** Rendered between the inputs and the ledger. */
  extra?: React.ReactNode;
}) {
  const th = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: th.c.paper }}>
      <Screen bottomInset={STICKY_BAR_HEIGHT}>
        <BackBar />
        <ScreenTitle title={title} subtitle={subtitle} eyebrow={eyebrow} />

        <Card style={{ gap: th.space.lg }}>{inputs}</Card>

        {extra}

        <View style={{ gap: th.space.md }}>
          <SectionHead title="The ledger" />
          <Ledger sections={result.sections} />
        </View>

        {result.notes.length ? (
          <View style={{ gap: th.space.sm }}>
            <SectionHead title="Notes" />
            {result.notes.map((n, i) => (
              <Callout key={i}>{n}</Callout>
            ))}
          </View>
        ) : null}

        <CalcActions
          result={result}
          title={title}
          kind={kind}
          href={href}
          inputs={savedInputs}
        />

        <RaiseItSection />
      </Screen>

      <StickyResultBar
        result={result}
        title={title}
        hapticKey={hapticKey}
        warn={warn}
        headlineRaw={headlineRaw}
        actions={
          <CalcActions
            result={result}
            title={title}
            kind={kind}
            href={href}
            inputs={savedInputs}
          />
        }
      />
    </View>
  );
}

export function BackBar({ label = "Back" }: { label?: string }) {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      style={({ pressed }) => ({
        minHeight: 44,
        justifyContent: "center",
        marginTop: insets.top > 0 ? insets.top - th.space.lg + 4 : 0,
        opacity: pressed ? 0.6 : 1,
        alignSelf: "flex-start",
        paddingRight: th.space.lg,
      })}
    >
      <Txt variant="label" color={th.c.accent}>
        ‹  {label}
      </Txt>
    </Pressable>
  );
}

/**
 * Where to raise it. Neutral pathway only: no drafting complaints, no
 * predicting outcomes, no telling anyone they have a case.
 */
export function RaiseItSection() {
  const th = useTheme();
  return (
    <View style={{ gap: th.space.sm }}>
      <SectionHead title="Where to raise it" />
      <Card style={{ gap: th.space.sm }}>
        <Txt variant="body">
          If a wage or benefit question is not resolved with your employer, the first
          step is the DOLE Single Entry Approach, or SEnA. It is a 30-day
          conciliation-mediation process, it is free, and it does not require a lawyer.
        </Txt>
        <Txt variant="small">
          Request assistance at any DOLE Regional or Field Office, or through the DOLE
          website. A desk officer sits both sides down and tries to settle it. If it does
          not settle, the officer refers the matter to the appropriate office.
        </Txt>
        <Txt variant="rule">RA 10396; DOLE Department Order 151-16 · DOLE Hotline 1349</Txt>
      </Card>
    </View>
  );
}
