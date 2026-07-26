import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Jeepney } from "../components/Illustrations";
import { Button, Callout, Card, Txt } from "../components/ui";
import { t } from "../lib/i18n";
import { requestNotificationPermission } from "../lib/notifications";
import { ROLES, useAppStore, type Role } from "../lib/store/useAppStore";
import { useTheme } from "../lib/theme/ThemeProvider";
import { HIT } from "../lib/theme/tokens";

/**
 * Three screens, skippable, shown once.
 *
 * Never ask for a name, an email, a phone number or a salary here. A payroll app
 * asking for personal details reads as a data grab and loses people at the door.
 */
export default function Onboarding() {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = React.useState(0);
  const roles = useAppStore((s) => s.roles);
  const setRoles = useAppStore((s) => s.setRoles);
  const setNotifications = useAppStore((s) => s.setNotifications);
  const complete = useAppStore((s) => s.completeOnboarding);

  const finish = () => {
    complete();
    router.replace("/");
  };

  const toggleRole = (r: Role) =>
    setRoles(roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r]);

  const enableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotifications({
      enabled: granted,
      holidays: true,
      thirteenthMonth: true,
      deadlines: roles.includes("hr"),
      rateChanges: true,
    });
    finish();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: th.c.paper,
        paddingTop: insets.top + th.space.xl,
        paddingBottom: insets.bottom + th.space.xl,
        paddingHorizontal: th.space.xl,
        gap: th.space.xl,
        maxWidth: 560,
        width: "100%",
        alignSelf: "center",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              height: 3,
              flex: 1,
              borderRadius: 2,
              backgroundColor: i <= step ? th.c.accent : th.c.rule,
            }}
          />
        ))}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={finish}
          hitSlop={12}
          style={{ minHeight: HIT, justifyContent: "center", paddingLeft: th.space.md }}
        >
          <Txt variant="small" color={th.c.muted}>
            Skip
          </Txt>
        </Pressable>
      </View>

      <View style={{ flex: 1, gap: th.space.xl, justifyContent: "center" }}>
        {step === 0 ? (
          <View style={{ gap: th.space.md }}>
            <View style={{ alignItems: "center", paddingBottom: th.space.sm }}>
              <Jeepney size={180} />
            </View>
            <Txt variant="wordmark">{t("app.wordmark")}</Txt>
            <Txt variant="display">
              The peso figure, the rule behind it, and what to bring to the office.
            </Txt>
            <Txt variant="body" color={th.c.muted}>
              {t("app.tagline")}
            </Txt>
            <Callout tone="accent" title="Everything stays on your phone">
              Gabay has no account, no login and no server. It collects nothing, sends
              nothing, and works with no signal.
            </Callout>
          </View>
        ) : null}

        {step === 1 ? (
          <View style={{ gap: th.space.lg }}>
            <View style={{ gap: th.space.xs }}>
              <Txt variant="display">Which of these are you?</Txt>
              <Txt variant="body" color={th.c.muted}>
                Pick as many as apply. This only reorders the shortcuts on your Home screen —
                nothing is hidden or locked behind it.
              </Txt>
            </View>
            <View style={{ gap: th.space.sm }}>
              {ROLES.map((r) => {
                const selected = roles.includes(r.id);
                return (
                  <Pressable
                    key={r.id}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={r.label}
                    onPress={() => toggleRole(r.id)}
                    style={({ pressed }) => ({
                      minHeight: HIT + 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: th.space.md,
                      padding: th.space.lg,
                      borderRadius: th.radius.lg,
                      borderWidth: selected ? 1.5 : StyleSheet.hairlineWidth,
                      borderColor: selected ? th.c.accent : th.c.rule,
                      backgroundColor: pressed
                        ? th.c.cardSunken
                        : selected
                          ? th.c.accentSoft
                          : th.c.card,
                    })}
                  >
                    <View style={{ flex: 1, gap: 2 }}>
                      <Txt variant="label">{r.label}</Txt>
                      <Txt variant="small">{r.hint}</Txt>
                    </View>
                    {selected ? (
                      <Txt variant="body" color={th.c.accent} style={{ fontFamily: th.font.monoBold }}>
                        ✓
                      </Txt>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={{ gap: th.space.lg }}>
            <View style={{ gap: th.space.xs }}>
              <Txt variant="display">A few notifications a month, with the figure attached.</Txt>
              <Txt variant="body" color={th.c.muted}>
                Not a nudge to open the app. Each one carries a specific date or amount.
              </Txt>
            </View>
            <Card style={{ gap: th.space.md }}>
              <Example
                title="Tomorrow: Araw ng Kagitingan"
                body="Regular holiday. Work pays 200% of your daily rate; if you do not work, 100% if you were present the working day before."
              />
              <Example
                title="13th month pay"
                body="Total basic salary earned ÷ 12, payable on or before 24 December. Start computing now."
              />
              {roles.includes("hr") ? (
                <Example
                  title="BIR 2316 to employees"
                  body="Certificates of compensation payment and tax withheld are due to employees by 28 February."
                />
              ) : null}
            </Card>
            <Txt variant="small">
              Scheduled on your phone. No push server is involved and nothing is transmitted.
              You can turn these off any time in Ako.
            </Txt>
          </View>
        ) : null}
      </View>

      <View style={{ gap: th.space.sm }}>
        {step < 2 ? (
          <Button label="Continue" onPress={() => setStep(step + 1)} />
        ) : (
          <>
            <Button label="Turn on notifications" onPress={enableNotifications} />
            <Button label="Not now" tone="quiet" onPress={finish} />
          </>
        )}
      </View>
    </View>
  );
}

function Example({ title, body }: { title: string; body: string }) {
  const th = useTheme();
  return (
    <View
      style={{
        gap: 2,
        paddingLeft: th.space.md,
        borderLeftWidth: 2,
        borderLeftColor: th.c.accent,
      }}
    >
      <Txt variant="label" style={{ fontSize: th.fs(14) }}>
        {title}
      </Txt>
      <Txt variant="small">{body}</Txt>
    </View>
  );
}
