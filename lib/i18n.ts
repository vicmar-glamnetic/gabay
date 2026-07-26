/**
 * Single-locale i18n shim.
 *
 * The Taglish toggle on the roadmap is a full language switch, not a partial
 * one, so every user-facing string that passes through the chrome goes through
 * `t()` now. Adding `tl` later means adding a catalogue, not touching screens.
 */

type Catalogue = Record<string, string>;

const en: Catalogue = {
  "app.wordmark": "Gabay",
  "app.tagline": "Sahod, benepisyo, at papeles sa isang lugar",

  "tab.home": "Home",
  "tab.kalkula": "Kalkula",
  "tab.papeles": "Papeles",
  "tab.karapatan": "Karapatan",
  "tab.ako": "Ako",

  "common.verify": "VERIFY",
  "common.source": "Source",
  "common.lastVerified": "Last verified",
  "common.save": "Save",
  "common.share": "Share",
  "common.close": "Close",
  "common.done": "Done",
  "common.search": "Search",
  "common.copied": "Copied",
};

export type Locale = "en";

let locale: Locale = "en";
const catalogues: Record<Locale, Catalogue> = { en };

export function setLocale(l: Locale) {
  locale = l;
}

export function t(key: string, fallback?: string): string {
  return catalogues[locale][key] ?? fallback ?? key;
}
