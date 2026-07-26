import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card, ListRow, SectionHead, Txt } from "../../../components/ui";
import { RATES_VERSION_LABEL } from "../../../lib/rates";
import { ROLES, useAppStore } from "../../../lib/store/useAppStore";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function AkoTab() {
  const th = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const saved = useAppStore((s) => s.saved);
  const roles = useAppStore((s) => s.roles);
  const notifications = useAppStore((s) => s.notifications);

  return (
    <Screen contentStyle={{ paddingTop: insets.top + th.space.md }}>
      <ScreenTitle eyebrow="Ako" title="Your stuff" subtitle="Saved work, sources, and settings." />

      <Callout tone="accent" title="Where your data lives">
        <Txt variant="small">
          This app stores everything on your phone and sends nothing to a server. There is no
          account, no login, and no analytics. Delete the app and it is all gone — which also
          means nothing here is backed up anywhere.
        </Txt>
      </Callout>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Your work" />
        <Card padded={false}>
          <ListRow
            title="Saved computations"
            subtitle={
              saved.length
                ? `${saved.length} saved · reopens with the inputs intact`
                : "Nothing saved yet"
            }
            onPress={() => router.push("/ako/saved")}
            last
          />
        </Card>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Sources" />
        <Card padded={false}>
          <ListRow
            title="Rates and sources"
            subtitle={`Every statutory figure, its source, and when it was verified · ${RATES_VERSION_LABEL}`}
            onPress={() => router.push("/ako/rates")}
            last
          />
        </Card>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="Settings" />
        <Card padded={false}>
          <ListRow
            title="Notifications"
            subtitle={
              notifications.enabled
                ? "On — a few a month, each with a figure or a date"
                : "Off"
            }
            onPress={() => router.push("/ako/notifications")}
          />
          <ListRow
            title="Appearance"
            subtitle="Light, dark, or follow the system"
            onPress={() => router.push("/ako/appearance")}
          />
          <ListRow
            title="Language"
            subtitle="English. A Taglish switch is coming."
            onPress={() => router.push("/ako/language")}
          />
          <ListRow
            title="Your roles"
            subtitle={
              roles.length
                ? roles.map((r) => ROLES.find((x) => x.id === r)?.label).join(", ")
                : "Not set — Home shows the default shortcuts"
            }
            onPress={() => router.push("/ako/roles")}
            last
          />
        </Card>
      </View>

      <View style={{ gap: th.space.md }}>
        <SectionHead title="About" />
        <Card padded={false}>
          <ListRow title="About Gabay" subtitle="What it does and what it will not do" onPress={() => router.push("/ako/about")} last />
        </Card>
      </View>
    </Screen>
  );
}
