import {
  PAY_FREQUENCY_LABEL,
  PERIOD_CONVENTION,
  type PayFrequency,
} from "../rates";
import { monthlyContributions, type PhilHealthPayer } from "./contributions";
import { num, peso, round2 } from "./money";
import { withholdingTax } from "./tax";
import type { CalcResult, LedgerLine, LedgerSection } from "./types";

/**
 * Whether the monthly contributions are spread evenly across the cutoffs in the
 * month, or taken in full on one cutoff. Companies do both, so it is a choice
 * and the ledger states which convention is in effect.
 */
export type ContributionTiming = "spread" | "single";

export type NetPayInput = {
  /** Monthly basic salary, regardless of how often the employee is paid. */
  monthlyBasic: number;
  frequency: PayFrequency;
  /** Non-taxable allowance for one pay period (de minimis, allowances). */
  nonTaxableAllowance?: number;
  contributionTiming?: ContributionTiming;
  philHealthPayer?: PhilHealthPayer;
};

export type NetPayFigures = {
  frequency: PayFrequency;
  periodsPerMonth: number;
  /** Basic pay for one period. */
  periodGross: number;
  allowance: number;
  sss: number;
  philhealth: number;
  pagibig: number;
  contributionsTotal: number;
  taxable: number;
  tax: number;
  taxBracketIndex: number;
  net: number;
  /** Monthly-equivalent figures, useful when the frequency is not monthly. */
  monthly: {
    gross: number;
    sss: number;
    philhealth: number;
    pagibig: number;
    contributionsTotal: number;
    tax: number;
    net: number;
  };
  employer: {
    sss: number;
    philhealth: number;
    pagibig: number;
    ec: number;
    contributionsTotal: number;
    totalMonthlyCost: number;
  };
};

export function periodsPerMonth(frequency: PayFrequency): number {
  return PERIOD_CONVENTION.value.periodsPerMonth[frequency];
}

export function computeNetPay(input: NetPayInput): CalcResult<NetPayFigures> {
  const {
    monthlyBasic,
    frequency,
    nonTaxableAllowance = 0,
    contributionTiming = "spread",
    philHealthPayer = "employed",
  } = input;

  const basic = Math.max(0, monthlyBasic || 0);
  const periods = periodsPerMonth(frequency);
  const c = monthlyContributions(basic, philHealthPayer);

  const periodGross = round2(basic / periods);
  const divisor = contributionTiming === "spread" ? periods : 1;
  const sss = round2(c.sss.employee / divisor);
  const philhealth = round2(c.philhealth.employee / divisor);
  const pagibig = round2(c.pagibig.employee / divisor);
  const contributionsTotal = round2(sss + philhealth + pagibig);

  const taxable = round2(periodGross - contributionsTotal);
  const wt = withholdingTax(taxable, frequency);
  const allowance = Math.max(0, nonTaxableAllowance || 0);
  const net = round2(periodGross + allowance - contributionsTotal - wt.tax);

  const ec = c.sss.employerExtras?.[0]?.amount ?? 0;
  const employerTotalMonthly = round2(basic + c.employerTotal + ec);

  const timingRule =
    periods === 1
      ? "Monthly payroll, so the full monthly contribution is taken once."
      : contributionTiming === "spread"
        ? `Monthly contributions divided evenly across ${num(periods, 2)} cutoffs a month.`
        : "Full monthly contribution taken on this cutoff; the other cutoffs deduct nothing.";

  const periodLabel = PAY_FREQUENCY_LABEL[frequency];

  const sections: LedgerSection[] = [
    {
      title: "Gross pay",
      subtitle: periodLabel,
      lines: [
        {
          label: "Monthly basic salary",
          rule: "As entered",
          amount: basic,
        },
        ...(periods !== 1
          ? [
              {
                label: `Basic pay this ${frequency === "daily" ? "day" : "cutoff"}`,
                rule:
                  frequency === "semi-monthly"
                    ? "Monthly basic ÷ 2"
                    : frequency === "weekly"
                      ? `Monthly basic × 12 ÷ ${PERIOD_CONVENTION.value.weeksPerYear} weeks`
                      : `Monthly basic × 12 ÷ ${PERIOD_CONVENTION.value.daysPerYear} days`,
                amount: periodGross,
                strong: true,
              } as LedgerLine,
            ]
          : []),
        ...(allowance > 0
          ? [
              {
                label: "Non-taxable allowance",
                rule: "De minimis and allowances, excluded from the tax base",
                amount: allowance,
              } as LedgerLine,
            ]
          : []),
      ],
    },
    {
      title: "Mandatory contributions",
      subtitle: timingRule,
      lines: [
        ...c.sss.lines.filter((l) => l.label.includes("Monthly salary credit")),
        {
          label: "SSS",
          rule: c.sss.lines.find((l) => l.label.includes("employee share"))?.rule,
          amount: sss,
          negative: true,
        },
        {
          label: "PhilHealth",
          rule: c.philhealth.lines.find((l) => l.label.includes("employee"))?.rule,
          amount: philhealth,
          negative: true,
        },
        {
          label: "Pag-IBIG",
          rule: c.pagibig.lines.find((l) => l.label.includes("employee share"))?.rule,
          amount: pagibig,
          negative: true,
        },
        {
          label: "Total contributions",
          rule: "SSS + PhilHealth + Pag-IBIG, employee shares",
          amount: contributionsTotal,
          negative: true,
          strong: true,
        },
      ],
    },
    {
      title: "Withholding tax",
      subtitle: `${periodLabel} BIR table`,
      lines: [
        {
          label: "Taxable compensation",
          rule: "Basic pay less the three employee contribution shares",
          amount: taxable,
          strong: true,
        },
        ...wt.lines,
      ],
    },
    {
      title: "Net pay",
      subtitle: `Take-home, ${periodLabel.toLowerCase()}`,
      lines: [
        { label: "Basic pay", amount: periodGross },
        ...(allowance > 0 ? [{ label: "Allowance", amount: allowance } as LedgerLine] : []),
        { label: "Less contributions", amount: contributionsTotal, negative: true },
        { label: "Less withholding tax", amount: wt.tax, negative: true },
        {
          label: "Net pay",
          rule: "What lands in the account",
          amount: net,
          strong: true,
        },
      ],
    },
    {
      title: "Employer cost",
      subtitle: "Monthly, on top of the salary",
      lines: [
        { label: "Monthly basic salary", amount: basic },
        {
          label: "SSS — employer share",
          rule: c.sss.lines.find((l) => l.label.includes("employer share"))?.rule,
          amount: c.sss.employer,
        },
        {
          label: "PhilHealth — employer share",
          rule: philHealthPayer === "employed" ? "Half the premium · RA 11223" : "None — self-paying member",
          amount: c.philhealth.employer,
        },
        {
          label: "Pag-IBIG — employer share",
          rule: c.pagibig.lines.find((l) => l.label.includes("employer share"))?.rule,
          amount: c.pagibig.employer,
        },
        {
          label: "EC premium",
          rule: c.sss.employerExtras?.[0]?.rule,
          amount: ec,
        },
        {
          label: "Total monthly cost",
          rule: "Salary plus every employer-side contribution",
          amount: employerTotalMonthly,
          strong: true,
        },
      ],
    },
  ];

  return {
    headline: {
      label: `Net pay, ${periodLabel.toLowerCase()}`,
      amount: net,
      rule: `${peso(periodGross)} gross less ${peso(contributionsTotal)} contributions and ${peso(wt.tax)} tax`,
    },
    sections,
    figures: {
      frequency,
      periodsPerMonth: periods,
      periodGross,
      allowance,
      sss,
      philhealth,
      pagibig,
      contributionsTotal,
      taxable,
      tax: wt.tax,
      taxBracketIndex: wt.bracketIndex,
      net,
      monthly: {
        gross: basic,
        sss: c.sss.employee,
        philhealth: c.philhealth.employee,
        pagibig: c.pagibig.employee,
        contributionsTotal: c.employeeTotal,
        tax: round2(wt.tax * periods),
        net: round2(net * periods),
      },
      employer: {
        sss: c.sss.employer,
        philhealth: c.philhealth.employer,
        pagibig: c.pagibig.employer,
        ec,
        contributionsTotal: round2(c.employerTotal + ec),
        totalMonthlyCost: employerTotalMonthly,
      },
    },
    notes: [
      ...c.sss.notes,
      ...c.philhealth.notes,
      ...c.pagibig.notes,
      ...(periods !== 1 ? [timingRule] : []),
      ...(frequency === "weekly" || frequency === "daily"
        ? [PERIOD_CONVENTION.value ? PERIOD_CONVENTION.note! : ""]
        : []),
      "Many companies withhold using an annualised projection rather than the per-period table, which shifts tax between months without changing the year's total.",
    ].filter(Boolean),
  };
}

/* ---------------------- Job offer preview ---------------------- */

export type JobOfferFigures = NetPayFigures & {
  annualGross: number;
  annualNet: number;
  thirteenthMonth: number;
};

export function computeJobOffer(input: NetPayInput): CalcResult<JobOfferFigures> {
  const base = computeNetPay({ ...input, frequency: "monthly" });
  const monthlyNet = base.figures.net;
  const thirteenth = round2(input.monthlyBasic);
  const annualGross = round2(input.monthlyBasic * 13);
  const annualNet = round2(monthlyNet * 12 + thirteenth);

  return {
    headline: {
      label: "Monthly take-home",
      amount: monthlyNet,
      rule: `From a ${peso(input.monthlyBasic)} offer`,
    },
    sections: [
      ...base.sections.slice(0, 4),
      {
        title: "Over a year",
        subtitle: "Assuming a full year of service and no unpaid absences",
        lines: [
          { label: "Monthly take-home", amount: monthlyNet },
          { label: "× 12 months", amount: round2(monthlyNet * 12) },
          {
            label: "13th month pay",
            rule: "One month of basic salary, tax exempt up to ₱90,000 · PD 851",
            amount: thirteenth,
          },
          {
            label: "Annual take-home",
            rule: `Against ${peso(annualGross)} annual gross`,
            amount: annualNet,
            strong: true,
          },
        ],
      },
      base.sections[4],
    ],
    figures: { ...base.figures, annualGross, annualNet, thirteenthMonth: thirteenth },
    notes: [
      ...base.notes,
      "This covers statutory deductions only. HMO, union dues, company loans and late deductions are not included.",
    ],
  };
}

export type OfferComparison = {
  a: CalcResult<JobOfferFigures>;
  b: CalcResult<JobOfferFigures>;
  netDifference: number;
  grossDifference: number;
  /** True when the higher gross offer does NOT win on take-home. */
  reversal: boolean;
  verdict: string;
};

export function compareOffers(
  offerA: NetPayInput,
  offerB: NetPayInput
): OfferComparison {
  const a = computeJobOffer(offerA);
  const b = computeJobOffer(offerB);
  const netDifference = round2(b.figures.net - a.figures.net);
  const grossDifference = round2(offerB.monthlyBasic - offerA.monthlyBasic);
  const reversal =
    grossDifference !== 0 && Math.sign(grossDifference) !== Math.sign(netDifference);

  const winner = netDifference > 0 ? "the second offer" : "the first offer";
  const verdict =
    netDifference === 0
      ? "Both offers land on the same take-home."
      : `${peso(Math.abs(netDifference))} more a month from ${winner}, or ${peso(
          Math.abs(round2(b.figures.annualNet - a.figures.annualNet))
        )} a year.`;

  return { a, b, netDifference, grossDifference, reversal, verdict };
}
