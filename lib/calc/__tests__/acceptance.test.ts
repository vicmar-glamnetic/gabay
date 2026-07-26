import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { PAY_FREQUENCIES, WITHHOLDING, type PayFrequency } from "../../rates";
import { monthlyContributions, sssMsc } from "../contributions";
import { num, round2 } from "../money";
import { compareOffers, computeNetPay } from "../netpay";
import { checkPayslip } from "../payslip";
import { computePremiumPay } from "../premium";
import { computeRetirementPay } from "../retirement";
import { computeSeparationPay } from "../separation";
import { computeThirteenthMonth } from "../thirteenth";
import { withholdingTax } from "../tax";

/* ================================================================= *
 * The acceptance tests from the brief. If these fail the rates
 * module is wrong and nothing built on top of it can be trusted.
 * ================================================================= */

describe("₱30,000 monthly basic salary", () => {
  const r = computeNetPay({ monthlyBasic: 30_000, frequency: "monthly" });
  const f = r.figures;

  it("MSC is ₱30,000 and the SSS employee share is ₱1,500.00", () => {
    assert.equal(sssMsc(30_000), 30_000);
    assert.equal(f.sss, 1_500.0);
  });
  it("PhilHealth employee share is ₱750.00", () => assert.equal(f.philhealth, 750.0));
  it("Pag-IBIG employee share is ₱200.00", () => assert.equal(f.pagibig, 200.0));
  it("taxable income is ₱27,550.00", () => assert.equal(f.taxable, 27_550.0));
  it("withholding tax is ₱1,007.55", () => assert.equal(f.tax, 1_007.55));
  it("net pay is ₱26,542.45", () => assert.equal(f.net, 26_542.45));
});

describe("₱50,000 monthly basic salary", () => {
  const f = computeNetPay({ monthlyBasic: 50_000, frequency: "monthly" }).figures;

  it("MSC caps at ₱35,000 and the SSS employee share is ₱1,750.00", () => {
    assert.equal(sssMsc(50_000), 35_000);
    assert.equal(f.sss, 1_750.0);
  });
  it("PhilHealth employee share is ₱1,250.00", () => assert.equal(f.philhealth, 1_250.0));
  it("Pag-IBIG employee share is ₱200.00", () => assert.equal(f.pagibig, 200.0));
  it("taxable income is ₱46,800.00", () => assert.equal(f.taxable, 46_800.0));
  it("withholding tax is ₱4,568.40", () => assert.equal(f.tax, 4_568.4));
  it("net pay is ₱42,231.60", () => assert.equal(f.net, 42_231.6));
});

describe("₱20,000 monthly basic salary", () => {
  const f = computeNetPay({ monthlyBasic: 20_000, frequency: "monthly" }).figures;

  it("taxable income is ₱18,300.00", () => assert.equal(f.taxable, 18_300.0));
  it("withholding tax is ₱0.00", () => assert.equal(f.tax, 0));
  it("net pay is ₱18,300.00", () => assert.equal(f.net, 18_300.0));
});

describe("premium pay — ₱1,000 daily, regular holiday, 8h + 2h OT + 3h night", () => {
  const f = computePremiumPay({
    dailyRate: 1_000,
    dayType: "regular-holiday",
    reportedForWork: true,
    hoursWorked: 8,
    overtimeHours: 2,
    nightHours: 3,
  }).figures;

  it("basic is ₱2,000.00", () => assert.equal(f.basic, 2_000.0));
  it("overtime is ₱650.00", () => assert.equal(f.overtime, 650.0));
  it("night differential is ₱75.00", () => assert.equal(f.nightDifferential, 75.0));
  it("total is ₱2,725.00", () => assert.equal(f.total, 2_725.0));
});

describe("separation pay — ₱25,000 monthly, 5 years 7 months, redundancy", () => {
  const f = computeSeparationPay({
    monthlyPay: 25_000,
    years: 5,
    months: 7,
    ground: "redundancy",
  }).figures;

  it("credits 6 years", () => assert.equal(f.creditedYears, 6));
  it("separation pay is ₱150,000.00", () => assert.equal(f.separationPay, 150_000.0));
});

describe("payslip checker — ₱30,000 monthly, SSS entered as ₱1,620.00", () => {
  const r = checkPayslip({
    periodGross: 30_000,
    frequency: "monthly",
    actual: { sss: 1_620.0 },
  });
  const sss = r.figures.rows.find((row) => row.key === "sss")!;

  it("expected is ₱1,500.00", () => assert.equal(sss.expected, 1_500.0));
  it("difference is ₱120.00", () => assert.equal(sss.difference, 120.0));
  it("verdict is overdeducted", () => assert.equal(sss.verdict, "over"));
  it("does not error with every other field blank", () => {
    assert.equal(r.figures.checkedCount, 1);
    assert.equal(r.figures.mismatchCount, 1);
    for (const key of ["philhealth", "pagibig", "tax", "net"] as const) {
      assert.equal(r.figures.rows.find((row) => row.key === key)!.verdict, "not-entered");
    }
  });
  it("phrases the verdict in the employee's language", () => {
    assert.match(sss.message, /higher than the schedule for a ₱30,000\.00 salary/);
  });
  it("offers an innocent explanation and a neutral next step", () => {
    assert.ok(sss.explanations.length > 0);
    assert.ok(r.notes.some((n) => /ask HR which basis/.test(n)));
    assert.ok(!r.notes.some((n) => /file a complaint|you have a case|illegal/i.test(n)));
  });
});

/* ================================================================= *
 * Frequency tests. Base amounts come from the published BIR table
 * for each frequency (RR 11-2018 Annex "E", effective 1 Jan 2023),
 * transcribed rather than derived from the monthly figures.
 * ================================================================= */

describe("BIR withholding tables, all four frequencies", () => {
  const exemptTop: Record<PayFrequency, number> = {
    monthly: 20_833,
    "semi-monthly": 10_417,
    weekly: 4_808,
    daily: 685,
  };

  for (const frequency of PAY_FREQUENCIES) {
    it(`${frequency}: ₱${exemptTop[frequency]} and below is exempt`, () => {
      assert.equal(withholdingTax(exemptTop[frequency], frequency).tax, 0);
      assert.equal(withholdingTax(exemptTop[frequency], frequency).exempt, true);
    });

    it(`${frequency}: the published base amounts are internally consistent`, () => {
      // Each bracket's base must equal the tax computed at its own lower bound
      // using the previous bracket. This catches a mistyped base amount.
      const brackets = WITHHOLDING.value[frequency];
      for (let i = 2; i < brackets.length; i++) {
        const prev = brackets[i - 1];
        const derived = round2(prev.base + (brackets[i].over - prev.over) * prev.rate);
        assert.equal(
          brackets[i].base,
          derived,
          `${frequency} bracket ${i + 1}: published ${brackets[i].base}, derived ${derived}`
        );
      }
    });
  }

  it("semi-monthly: ₱20,000 taxable withholds ₱1,604.10", () => {
    // 937.50 + 20% × (20,000 − 16,667) = 937.50 + 666.60
    assert.equal(withholdingTax(20_000, "semi-monthly").tax, 1_604.1);
  });

  it("weekly: ₱10,000 taxable withholds ₱894.20", () => {
    // 432.60 + 20% × (10,000 − 7,692) = 432.60 + 461.60
    assert.equal(withholdingTax(10_000, "weekly").tax, 894.2);
  });

  it("daily: ₱1,500 taxable withholds ₱142.45", () => {
    // 61.65 + 20% × (1,500 − 1,096) = 61.65 + 80.80
    assert.equal(withholdingTax(1_500, "daily").tax, 142.45);
  });
});

describe("semi-monthly payroll at ₱30,000 monthly basic", () => {
  it("splitting contributions evenly halves each deduction", () => {
    const f = computeNetPay({
      monthlyBasic: 30_000,
      frequency: "semi-monthly",
      contributionTiming: "spread",
    }).figures;
    assert.equal(f.periodGross, 15_000);
    assert.equal(f.sss, 750);
    assert.equal(f.philhealth, 375);
    assert.equal(f.pagibig, 100);
    assert.equal(f.taxable, 13_775);
    // 15% over 10,417 → 0.15 × 3,358 = 503.70
    assert.equal(f.tax, 503.7);
    assert.equal(f.net, 13_271.3);
  });

  it("taking the full contribution on one cutoff deducts the whole monthly amount", () => {
    const f = computeNetPay({
      monthlyBasic: 30_000,
      frequency: "semi-monthly",
      contributionTiming: "single",
    }).figures;
    assert.equal(f.sss, 1_500);
    assert.equal(f.philhealth, 750);
    assert.equal(f.pagibig, 200);
    assert.equal(f.taxable, 12_550);
  });

  it("states the contribution convention in effect", () => {
    const spread = computeNetPay({ monthlyBasic: 30_000, frequency: "semi-monthly" });
    assert.ok(spread.notes.some((n) => /divided evenly across/.test(n)));
  });
});

describe("num() formatting inside rule strings", () => {
  it("does not eat the zeros off a round threshold", () => {
    // Regression: trimming zeros without checking for a decimal point turned
    // ₱500 into ₱5 on the SSS salary-credit line, and 200% into 2%.
    assert.equal(num(500, 0), "500");
    assert.equal(num(5_000, 0), "5,000");
    assert.equal(num(35_000, 0), "35,000");
    assert.equal(num(100_000, 0), "100,000");
    assert.equal(num(200, 0), "200");
  });

  it("still drops a meaningless decimal tail", () => {
    assert.equal(num(22.5, 2), "22.5");
    assert.equal(num(6, 2), "6");
    assert.equal(num(30_000, 2), "30,000");
    assert.equal(num(1_007.55, 2), "1,007.55");
  });

  it("renders the SSS rule line with the real salary-credit step", () => {
    const line = monthlyContributions(30_000).sss.lines[0];
    assert.match(line.rule!, /nearest ₱500/);
    assert.match(line.rule!, /₱5,000–₱35,000/);
  });

  it("renders premium pay percentages at full value", () => {
    const r = computePremiumPay({
      dailyRate: 1_000,
      dayType: "regular-holiday",
      reportedForWork: true,
      hoursWorked: 8,
    });
    const dayLine = r.sections[0].lines.find((l) => l.label === "Day type")!;
    assert.match(dayLine.rule!, /200% of the daily rate/);
  });
});

describe("contribution edge cases", () => {
  it("clamps the MSC to the ₱5,000 floor", () => {
    assert.equal(sssMsc(3_000), 5_000);
    assert.equal(monthlyContributions(3_000).sss.employee, 250);
  });

  it("rounds salary to the nearest ₱500 salary credit", () => {
    assert.equal(sssMsc(20_249), 20_000);
    assert.equal(sssMsc(20_250), 20_500);
  });

  it("charges the ₱10 EC premium below a ₱15,000 MSC and ₱30 at or above", () => {
    assert.equal(monthlyContributions(14_000).sss.employerExtras![0].amount, 10);
    assert.equal(monthlyContributions(15_000).sss.employerExtras![0].amount, 30);
  });

  it("notes the provident layer above a ₱20,000 MSC without changing the total", () => {
    const c = monthlyContributions(25_000);
    assert.equal(c.sss.employee, 1_250);
    assert.ok(c.sss.notes.some((n) => /provident/i.test(n)));
  });

  it("applies the PhilHealth ₱10,000 floor and ₱100,000 ceiling", () => {
    assert.equal(monthlyContributions(8_000).philhealth.employee, 250);
    assert.equal(monthlyContributions(150_000).philhealth.employee, 2_500);
  });

  it("charges self-paying PhilHealth members the whole premium", () => {
    const c = monthlyContributions(30_000, "self-paying");
    assert.equal(c.philhealth.employee, 1_500);
    assert.equal(c.philhealth.employer, 0);
  });

  it("uses the 1% Pag-IBIG employee rate at ₱1,500 and below", () => {
    assert.equal(monthlyContributions(1_500).pagibig.employee, 15);
    assert.equal(monthlyContributions(1_501).pagibig.employee, 30.02);
  });

  it("caps Pag-IBIG at ₱200 per side", () => {
    const c = monthlyContributions(80_000);
    assert.equal(c.pagibig.employee, 200);
    assert.equal(c.pagibig.employer, 200);
  });
});

describe("premium pay across every day type", () => {
  const base = { dailyRate: 1_000, reportedForWork: true, hoursWorked: 8 } as const;

  it("ordinary day pays 100%", () =>
    assert.equal(computePremiumPay({ ...base, dayType: "ordinary" }).figures.total, 1_000));
  it("rest day pays 130%", () =>
    assert.equal(computePremiumPay({ ...base, dayType: "rest-day" }).figures.total, 1_300));
  it("special non-working pays 130%", () =>
    assert.equal(computePremiumPay({ ...base, dayType: "special" }).figures.total, 1_300));
  it("special on a rest day pays 150%", () =>
    assert.equal(
      computePremiumPay({ ...base, dayType: "special-rest-day" }).figures.total,
      1_500
    ));
  it("regular holiday on a rest day pays 260%", () =>
    assert.equal(
      computePremiumPay({ ...base, dayType: "regular-holiday-rest-day" }).figures.total,
      2_600
    ));

  it("pays 100% for an unworked regular holiday when present the day before", () => {
    const f = computePremiumPay({
      dailyRate: 1_000,
      dayType: "regular-holiday",
      reportedForWork: false,
      presentDayBefore: true,
    }).figures;
    assert.equal(f.total, 1_000);
  });

  it("pays nothing for an unworked regular holiday when absent the day before", () => {
    const f = computePremiumPay({
      dailyRate: 1_000,
      dayType: "regular-holiday",
      reportedForWork: false,
      presentDayBefore: false,
    }).figures;
    assert.equal(f.total, 0);
  });

  it("pays nothing for an unworked special non-working day", () => {
    const f = computePremiumPay({
      dailyRate: 1_000,
      dayType: "special",
      reportedForWork: false,
    }).figures;
    assert.equal(f.total, 0);
  });

  it("applies the 1.25 overtime factor on an ordinary day", () => {
    const f = computePremiumPay({
      ...base,
      dayType: "ordinary",
      overtimeHours: 2,
    }).figures;
    assert.equal(f.overtime, 312.5); // 125 × 1.25 × 2
  });
});

describe("13th month pay", () => {
  it("is total basic earned ÷ 12", () => {
    const f = computeThirteenthMonth({ mode: "total", totalBasicEarned: 360_000 }).figures;
    assert.equal(f.thirteenthMonth, 30_000);
  });

  it("pro-rates from months worked", () => {
    const f = computeThirteenthMonth({
      mode: "salary",
      monthlySalary: 30_000,
      monthsWorked: 7,
    }).figures;
    assert.equal(f.basicEarned, 210_000);
    assert.equal(f.thirteenthMonth, 17_500);
  });

  it("deducts unpaid absences from basic earned", () => {
    const f = computeThirteenthMonth({
      mode: "salary",
      monthlySalary: 30_000,
      monthsWorked: 12,
      unpaidAbsences: 12_000,
    }).figures;
    assert.equal(f.basicEarned, 348_000);
    assert.equal(f.thirteenthMonth, 29_000);
  });

  it("exempts benefits up to ₱90,000 and taxes the excess", () => {
    const f = computeThirteenthMonth({ mode: "total", totalBasicEarned: 1_500_000 }).figures;
    assert.equal(f.thirteenthMonth, 125_000);
    assert.equal(f.taxExempt, 90_000);
    assert.equal(f.taxableExcess, 35_000);
  });
});

describe("separation pay", () => {
  it("credits a fraction of six months or more as a whole year", () => {
    assert.equal(computeSeparationPay({ monthlyPay: 20_000, years: 3, months: 6, ground: "redundancy" }).figures.creditedYears, 4);
    assert.equal(computeSeparationPay({ monthlyPay: 20_000, years: 3, months: 5, ground: "redundancy" }).figures.creditedYears, 3);
  });

  it("pays half a month per year for retrenchment", () => {
    const f = computeSeparationPay({
      monthlyPay: 25_000,
      years: 6,
      ground: "retrenchment",
    }).figures;
    assert.equal(f.separationPay, 75_000);
  });

  it("applies the one-month statutory floor", () => {
    const f = computeSeparationPay({
      monthlyPay: 20_000,
      years: 1,
      ground: "retrenchment",
    }).figures;
    assert.equal(f.computed, 10_000);
    assert.equal(f.separationPay, 20_000);
    assert.equal(f.floorApplied, true);
  });
});

describe("retirement pay under RA 7641", () => {
  it("uses 22.5 days per year of service", () => {
    const f = computeRetirementPay({ basis: "daily", pay: 1_000, years: 10, age: 62 }).figures;
    assert.equal(f.halfMonthValue, 22_500);
    assert.equal(f.retirementPay, 225_000);
    assert.equal(f.eligible, true);
  });

  it("breaks 22.5 days into 15 + 5 + 2.5", () => {
    const r = computeRetirementPay({ basis: "daily", pay: 1_000, years: 10 });
    const section = r.sections.find((s) => s.title.includes("22.5"))!;
    const days = section.lines.filter((l) => !l.strong).map((l) => l.raw);
    assert.deepEqual(days, ["15 days", "5 days", "2.5 days"]);
  });

  it("flags fewer than five years of service as not meeting the conditions", () => {
    const f = computeRetirementPay({ basis: "daily", pay: 1_000, years: 3, age: 62 }).figures;
    assert.equal(f.eligible, false);
  });

  it("credits a fraction of six months or more as a whole year", () => {
    const f = computeRetirementPay({ basis: "daily", pay: 1_000, years: 9, months: 8 }).figures;
    assert.equal(f.creditedYears, 10);
  });
});

describe("job offer comparison", () => {
  it("reports the take-home difference between two offers", () => {
    const c = compareOffers(
      { monthlyBasic: 30_000, frequency: "monthly" },
      { monthlyBasic: 35_000, frequency: "monthly" }
    );
    assert.equal(c.a.figures.net, 26_542.45);
    assert.ok(c.netDifference > 0);
    assert.equal(c.reversal, false);
  });

  it("annualises with the 13th month", () => {
    const r = compareOffers(
      { monthlyBasic: 30_000, frequency: "monthly" },
      { monthlyBasic: 30_000, frequency: "monthly" }
    );
    assert.equal(r.a.figures.annualGross, 390_000);
    assert.equal(r.a.figures.annualNet, round2(26_542.45 * 12 + 30_000));
    assert.equal(r.netDifference, 0);
  });
});

describe("payslip checker beyond the acceptance case", () => {
  it("treats sub-peso drift as a match rather than a discrepancy", () => {
    const r = checkPayslip({
      periodGross: 30_000,
      frequency: "monthly",
      actual: { tax: 1_007.0 },
    });
    assert.equal(r.figures.rows.find((x) => x.key === "tax")!.verdict, "match");
  });

  it("reports an underdeduction", () => {
    const r = checkPayslip({
      periodGross: 30_000,
      frequency: "monthly",
      actual: { pagibig: 100 },
    });
    const row = r.figures.rows.find((x) => x.key === "pagibig")!;
    assert.equal(row.verdict, "under");
    assert.equal(row.difference, -100);
  });

  it("derives the monthly salary from a semi-monthly gross", () => {
    const r = checkPayslip({
      periodGross: 15_000,
      frequency: "semi-monthly",
      actual: { sss: 750 },
    });
    assert.equal(r.figures.monthlyEquivalent, 30_000);
    assert.equal(r.figures.rows.find((x) => x.key === "sss")!.verdict, "match");
  });

  it("says nothing to compare when every field is blank", () => {
    const r = checkPayslip({ periodGross: 30_000, frequency: "monthly", actual: {} });
    assert.equal(r.figures.checkedCount, 0);
    assert.equal(r.figures.mismatchCount, 0);
  });
});
