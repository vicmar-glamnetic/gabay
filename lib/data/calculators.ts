import type { Role } from "../store/useAppStore";

export type CalculatorEntry = {
  id: string;
  href: string;
  name: string;
  blurb: string;
  /** Words a user might search for that are not in the name. */
  keywords: string[];
  roles?: Role[];
};

export const CALCULATORS: CalculatorEntry[] = [
  {
    id: "net-pay",
    href: "/kalkula/net-pay",
    name: "Contributions and net pay",
    blurb: "The full payslip ledger down to take-home, plus what it costs the employer.",
    keywords: ["sss", "philhealth", "pagibig", "pag-ibig", "tax", "withholding", "deduction", "sahod", "take home", "payslip", "salary"],
  },
  {
    id: "payslip-check",
    href: "/kalkula/payslip-check",
    name: "Payslip checker",
    blurb: "Enter what your payslip says. Get a line-by-line comparison against the schedule.",
    keywords: ["wrong deduction", "overdeducted", "check payslip", "mali", "difference", "verify"],
    roles: ["empleyado", "freelancer"],
  },
  {
    id: "premium-pay",
    href: "/kalkula/premium-pay",
    name: "Holiday, overtime and night pay",
    blurb: "Pay for one day, by day type, with overtime and night differential.",
    keywords: ["holiday pay", "overtime", "ot", "night differential", "rest day", "premium", "double pay"],
  },
  {
    id: "thirteenth-month",
    href: "/kalkula/thirteenth-month",
    name: "13th month pay",
    blurb: "Total basic salary earned ÷ 12, pro-rated for a partial year.",
    keywords: ["13th", "thirteenth", "bonus", "christmas", "pd 851"],
  },
  {
    id: "separation",
    href: "/kalkula/separation",
    name: "Separation pay",
    blurb: "One month or half a month per year, by ground for separation.",
    keywords: ["redundancy", "retrenchment", "closure", "laid off", "tanggal", "termination"],
  },
  {
    id: "final-pay",
    href: "/kalkula/final-pay",
    name: "Final pay",
    blurb: "Last pay on separation: unpaid salary, leave conversion, pro-rated 13th month.",
    keywords: ["last pay", "back pay", "clearance", "resign", "quitclaim", "certificate of employment"],
  },
  {
    id: "retirement",
    href: "/kalkula/retirement",
    name: "Retirement pay",
    blurb: "22.5 days per year of service under RA 7641, broken down.",
    keywords: ["ra 7641", "retire", "60", "65", "pension", "22.5"],
  },
  {
    id: "job-offer",
    href: "/kalkula/job-offer",
    name: "Job offer preview",
    blurb: "Take-home from an offered salary, annualised — and two offers side by side.",
    keywords: ["offer", "new job", "compare", "salary negotiation", "annual"],
  },
];

export const HOLIDAY_ENTRY = {
  id: "holidays",
  href: "/kalkula/holidays",
  name: "2026 holiday calendar",
  blurb: "Every regular and special day, with the worked and unworked rule.",
  keywords: ["holiday", "piyesta", "araw", "calendar", "regular holiday", "special non-working"],
};

/** Home shortcut tiles, ordered by the role picked during onboarding. */
export const SHORTCUTS_BY_ROLE: Record<Role, { href: string; label: string; icon: string }[]> = {
  empleyado: [
    { href: "/kalkula/payslip-check", label: "Payslip checker", icon: "receipt-outline" },
    { href: "/karapatan/leave", label: "Leave entitlements", icon: "calendar-outline" },
    { href: "/karapatan/minimum-wage", label: "Minimum wage", icon: "trending-up-outline" },
    { href: "/kalkula/net-pay", label: "Net pay", icon: "wallet-outline" },
  ],
  hr: [
    { href: "/kalkula/net-pay", label: "Net pay", icon: "wallet-outline" },
    { href: "/kalkula/holidays", label: "Holidays", icon: "calendar-outline" },
    { href: "/ako/rates", label: "Contribution rates", icon: "documents-outline" },
    { href: "/kalkula/thirteenth-month", label: "13th month", icon: "gift-outline" },
  ],
  freelancer: [
    { href: "/kalkula/net-pay", label: "Contributions", icon: "wallet-outline" },
    { href: "/karapatan/philhealth", label: "PhilHealth benefits", icon: "medkit-outline" },
    { href: "/papeles/tin-registration", label: "TIN registration", icon: "document-text-outline" },
    { href: "/ako/rates", label: "Rates and sources", icon: "documents-outline" },
  ],
  ofw: [
    { href: "/karapatan/ofw", label: "Agency check", icon: "shield-checkmark-outline" },
    { href: "/karapatan/philhealth", label: "PhilHealth for OFWs", icon: "medkit-outline" },
    { href: "/papeles/passport-new", label: "Passport", icon: "airplane-outline" },
    { href: "/kalkula/net-pay", label: "Contributions", icon: "wallet-outline" },
  ],
};

export const DEFAULT_SHORTCUTS = SHORTCUTS_BY_ROLE.empleyado;
