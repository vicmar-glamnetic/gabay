import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlamMoBa } from "../../components/AlamMoBa";
import { Banderitas, MagnifyPaper, PayEnvelope } from "../../components/Illustrations";
import { Screen } from "../../components/Screen";
import { Wordmark } from "../../components/Wordmark";
import { Callout, Card, ListRow, Rule, SectionHead, Txt } from "../../components/ui";
import { nextPayday, PAYDAY_CAVEAT } from "../../lib/data/payday";
import { DEFAULT_SHORTCUTS, SHORTCUTS_BY_ROLE } from "../../lib/data/calculators";
import {
  daysUntil,
  dayTypeForHoliday,
  formatHolidayDate,
  holidayDate,
  HOLIDAY_TYPE_LABEL,
  isRestDay,
  nextHoliday,
} from "../../lib/data/holidays";
import { searchEverything } from "../../lib/data/search";
import { useDebounced } from "../../lib/hooks";
import { t } from "../../lib/i18n";
import { DAY_TYPES, RATES_VERSION_LABEL } from "../../lib/rates";
import { useAppStore, useRatesChanged } from "../../lib/store/useAppStore";
import { useTheme } from "../../lib/theme/ThemeProvider";
import { HIT } from "../../lib/theme/tokens";

export default function HomeTab() {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const roles = useAppStore((s) => s.roles);
  const recents = useAppStore((s) => s.recents);
  const acknowledge = useAppStore((s) => s.acknowledgeRates);
  const ratesChanged = useRatesChanged();

  const [query, setQuery] = React.useState("");
  const debounced = useDebounced(query);
  const hits = searchEverything(debounced);

  const shortcuts = roles.length
    ? dedupe(roles.flatMap((r) => SHORTCUTS_BY_ROLE[r])).slice(0, 4)
    : DEFAULT_SHORTCUTS;

  const holiday = nextHoliday();

  return (
    <Screen contentStyle={{ paddingTop: insets.top + th.space.md }}>
      <View style={{ gap: th.space.xs }}>
        <Wordmark />
        <Txt variant="small">{t("app.tagline")}</Txt>
      </View>

      {ratesChanged ? (
        <Pressable accessibilityRole="button" onPress={() => { acknowledge(); router.push("/ako/rates"); }}>
          <Callout tone="stop" title="Statutory rates updated">
            <Txt variant="small">
              The schedules in this app changed since you last opened it. Now on the{" "}
              {RATES_VERSION_LABEL}. Tap to see what each figure is and where it comes from.
            </Txt>
          </Callout>
        </Pressable>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: th.space.sm,
          minHeight: 48,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: th.c.ruleStrong,
          borderRadius: th.radius.md,
          backgroundColor: th.c.card,
          paddingHorizontal: th.space.md,
        }}
      >
        <Ionicons name="search" size={17} color={th.c.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search everything — a form, a figure, a rule"
          placeholderTextColor={th.c.ruleStrong}
          accessibilityLabel="Search everything in Gabay"
          returnKeyType="search"
          style={{
            flex: 1,
            paddingVertical: th.space.sm,
            fontFamily: th.font.sans,
            fontSize: th.fs(16),
            color: th.c.ink,
          }}
        />
        {query.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery("")}
            hitSlop={12}
          >
            <Txt variant="small" color={th.c.muted}>
              ✕
            </Txt>
          </Pressable>
        ) : null}
      </View>

      {debounced.trim().length > 0 ? (
        <View style={{ gap: th.space.sm }}>
          <SectionHead title={hits.length ? `${hits.length} results` : "No results"} />
          {hits.length === 0 ? (
            <Card style={{ alignItems: "center", gap: th.space.sm, paddingVertical: th.space.xl }}>
              <MagnifyPaper />
              <Txt variant="title">Wala pa rito.</Txt>
              <Txt variant="small" style={{ textAlign: "center", maxWidth: 340 }}>
                Nothing matches “{debounced}”. Try a form name, an agency, a law number, or just
                the word for what you need — sahod, leave, holiday, permit.
              </Txt>
            </Card>
          ) : (
            <Card padded={false}>
              {hits.map((h, i) => (
                <ListRow
                  key={`${h.href}-${h.title}`}
                  title={h.title}
                  subtitle={h.subtitle}
                  onPress={() => router.push(h.href as never)}
                  last={i === hits.length - 1}
                  meta={<Txt variant="micro">{h.group}</Txt>}
                />
              ))}
            </Card>
          )}
        </View>
      ) : (
        <>
          {holiday ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Next holiday, ${holiday.name}, ${formatHolidayDate(holiday)}`}
              onPress={() => router.push("/kalkula/holidays")}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Card
                padded={false}
                style={{
                  borderColor: th.c.accent,
                  borderWidth: 1,
                  backgroundColor: th.c.accentSoft,
                  overflow: "hidden",
                }}
              >
                <Banderitas />
                <View style={{ padding: th.space.lg, paddingTop: th.space.sm, gap: th.space.sm }}>
                <Txt variant="micro" color={th.c.accent}>
                  Next holiday ·{" "}
                  {daysUntil(holiday) === 0
                    ? "today"
                    : daysUntil(holiday) === 1
                      ? "tomorrow"
                      : `in ${daysUntil(holiday)} days`}
                </Txt>
                <Txt variant="title">{holiday.name}</Txt>
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.md }}>
                  <Txt variant="body">{formatHolidayDate(holiday)}</Txt>
                  <Txt variant="rule">{HOLIDAY_TYPE_LABEL[holiday.type]}</Txt>
                </View>
                <Rule />
                <View style={{ flexDirection: "row", alignItems: "baseline", gap: th.space.sm }}>
                  <Txt
                    variant="amount"
                    color={th.c.accent}
                    style={{ fontFamily: th.font.monoBold, fontSize: th.fs(20) }}
                  >
                    {Math.round(
                      (DAY_TYPES.find(
                        (d) =>
                          d.id === dayTypeForHoliday(holiday, isRestDay(holidayDate(holiday)))
                      )?.workedRate ?? 1) * 100
                    )}
                    %
                  </Txt>
                  <Txt variant="small">of your daily rate if you work</Txt>
                </View>
                </View>
              </Card>
            </Pressable>
          ) : null}

          <PaydayCard />

          <AlamMoBa />

          <View style={{ gap: th.space.md }}>
            <SectionHead title="Shortcuts" />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: th.space.sm }}>
              {shortcuts.map((s) => (
                <Tile
                  key={s.href}
                  label={s.label}
                  icon={s.icon as keyof typeof Ionicons.glyphMap}
                  onPress={() => router.push(s.href as never)}
                />
              ))}
            </View>
          </View>

          {recents.length ? (
            <View style={{ gap: th.space.md }}>
              <SectionHead title="Recent" />
              <Card padded={false}>
                {recents.slice(0, 5).map((r, i) => (
                  <ListRow
                    key={r.href}
                    title={r.title}
                    subtitle={r.subtitle}
                    onPress={() => router.push(r.href as never)}
                    last={i === Math.min(recents.length, 5) - 1}
                  />
                ))}
              </Card>
            </View>
          ) : null}

          <Callout tone="neutral" title="Everything here works offline">
            Every figure, rule, holiday and transaction is compiled into the app. Nothing is
            fetched, nothing is sent anywhere, and it all works with no signal — which is
            usually exactly when you need it.
          </Callout>
        </>
      )}
    </Screen>
  );
}

function PaydayCard() {
  const th = useTheme();
  const payday = nextPayday();

  return (
    <Card style={{ flexDirection: "row", alignItems: "center", gap: th.space.lg }}>
      <PayEnvelope />
      <View style={{ flex: 1, gap: 2 }}>
        <Txt variant="micro">{payday.label.toUpperCase()}</Txt>
        <Txt variant="title">
          {payday.date.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
        </Txt>
        <Txt variant="rule">{PAYDAY_CAVEAT}</Txt>
      </View>
    </Card>
  );
}

function Tile({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flexGrow: 1,
        flexBasis: "45%",
        minHeight: HIT + 34,
        justifyContent: "space-between",
        gap: th.space.sm,
        padding: th.space.md,
        borderRadius: th.radius.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: th.c.rule,
        backgroundColor: pressed ? th.c.cardSunken : th.c.card,
      })}
    >
      <Ionicons name={icon} size={20} color={th.c.accent} />
      <Txt variant="label" style={{ fontSize: th.fs(14) }}>
        {label}
      </Txt>
    </Pressable>
  );
}

function dedupe<T extends { href: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.href) ? false : (seen.add(i.href), true)));
}
