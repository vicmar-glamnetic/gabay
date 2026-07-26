import { RETIREMENT } from "../rates";
import { num, peso, round2 } from "./money";
import type { CalcResult, LedgerLine } from "./types";

export type RetirementInput = {
  /** Whether the pay entered is a daily rate or a monthly salary. */
  basis: "daily" | "monthly";
  pay: number;
  years: number;
  months?: number;
  /** Age at retirement, used only to flag eligibility. */
  age?: number;
  /** Whether the company has a retirement plan at least as good as RA 7641. */
  hasCompanyPlan?: boolean;
};

export type RetirementFigures = {
  dailyRate: number;
  creditedYears: number;
  halfMonthDays: number;
  halfMonthValue: number;
  retirementPay: number;
  eligible: boolean;
};

export function computeRetirementPay(
  input: RetirementInput
): CalcResult<RetirementFigures> {
  const r = RETIREMENT.value;
  const pay = Math.max(0, input.pay || 0);
  const dailyRate =
    input.basis === "daily" ? round2(pay) : round2(pay / r.daysPerMonthDivisor);
  const months = Math.max(0, input.months ?? 0);
  const credited =
    Math.max(0, Math.floor(input.years)) + (months >= r.fractionCountsAsYearFrom ? 1 : 0);

  const halfMonthValue = round2(dailyRate * r.halfMonthDays);
  const retirementPay = round2(halfMonthValue * credited);

  const ageOk =
    input.age === undefined ||
    (input.age >= r.optionalRetirementAge && input.age <= r.compulsoryRetirementAge);
  const serviceOk = input.years + months / 12 >= r.minimumYearsOfService;
  const eligible = ageOk && serviceOk;

  const componentLines: LedgerLine[] = r.components.map((c) => ({
    label: c.label,
    rule: c.rule,
    raw: `${num(c.days, 2)} day${c.days === 1 ? "" : "s"}`,
  }));

  return {
    headline: {
      label: "Retirement pay",
      amount: retirementPay,
      rule: `${num(r.halfMonthDays, 2)} days × ${num(credited, 0)} years`,
    },
    sections: [
      {
        title: "Eligibility",
        subtitle: "RA 7641, where no retirement plan exists",
        lines: [
          {
            label: "Age",
            rule: `${r.optionalRetirementAge} to ${r.compulsoryRetirementAge} · Art. 302`,
            raw: input.age === undefined ? "Not entered" : `${num(input.age, 0)} years old`,
          },
          {
            label: "Years of service",
            rule: `At least ${r.minimumYearsOfService} years with the same employer`,
            raw: `${num(input.years, 0)} year${input.years === 1 ? "" : "s"}${
              months ? ` ${num(months, 0)} month${months === 1 ? "" : "s"}` : ""
            }`,
          },
          {
            label: eligible ? "Meets the RA 7641 conditions" : "Does not meet the RA 7641 conditions as entered",
            rule: eligible
              ? "The statutory minimum below applies"
              : serviceOk
                ? "Age is outside the 60–65 range"
                : `Fewer than ${r.minimumYearsOfService} years of service`,
            note: true,
          },
        ],
      },
      {
        title: "Where 22.5 days comes from",
        subtitle: "The part almost nobody is shown",
        lines: [
          ...componentLines,
          {
            label: "One half month salary",
            rule: "The law defines it as this sum, not as 15 days · Art. 302",
            raw: `${num(r.halfMonthDays, 2)} days`,
            strong: true,
          },
        ],
      },
      {
        title: "Computation",
        lines: [
          {
            label: "Daily rate",
            rule:
              input.basis === "daily"
                ? "As entered"
                : `${peso(pay)} monthly ÷ ${r.daysPerMonthDivisor} days — a payroll convention, not a statutory divisor`,
            amount: dailyRate,
          },
          {
            label: "Value of one half month salary",
            rule: `${peso(dailyRate)} × ${num(r.halfMonthDays, 2)} days`,
            amount: halfMonthValue,
          },
          {
            label: "Years credited",
            rule: `A fraction of at least ${r.fractionCountsAsYearFrom} months counts as one whole year`,
            raw: `${num(credited, 0)} year${credited === 1 ? "" : "s"}`,
          },
          {
            label: "Retirement pay",
            rule: `${peso(halfMonthValue)} × ${num(credited, 0)} years · RA 7641`,
            amount: retirementPay,
            strong: true,
          },
        ],
      },
    ],
    figures: {
      dailyRate,
      creditedYears: credited,
      halfMonthDays: r.halfMonthDays,
      halfMonthValue,
      retirementPay,
      eligible,
    },
    notes: [
      "This is the statutory minimum. A company retirement plan, CBA or established practice more favourable than RA 7641 governs instead, and this figure does not apply.",
      "Retirement benefits under a BIR-registered plan, for an employee aged at least 50 with 10 years of service, are exempt from income tax. Benefits under RA 7641 for an employee aged at least 60 with 5 years of service are likewise exempt.",
      input.basis === "monthly"
        ? "Different employers use 26, 313/12 or 365/12 to convert a monthly salary to a daily rate. Ask which divisor your company uses, because it changes the total."
        : "",
    ].filter(Boolean),
  };
}
