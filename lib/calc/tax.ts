import { PAY_FREQUENCY_LABEL, WITHHOLDING, type PayFrequency, type TaxBracket } from "../rates";
import { num, peso, pct, round2 } from "./money";
import type { LedgerLine } from "./types";

export type WithholdingResult = {
  tax: number;
  bracketIndex: number;
  bracket: TaxBracket;
  exempt: boolean;
  lines: LedgerLine[];
};

function bracketsFor(frequency: PayFrequency): TaxBracket[] {
  return WITHHOLDING.value[frequency];
}

/** The exemption threshold for a frequency — the top of bracket 1. */
export function exemptionThreshold(frequency: PayFrequency): number {
  return bracketsFor(frequency)[1].over;
}

/**
 * Withholding tax on one pay period's taxable compensation, using the published
 * BIR table for that frequency. Base amounts are transcribed, never derived.
 */
export function withholdingTax(
  taxableForPeriod: number,
  frequency: PayFrequency = "monthly"
): WithholdingResult {
  const brackets = bracketsFor(frequency);
  const taxable = Math.max(0, round2(taxableForPeriod));

  let index = 0;
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxable > brackets[i].over) {
      index = i;
      break;
    }
  }
  const bracket = brackets[index];
  const excess = round2(taxable - bracket.over);
  const tax = index === 0 ? 0 : round2(bracket.base + excess * bracket.rate);
  const freqLabel = PAY_FREQUENCY_LABEL[frequency].toLowerCase();

  const lines: LedgerLine[] =
    index === 0
      ? [
          {
            label: "Withholding tax",
            rule: `₱${num(exemptionThreshold(frequency), 0)} and below is exempt on the ${freqLabel} table · BIR RR 11-2018 Annex E`,
            amount: 0,
            negative: true,
          },
        ]
      : [
          {
            label: "Tax bracket",
            rule: `Over ₱${num(bracket.over, 0)} on the ${freqLabel} table · BIR RR 11-2018 Annex E`,
            raw: `Bracket ${index + 1} of ${brackets.length}`,
          },
          ...(bracket.base > 0
            ? [
                {
                  label: "Prescribed tax at ₱" + num(bracket.over, 0),
                  rule: "Fixed amount published for this bracket",
                  raw: peso(bracket.base),
                } as LedgerLine,
              ]
            : []),
          {
            label: `${pct(bracket.rate)} of the excess`,
            rule: `${peso(taxable)} − ₱${num(bracket.over, 0)} = ${peso(excess)}`,
            raw: peso(round2(excess * bracket.rate)),
          },
          {
            label: "Withholding tax",
            rule: `${bracket.base > 0 ? peso(bracket.base) + " + " : ""}${pct(
              bracket.rate
            )} over ₱${num(bracket.over, 0)}`,
            amount: tax,
            negative: true,
          },
        ];

  return { tax, bracketIndex: index, bracket, exempt: index === 0, lines };
}

/** Used by the haptics trigger: did a change move the user across a bracket? */
export function bracketOf(taxable: number, frequency: PayFrequency = "monthly"): number {
  return withholdingTax(taxable, frequency).bracketIndex;
}

/**
 * 13th month pay and other benefits are exempt up to ₱90,000 a year; the excess
 * is added to taxable compensation.
 */
export function thirteenthMonthTax(totalBenefits: number): {
  exempt: number;
  taxable: number;
  lines: LedgerLine[];
} {
  const ceiling = 90_000;
  const exempt = Math.min(totalBenefits, ceiling);
  const taxable = round2(Math.max(0, totalBenefits - ceiling));
  return {
    exempt,
    taxable,
    lines: [
      {
        label: "Tax-exempt portion",
        rule: "13th month pay and other benefits, up to ₱90,000 a year · NIRC Sec. 32(B)(7)(e) as amended by TRAIN",
        amount: exempt,
      },
      ...(taxable > 0
        ? [
            {
              label: "Taxable excess",
              rule: "Amount above the ₱90,000 ceiling, added to taxable compensation",
              amount: taxable,
              negative: true,
            } as LedgerLine,
          ]
        : []),
    ],
  };
}
