import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { Banderitas, Parol } from "../../../components/Illustrations";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, Chip, SectionHead, Txt } from "../../../components/ui";
import {
  daysUntil,
  dayTypeForHoliday,
  formatHolidayDate,
  holidayDate,
  HOLIDAYS_2026,
  HOLIDAY_SOURCE,
  HOLIDAY_TYPE_LABEL,
  isRestDay,
  nextHoliday,
  type Holiday,
  type HolidayType,
} from "../../../lib/data/holidays";
import { useRecent } from "../../../lib/hooks";
import { DAY_TYPES } from "../../../lib/rates";
import { useTheme } from "../../../lib/theme/ThemeProvider";

type Filter = "all" | HolidayType;

export default function HolidaysScreen() {
  const th = useTheme();
  useRecent("/kalkula/holidays", "2026 holiday calendar", "Kalkula");

  const [filter, setFilter] = React.useState<Filter>("all");
  const next = nextHoliday();
  const list = HOLIDAYS_2026.filter((h) => filter === "all" || h.type === filter);

  const counts = {
    all: HOLIDAYS_2026.length,
    regular: HOLIDAYS_2026.filter((h) => h.type === "regular").length,
    special: HOLIDAYS_2026.filter((h) => h.type === "special").length,
    "special-working": HOLIDAYS_2026.filter((h) => h.type === "special-working").length,
  };

  return (
    <Screen>
      <BackBar />
      <ScreenTitle
        eyebrow="Kalkula"
        title="2026 holidays"
        subtitle="Twelve regular, eight special non-working, one special working."
      />

      {next ? <NextHolidayCard holiday={next} /> : null}

      <View style={{ gap: th.space.md }}>
        <SectionHead title="The full year" />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: th.space.sm }}>
          <Chip label="All" count={counts.all} selected={filter === "all"} onPress={() => setFilter("all")} />
          <Chip
            label="Regular"
            count={counts.regular}
            selected={filter === "regular"}
            onPress={() => setFilter("regular")}
          />
          <Chip
            label="Special non-working"
            count={counts.special}
            selected={filter === "special"}
            onPress={() => setFilter("special")}
          />
          <Chip
            label="Special working"
            count={counts["special-working"]}
            selected={filter === "special-working"}
            onPress={() => setFilter("special-working")}
          />
        </View>

        <View style={{ gap: th.space.sm }}>
          {list.map((h) => (
            <HolidayCard key={h.date} holiday={h} />
          ))}
        </View>
      </View>

      <Callout tone="warn" title="Local holidays are not in this list">
        LGUs declare their own local holidays on top of the national list, and those carry
        the same premiums within that city or province. Check your LGU&apos;s announcements.
      </Callout>

      <Txt variant="rule">{HOLIDAY_SOURCE}</Txt>
    </Screen>
  );
}

function TypeBadge({ type }: { type: HolidayType }) {
  const th = useTheme();
  const tone =
    type === "regular" ? th.c.accent : type === "special" ? th.c.warn : th.c.muted;
  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: tone,
      }}
    >
      <Txt variant="micro" color={tone}>
        {HOLIDAY_TYPE_LABEL[type]}
      </Txt>
    </View>
  );
}

function NextHolidayCard({ holiday }: { holiday: Holiday }) {
  const th = useTheme();
  const router = useRouter();
  const days = daysUntil(holiday);
  const rest = isRestDay(holidayDate(holiday));
  const rule = DAY_TYPES.find((d) => d.id === dayTypeForHoliday(holiday, rest))!;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Next holiday, ${holiday.name}, ${formatHolidayDate(holiday)}. Open the premium pay calculator.`}
      onPress={() =>
        router.push({
          pathname: "/kalkula/premium-pay",
          params: { dayType: dayTypeForHoliday(holiday, rest) },
        })
      }
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
        {holidayDate(holiday).getMonth() === 11 ? (
          <View style={{ alignItems: "center" }}>
            <Parol size={72} />
          </View>
        ) : null}
        <Txt variant="micro" color={th.c.accent}>
          {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`}
        </Txt>
        <Txt variant="title">{holiday.name}</Txt>
        <Txt variant="body">{formatHolidayDate(holiday)}</Txt>
        <View style={{ flexDirection: "row", gap: th.space.sm, alignItems: "center" }}>
          <TypeBadge type={holiday.type} />
          <Txt variant="amount" color={th.c.accent} style={{ fontFamily: th.font.monoBold }}>
            {Math.round(rule.workedRate * 100)}%
          </Txt>
          <Txt variant="rule">if you work</Txt>
        </View>
        <Txt variant="small">
          Tap to open the premium pay calculator with this day type already selected.
        </Txt>
        </View>
      </Card>
    </Pressable>
  );
}

function HolidayCard({ holiday }: { holiday: Holiday }) {
  const th = useTheme();
  const router = useRouter();
  const date = holidayDate(holiday);
  const rest = isRestDay(date);
  const rule = DAY_TYPES.find((d) => d.id === dayTypeForHoliday(holiday, false))!;
  const past = daysUntil(holiday) < 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${holiday.name}, ${formatHolidayDate(holiday)}, ${HOLIDAY_TYPE_LABEL[holiday.type]}`}
      onPress={() =>
        router.push({
          pathname: "/kalkula/premium-pay",
          params: { dayType: dayTypeForHoliday(holiday, rest) },
        })
      }
      style={({ pressed }) => ({ opacity: past ? 0.55 : pressed ? 0.8 : 1 })}
    >
      <Card style={{ gap: th.space.sm }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: th.space.md }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt variant="label">{holiday.name}</Txt>
            <Txt variant="small">{formatHolidayDate(holiday)}</Txt>
          </View>
          <TypeBadge type={holiday.type} />
        </View>

        {rest ? (
          <Txt variant="rule" color={th.c.warn}>
            Falls on a Sunday. If that is the employee&apos;s rest day the higher combined
            rate applies.
          </Txt>
        ) : null}

        <View style={{ gap: 2 }}>
          <View style={{ flexDirection: "row", gap: th.space.sm }}>
            <Txt variant="rule" style={{ width: 82 }}>
              If you work
            </Txt>
            <Txt variant="rule" color={th.c.ink} style={{ flex: 1 }}>
              {rule.workedRule}
            </Txt>
          </View>
          <View style={{ flexDirection: "row", gap: th.space.sm }}>
            <Txt variant="rule" style={{ width: 82 }}>
              If you do not
            </Txt>
            <Txt variant="rule" color={th.c.ink} style={{ flex: 1 }}>
              {rule.unworkedRule}
            </Txt>
          </View>
        </View>

        {holiday.note ? <Txt variant="rule" color={th.c.warn}>{holiday.note}</Txt> : null}
      </Card>
    </Pressable>
  );
}
