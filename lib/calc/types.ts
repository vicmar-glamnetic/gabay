/**
 * Shared shapes for the calculation layer.
 *
 * Nothing in lib/calc imports React, React Native, or any platform API. These
 * functions run unchanged in the mobile app, the web build, the unit tests, and
 * (later) the batch payroll worker.
 */

export type LedgerLine = {
  label: string;
  /** The legal or arithmetic basis, rendered in small mono under the label. */
  rule?: string;
  amount?: number;
  /** For non-peso values like "6 years" or "22.5 days". */
  raw?: string;
  /** Renders bold, above a double rule. Use for totals. */
  strong?: boolean;
  /** Renders in stamp red with a leading minus. Use for deductions. */
  negative?: boolean;
  /** Renders as a muted aside with no leader dots. */
  note?: boolean;
};

export type LedgerSection = {
  title: string;
  subtitle?: string;
  lines: LedgerLine[];
};

/** Every calculator returns this shape so the screens can stay dumb. */
export type CalcResult<T> = {
  /** The one number the sticky bar shows. */
  headline: { label: string; amount: number; rule?: string };
  sections: LedgerSection[];
  /** Machine-readable figures for tests, saving, and downstream calculators. */
  figures: T;
  /** Caveats rendered under the ledger, in order. */
  notes: string[];
};

export const line = (l: LedgerLine): LedgerLine => l;
