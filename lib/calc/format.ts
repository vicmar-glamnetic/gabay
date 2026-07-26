import { peso } from "./money";
import type { LedgerSection } from "./types";

/**
 * Renders a ledger as plain text for the share sheet. Lives in the calc layer
 * because it is pure string work — the shared artifact has to look good on its
 * own, and it must not depend on anything that only exists in the app.
 */
export function ledgerToText(opts: {
  title: string;
  headline: { label: string; amount: number };
  sections: LedgerSection[];
  notes?: string[];
}): string {
  const width = 42;
  const rows: string[] = [];
  rows.push(opts.title.toUpperCase());
  rows.push("=".repeat(width));
  rows.push(`${opts.headline.label}: ${peso(opts.headline.amount)}`);
  rows.push("");

  for (const s of opts.sections) {
    rows.push(s.title.toUpperCase());
    if (s.subtitle) rows.push(s.subtitle);
    rows.push("-".repeat(width));
    for (const l of s.lines) {
      const value =
        l.raw ??
        (l.amount !== undefined
          ? l.negative && l.amount > 0
            ? `-${peso(l.amount)}`
            : peso(l.amount)
          : "");
      const label = l.label.slice(0, Math.max(4, width - value.length - 2));
      const dots = ".".repeat(Math.max(2, width - label.length - value.length));
      rows.push(`${label}${dots}${value}`);
      if (l.rule) rows.push(`  ${l.rule}`);
    }
    rows.push("");
  }

  if (opts.notes?.length) {
    rows.push("NOTES");
    rows.push("-".repeat(width));
    for (const n of opts.notes) rows.push(`• ${n}`);
    rows.push("");
  }

  rows.push("Computed with Gabay — Sahod, benepisyo, at papeles sa isang lugar.");
  rows.push(
    "Estimates for checking a payslip or planning payroll, not legal or tax advice."
  );
  return rows.join("\n");
}
