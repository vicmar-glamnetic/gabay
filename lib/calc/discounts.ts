import { DISCOUNTS } from "../rates";
import { num, peso, round2 } from "./money";
import type { CalcResult } from "./types";

export type DiscountKind = "senior" | "pwd" | "solo-parent";

export type DiscountInput = {
  /** The price on the menu or shelf, which normally already includes VAT. */
  postedPrice: number;
  kind: DiscountKind;
  /** Some sellers post VAT-exclusive prices. */
  priceIncludesVat?: boolean;
};

export type DiscountFigures = {
  vatExclusivePrice: number;
  discount: number;
  vatSaved: number;
  amountDue: number;
  totalSaved: number;
};

const RATE_BY_KIND: Record<DiscountKind, { rate: number; label: string; law: string; vatExempt: boolean }> = {
  senior: {
    rate: DISCOUNTS.value.seniorDiscountRate,
    label: "Senior citizen",
    law: "RA 9994, the Expanded Senior Citizens Act",
    vatExempt: true,
  },
  pwd: {
    rate: DISCOUNTS.value.pwdDiscountRate,
    label: "Person with disability",
    law: "RA 10754 amending RA 7277",
    vatExempt: true,
  },
  "solo-parent": {
    rate: DISCOUNTS.value.soloParentDiscountRate,
    label: "Solo parent",
    law: "RA 11861, the Expanded Solo Parents Welfare Act",
    vatExempt: true,
  },
};

/**
 * The point of this calculator is the VAT treatment. The discount is computed
 * on the VAT-exclusive price and the sale is VAT exempt — being charged 12% VAT
 * on top of a 20% discount is one of the most common retail errors in the country.
 */
export function computeDiscount(input: DiscountInput): CalcResult<DiscountFigures> {
  const r = DISCOUNTS.value;
  const cfg = RATE_BY_KIND[input.kind];
  const posted = Math.max(0, input.postedPrice || 0);
  const includesVat = input.priceIncludesVat ?? true;

  const vatExclusive = includesVat ? round2(posted / (1 + r.vatRate)) : round2(posted);
  const discount = round2(vatExclusive * cfg.rate);
  const amountDue = round2(vatExclusive - discount);
  const vatSaved = includesVat ? round2(posted - vatExclusive) : 0;
  const totalSaved = round2(posted - amountDue);

  return {
    headline: {
      label: "You should pay",
      amount: amountDue,
      rule: `${cfg.label} · ${cfg.law}`,
    },
    sections: [
      {
        title: "How the discount is computed",
        subtitle: cfg.law,
        lines: [
          { label: "Posted price", rule: includesVat ? "As displayed, VAT inclusive" : "As displayed, VAT exclusive", amount: posted },
          ...(includesVat
            ? [
                {
                  label: "Remove VAT first",
                  rule: `${peso(posted)} ÷ 1.${num(r.vatRate * 100, 0)} — the sale is VAT exempt, so VAT comes off before anything else`,
                  amount: vatExclusive,
                },
              ]
            : []),
          {
            label: `${num(cfg.rate * 100, 0)}% discount`,
            rule: `${num(cfg.rate * 100, 0)}% of the VAT-exclusive price · ${cfg.law}`,
            amount: discount,
            negative: true,
          },
          {
            label: "Amount due",
            rule: "This is the figure that should appear on the receipt",
            amount: amountDue,
            strong: true,
          },
        ],
      },
      {
        title: "What you saved",
        lines: [
          ...(vatSaved > 0
            ? [{ label: "VAT exemption", rule: `${num(r.vatRate * 100, 0)}% VAT removed`, amount: vatSaved }]
            : []),
          { label: "Discount", amount: discount },
          { label: "Total off the posted price", amount: totalSaved, strong: true },
        ],
      },
    ],
    figures: { vatExclusivePrice: vatExclusive, discount, vatSaved, amountDue, totalSaved },
    notes: [
      "If the receipt shows the discount taken off first and 12% VAT added back on top, the computation is wrong. The sale is VAT exempt.",
      "Present the ID at the point of order, not after the bill is printed. Establishments are entitled to ask for the card or ID and to record its number.",
      "For restaurant group bills the discount covers the senior's or PWD's share, computed as the total divided by the number of diners.",
      input.kind === "solo-parent"
        ? `The solo parent 10% discount applies to a solo parent earning below ₱${num(r.soloParentIncomeCeiling, 0)} a year, on baby's milk, food supplements, micronutrient supplements, medicines, vaccines and other medical supplements for a child up to six years old · RA 11861.`
        : "",
    ].filter(Boolean),
  };
}
