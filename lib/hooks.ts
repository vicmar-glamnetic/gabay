import { useLocalSearchParams } from "expo-router";
import React from "react";

import { parseAmount } from "./calc/money";
import { useAppStore } from "./store/useAppStore";

/** Live computation everywhere — there is no calculate button in this app. */
export function useDebounced<T>(value: T, ms = 180): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

/** A numeric field's string state plus its parsed value. */
export function useAmount(initial = "") {
  const [text, setText] = React.useState(initial);
  const debounced = useDebounced(text);
  return {
    text,
    setText,
    value: parseAmount(debounced),
    valueOr: (fallback: number) => parseAmount(debounced) ?? fallback,
  };
}

/** Records the screen in Recents, once, shortly after it settles. */
export function useRecent(href: string, title: string, subtitle?: string) {
  const push = useAppStore((s) => s.pushRecent);
  React.useEffect(() => {
    const id = setTimeout(() => push({ href, title, subtitle }), 600);
    return () => clearTimeout(id);
  }, [href, title, subtitle, push]);
}

/**
 * Restores a saved computation's inputs. Saved ledgers reopen on their own
 * screen with exactly what was typed, which is what makes saving worth doing.
 */
export function useRestoredInputs(): Record<string, string> {
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  return React.useMemo(() => {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (typeof v === "string") out[k] = v;
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);
}
