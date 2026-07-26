import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, type ColorValue } from "react-native";

import { t } from "../../lib/i18n";
import { useTheme } from "../../lib/theme/ThemeProvider";

/** Five tabs is the hard maximum. Everything else is reached from inside them. */
export default function TabsLayout() {
  const th = useTheme();

  const icon =
    (name: keyof typeof Ionicons.glyphMap, active: keyof typeof Ionicons.glyphMap) =>
    ({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) => (
      <Ionicons name={focused ? active : name} size={size - 2} color={color as string} />
    );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: th.c.accent,
        tabBarInactiveTintColor: th.c.muted,
        tabBarStyle: {
          backgroundColor: th.c.tabBar,
          borderTopColor: th.c.rule,
          borderTopWidth: StyleSheet.hairlineWidth,
        },
        tabBarLabelStyle: {
          fontFamily: th.font.sansMedium,
          fontSize: th.fs(10.5),
        },
        tabBarItemStyle: { paddingVertical: 4, minHeight: 44 },
        sceneStyle: { backgroundColor: th.c.paper },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tab.home"),
          tabBarIcon: icon("home-outline", "home"),
        }}
      />
      <Tabs.Screen
        name="kalkula"
        options={{
          title: t("tab.kalkula"),
          tabBarIcon: icon("calculator-outline", "calculator"),
        }}
      />
      <Tabs.Screen
        name="papeles"
        options={{
          title: t("tab.papeles"),
          tabBarIcon: icon("document-text-outline", "document-text"),
        }}
      />
      <Tabs.Screen
        name="karapatan"
        options={{
          title: t("tab.karapatan"),
          tabBarIcon: icon("shield-checkmark-outline", "shield-checkmark"),
        }}
      />
      <Tabs.Screen
        name="ako"
        options={{
          title: t("tab.ako"),
          tabBarIcon: icon("person-outline", "person"),
        }}
      />
    </Tabs>
  );
}
