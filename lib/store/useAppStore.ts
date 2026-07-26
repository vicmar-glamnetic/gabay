import { create } from "zustand";

import { RATES_VERSION } from "../rates";
import { KEYS, storage } from "./storage";

export type Role = "empleyado" | "hr" | "freelancer" | "ofw";

export const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "empleyado", label: "Empleyado", hint: "Checking a payslip, leave, or wage" },
  { id: "hr", label: "HR or negosyo", hint: "Running payroll for other people" },
  { id: "freelancer", label: "Freelancer", hint: "Self-paying contributions and tax" },
  { id: "ofw", label: "OFW", hint: "Agency checks, OEC, contributions from abroad" },
];

export type RecentItem = {
  href: string;
  title: string;
  subtitle?: string;
  at: number;
};

export type SavedComputation = {
  id: string;
  name: string;
  /** Which calculator, so it reopens on the right screen. */
  kind: string;
  href: string;
  /** The raw inputs, so reopening restores exactly what was typed. */
  inputs: Record<string, unknown>;
  /** Headline figure at the time of saving, for the list. */
  headline: { label: string; amount: number };
  at: number;
};

/**
 * Ticked "what to bring" items, keyed by transaction id. Stored as the item
 * text rather than an index so editing the dataset cannot silently shift
 * somebody's ticks onto the wrong line. Gathering documents takes days, so this
 * has to survive closing the app.
 */
export type Checklists = Record<string, string[]>;

export type NotificationPrefs = {
  enabled: boolean;
  holidays: boolean;
  deadlines: boolean;
  thirteenthMonth: boolean;
  rateChanges: boolean;
};

export const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  enabled: false,
  holidays: true,
  deadlines: false,
  thirteenthMonth: true,
  rateChanges: true,
};

type AppState = {
  hydrated: boolean;
  onboarded: boolean;
  roles: Role[];
  recents: RecentItem[];
  saved: SavedComputation[];
  notifications: NotificationPrefs;
  lastSeenRates: string | null;
  themePreference: "system" | "light" | "dark";
  checklists: Checklists;

  hydrate: () => void;
  toggleChecklistItem: (transactionId: string, item: string) => void;
  resetChecklist: (transactionId: string) => void;
  setRoles: (roles: Role[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  pushRecent: (item: Omit<RecentItem, "at">) => void;
  clearRecents: () => void;
  saveComputation: (c: Omit<SavedComputation, "id" | "at">) => SavedComputation;
  renameComputation: (id: string, name: string) => void;
  deleteComputation: (id: string) => void;
  setNotifications: (p: Partial<NotificationPrefs>) => void;
  acknowledgeRates: () => void;
  setThemePreference: (p: "system" | "light" | "dark") => void;
};

const MAX_RECENTS = 8;

export const useAppStore = create<AppState>((set, get) => ({
  hydrated: false,
  onboarded: false,
  roles: [],
  recents: [],
  saved: [],
  notifications: DEFAULT_NOTIFICATIONS,
  lastSeenRates: null,
  themePreference: "system",
  checklists: {},

  hydrate: () => {
    // Calculators moved from /calc/* into the Kalkula tab at /kalkula/* so the
    // bottom bar would survive a push. Repoint anything saved before that.
    const repoint = <T extends { href: string }>(items: T[]): T[] =>
      items.map((i) =>
        i.href.startsWith("/calc/")
          ? { ...i, href: i.href.replace("/calc/", "/kalkula/") }
          : i
      );
    const recents = repoint(storage.get<RecentItem[]>(KEYS.recents, []));
    const saved = repoint(storage.get<SavedComputation[]>(KEYS.saved, []));
    storage.set(KEYS.recents, recents);
    storage.set(KEYS.saved, saved);

    set({
      hydrated: true,
      onboarded: storage.get(KEYS.onboarded, false),
      roles: storage.get<Role[]>(KEYS.roles, []),
      recents,
      saved,
      notifications: storage.get<NotificationPrefs>(KEYS.notifications, DEFAULT_NOTIFICATIONS),
      lastSeenRates: storage.get<string | null>(KEYS.lastSeenRates, null),
      themePreference: storage.get<"system" | "light" | "dark">(KEYS.theme, "system"),
      checklists: storage.get<Checklists>(KEYS.checklists, {}),
    });
  },

  toggleChecklistItem: (transactionId, item) => {
    const current = get().checklists[transactionId] ?? [];
    const next = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    const all = { ...get().checklists, [transactionId]: next };
    storage.set(KEYS.checklists, all);
    set({ checklists: all });
  },

  resetChecklist: (transactionId) => {
    const all = { ...get().checklists, [transactionId]: [] };
    storage.set(KEYS.checklists, all);
    set({ checklists: all });
  },

  setRoles: (roles) => {
    storage.set(KEYS.roles, roles);
    set({ roles });
  },

  completeOnboarding: () => {
    storage.set(KEYS.onboarded, true);
    storage.set(KEYS.lastSeenRates, RATES_VERSION);
    set({ onboarded: true, lastSeenRates: RATES_VERSION });
  },

  resetOnboarding: () => {
    storage.set(KEYS.onboarded, false);
    set({ onboarded: false });
  },

  pushRecent: (item) => {
    const next = [
      { ...item, at: Date.now() },
      ...get().recents.filter((r) => r.href !== item.href),
    ].slice(0, MAX_RECENTS);
    storage.set(KEYS.recents, next);
    set({ recents: next });
  },

  clearRecents: () => {
    storage.set(KEYS.recents, []);
    set({ recents: [] });
  },

  saveComputation: (c) => {
    const entry: SavedComputation = {
      ...c,
      id: `${c.kind}-${Date.now().toString(36)}`,
      at: Date.now(),
    };
    const next = [entry, ...get().saved];
    storage.set(KEYS.saved, next);
    set({ saved: next });
    return entry;
  },

  renameComputation: (id, name) => {
    const next = get().saved.map((s) => (s.id === id ? { ...s, name } : s));
    storage.set(KEYS.saved, next);
    set({ saved: next });
  },

  deleteComputation: (id) => {
    const next = get().saved.filter((s) => s.id !== id);
    storage.set(KEYS.saved, next);
    set({ saved: next });
  },

  setNotifications: (p) => {
    const next = { ...get().notifications, ...p };
    storage.set(KEYS.notifications, next);
    set({ notifications: next });
  },

  acknowledgeRates: () => {
    storage.set(KEYS.lastSeenRates, RATES_VERSION);
    set({ lastSeenRates: RATES_VERSION });
  },

  setThemePreference: (p) => {
    storage.set(KEYS.theme, p);
    set({ themePreference: p });
  },
}));

/** True when the statutory schedules changed since the user last opened the app. */
export function useRatesChanged(): boolean {
  return useAppStore((s) => s.hydrated && s.onboarded && s.lastSeenRates !== RATES_VERSION);
}
