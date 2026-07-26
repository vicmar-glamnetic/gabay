import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BackBar } from "../../../components/CalcScaffold";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Txt } from "../../../components/ui";
import { ROLES, useAppStore, type Role } from "../../../lib/store/useAppStore";
import { useTheme } from "../../../lib/theme/ThemeProvider";
import { HIT } from "../../../lib/theme/tokens";

export default function RolesScreen() {
  const th = useTheme();
  const roles = useAppStore((s) => s.roles);
  const setRoles = useAppStore((s) => s.setRoles);

  const toggle = (r: Role) =>
    setRoles(roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r]);

  return (
    <Screen>
      <BackBar label="Ako" />
      <ScreenTitle
        eyebrow="Ako"
        title="Your roles"
        subtitle="This only reorders the shortcuts on Home. Nothing is hidden behind it."
      />

      <View style={{ gap: th.space.sm }}>
        {ROLES.map((r) => {
          const selected = roles.includes(r.id);
          return (
            <Pressable
              key={r.id}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={r.label}
              onPress={() => toggle(r.id)}
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

      <Callout>
        Gabay never asks for your name, email, phone number or salary. Roles are stored on
        this phone and used for nothing except the order of four tiles.
      </Callout>
    </Screen>
  );
}
