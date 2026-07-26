import { PAY_FREQUENCY_LABEL, type PayFrequency } from "../rates";
import { peso, round2 } from "./money";
import { computeNetPay, periodsPerMonth, type ContributionTiming } from "./netpay";
import type { CalcResult, LedgerLine } from "./types";

/** ₱1 of drift is rounding, not a discrepancy worth alarming anyone about. */
const TOLERANCE = 1;

export type PayslipRowKey = "sss" | "philhealth" | "pagibig" | "tax" | "net";

export type PayslipVerdict = "match" | "over" | "under" | "not-entered";

export type PayslipRow = {
  key: PayslipRowKey;
  label: string;
  expected: number;
  actual?: number;
  difference?: number;
  verdict: PayslipVerdict;
  /** Written in the employee's language, not the system's. */
  message: string;
  /** Common innocent explanations, shown when there is a difference. */
  explanations: string[];
  rule: string;
};

export type PayslipCheckInput = {
  /** The gross basic pay printed on the payslip, for one pay period. */
  periodGross: number;
  frequency: PayFrequency;
  contributionTiming?: ContributionTiming;
  actual: Partial<Record<PayslipRowKey, number | undefined>>;
};

export type PayslipFigures = {
  rows: PayslipRow[];
  monthlyEquivalent: number;
  checkedCount: number;
  mismatchCount: number;
  totalDifference: number;
};

const LABELS: Record<PayslipRowKey, string> = {
  sss: "SSS",
  philhealth: "PhilHealth",
  pagibig: "Pag-IBIG",
  tax: "Withholding tax",
  net: "Net pay",
};

const EXPLANATIONS: Record<PayslipRowKey, string[]> = {
  sss: [
    "Your salary changed mid-month, so the contribution was based on a different salary credit.",
    "Your company takes the whole monthly contribution on one cutoff instead of splitting it.",
    "A voluntary top-up to the provident (WISP Plus) layer is being deducted on the same line.",
  ],
  philhealth: [
    "The premium is based on monthly basic income, so allowances and overtime on your payslip do not raise it.",
    "Your company takes the whole monthly premium on one cutoff instead of splitting it.",
    "A prior month's under-remittance is being adjusted on this payslip.",
  ],
  pagibig: [
    "You may have elected to contribute above the ₱200 mandatory ceiling.",
    "A Pag-IBIG MP2 savings contribution can appear on the same line.",
    "Your company takes the whole monthly contribution on one cutoff instead of splitting it.",
  ],
  tax: [
    "Many employers withhold using an annualised projection rather than the per-period table. That shifts tax between months without changing the year's total.",
    "A year-end tax adjustment, a taxable bonus, or 13th month pay above ₱90,000 can land on one payslip.",
    "Taxable allowances that are not part of basic pay raise the tax base above what this check assumes.",
  ],
  net: [
    "HMO premiums, union dues, company loans, late or absence deductions and salary loans are not part of this check.",
    "Non-taxable allowances, overtime, holiday premium and night differential add to net pay and are not included here.",
  ],
};

function verdictFor(
  key: PayslipRowKey,
  expected: number,
  actual: number | undefined
): { verdict: PayslipVerdict; difference?: number } {
  if (actual === undefined || Number.isNaN(actual)) return { verdict: "not-entered" };
  const difference = round2(actual - expected);
  if (Math.abs(difference) <= TOLERANCE) return { verdict: "match", difference };
  return { verdict: difference > 0 ? "over" : "under", difference };
}

function messageFor(
  key: PayslipRowKey,
  expected: number,
  monthlyEquivalent: number,
  verdict: PayslipVerdict,
  difference?: number
): string {
  const salary = peso(monthlyEquivalent);
  if (verdict === "not-entered") {
    return `Not entered. Based on a ${salary} monthly salary the schedule gives ${peso(expected)}.`;
  }
  if (verdict === "match") {
    return key === "net"
      ? `Your net pay matches what the four statutory deductions give for a ${salary} salary.`
      : `Your ${LABELS[key]} deduction matches the schedule for a ${salary} salary.`;
  }
  const gap = peso(Math.abs(difference ?? 0));
  if (key === "net") {
    return verdict === "over"
      ? `Your net pay is ${gap} higher than this computation. Something is adding to your pay that this check does not know about.`
      : `Your net pay is ${gap} lower than this computation. Something is being deducted that this check does not know about.`;
  }
  return verdict === "over"
    ? `Your ${LABELS[key]} deduction is ${gap} higher than the schedule for a ${salary} salary.`
    : `Your ${LABELS[key]} deduction is ${gap} lower than the schedule for a ${salary} salary.`;
}

export function checkPayslip(input: PayslipCheckInput): CalcResult<PayslipFigures> {
  const periods = periodsPerMonth(input.frequency);
  const periodGross = Math.max(0, input.periodGross || 0);
  const monthlyEquivalent = round2(periodGross * periods);

  const computed = computeNetPay({
    monthlyBasic: monthlyEquivalent,
    frequency: input.frequency,
    contributionTiming: input.contributionTiming ?? "spread",
  });
  const f = computed.figures;

  const expectedBy: Record<PayslipRowKey, number> = {
    sss: f.sss,
    philhealth: f.philhealth,
    pagibig: f.pagibig,
    tax: f.tax,
    net: f.net,
  };

  const ruleBy: Record<PayslipRowKey, string> = {
    sss: "5% of the monthly salary credit · RA 11199",
    philhealth: "Half of 5% of monthly basic income · RA 11223",
    pagibig: "2% of fund salary, capped at ₱200 · HDMF Circular 460",
    tax: `${PAY_FREQUENCY_LABEL[input.frequency]} table · BIR RR 11-2018 Annex E`,
    net: "Gross less the four statutory deductions",
  };

  const keys: PayslipRowKey[] = ["sss", "philhealth", "pagibig", "tax", "net"];
  const rows: PayslipRow[] = keys.map((key) => {
    const expected = expectedBy[key];
    const actual = input.actual[key];
    const { verdict, difference } = verdictFor(key, expected, actual);
    return {
      key,
      label: LABELS[key],
      expected,
      actual,
      difference,
      verdict,
      message: messageFor(key, expected, monthlyEquivalent, verdict, difference),
      explanations: verdict === "over" || verdict === "under" ? EXPLANATIONS[key] : [],
      rule: ruleBy[key],
    };
  });

  const checked = rows.filter((r) => r.verdict !== "not-entered");
  const mismatches = checked.filter((r) => r.verdict !== "match");
  const totalDifference = round2(
    mismatches
      .filter((r) => r.key !== "net")
      .reduce((s, r) => s + (r.difference ?? 0), 0)
  );

  const headlineAmount =
    checked.length === 0 ? 0 : round2(Math.abs(totalDifference));

  const sections = [
    {
      title: "Line by line",
      subtitle: `Against a ${peso(monthlyEquivalent)} monthly basic salary, paid ${PAY_FREQUENCY_LABEL[
        input.frequency
      ].toLowerCase()}`,
      lines: rows.flatMap((r): LedgerLine[] => {
        if (r.verdict === "not-entered") {
          return [
            {
              label: r.label,
              rule: `${r.rule} — you did not enter this one`,
              raw: `Expected ${peso(r.expected)}`,
              note: true,
            },
          ];
        }
        return [
          { label: `${r.label} — expected`, rule: r.rule, amount: r.expected },
          { label: `${r.label} — on your payslip`, amount: r.actual },
          {
            label: `${r.label} — difference`,
            rule: r.message,
            amount: r.difference,
            negative: (r.difference ?? 0) !== 0,
            strong: true,
          },
        ];
      }),
    },
  ];

  const notes = [
    checked.length === 0
      ? "Enter at least one figure from your payslip to see a comparison."
      : mismatches.length === 0
        ? "Everything you entered matches the current statutory schedules."
        : "A difference does not mean your employer is wrong. This app cannot see your allowances, adjustments, or the basis payroll used.",
    ...(mismatches.length > 0
      ? [
          "If you want to follow it up, ask HR which basis they used for the deduction and for which period. That question is usually enough to resolve it.",
          "If it is not resolved, the DOLE Single Entry Approach (SEnA) is a free 30-day conciliation step at any DOLE office. It does not require a lawyer.",
        ]
      : []),
  ];

  return {
    headline: {
      label:
        checked.length === 0
          ? "Nothing to compare yet"
          : mismatches.length === 0
            ? "No differences found"
            : `${mismatches.length} line${mismatches.length === 1 ? "" : "s"} differ`,
      amount: headlineAmount,
      rule:
        checked.length === 0
          ? "Enter any one figure from your payslip"
          : `Total difference across contributions and tax`,
    },
    sections,
    figures: {
      rows,
      monthlyEquivalent,
      checkedCount: checked.length,
      mismatchCount: mismatches.length,
      totalDifference,
    },
    notes,
  };
}
