import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import {
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ThemeProvider, useTheme } from "../lib/theme/ThemeProvider";
import { useAppStore } from "../lib/store/useAppStore";
import { syncNotifications } from "../lib/notifications";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  // Keys match `fonts` in lib/theme/tokens.ts — change both together.
  const [fontsLoaded] = useFonts({
    Roboto: Roboto_400Regular,
    RobotoMedium: Roboto_500Medium,
    RobotoBold: Roboto_700Bold,
    RobotoMono: RobotoMono_400Regular,
    RobotoMonoMedium: RobotoMono_500Medium,
    RobotoMonoBold: RobotoMono_700Bold,
  });

  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);
  const notifications = useAppStore((s) => s.notifications);
  const roles = useAppStore((s) => s.roles);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  React.useEffect(() => {
    if (fontsLoaded && hydrated) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, hydrated]);

  React.useEffect(() => {
    if (hydrated) syncNotifications(notifications, roles);
  }, [hydrated, notifications, roles]);

  if (!fontsLoaded || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Chrome />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function Chrome() {
  const th = useTheme();
  const router = useRouter();
  const onboarded = useAppStore((s) => s.onboarded);
  const pathname = usePathname();

  // The root layout must always render a navigator, so the onboarding hand-off
  // happens after mount rather than by returning a <Redirect> in its place.
  React.useEffect(() => {
    if (!onboarded && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
  }, [onboarded, pathname, router]);

  return (
    <View style={{ flex: 1, backgroundColor: th.c.paper }}>
      <StatusBar style={th.scheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: th.c.paper },
          // Swipe back on every pushed screen.
          gestureEnabled: true,
          animation: th.reduceMotion ? "fade" : "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: "fade" }} />
      </Stack>
    </View>
  );
}
