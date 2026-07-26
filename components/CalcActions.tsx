import * as Haptics from "expo-haptics";
import React from "react";
import { Alert, Platform, TextInput, View } from "react-native";

import type { CalcResult } from "../lib/calc/types";
import { shareResult } from "../lib/share";
import { useAppStore } from "../lib/store/useAppStore";
import { useTheme } from "../lib/theme/ThemeProvider";
import { Sheet } from "./Sheet";
import { Button, Callout, Txt } from "./ui";

/**
 * Save and share, offered inside the expanded ledger. Saving is the one piece
 * of real state in the app: it turns a one-off computation into something the
 * user keeps and reopens with the inputs intact.
 */
export function CalcActions<T>({
  result,
  title,
  kind,
  href,
  inputs,
}: {
  result: CalcResult<T>;
  title: string;
  kind: string;
  href: string;
  inputs: Record<string, unknown>;
}) {
  const th = useTheme();
  const save = useAppStore((s) => s.saveComputation);
  const [naming, setNaming] = React.useState(false);
  const [name, setName] = React.useState("");
  const [savedMsg, setSavedMsg] = React.useState<string | null>(null);

  const commit = () => {
    const finalName = name.trim() || `${title} — ${new Date().toLocaleDateString("en-PH")}`;
    save({
      name: finalName,
      kind,
      href,
      inputs,
      headline: { label: result.headline.label, amount: result.headline.amount },
    });
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setNaming(false);
    setName("");
    setSavedMsg(`Saved as “${finalName}”. Find it in Ako › Saved.`);
    setTimeout(() => setSavedMsg(null), 4000);
  };

  return (
    <View style={{ gap: th.space.sm }}>
      {savedMsg ? <Callout tone="accent">{savedMsg}</Callout> : null}
      <View style={{ flexDirection: "row", gap: th.space.sm }}>
        <Button
          label="Save"
          tone="quiet"
          style={{ flex: 1 }}
          onPress={() => setNaming(true)}
        />
        <Button
          label="Share"
          style={{ flex: 1 }}
          onPress={() => shareResult(result, title)}
        />
      </View>

      <Sheet
        visible={naming}
        onClose={() => setNaming(false)}
        title="Name this computation"
        subtitle="Stored on this phone only. Reopening restores what you typed."
        snap={0.42}
      >
        <View style={{ padding: th.space.lg, gap: th.space.lg }}>
          <TextInput
            value={name}
            onChangeText={setName}
            autoFocus
            placeholder="Payslip — March cutoff"
            placeholderTextColor={th.c.ruleStrong}
            accessibilityLabel="Name for this computation"
            onSubmitEditing={commit}
            returnKeyType="done"
            style={{
              minHeight: 48,
              borderWidth: 1,
              borderColor: th.c.ruleStrong,
              borderRadius: th.radius.md,
              paddingHorizontal: th.space.md,
              fontFamily: th.font.sans,
              fontSize: th.fs(16),
              color: th.c.ink,
              backgroundColor: th.c.card,
            }}
          />
          <Button label="Save" onPress={commit} />
        </View>
      </Sheet>
    </View>
  );
}

export function confirmDestructive(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    // eslint-disable-next-line no-alert
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: onConfirm },
  ]);
}
