import { PAGIBIG, PHILHEALTH, SSS } from "../rates";
import { clamp, num, peso, pct, round2, roundToStep } from "./money";
import type { LedgerLine } from "./types";

export type ContributionShare = {
  employee: number;
  employer: number;
  total: number;
  lines: LedgerLine[];
  /** Extra employer-side cost that is not part of `total`, e.g. the EC premium. */
  employerExtras?: { label: string; amount: number; rule: string }[];
  notes: string[];
};

/* ------------------------------ SSS ------------------------------ */

export function sssMsc(monthlyBasic: number): number {
  const { mscFloor, mscCeiling, mscStep } = SSS.value;
  return clamp(roundToStep(monthlyBasic, mscStep), mscFloor, mscCeiling);
}

export function sssContribution(monthlyBasic: number): ContributionShare {
  const r = SSS.value;
  const msc = sssMsc(monthlyBasic);
  const employee = round2(msc * r.employeeRate);
  const employer = round2(msc * r.employerRate);
  const ec =
    msc >= r.ecThresholdMsc ? r.ecPremiumAtOrAboveThreshold : r.ecPremiumBelowThreshold;

  const notes: string[] = [];
  if (msc >= r.providentThresholdMsc) {
    notes.push(
      `At a ₱${num(msc, 0)} MSC part of this contribution funds the mandatory provident (WISP) layer. The total you pay is unchanged.`
    );
  }
  if (monthlyBasic > r.mscCeiling) {
    notes.push(
      `Your salary is above the ₱${num(r.mscCeiling, 0)} MSC ceiling, so the contribution stops rising here.`
    );
  }

  return {
    employee,
    employer,
    total: round2(employee + employer),
    employerExtras: [
      {
        label: "SSS Employees' Compensation premium",
        amount: ec,
        rule:
          msc >= r.ecThresholdMsc
            ? `₱${num(ec, 0)} at an MSC of ₱${num(r.ecThresholdMsc, 0)} and above`
            : `₱${num(ec, 0)} below a ₱${num(r.ecThresholdMsc, 0)} MSC`,
      },
    ],
    notes,
    lines: [
      {
        label: "Monthly salary credit",
        rule: `₱${num(monthlyBasic, 2)} rounded to the nearest ₱${num(
          r.mscStep,
          0
        )}, clamped to ₱${num(r.mscFloor, 0)}–₱${num(r.mscCeiling, 0)}`,
        raw: peso(msc),
      },
      {
        label: "SSS — employee share",
        rule: `${pct(r.employeeRate)} of MSC · RA 11199`,
        amount: employee,
        negative: true,
      },
      {
        label: "SSS — employer share",
        rule: `${pct(r.employerRate)} of MSC · RA 11199`,
        amount: employer,
      },
    ],
  };
}

/* --------------------------- PhilHealth --------------------------- */

export type PhilHealthPayer = "employed" | "self-paying";

export function philHealthContribution(
  monthlyBasic: number,
  payer: PhilHealthPayer = "employed"
): ContributionShare {
  const r = PHILHEALTH.value;
  const base = clamp(monthlyBasic, r.incomeFloor, r.incomeCeiling);
  const premium = round2(base * r.premiumRate);
  const employee =
    payer === "employed" ? round2(premium * r.employeeShareOfPremium) : premium;
  const employer = payer === "employed" ? round2(premium - employee) : 0;

  const notes: string[] = [];
  if (monthlyBasic < r.incomeFloor) {
    notes.push(
      `Income below ₱${num(r.incomeFloor, 0)} is charged the floor premium of ${peso(premium)}.`
    );
  }
  if (monthlyBasic > r.incomeCeiling) {
    notes.push(
      `Income above ₱${num(r.incomeCeiling, 0)} is capped, so the premium stops at ${peso(premium)}.`
    );
  }
  if (payer === "self-paying") {
    notes.push(
      "Self-employed, voluntary and OFW members pay the whole premium themselves — there is no employer half."
    );
  }

  return {
    employee,
    employer,
    total: premium,
    notes,
    lines: [
      {
        label: "Premium base",
        rule: `Monthly basic income, floor ₱${num(r.incomeFloor, 0)}, ceiling ₱${num(
          r.incomeCeiling,
          0
        )}`,
        raw: peso(base),
      },
      {
        label: "Total premium",
        rule: `${pct(r.premiumRate)} of premium base · RA 11223`,
        raw: peso(premium),
      },
      payer === "employed"
        ? {
            label: "PhilHealth — employee share",
            rule: "Half the premium · RA 11223",
            amount: employee,
            negative: true,
          }
        : {
            label: "PhilHealth — member pays in full",
            rule: "Self-paying members carry the whole premium · RA 11223",
            amount: employee,
            negative: true,
          },
      ...(payer === "employed"
        ? [
            {
              label: "PhilHealth — employer share",
              rule: "Half the premium · RA 11223",
              amount: employer,
            } as LedgerLine,
          ]
        : []),
    ],
  };
}

/* ---------------------------- Pag-IBIG ---------------------------- */

export function pagibigContribution(monthlyBasic: number): ContributionShare {
  const r = PAGIBIG.value;
  const fundSalary = Math.min(monthlyBasic, r.maxFundSalary);
  const employeeRate =
    monthlyBasic <= r.lowerBandCeiling ? r.employeeRateLowBand : r.employeeRateHighBand;
  const employee = round2(fundSalary * employeeRate);
  const employer = round2(fundSalary * r.employerRate);

  const notes: string[] = [];
  if (monthlyBasic > r.maxFundSalary) {
    notes.push(
      `Pag-IBIG caps the fund salary at ₱${num(
        r.maxFundSalary,
        0
      )}, so ₱${num(r.maxFundSalary * r.employerRate, 0)} is the maximum per side. You may contribute more voluntarily.`
    );
  }

  return {
    employee,
    employer,
    total: round2(employee + employer),
    notes,
    lines: [
      {
        label: "Fund salary",
        rule: `Monthly basic, capped at ₱${num(r.maxFundSalary, 0)} · HDMF Circular 460`,
        raw: peso(fundSalary),
      },
      {
        label: "Pag-IBIG — employee share",
        rule:
          monthlyBasic <= r.lowerBandCeiling
            ? `${pct(employeeRate)} of fund salary, the rate at ₱${num(
                r.lowerBandCeiling,
                0
              )} and below`
            : `${pct(employeeRate)} of fund salary · HDMF Circular 460`,
        amount: employee,
        negative: true,
      },
      {
        label: "Pag-IBIG — employer share",
        rule: `${pct(r.employerRate)} of fund salary · HDMF Circular 460`,
        amount: employer,
      },
    ],
  };
}

/* --------------------------- All three --------------------------- */

export type MonthlyContributions = {
  sss: ContributionShare;
  philhealth: ContributionShare;
  pagibig: ContributionShare;
  employeeTotal: number;
  employerTotal: number;
  employerExtrasTotal: number;
};

export function monthlyContributions(
  monthlyBasic: number,
  philHealthPayer: PhilHealthPayer = "employed"
): MonthlyContributions {
  const sss = sssContribution(monthlyBasic);
  const philhealth = philHealthContribution(monthlyBasic, philHealthPayer);
  const pagibig = pagibigContribution(monthlyBasic);
  const extras = [sss, philhealth, pagibig].flatMap((c) => c.employerExtras ?? []);
  return {
    sss,
    philhealth,
    pagibig,
    employeeTotal: round2(sss.employee + philhealth.employee + pagibig.employee),
    employerTotal: round2(sss.employer + philhealth.employer + pagibig.employer),
    employerExtrasTotal: round2(extras.reduce((s, e) => s + e.amount, 0)),
  };
}
