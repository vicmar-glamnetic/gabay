/**
 * Gabay — the single source of truth for every statutory figure in the app.
 *
 * ARCHITECTURE RULE: no rate, threshold, multiplier or bracket may appear
 * anywhere else in the codebase. When a circular changes a number, this is the
 * only file that gets edited.
 *
 * Every schedule carries `lastVerified` and `source`. The Rates screen renders
 * those strings verbatim, so keep them human-readable.
 */

export type Verified<T> = {
  /** ISO date the figures were last checked against the issuance. */
  lastVerified: string;
  /** The issuance, cited the way it should appear on screen. */
  source: string;
  /** Optional caveat rendered under the source line. */
  note?: string;
  /** When this schedule is expected to move, for the maintenance list. */
  reviewCadence?: string;
  value: T;
};

function verified<T>(v: Verified<T>): Verified<T> {
  return v;
}

export const RATES_VERSION = "2026.07";
export const RATES_VERSION_LABEL = "July 2026 schedule";

/* ------------------------------------------------------------------ *
 * Pay frequency
 * ------------------------------------------------------------------ */

export type PayFrequency = "monthly" | "semi-monthly" | "weekly" | "daily";

export const PAY_FREQUENCIES: PayFrequency[] = [
  "monthly",
  "semi-monthly",
  "weekly",
  "daily",
];

export const PAY_FREQUENCY_LABEL: Record<PayFrequency, string> = {
  monthly: "Monthly",
  "semi-monthly": "Semi-monthly (15th & 30th)",
  weekly: "Weekly",
  daily: "Daily",
};

/**
 * How many pay periods fall in one month, used to spread the monthly
 * contributions and to derive period gross from a monthly basic salary.
 *
 * These are payroll conventions, not statutory figures. They are stated here so
 * the ledger can name the convention it used rather than hiding it.
 */
export const PERIOD_CONVENTION = verified({
  lastVerified: "2026-07-01",
  source: "Payroll convention, not a statutory figure",
  note:
    "Weekly uses 52 weeks a year. Daily uses the 313-day factor (six-day week, less Sundays). Companies using a 261-day or 365-day factor will differ.",
  reviewCadence: "Stable",
  value: {
    periodsPerMonth: {
      monthly: 1,
      "semi-monthly": 2,
      weekly: 52 / 12,
      daily: 313 / 12,
    } as Record<PayFrequency, number>,
    weeksPerYear: 52,
    daysPerYear: 313,
    monthsPerYear: 12,
  },
});

/* ------------------------------------------------------------------ *
 * SSS — RA 11199
 * ------------------------------------------------------------------ */

export const SSS = verified({
  lastVerified: "2026-07-01",
  source: "SSS Schedule of Contributions, RA 11199 (Social Security Act of 2018)",
  note:
    "Total rate 15% of the monthly salary credit: 5% employee, 10% employer. Above a ₱20,000 MSC part of the contribution funds the mandatory provident (WISP) layer, but the total is unchanged.",
  reviewCadence: "Reviewed every January; rate steps legislated through 2025 are now at their final level.",
  value: {
    totalRate: 0.15,
    employeeRate: 0.05,
    employerRate: 0.1,
    mscFloor: 5_000,
    mscCeiling: 35_000,
    mscStep: 500,
    /** Employer-paid Employees' Compensation premium. */
    ecPremiumBelowThreshold: 10,
    ecPremiumAtOrAboveThreshold: 30,
    ecThresholdMsc: 15_000,
    /** MSC at or above which part of the contribution goes to the provident fund. */
    providentThresholdMsc: 20_000,
  },
});

/* ------------------------------------------------------------------ *
 * PhilHealth — RA 11223
 * ------------------------------------------------------------------ */

export const PHILHEALTH = verified({
  lastVerified: "2026-07-01",
  source: "RA 11223 (Universal Health Care Act), final scheduled premium rate",
  note:
    "Employed members split the premium equally with the employer. Self-employed, voluntary and OFW members pay the full amount.",
  reviewCadence: "Rate schedule under RA 11223 is complete; watch for PhilHealth circulars adjusting the income ceiling.",
  value: {
    premiumRate: 0.05,
    incomeFloor: 10_000,
    incomeCeiling: 100_000,
    employeeShareOfPremium: 0.5,
  },
});

/* ------------------------------------------------------------------ *
 * Pag-IBIG — HDMF Circular 460
 * ------------------------------------------------------------------ */

export const PAGIBIG = verified({
  lastVerified: "2026-07-01",
  source: "HDMF Circular No. 460, Pag-IBIG Fund membership contributions",
  note:
    "Maximum fund salary ₱10,000, so the cap is ₱200 per side. Members may voluntarily contribute more than the mandatory rate.",
  reviewCadence: "Changes only by HDMF circular; last moved in 2024.",
  value: {
    lowerBandCeiling: 1_500,
    employeeRateLowBand: 0.01,
    employeeRateHighBand: 0.02,
    employerRate: 0.02,
    maxFundSalary: 10_000,
  },
});

/* ------------------------------------------------------------------ *
 * Withholding tax — TRAIN Law, BIR RR 11-2018 Annex "E"
 * ------------------------------------------------------------------ */

export type TaxBracket = {
  /** Lower bound of the bracket; tax applies to the excess over this. */
  over: number;
  /** Prescribed withholding tax at the lower bound. */
  base: number;
  /** Marginal rate on the excess. */
  rate: number;
};

/**
 * The four published tables. The base amounts are transcribed from the BIR
 * table for each frequency and are NOT derived by dividing the monthly figures,
 * because the published values carry rounding that division does not reproduce.
 */
export const WITHHOLDING = verified({
  lastVerified: "2026-07-01",
  source:
    "BIR RR 11-2018 Annex \"E\", Revised Withholding Tax Table effective 1 January 2023 and onwards (TRAIN Law, RA 10963)",
  note:
    "Unchanged for 2026. Taxable compensation is gross basic less the employee shares of SSS, PhilHealth and Pag-IBIG.",
  reviewCadence: "Stable since 2023. Watch for a new RR if the tax code is amended.",
  value: {
    monthly: [
      { over: 0, base: 0, rate: 0 },
      { over: 20_833, base: 0, rate: 0.15 },
      { over: 33_333, base: 1_875.0, rate: 0.2 },
      { over: 66_667, base: 8_541.8, rate: 0.25 },
      { over: 166_667, base: 33_541.8, rate: 0.3 },
      { over: 666_667, base: 183_541.8, rate: 0.35 },
    ] as TaxBracket[],
    "semi-monthly": [
      { over: 0, base: 0, rate: 0 },
      { over: 10_417, base: 0, rate: 0.15 },
      { over: 16_667, base: 937.5, rate: 0.2 },
      { over: 33_333, base: 4_270.7, rate: 0.25 },
      { over: 83_333, base: 16_770.7, rate: 0.3 },
      { over: 333_333, base: 91_770.7, rate: 0.35 },
    ] as TaxBracket[],
    weekly: [
      { over: 0, base: 0, rate: 0 },
      { over: 4_808, base: 0, rate: 0.15 },
      { over: 7_692, base: 432.6, rate: 0.2 },
      { over: 15_385, base: 1_971.2, rate: 0.25 },
      { over: 38_462, base: 7_740.45, rate: 0.3 },
      { over: 153_846, base: 42_355.65, rate: 0.35 },
    ] as TaxBracket[],
    daily: [
      { over: 0, base: 0, rate: 0 },
      { over: 685, base: 0, rate: 0.15 },
      { over: 1_096, base: 61.65, rate: 0.2 },
      { over: 2_192, base: 280.85, rate: 0.25 },
      { over: 5_479, base: 1_102.6, rate: 0.3 },
      { over: 21_918, base: 6_034.3, rate: 0.35 },
    ] as TaxBracket[],
  } as Record<PayFrequency, TaxBracket[]>,
});

export const THIRTEENTH_MONTH = verified({
  lastVerified: "2026-07-01",
  source: "PD 851; NIRC Sec. 32(B)(7)(e) as amended by RA 10963 (TRAIN)",
  note:
    "13th month pay is total basic salary earned during the year divided by 12. It plus other benefits is tax exempt up to ₱90,000 a year; the excess is taxable.",
  reviewCadence: "The ₱90,000 exemption changes only by legislation.",
  value: {
    divisor: 12,
    taxExemptCeiling: 90_000,
    /** Statutory release deadline. */
    deadline: "24 December",
  },
});

/* ------------------------------------------------------------------ *
 * Premium pay — Labor Code Book III, DOLE Handbook
 * ------------------------------------------------------------------ */

export type DayTypeId =
  | "ordinary"
  | "rest-day"
  | "special"
  | "special-rest-day"
  | "regular-holiday"
  | "regular-holiday-rest-day";

export type DayTypeRule = {
  id: DayTypeId;
  label: string;
  short: string;
  /** Multiplier on the daily rate for the first 8 hours worked. */
  workedRate: number;
  /** Factor applied on top of the resulting hourly rate for overtime hours. */
  overtimeFactor: number;
  /** Multiplier on the daily rate when the employee does not report for work. */
  unworkedRate: number;
  /** Plain-language rule for not working that day. */
  unworkedRule: string;
  workedRule: string;
};

export const PREMIUM_PAY = verified({
  lastVerified: "2026-07-01",
  source:
    "Labor Code of the Philippines, Book III (Arts. 86, 87, 93, 94); DOLE Handbook on Workers' Statutory Monetary Benefits",
  note:
    "Multipliers apply to the first 8 hours. The overtime factor is applied on top of the hourly rate that already carries the day's premium.",
  reviewCadence: "Statutory. Changes only by amendment to the Labor Code.",
  value: {
    dayTypes: [
      {
        id: "ordinary",
        label: "Ordinary working day",
        short: "Ordinary",
        workedRate: 1.0,
        overtimeFactor: 1.25,
        unworkedRate: 0,
        unworkedRule: "No work, no pay",
        workedRule: "100% of the daily rate",
      },
      {
        id: "rest-day",
        label: "Rest day",
        short: "Rest day",
        workedRate: 1.3,
        overtimeFactor: 1.3,
        unworkedRate: 0,
        unworkedRule: "No pay",
        workedRule: "130% of the daily rate",
      },
      {
        id: "special",
        label: "Special non-working day",
        short: "Special",
        workedRate: 1.3,
        overtimeFactor: 1.3,
        unworkedRate: 0,
        unworkedRule: "No work, no pay unless company policy or a CBA grants it",
        workedRule: "130% of the daily rate",
      },
      {
        id: "special-rest-day",
        label: "Special non-working day falling on a rest day",
        short: "Special + rest",
        workedRate: 1.5,
        overtimeFactor: 1.3,
        unworkedRate: 0,
        unworkedRule: "No pay",
        workedRule: "150% of the daily rate",
      },
      {
        id: "regular-holiday",
        label: "Regular holiday",
        short: "Regular holiday",
        workedRate: 2.0,
        overtimeFactor: 1.3,
        unworkedRate: 1.0,
        unworkedRule:
          "100% of the daily rate, if present or on paid leave the working day before",
        workedRule: "200% of the daily rate",
      },
      {
        id: "regular-holiday-rest-day",
        label: "Regular holiday falling on a rest day",
        short: "Holiday + rest",
        workedRate: 2.6,
        overtimeFactor: 1.3,
        unworkedRate: 1.0,
        unworkedRule:
          "100% of the daily rate, if present or on paid leave the working day before",
        workedRule: "260% of the daily rate",
      },
    ] as DayTypeRule[],
    hoursPerDay: 8,
    nightDifferentialRate: 0.1,
    nightWindow: { startHour: 22, endHour: 6, label: "10:00 PM to 6:00 AM" },
  },
});

export const DAY_TYPES = PREMIUM_PAY.value.dayTypes;

/* ------------------------------------------------------------------ *
 * Separation pay — Labor Code Arts. 298–299
 * ------------------------------------------------------------------ */

export type SeparationGroundId =
  | "redundancy"
  | "labor-saving"
  | "closure-no-losses"
  | "retrenchment"
  | "closure-losses"
  | "disease";

export type SeparationGround = {
  id: SeparationGroundId;
  label: string;
  /** Months of pay credited per year of service. */
  monthsPerYear: number;
  basis: string;
};

export const SEPARATION = verified({
  lastVerified: "2026-07-01",
  source: "Labor Code Arts. 298 and 299 (formerly 283 and 284)",
  note:
    "A fraction of at least six months counts as one whole year. The statutory floor is one month pay; whichever is higher applies. Dismissal for just cause under Art. 297 carries no separation pay.",
  reviewCadence: "Statutory.",
  value: {
    grounds: [
      {
        id: "redundancy",
        label: "Redundancy",
        monthsPerYear: 1,
        basis: "Art. 298 — one month pay per year of service",
      },
      {
        id: "labor-saving",
        label: "Installation of labor-saving device",
        monthsPerYear: 1,
        basis: "Art. 298 — one month pay per year of service",
      },
      {
        id: "closure-no-losses",
        label: "Closure not due to serious business losses",
        monthsPerYear: 1,
        basis: "Art. 298 — one month pay per year of service",
      },
      {
        id: "retrenchment",
        label: "Retrenchment to prevent losses",
        monthsPerYear: 0.5,
        basis: "Art. 298 — one half month pay per year of service",
      },
      {
        id: "closure-losses",
        label: "Closure due to serious business losses",
        monthsPerYear: 0.5,
        basis: "Art. 298 — one half month pay per year of service",
      },
      {
        id: "disease",
        label: "Disease, where continued employment is prohibited",
        monthsPerYear: 0.5,
        basis: "Art. 299 — one half month pay per year of service",
      },
    ] as SeparationGround[],
    fractionCountsAsYearFrom: 6,
    minimumMonths: 1,
  },
});

/* ------------------------------------------------------------------ *
 * Retirement pay — RA 7641
 * ------------------------------------------------------------------ */

export const RETIREMENT = verified({
  lastVerified: "2026-07-01",
  source: "RA 7641 (Retirement Pay Law), Labor Code Art. 302",
  note:
    "Applies where there is no retirement plan, or where the company plan is less favourable. A more favourable company plan or CBA governs instead.",
  reviewCadence: "Statutory.",
  value: {
    optionalRetirementAge: 60,
    compulsoryRetirementAge: 65,
    minimumYearsOfService: 5,
    /** "One half month salary" is defined by law as 22.5 days. */
    halfMonthDays: 22.5,
    components: [
      { label: "15 days salary", days: 15, rule: "Art. 302, base component" },
      {
        label: "Cash equivalent of 5 days service incentive leave",
        days: 5,
        rule: "Art. 302 in relation to Art. 95",
      },
      {
        label: "One twelfth of the 13th month pay",
        days: 2.5,
        rule: "30 days ÷ 12 = 2.5 days",
      },
    ],
    daysPerMonthDivisor: 30,
    fractionCountsAsYearFrom: 6,
  },
});

/* ------------------------------------------------------------------ *
 * Final pay — DOLE Labor Advisory 06-20
 * ------------------------------------------------------------------ */

export const FINAL_PAY = verified({
  lastVerified: "2026-07-01",
  source: "DOLE Labor Advisory No. 06, series of 2020",
  note:
    "Final pay is to be released within 30 calendar days from the date of separation, unless a more favourable company policy or CBA applies. A Certificate of Employment must be issued within 3 days of the request.",
  reviewCadence: "Advisory. Stable since 2020.",
  value: {
    releaseDays: 30,
    certificateOfEmploymentDays: 3,
    serviceIncentiveLeaveDays: 5,
    daysPerMonthDivisor: 26,
  },
});

/* ------------------------------------------------------------------ *
 * Service incentive leave and other leaves
 * ------------------------------------------------------------------ */

export const SERVICE_INCENTIVE_LEAVE = verified({
  lastVerified: "2026-07-01",
  source: "Labor Code Art. 95",
  note:
    "Five days paid leave a year after one year of service, convertible to cash if unused. Establishments with fewer than 10 employees are exempt, as are those already granting at least five days of leave.",
  reviewCadence: "Statutory.",
  value: { days: 5, minimumMonthsOfService: 12 },
});

export const MATERNITY = verified({
  lastVerified: "2026-07-01",
  source: "RA 11210 (105-Day Expanded Maternity Leave Law) and its IRR",
  note:
    "Days are calendar days, paid. A solo parent under RA 8972 gets an additional 15 days. Up to 7 days may be transferred to the child's father, or in his absence to an alternate caregiver.",
  reviewCadence: "Statutory.",
  value: {
    liveBirthDays: 105,
    soloParentAdditionalDays: 15,
    miscarriageDays: 60,
    transferableDays: 7,
    optionalExtensionDaysUnpaid: 30,
    paternityLeaveDays: 7,
  },
});

/* ------------------------------------------------------------------ *
 * Discounts — senior citizen, PWD, solo parent
 * ------------------------------------------------------------------ */

export const DISCOUNTS = verified({
  lastVerified: "2026-07-01",
  source:
    "RA 9994 (Expanded Senior Citizens Act), RA 10754 (PWD), RA 11861 (Expanded Solo Parents Welfare Act)",
  note:
    "The 20% discount is computed on the VAT-exclusive price, and the sale is exempt from VAT. Being charged 12% VAT on top of a 20% discount is incorrect.",
  reviewCadence: "Statutory.",
  value: {
    seniorDiscountRate: 0.2,
    pwdDiscountRate: 0.2,
    soloParentDiscountRate: 0.1,
    vatRate: 0.12,
    soloParentIncomeCeiling: 250_000,
  },
});

/* ------------------------------------------------------------------ *
 * OFW placement fees and red flags — DMW / RA 8042 as amended
 * ------------------------------------------------------------------ */

export const OFW = verified({
  lastVerified: "2026-07-01",
  source:
    "RA 8042 as amended by RA 10022 (Migrant Workers Act); DMW rules on placement and recruitment",
  note:
    "No placement fee may be collected before an employment contract is signed, and no fee at all for domestic workers or for destinations whose rules prohibit it. Fees are always receipted.",
  reviewCadence: "Watch DMW circulars.",
  value: {
    maxPlacementFeeMonths: 1,
    verificationUrl: "https://dmw.gov.ph/licensed-recruitment-agencies",
    stopScore: 4,
    disqualifyingWeight: 3,
  },
});

/* ------------------------------------------------------------------ *
 * Where to raise it
 * ------------------------------------------------------------------ */

export const DISPUTE_PATHWAY = verified({
  lastVerified: "2026-07-01",
  source: "RA 10396; DOLE Department Order 151-16 (Single Entry Approach)",
  note:
    "SEnA is a mandatory 30-day conciliation-mediation step for most labour issues. It is free and does not require a lawyer.",
  reviewCadence: "Stable.",
  value: {
    days: 30,
    hotline: "DOLE Hotline 1349",
    channel: "Any DOLE Regional or Field Office, or the DOLE website",
  },
});

/* ------------------------------------------------------------------ *
 * The maintenance schedule rendered on the Rates screen
 * ------------------------------------------------------------------ */

export const RATE_SCHEDULES = [
  { key: "SSS", schedule: SSS as Verified<unknown> },
  { key: "PhilHealth", schedule: PHILHEALTH as Verified<unknown> },
  { key: "Pag-IBIG", schedule: PAGIBIG as Verified<unknown> },
  { key: "Withholding tax", schedule: WITHHOLDING as Verified<unknown> },
  { key: "13th month pay", schedule: THIRTEENTH_MONTH as Verified<unknown> },
  { key: "Premium pay", schedule: PREMIUM_PAY as Verified<unknown> },
  { key: "Separation pay", schedule: SEPARATION as Verified<unknown> },
  { key: "Retirement pay", schedule: RETIREMENT as Verified<unknown> },
  { key: "Final pay", schedule: FINAL_PAY as Verified<unknown> },
  { key: "Service incentive leave", schedule: SERVICE_INCENTIVE_LEAVE as Verified<unknown> },
  { key: "Maternity and paternity leave", schedule: MATERNITY as Verified<unknown> },
  { key: "Discount entitlements", schedule: DISCOUNTS as Verified<unknown> },
  { key: "OFW placement rules", schedule: OFW as Verified<unknown> },
  { key: "Pay period conventions", schedule: PERIOD_CONVENTION as Verified<unknown> },
] as const;

export const DISCLAIMER =
  "Estimates for checking a payslip or planning payroll, not legal or tax advice. In a dispute the controlling figures are the current DOLE, BIR, SSS, PhilHealth and Pag-IBIG issuances.";

export const FEE_CAVEAT =
  "Fees change by circular and vary by office and purpose. Confirm with the agency before making a long trip.";
