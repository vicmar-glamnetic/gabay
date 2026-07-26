import { Platform } from "react-native";

/**
 * Everything Gabay stores stays on the device. MMKV on native, localStorage on
 * web, an in-memory map when neither exists (SSR during the static web export).
 * Nothing here ever leaves the phone.
 */

type KV = {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
};

function makeMemory(): KV {
  const m = new Map<string, string>();
  return {
    getString: (k) => m.get(k),
    set: (k, v) => void m.set(k, v),
    delete: (k) => void m.delete(k),
  };
}

function makeWeb(): KV {
  if (typeof localStorage === "undefined") return makeMemory();
  return {
    getString: (k) => localStorage.getItem(k) ?? undefined,
    set: (k, v) => localStorage.setItem(k, v),
    delete: (k) => localStorage.removeItem(k),
  };
}

function makeNative(): KV {
  try {
    // Required lazily so the web bundle never pulls the native module in.
    const { createMMKV } = require("react-native-mmkv") as typeof import("react-native-mmkv");
    const mmkv = createMMKV({ id: "gabay" });
    return {
      getString: (k) => mmkv.getString(k),
      set: (k, v) => mmkv.set(k, v),
      delete: (k) => void mmkv.remove(k),
    };
  } catch {
    return makeMemory();
  }
}

const kv: KV = Platform.OS === "web" ? makeWeb() : makeNative();

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = kv.getString(key);
      if (raw === undefined) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown): void {
    try {
      kv.set(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — the app still works, it just forgets */
    }
  },
  remove(key: string): void {
    try {
      kv.delete(key);
    } catch {
      /* ignore */
    }
  },
};

export const KEYS = {
  roles: "gabay.roles",
  onboarded: "gabay.onboarded",
  saved: "gabay.saved",
  recents: "gabay.recents",
  notifications: "gabay.notifications",
  lastSeenRates: "gabay.lastSeenRates",
  theme: "gabay.theme",
  checklists: "gabay.checklists",
} as const;
