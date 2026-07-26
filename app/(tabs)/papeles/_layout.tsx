import { Stack } from "expo-router";
import React from "react";

import { useTheme } from "../../../lib/theme/ThemeProvider";

/**
 * Each tab owns its own stack, so pushed screens render INSIDE the tab
 * navigator and the bottom bar stays put. A screen pushed from the root stack
 * would cover the bar instead, which is why these screens used to live in
 * app/calc, app/karapatan and so on.
 */
export default function PapelesStackLayout() {
  const th = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: th.c.paper },
        gestureEnabled: true,
        animation: th.reduceMotion ? "fade" : "slide_from_right",
      }}
    />
  );
}
