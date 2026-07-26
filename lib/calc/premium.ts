import { DAY_TYPES, PREMIUM_PAY, type DayTypeId, type DayTypeRule } from "../rates";
import { num, peso, round2 } from "./money";
import type { CalcResult, LedgerLine } from "./types";

export type PremiumPayInput = {
  dailyRate: number;
  dayType: DayTypeId;
  reportedForWork: boolean;
  hoursWorked?: number;
  overtimeHours?: number;
  nightHours?: number;
  /** Regular-holiday pay when absent requires presence the working day before. */
  presentDayBefore?: boolean;
};

export type PremiumPayFigures = {
  dayType: DayTypeId;
  hourlyRate: number;
  premiumHourlyRate: number;
  basic: number;
  overtime: number;
  nightDifferential: number;
  total: number;
};

export function dayTypeRule(id: DayTypeId): DayTypeRule {
  return DAY_TYPES.find((d) => d.id === id) ?? DAY_TYPES[0];
}

export function computePremiumPay(
  input: PremiumPayInput
): CalcResult<PremiumPayFigures> {
  const r = PREMIUM_PAY.value;
  const rule = dayTypeRule(input.dayType);
  const daily = Math.max(0, input.dailyRate || 0);
  const worked = input.reportedForWork;
  const hours = Math.min(Math.max(0, input.hoursWorked ?? r.hoursPerDay), r.hoursPerDay);
  const otHours = Math.max(0, input.overtimeHours ?? 0);
  const nightHours = Math.max(0, input.nightHours ?? 0);
  const presentBefore = input.presentDayBefore ?? true;

  const ordinaryHourly = round2(daily / r.hoursPerDay);
  const premiumHourly = round2((daily * rule.workedRate) / r.hoursPerDay);

  if (!worked) {
    const eligible = rule.unworkedRate > 0 && presentBefore;
    const amount = eligible ? round2(daily * rule.unworkedRate) : 0;
    const lines: LedgerLine[] = [
      { label: "Daily rate", rule: "As entered", amount: daily },
      {
        label: rule.label,
        rule: rule.unworkedRule,
        raw: `${num(rule.unworkedRate * 100, 0)}% when absent`,
      },
      ...(rule.unworkedRate > 0 && !presentBefore
        ? [
            {
              label: "Condition not met",
              rule: "Holiday pay when absent requires presence, or paid leave, on the working day before",
              amount: 0,
              note: true,
            } as LedgerLine,
          ]
        : []),
      {
        label: "Pay for the day",
        rule: eligible
          ? `${num(rule.unworkedRate * 100, 0)}% of the daily rate · Labor Code Art. 94`
          : "No work, no pay for this day type",
        amount,
        strong: true,
      },
    ];
    return {
      headline: { label: "Pay for the day", amount, rule: rule.label },
      sections: [{ title: "Did not report for work", subtitle: rule.label, lines }],
      figures: {
        dayType: input.dayType,
        hourlyRate: ordinaryHourly,
        premiumHourlyRate: premiumHourly,
        basic: amount,
        overtime: 0,
        nightDifferential: 0,
        total: amount,
      },
      notes: [
        "Monthly-paid employees whose salary already covers unworked days may see this reflected as no separate line on the payslip.",
      ],
    };
  }

  const basic = round2(premiumHourly * hours);
  const otHourly = round2(premiumHourly * rule.overtimeFactor);
  const overtime = round2(otHourly * otHours);
  const nightDifferential = round2(premiumHourly * r.nightDifferentialRate * nightHours);
  const total = round2(basic + overtime + nightDifferential);

  const lines: LedgerLine[] = [
    { label: "Daily rate", rule: "As entered", amount: daily },
    {
      label: "Day type",
      rule: `${rule.workedRule} · Labor Code Book III`,
      raw: rule.label,
    },
    {
      label: `First ${num(hours, 2)} hour${hours === 1 ? "" : "s"}`,
      rule: `${peso(daily)} × ${num(rule.workedRate * 100, 0)}%${
        hours < r.hoursPerDay ? ` × ${num(hours, 2)}/${r.hoursPerDay} hours` : ""
      }`,
      amount: basic,
    },
  ];

  if (otHours > 0) {
    lines.push({
      label: "Hourly rate at this day's premium",
      rule: `${peso(basic > 0 ? daily * rule.workedRate : 0)} ÷ ${r.hoursPerDay} hours`,
      raw: peso(premiumHourly),
    });
    lines.push({
      label: `Overtime, ${num(otHours, 2)} hour${otHours === 1 ? "" : "s"}`,
      rule: `${peso(premiumHourly)} × ${num(rule.overtimeFactor * 100, 0)}% × ${num(
        otHours,
        2
      )} hours · Labor Code Art. 87`,
      amount: overtime,
    });
  }

  if (nightHours > 0) {
    lines.push({
      label: `Night differential, ${num(nightHours, 2)} hour${nightHours === 1 ? "" : "s"}`,
      rule: `${num(r.nightDifferentialRate * 100, 0)}% of ${peso(
        premiumHourly
      )} × ${num(nightHours, 2)} hours, ${r.nightWindow.label} · Labor Code Art. 86`,
      amount: nightDifferential,
    });
  }

  lines.push({
    label: "Total pay for the day",
    rule: "Basic + overtime + night differential",
    amount: total,
    strong: true,
  });

  return {
    headline: { label: "Pay for the day", amount: total, rule: rule.label },
    sections: [{ title: "Reported for work", subtitle: rule.label, lines }],
    figures: {
      dayType: input.dayType,
      hourlyRate: ordinaryHourly,
      premiumHourlyRate: premiumHourly,
      basic,
      overtime,
      nightDifferential,
      total,
    },
    notes: [
      "Night differential here is computed on the hourly rate that already carries the day's premium. Where night hours are also overtime hours, some employers compute the differential on the overtime rate instead, which is higher.",
      "LGUs declare their own local holidays on top of the national list, and those carry the same premiums within that locality.",
    ],
  };
}
