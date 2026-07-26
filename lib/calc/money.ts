/** Money helpers. No rates live here — only arithmetic and formatting. */

/** Round to centavos. Uses a scaled epsilon nudge so 1007.5499999 lands on 1007.55. */
export function round2(n: number): number {
  if (!Number.isFinite(n)) return 0;
  const scaled = n * 100;
  const rounded = Math.round(scaled + (scaled >= 0 ? 1e-6 : -1e-6));
  return rounded / 100;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/** Round to the nearest step, e.g. the SSS ₱500 salary-credit grid. */
export function roundToStep(n: number, step: number): number {
  return Math.round(n / step) * step;
}

/** Parses whatever a user typed into a numeric field. Blank stays undefined. */
export function parseAmount(input: string | number | undefined | null): number | undefined {
  if (input === undefined || input === null) return undefined;
  if (typeof input === "number") return Number.isFinite(input) ? input : undefined;
  const cleaned = input.replace(/[^0-9.\-]/g, "");
  if (cleaned === "" || cleaned === "." || cleaned === "-") return undefined;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

const pesoFormatter = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** "₱26,542.45". Negative amounts render as "−₱120.00" for the ledger. */
export function peso(n: number | undefined, opts?: { sign?: boolean }): string {
  if (n === undefined || !Number.isFinite(n)) return "—";
  const v = round2(n);
  const body = `₱${pesoFormatter.format(Math.abs(v))}`;
  if (v < 0) return `−${body}`;
  if (opts?.sign && v > 0) return `+${body}`;
  return body;
}

/**
 * For figures inside rule strings: counts of days, years, hours, and thresholds.
 * Drops a trailing ".0" and groups thousands.
 *
 * The zero-trimming must only apply AFTER a decimal point. Trimming blindly
 * turned `num(500, 0)` into "5", which rendered "rounded to the nearest ₱5" on
 * the SSS line and mangled every other round threshold in the app.
 */
export function num(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "0";
  const fixed = n.toFixed(digits);
  const trimmed = fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;
  const [whole, frac] = (trimmed || "0").split(".");
  const grouped = Number(whole).toLocaleString("en-PH");
  return frac ? `${grouped}.${frac}` : grouped;
}

export function pct(rate: number): string {
  return `${num(rate * 100, 4)}%`;
}
