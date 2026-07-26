import React from "react";
import { Platform, View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { ToggleField } from "../../../components/Field";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card } from "../../../components/ui";
import { requestNotificationPermission } from "../../../lib/notifications";
import { useAppStore } from "../../../lib/store/useAppStore";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function NotificationsScreen() {
  const th = useTheme();
  const prefs = useAppStore((s) => s.notifications);
  const set = useAppStore((s) => s.setNotifications);
  const roles = useAppStore((s) => s.roles);

  const enable = async (on: boolean) => {
    if (!on) return set({ enabled: false });
    const granted = await requestNotificationPermission();
    set({ enabled: granted });
  };

  return (
    <Screen>
      <BackBar label="Ako" />
      <ScreenTitle
        eyebrow="Ako"
        title="Notifications"
        subtitle="A few a month. Every one carries a specific figure or date."
      />

      {Platform.OS === "web" ? (
        <Callout tone="warn" title="Not available on the web build">
          Scheduled notifications need the installed app. Everything else works here.
        </Callout>
      ) : null}

      <Card style={{ gap: th.space.lg }}>
        <ToggleField
          label="Notifications"
          hint="All scheduled on this phone. No push server is involved."
          value={prefs.enabled}
          onChange={enable}
        />
      </Card>

      <Card style={{ gap: th.space.lg, opacity: prefs.enabled ? 1 : 0.45 }}>
        <ToggleField
          label="The day before each holiday"
          hint="With the pay multiplier in the body — 200% for a regular holiday, 130% for a special non-working day."
          value={prefs.holidays}
          onChange={(v) => set({ holidays: v })}
        />
        <ToggleField
          label="13th month reminder in late November"
          hint="Payable on or before 24 December."
          value={prefs.thirteenthMonth}
          onChange={(v) => set({ thirteenthMonth: v })}
        />
        <ToggleField
          label="Remittance and BIR filing deadlines"
          hint={
            roles.includes("hr")
              ? "Contribution remittance, 1604-C and alphalist, 2316 to employees."
              : "For the HR or negosyo role. Set your role in Ako to enable these."
          }
          value={prefs.deadlines && roles.includes("hr")}
          onChange={(v) => set({ deadlines: v })}
        />
        <ToggleField
          label="Rate change notices"
          hint="When the app updates with a new statutory schedule."
          value={prefs.rateChanges}
          onChange={(v) => set({ rateChanges: v })}
        />
      </Card>

      <Callout>
        Gabay caps what it schedules. Nobody wants more than a few notifications a month from
        a payroll app, and a notification that only says &ldquo;open the app&rdquo; is not
        worth sending.
      </Callout>
    </Screen>
  );
}
