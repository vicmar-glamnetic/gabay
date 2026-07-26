import { SEPARATION, type SeparationGroundId } from "../rates";
import { num, peso, round2 } from "./money";
import type { CalcResult } from "./types";

export type SeparationInput = {
  monthlyPay: number;
  years: number;
  /** Additional months beyond the whole years. */
  months?: number;
  ground: SeparationGroundId;
};

export type SeparationFigures = {
  creditedYears: number;
  monthsPerYear: number;
  computed: number;
  statutoryFloor: number;
  separationPay: number;
  floorApplied: boolean;
};

export function creditedYearsOfService(years: number, months = 0): number {
  const whole = Math.max(0, Math.floor(years));
  const extra = Math.max(0, months);
  return whole + (extra >= SEPARATION.value.fractionCountsAsYearFrom ? 1 : 0);
}

export function computeSeparationPay(
  input: SeparationInput
): CalcResult<SeparationFigures> {
  const r = SEPARATION.value;
  const ground = r.grounds.find((g) => g.id === input.ground) ?? r.grounds[0];
  const pay = Math.max(0, input.monthlyPay || 0);
  const months = Math.max(0, input.months ?? 0);
  const credited = creditedYearsOfService(input.years, months);

  const computed = round2(pay * ground.monthsPerYear * credited);
  const floor = round2(pay * r.minimumMonths);
  const separationPay = Math.max(computed, floor);
  const floorApplied = floor > computed;

  return {
    headline: {
      label: "Separation pay",
      amount: separationPay,
      rule: ground.label,
    },
    sections: [
      {
        title: "Service credited",
        lines: [
          {
            label: "Length of service",
            rule: "As entered",
            raw: `${num(input.years, 0)} year${input.years === 1 ? "" : "s"}${
              months ? ` ${num(months, 0)} month${months === 1 ? "" : "s"}` : ""
            }`,
          },
          {
            label: "Fraction of a year",
            rule: `A fraction of at least ${r.fractionCountsAsYearFrom} months counts as one whole year · Art. 298`,
            raw:
              months >= r.fractionCountsAsYearFrom
                ? `${num(months, 0)} months rounds up to a full year`
                : months > 0
                  ? `${num(months, 0)} months does not round up`
                  : "None",
          },
          {
            label: "Years credited",
            rule: "Used as the multiplier below",
            raw: `${num(credited, 0)} year${credited === 1 ? "" : "s"}`,
            strong: true,
          },
        ],
      },
      {
        title: "Computation",
        subtitle: ground.label,
        lines: [
          { label: "Monthly pay", rule: "As entered", amount: pay },
          {
            label: "Rate for this ground",
            rule: ground.basis,
            raw: `${ground.monthsPerYear === 1 ? "1" : "½"} month per year`,
          },
          {
            label: "Computed separation pay",
            rule: `${peso(pay)} × ${ground.monthsPerYear === 1 ? "1" : "0.5"} × ${num(
              credited,
              0
            )} years`,
            amount: computed,
          },
          {
            label: "Statutory floor",
            rule: "At least one month pay · Art. 298",
            amount: floor,
          },
          {
            label: "Separation pay",
            rule: floorApplied
              ? "The one-month floor is higher, so it applies"
              : "The computed amount is higher, so it applies",
            amount: separationPay,
            strong: true,
          },
        ],
      },
    ],
    figures: {
      creditedYears: credited,
      monthsPerYear: ground.monthsPerYear,
      computed,
      statutoryFloor: floor,
      separationPay,
      floorApplied,
    },
    notes: [
      "Separation pay is due for authorised causes under Arts. 298 and 299. Dismissal for a just cause under Art. 297 — serious misconduct, gross neglect, fraud and the like — carries no separation pay.",
      "A company policy, CBA or established practice more generous than the statutory rate governs instead.",
      "Resignation carries no separation pay unless a company policy, CBA or practice provides for it.",
      "Separation pay for redundancy, retrenchment, closure or disease is exempt from income tax.",
    ],
  };
}
