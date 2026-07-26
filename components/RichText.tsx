import React from "react";
import { Linking, Text } from "react-native";

import { useTheme } from "../lib/theme/ThemeProvider";
import { Txt } from "./ui";

/**
 * Renders a string containing markdown-style links as tappable text:
 *
 *   "Book an appointment on the [DFA passport appointment site](https://…)."
 *
 * The link sits inside the sentence where it belongs, rather than as a button
 * bolted underneath. Only links are supported — no other markdown — because
 * anything more would be a formatting language nobody asked for.
 */

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; url: string };

export function parseRichText(input: string): Segment[] {
  const segments: Segment[] = [];
  let lastIndex = 0;
  LINK.lastIndex = 0;

  for (let m = LINK.exec(input); m !== null; m = LINK.exec(input)) {
    if (m.index > lastIndex) {
      segments.push({ kind: "text", text: input.slice(lastIndex, m.index) });
    }
    segments.push({ kind: "link", text: m[1], url: m[2] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < input.length) {
    segments.push({ kind: "text", text: input.slice(lastIndex) });
  }
  return segments;
}

/** Strips the link markup, for search indexes and share text. */
export function plainText(input: string): string {
  return input.replace(LINK, "$1");
}

export function RichText({
  children,
  size,
  color,
}: {
  children: string;
  size?: number;
  color?: string;
}) {
  const th = useTheme();
  const segments = React.useMemo(() => parseRichText(children), [children]);

  return (
    <Txt
      variant="body"
      color={color}
      style={{ fontSize: th.fs(size ?? 15) }}
      accessibilityLabel={plainText(children)}
    >
      {segments.map((s, i) =>
        s.kind === "text" ? (
          <Text key={i}>{s.text}</Text>
        ) : (
          <Text
            key={i}
            accessibilityRole="link"
            accessibilityHint="Opens in your browser"
            onPress={() => Linking.openURL(s.url).catch(() => {})}
            style={{
              color: th.c.accent,
              textDecorationLine: "underline",
              fontFamily: th.font.sansMedium,
            }}
          >
            {s.text}
          </Text>
        )
      )}
    </Txt>
  );
}
