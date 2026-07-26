import { CALCULATORS, HOLIDAY_ENTRY } from "./calculators";
import { formatHolidayDate, HOLIDAYS_2026, HOLIDAY_TYPE_LABEL } from "./holidays";
import { DISCOUNT_ENTITLEMENTS, LEAVE_ENTITLEMENTS } from "./karapatan";
import { TRANSACTIONS } from "./transactions";

/** One box, all content: transactions, calculators, leave types, holidays. */
export type SearchHit = {
  href: string;
  title: string;
  subtitle: string;
  group: "Calculator" | "Papeles" | "Karapatan" | "Holiday";
  haystack: string;
};

const INDEX: SearchHit[] = [
  ...CALCULATORS.map((c) => ({
    href: c.href,
    title: c.name,
    subtitle: c.blurb,
    group: "Calculator" as const,
    haystack: [c.name, c.blurb, ...c.keywords].join(" ").toLowerCase(),
  })),
  {
    href: HOLIDAY_ENTRY.href,
    title: HOLIDAY_ENTRY.name,
    subtitle: HOLIDAY_ENTRY.blurb,
    group: "Calculator",
    haystack: [HOLIDAY_ENTRY.name, HOLIDAY_ENTRY.blurb, ...HOLIDAY_ENTRY.keywords]
      .join(" ")
      .toLowerCase(),
  },
  ...TRANSACTIONS.map((t) => ({
    href: `/papeles/${t.id}`,
    title: t.name,
    subtitle: `${t.agency} · ${t.category}`,
    group: "Papeles" as const,
    haystack: [t.name, t.agency, t.why, t.category, ...(t.keywords ?? [])]
      .join(" ")
      .toLowerCase(),
  })),
  ...LEAVE_ENTITLEMENTS.map((l) => ({
    href: "/karapatan/leave",
    title: l.name,
    subtitle: `${l.days} · ${l.law}`,
    group: "Karapatan" as const,
    haystack: [l.name, l.law, l.days, l.who].join(" ").toLowerCase(),
  })),
  ...DISCOUNT_ENTITLEMENTS.map((d) => ({
    href: "/karapatan/discounts",
    title: `${d.name} discount`,
    subtitle: `${d.rate} · ${d.law}`,
    group: "Karapatan" as const,
    haystack: [d.name, d.law, d.rate, ...d.covers].join(" ").toLowerCase(),
  })),
  {
    href: "/karapatan/minimum-wage",
    title: "Minimum wage checker",
    subtitle: "Daily wage floor by region and sector",
    group: "Karapatan",
    haystack: "minimum wage sahod floor region wage order nwpc rtwpb daily rate".toLowerCase(),
  },
  {
    href: "/karapatan/red-flags",
    title: "Contract and status check",
    subtitle: "Probation, regularisation, endo, payslips, deductions",
    group: "Karapatan",
    haystack: "probationary regular endo contractual contract red flag six months quitclaim payslip deduction cash bond",
  },
  {
    href: "/karapatan/philhealth",
    title: "PhilHealth benefits",
    subtitle: "Konsulta, case rates, Z Benefits, No Balance Billing",
    group: "Karapatan",
    haystack: "philhealth konsulta case rate z benefit no balance billing hospital admission premium",
  },
  {
    href: "/karapatan/ofw",
    title: "OFW agency check",
    subtitle: "Verification steps, placement fees, red flags",
    group: "Karapatan",
    haystack: "ofw agency recruiter dmw poea placement fee illegal recruitment abroad overseas",
  },
  {
    href: "/ako/rates",
    title: "Rates and sources",
    subtitle: "Every statutory figure with its source and last verified date",
    group: "Karapatan",
    haystack: "rates sources contribution table schedule verified sss philhealth pagibig bir",
  },
  ...HOLIDAYS_2026.map((h) => ({
    href: "/kalkula/holidays",
    title: h.name,
    subtitle: `${formatHolidayDate(h)} · ${HOLIDAY_TYPE_LABEL[h.type]}`,
    group: "Holiday" as const,
    haystack: [h.name, HOLIDAY_TYPE_LABEL[h.type], formatHolidayDate(h)].join(" ").toLowerCase(),
  })),
];

export function searchEverything(query: string, limit = 12): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return INDEX.filter((hit) => terms.every((term) => hit.haystack.includes(term))).slice(
    0,
    limit
  );
}
