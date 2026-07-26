import { FINAL_PAY, SERVICE_INCENTIVE_LEAVE } from "../rates";
import { num, peso, round2 } from "./money";
import type { CalcResult, LedgerLine } from "./types";

export type FinalPayInput = {
  monthlySalary: number;
  /** Days of salary already worked but not yet paid. */
  unpaidDays?: number;
  /** Unused service incentive leave days, converted to cash. */
  unusedLeaveDays?: number;
  /** Basic salary earned in the calendar year, for the pro-rated 13th month. */
  basicEarnedThisYear?: number;
  separationPay?: number;
  /** Cash advances, unreturned equipment, company loans. */
  accountabilities?: number;
};

export type FinalPayFigures = {
  dailyRate: number;
  unpaidSalary: number;
  leaveConversion: number;
  proratedThirteenth: number;
  separationPay: number;
  accountabilities: number;
  finalPay: number;
};

export function computeFinalPay(input: FinalPayInput): CalcResult<FinalPayFigures> {
  const r = FINAL_PAY.value;
  const monthly = Math.max(0, input.monthlySalary || 0);
  const dailyRate = round2(monthly / r.daysPerMonthDivisor);

  const unpaidDays = Math.max(0, input.unpaidDays ?? 0);
  const leaveDays = Math.max(0, input.unusedLeaveDays ?? 0);
  const unpaidSalary = round2(dailyRate * unpaidDays);
  const leaveConversion = round2(dailyRate * leaveDays);
  const proratedThirteenth = round2(Math.max(0, input.basicEarnedThisYear ?? 0) / 12);
  const separationPay = Math.max(0, input.separationPay ?? 0);
  const accountabilities = Math.max(0, input.accountabilities ?? 0);

  const finalPay = round2(
    unpaidSalary + leaveConversion + proratedThirteenth + separationPay - accountabilities
  );

  const lines: LedgerLine[] = [
    {
      label: "Daily rate",
      rule: `${peso(monthly)} monthly ÷ ${r.daysPerMonthDivisor} days — a payroll convention; confirm the divisor your company uses`,
      amount: dailyRate,
    },
    {
      label: `Unpaid salary, ${num(unpaidDays, 2)} day${unpaidDays === 1 ? "" : "s"}`,
      rule: "Days worked in the last cutoff but not yet paid",
      amount: unpaidSalary,
    },
    {
      label: `Unused leave, ${num(leaveDays, 2)} day${leaveDays === 1 ? "" : "s"}`,
      rule: `Service incentive leave is convertible to cash if unused · Labor Code Art. 95 (${SERVICE_INCENTIVE_LEAVE.value.days} days a year)`,
      amount: leaveConversion,
    },
    {
      label: "Pro-rated 13th month pay",
      rule: `${peso(input.basicEarnedThisYear ?? 0)} basic earned this year ÷ 12 · PD 851`,
      amount: proratedThirteenth,
    },
  ];

  if (separationPay > 0) {
    lines.push({
      label: "Separation pay",
      rule: "Where the separation was for an authorised cause · Arts. 298–299",
      amount: separationPay,
    });
  }

  if (accountabilities > 0) {
    lines.push({
      label: "Less accountabilities",
      rule: "Cash advances, company loans, unreturned equipment — these must be documented",
      amount: accountabilities,
      negative: true,
    });
  }

  lines.push({
    label: "Final pay",
    rule: `Released within ${r.releaseDays} calendar days of separation · DOLE Labor Advisory 06-20`,
    amount: finalPay,
    strong: true,
  });

  return {
    headline: {
      label: "Final pay",
      amount: finalPay,
      rule: `Due within ${r.releaseDays} days of separation`,
    },
    sections: [{ title: "Final pay", subtitle: "Last pay on separation", lines }],
    figures: {
      dailyRate,
      unpaidSalary,
      leaveConversion,
      proratedThirteenth,
      separationPay,
      accountabilities,
      finalPay,
    },
    notes: [
      `Final pay is to be released within ${r.releaseDays} calendar days from the date of separation, unless a more favourable company policy or CBA applies · DOLE Labor Advisory 06-20.`,
      `A Certificate of Employment must be issued within ${r.certificateOfEmploymentDays} days of the request. It is not conditional on clearance being complete.`,
      "Leave conversion applies to unused service incentive leave. Company vacation and sick leave convert only if the policy or CBA says so.",
      "Withholding tax on the final pay depends on the year's total compensation and the annualisation the employer runs on separation, so the figure above is before any tax adjustment.",
    ],
  };
}
