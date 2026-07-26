import { THIRTEENTH_MONTH } from "../rates";
import { num, peso, round2 } from "./money";
import { thirteenthMonthTax } from "./tax";
import type { CalcResult, LedgerLine } from "./types";

export type ThirteenthMode = "salary" | "total";

export type ThirteenthInput = {
  mode: ThirteenthMode;
  /** mode "salary": monthly basic salary. */
  monthlySalary?: number;
  /** mode "salary": months actually worked in the calendar year, 0–12. */
  monthsWorked?: number;
  /** mode "total": total basic salary actually earned during the year. */
  totalBasicEarned?: number;
  /** Peso value of unpaid absences and other deductions from basic salary. */
  unpaidAbsences?: number;
  /** Other 13th month / bonus amounts already received, for the ₱90,000 test. */
  otherBenefits?: number;
};

export type ThirteenthFigures = {
  basicEarned: number;
  thirteenthMonth: number;
  taxExempt: number;
  taxableExcess: number;
};

export function computeThirteenthMonth(
  input: ThirteenthInput
): CalcResult<ThirteenthFigures> {
  const r = THIRTEENTH_MONTH.value;
  const unpaid = Math.max(0, input.unpaidAbsences ?? 0);

  const gross =
    input.mode === "salary"
      ? round2(Math.max(0, input.monthlySalary ?? 0) * Math.max(0, Math.min(12, input.monthsWorked ?? 12)))
      : round2(Math.max(0, input.totalBasicEarned ?? 0));

  const basicEarned = round2(Math.max(0, gross - unpaid));
  const thirteenth = round2(basicEarned / r.divisor);

  const benefits = round2(thirteenth + Math.max(0, input.otherBenefits ?? 0));
  const tax = thirteenthMonthTax(benefits);

  const inputLines: LedgerLine[] =
    input.mode === "salary"
      ? [
          { label: "Monthly basic salary", rule: "As entered", amount: input.monthlySalary ?? 0 },
          {
            label: "Months worked this year",
            rule: "Only months actually worked count",
            raw: `${num(input.monthsWorked ?? 12, 2)} months`,
          },
          {
            label: "Basic salary earned",
            rule: `${peso(input.monthlySalary ?? 0)} × ${num(input.monthsWorked ?? 12, 2)} months`,
            amount: gross,
          },
        ]
      : [
          {
            label: "Total basic salary earned",
            rule: "Basic pay only — overtime, holiday premium, allowances and bonuses are excluded",
            amount: gross,
          },
        ];

  if (unpaid > 0) {
    inputLines.push({
      label: "Less unpaid absences",
      rule: "Days without pay do not form part of basic salary earned",
      amount: unpaid,
      negative: true,
    });
  }

  return {
    headline: {
      label: "13th month pay",
      amount: thirteenth,
      rule: `${peso(basicEarned)} ÷ ${r.divisor}`,
    },
    sections: [
      { title: "Basic salary earned", lines: inputLines },
      {
        title: "13th month pay",
        subtitle: "PD 851",
        lines: [
          {
            label: "Basic salary earned for the year",
            rule: "After unpaid absences",
            amount: basicEarned,
          },
          {
            label: "Divide by 12",
            rule: "Total basic salary earned ÷ 12 · PD 851",
            raw: `÷ ${r.divisor}`,
          },
          {
            label: "13th month pay",
            rule: `Payable on or before ${r.deadline}`,
            amount: thirteenth,
            strong: true,
          },
        ],
      },
      {
        title: "Tax treatment",
        subtitle: "13th month pay and other benefits",
        lines: [
          ...(input.otherBenefits
            ? [
                {
                  label: "Other benefits already received",
                  rule: "Bonuses and other benefits count toward the same ceiling",
                  amount: input.otherBenefits,
                } as LedgerLine,
                { label: "Total benefits for the year", amount: benefits, strong: true },
              ]
            : []),
          ...tax.lines,
        ],
      },
    ],
    figures: {
      basicEarned,
      thirteenthMonth: thirteenth,
      taxExempt: tax.exempt,
      taxableExcess: tax.taxable,
    },
    notes: [
      "13th month pay is a legal entitlement, not a bonus. Every rank-and-file employee who worked at least one month in the calendar year gets it, pro-rated.",
      "Overtime, holiday premium, night differential, allowances and cash conversions of leave are excluded from basic salary earned unless the company treats them as part of basic pay.",
      "Employees who resigned or were separated during the year are still entitled to the pro-rated amount.",
    ],
  };
}
