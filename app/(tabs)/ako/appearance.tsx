import React from "react";

import { BackBar } from "../../../components/CalcScaffold";
import { Segmented } from "../../../components/Field";
import { Screen, ScreenTitle } from "../../../components/Screen";
import { Callout, Card } from "../../../components/ui";
import { useAppStore } from "../../../lib/store/useAppStore";
import { useTheme } from "../../../lib/theme/ThemeProvider";

export default function AppearanceScreen() {
  const th = useTheme();
  const pref = useAppStore((s) => s.themePreference);
  const set = useAppStore((s) => s.setThemePreference);

  return (
    <Screen>
      <BackBar label="Ako" />
      <ScreenTitle eyebrow="Ako" title="Appearance" />

      <Card style={{ gap: th.space.lg }}>
        <Segmented
          label="Theme"
          value={pref}
          onChange={set}
          options={[
            { value: "system", label: "System" },
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
        />
      </Card>

      <Callout>
        Text size follows your phone&apos;s Dynamic Type setting. At the largest accessibility
        sizes the ledger rows stack the amount under the label rather than squeezing both onto
        one line.
      </Callout>
    </Screen>
  );
}
