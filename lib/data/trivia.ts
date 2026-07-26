/**
 * "Alam mo ba?" — the entitlements people are most surprised to learn they have.
 *
 * These are the entertaining part of the app, so the rule still applies: every
 * one names the law it comes from. A fun fact that cannot be checked is just a
 * rumour, and this app's whole premise is that a number is traceable.
 *
 * Keep them surprising. A fact that everybody already knows is not worth a card.
 */

export type Trivia = {
  id: string;
  /** The hook. Short enough to read in one glance. */
  fact: string;
  /** Why it matters, in plain words. */
  detail: string;
  law: string;
  /** Where tapping through goes. */
  href?: string;
  /** Rendered large behind the card. */
  emoji: string;
};

export const TRIVIA: Trivia[] = [
  {
    id: "22-5-days",
    emoji: "🧮",
    fact: "Your “half month” of retirement pay is actually 22.5 days.",
    detail:
      "Not 15. The law defines one half month salary as 15 days, plus the cash value of 5 days service incentive leave, plus one twelfth of the 13th month pay. Almost nobody is shown the arithmetic.",
    law: "RA 7641; Labor Code Art. 302",
    href: "/kalkula/retirement",
  },
  {
    id: "senior-vat",
    emoji: "🧾",
    fact: "Being charged VAT on top of a senior discount is wrong.",
    detail:
      "The sale is VAT exempt. The 12% comes off first, then the 20% discount applies to what is left. If the receipt adds VAT back after the discount, the computation is incorrect.",
    law: "RA 9994; RA 10754",
    href: "/karapatan/discounts",
  },
  {
    id: "coe-3-days",
    emoji: "📄",
    fact: "A Certificate of Employment is due within 3 days of asking.",
    detail:
      "It is not conditional on your clearance being finished, and it is not a favour. Three days from the request.",
    law: "DOLE Labor Advisory 06-20",
    href: "/kalkula/final-pay",
  },
  {
    id: "13th-not-bonus",
    emoji: "🎁",
    fact: "13th month pay is not a bonus.",
    detail:
      "It is a legal entitlement for every rank-and-file employee who worked at least one month in the year. It is pro-rated, it survives resignation, and it cannot be made discretionary.",
    law: "PD 851",
    href: "/kalkula/thirteenth-month",
  },
  {
    id: "six-months",
    emoji: "⏳",
    fact: "Six months and one day of probation makes you regular.",
    detail:
      "Probationary employment cannot exceed six months. An employee allowed to keep working past it is a regular employee, whatever the contract says.",
    law: "Labor Code Art. 296",
    href: "/karapatan/red-flags",
  },
  {
    id: "standards",
    emoji: "📋",
    fact: "If nobody told you the standards for regularisation, you are already regular.",
    detail:
      "The employer has to make the reasonable standards known at the time of hiring. Where they were never communicated, the employee is deemed regular.",
    law: "Labor Code Art. 296; Omnibus Rules Book VI",
    href: "/karapatan/red-flags",
  },
  {
    id: "maternity-unlimited",
    emoji: "👶",
    fact: "Maternity leave has no limit on how many times you can claim it.",
    detail:
      "The old four-pregnancy cap was removed. 105 days for every instance of pregnancy, married or not, plus 15 more if you are a solo parent.",
    law: "RA 11210",
    href: "/karapatan/leave",
  },
  {
    id: "maternity-transfer",
    emoji: "🤝",
    fact: "A mother can hand 7 of her maternity days to the father.",
    detail:
      "Whether or not they are married. If the father is absent, dead or incapacitated, the days can go to a relative within the fourth degree, or to the partner sharing the household.",
    law: "RA 11210 Sec. 6",
    href: "/karapatan/leave",
  },
  {
    id: "paternity-separate",
    emoji: "👨‍🍼",
    fact: "Paternity leave is separate from the days transferred by the mother.",
    detail:
      "7 days under RA 8187 for a married father, plus up to 7 more if the mother allocates them. Fathers routinely take only one of the two.",
    law: "RA 8187 and RA 11210",
    href: "/karapatan/leave",
  },
  {
    id: "final-pay-30",
    emoji: "📆",
    fact: "Final pay is due within 30 days of separation.",
    detail:
      "Not “after clearance”, not “next payroll run”. Thirty calendar days from the date of separation, unless company policy is more generous.",
    law: "DOLE Labor Advisory 06-20",
    href: "/kalkula/final-pay",
  },
  {
    id: "sil-cash",
    emoji: "💰",
    fact: "Unused service incentive leave converts to cash.",
    detail:
      "Five days a year after one year of service, and whatever you did not use is payable in cash — including when you leave.",
    law: "Labor Code Art. 95",
    href: "/karapatan/leave",
  },
  {
    id: "holiday-day-before",
    emoji: "🎏",
    fact: "You get paid for a regular holiday you did not work.",
    detail:
      "100% of your daily rate, as long as you were present or on paid leave the working day before. Special non-working days do not work this way.",
    law: "Labor Code Art. 94",
    href: "/kalkula/holidays",
  },
  {
    id: "night-diff",
    emoji: "🌙",
    fact: "Every hour between 10pm and 6am is worth 10% more.",
    detail:
      "Night differential is automatic, not a perk. It stacks on whatever rate the day already carries, so a night shift on a holiday compounds.",
    law: "Labor Code Art. 86",
    href: "/kalkula/premium-pay",
  },
  {
    id: "holiday-rest-day",
    emoji: "🔥",
    fact: "A regular holiday landing on your rest day pays 260%.",
    detail:
      "Two hundred percent for the holiday, then thirty percent on top for the rest day. Add overtime and night hours and it climbs from there.",
    law: "Labor Code Book III",
    href: "/kalkula/premium-pay",
  },
  {
    id: "sena-free",
    emoji: "⚖️",
    fact: "You can bring a pay dispute to DOLE without a lawyer, for free.",
    detail:
      "The Single Entry Approach is a 30-day conciliation step at any DOLE office. No filing fee, no lawyer, no case number to start.",
    law: "RA 10396; DO 151-16",
  },
  {
    id: "pagibig-cap",
    emoji: "🏠",
    fact: "Pag-IBIG stops taking more once you hit ₱200.",
    detail:
      "The fund salary is capped at ₱10,000, so 2% is ₱200 and that is the maximum. If your payslip shows more, you either opted in voluntarily or something needs asking about.",
    law: "HDMF Circular 460",
    href: "/kalkula/payslip-check",
  },
  {
    id: "sss-ceiling",
    emoji: "📈",
    fact: "SSS stops rising at a ₱35,000 salary credit.",
    detail:
      "Earn ₱35,000 or ₱350,000 and the employee share is the same ₱1,750. The contribution is on the salary credit, not on your actual salary.",
    law: "RA 11199",
    href: "/kalkula/net-pay",
  },
  {
    id: "tax-exempt-20833",
    emoji: "🪙",
    fact: "Below ₱20,833 a month, you owe no withholding tax at all.",
    detail:
      "That is taxable income — after SSS, PhilHealth and Pag-IBIG come off — so the actual salary where tax starts is a little higher than people assume.",
    law: "BIR RR 11-2018 Annex E",
    href: "/kalkula/net-pay",
  },
  {
    id: "90k-exempt",
    emoji: "🎄",
    fact: "₱90,000 of 13th month and bonuses is tax free.",
    detail:
      "Combined, per year. Only the amount above the ceiling is added to your taxable compensation.",
    law: "NIRC Sec. 32(B)(7)(e), as amended by TRAIN",
    href: "/kalkula/thirteenth-month",
  },
  {
    id: "placement-fee",
    emoji: "✈️",
    fact: "No agency may take a placement fee before you sign a contract.",
    detail:
      "And domestic workers pay no placement fee at all. Money asked for before a signed contract is the single clearest sign to walk away.",
    law: "RA 8042 as amended by RA 10022",
    href: "/karapatan/ofw",
  },
  {
    id: "vawc-leave",
    emoji: "🛡️",
    fact: "There are 10 days of paid leave for victims of abuse.",
    detail:
      "Available to a woman employee with a pending action under RA 9262, in addition to every other leave she holds. The employer must keep it confidential.",
    law: "RA 9262",
    href: "/karapatan/leave",
  },
  {
    id: "gynae-leave",
    emoji: "🏥",
    fact: "Two months of paid leave exists for gynaecological surgery.",
    detail:
      "The special leave benefit for women, on top of sick leave, for anyone with six months of service in the last year. Very few people know it exists.",
    law: "RA 9710, the Magna Carta of Women",
    href: "/karapatan/leave",
  },
  {
    id: "separation-6-months",
    emoji: "📊",
    fact: "Six months of service counts as a whole year in separation pay.",
    detail:
      "Five years and seven months is credited as six years. That fraction is worth a full month of pay in a redundancy.",
    law: "Labor Code Art. 298",
    href: "/kalkula/separation",
  },
  {
    id: "kasambahay",
    emoji: "🏡",
    fact: "A household employer pays their kasambahay's SSS, PhilHealth and Pag-IBIG.",
    detail:
      "In full, not split, where the kasambahay earns below ₱5,000 a month. Plus a rest day, a written contract, and 13th month pay.",
    law: "RA 10361, the Batas Kasambahay",
  },
  {
    id: "payslip-itemised",
    emoji: "🔍",
    fact: "You are entitled to see how every deduction was computed.",
    detail:
      "The employer has to keep a payroll showing the rate of pay and the amount and purpose of each deduction. Asking for the breakdown is not a confrontation.",
    law: "Labor Code Art. 113; Omnibus Rules Book III Rule X",
    href: "/kalkula/payslip-check",
  },
];

/** A stable pick for the day, so the card does not reshuffle on every render. */
export function triviaOfTheDay(date = new Date()): Trivia {
  const dayNumber = Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 86_400_000
  );
  return TRIVIA[dayNumber % TRIVIA.length];
}

export function nextTrivia(current: Trivia): Trivia {
  const i = TRIVIA.findIndex((t) => t.id === current.id);
  return TRIVIA[(i + 1) % TRIVIA.length];
}
