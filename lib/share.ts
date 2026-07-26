import * as Haptics from "expo-haptics";
import { Platform, Share } from "react-native";

import { ledgerToText } from "./calc/format";
import type { CalcResult } from "./calc/types";

type WebNavigator = {
  share?: (data: { title?: string; text?: string }) => Promise<void>;
  clipboard?: { writeText: (text: string) => Promise<void> };
};

/**
 * The shared artifact is how the app spreads, so it has to look good on its
 * own: a formatted ledger, the rule strings intact, and the disclaimer.
 */
export async function shareResult<T>(
  result: CalcResult<T>,
  title: string
): Promise<void> {
  const message = ledgerToText({
    title,
    headline: result.headline,
    sections: result.sections,
    notes: result.notes.slice(0, 3),
  });

  try {
    if (Platform.OS === "web") {
      const nav = (globalThis as { navigator?: WebNavigator }).navigator;
      if (nav?.share) {
        await nav.share({ title, text: message });
      } else if (nav?.clipboard) {
        await nav.clipboard.writeText(message);
      }
      return;
    }
    await Share.share({ message, title });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    /* the user dismissed the sheet */
  }
}

/**
 * Captures a view as a PNG and hands it to the native share sheet, so the
 * ledger travels as an image too. Falls back to text sharing when capture or
 * sharing is unavailable (notably on web).
 */
export async function shareLedgerImage(
  viewRef: React.RefObject<unknown>,
  fallback: () => Promise<void>
): Promise<void> {
  if (Platform.OS === "web" || !viewRef.current) return fallback();
  try {
    const { captureRef } = require("react-native-view-shot") as typeof import("react-native-view-shot");
    const Sharing = require("expo-sharing") as typeof import("expo-sharing");
    if (!(await Sharing.isAvailableAsync())) return fallback();
    const uri = await captureRef(viewRef as never, {
      format: "png",
      quality: 1,
      result: "tmpfile",
    });
    await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: "Share ledger" });
  } catch {
    return fallback();
  }
}
