import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, Share, StyleSheet, View } from "react-native";

import { nextTrivia, triviaOfTheDay, type Trivia } from "../lib/data/trivia";
import { useTheme } from "../lib/theme/ThemeProvider";
import { HIT } from "../lib/theme/tokens";
import { Txt } from "./ui";

/**
 * "Alam mo ba?" — the shareable surface of the app.
 *
 * The entitlements nobody was told about are the most interesting thing here,
 * so they get the one card with personality. It still carries the statute,
 * because a fun fact that cannot be checked is just a rumour.
 */
export function AlamMoBa({ compact }: { compact?: boolean }) {
  const th = useTheme();
  const router = useRouter();
  const [item, setItem] = React.useState<Trivia>(() => triviaOfTheDay());

  const shuffle = () => {
    setItem((t) => nextTrivia(t));
    if (Platform.OS !== "web") Haptics.selectionAsync();
  };

  const share = () => {
    const message = `Alam mo ba?\n\n${item.fact}\n\n${item.detail}\n\n— ${item.law}\n\nvia Gabay: sahod, benepisyo, at papeles sa isang lugar.`;
    if (Platform.OS === "web") {
      const nav = (globalThis as { navigator?: { share?: (d: { text: string }) => Promise<void> } })
        .navigator;
      nav?.share?.({ text: message }).catch(() => {});
      return;
    }
    Share.share({ message }).catch(() => {});
  };

  return (
    <View
      style={{
        borderRadius: th.radius.lg,
        borderWidth: 1,
        borderColor: th.c.accent,
        backgroundColor: th.c.accentSoft,
        overflow: "hidden",
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Alam mo ba? ${item.fact}. ${item.detail}. ${item.law}.`}
        accessibilityHint={item.href ? "Opens the related screen" : undefined}
        onPress={() => item.href && router.push(item.href as never)}
        style={({ pressed }) => ({
          padding: th.space.lg,
          gap: th.space.sm,
          opacity: pressed && item.href ? 0.8 : 1,
        })}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: th.space.sm }}>
          <Txt variant="micro" color={th.c.accent} style={{ flex: 1 }}>
            Alam mo ba?
          </Txt>
          <Txt style={{ fontSize: th.fs(22) }} accessibilityElementsHidden>
            {item.emoji}
          </Txt>
        </View>

        <Txt
          variant="title"
          style={{ fontSize: th.fs(compact ? 19 : 21), lineHeight: th.fs(compact ? 24 : 26) }}
        >
          {item.fact}
        </Txt>

        <Txt variant="small" color={th.c.ink} style={{ opacity: 0.85 }}>
          {item.detail}
        </Txt>

        <Txt variant="rule" color={th.c.accent}>
          {item.law}
          {item.href ? "  ·  tap to open" : ""}
        </Txt>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: th.c.accent,
        }}
      >
        <Action label="Isa pa" onPress={shuffle} />
        <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: th.c.accent }} />
        <Action label="Share" onPress={share} />
      </View>
    </View>
  );
}

function Action({ label, onPress }: { label: string; onPress: () => void }) {
  const th = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: HIT,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? th.c.card : "transparent",
      })}
    >
      <Txt variant="small" color={th.c.accent} style={{ fontFamily: th.font.sansSemi }}>
        {label}
      </Txt>
    </Pressable>
  );
}
