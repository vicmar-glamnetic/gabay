/**
 * Rights and entitlements content.
 *
 * Rule for this whole file: state the law, do not give legal advice. Every
 * entitlement names the statute it comes from, on screen, next to the figure.
 * Nothing here tells a user they have a case, predicts an outcome, drafts a
 * complaint, or characterises an employer's conduct as illegal.
 */

/* --------------------------- Leave entitlements --------------------------- */

export type LeaveEntitlement = {
  id: string;
  name: string;
  law: string;
  days: string;
  paid: string;
  who: string;
  toFile: string[];
  notes?: string[];
};

export const LEAVE_ENTITLEMENTS: LeaveEntitlement[] = [
  {
    id: "sil",
    name: "Service incentive leave",
    law: "Labor Code Art. 95",
    days: "5 days a year",
    paid: "Paid, and convertible to cash if unused at the end of the year",
    who: "Every employee who has rendered at least one year of service.",
    toFile: [
      "A leave application under company policy — there is no government form",
      "Nothing is filed with DOLE",
    ],
    notes: [
      "Establishments regularly employing fewer than ten workers are exempt, as are those already granting at least five days of leave, and field personnel whose hours cannot be determined.",
      "Where a company grants vacation leave of at least five days, that satisfies the requirement. It is not five days on top.",
      "Unused days are convertible to their cash equivalent on separation.",
    ],
  },
  {
    id: "maternity",
    name: "Expanded maternity leave",
    law: "RA 11210, the 105-Day Expanded Maternity Leave Law",
    days: "105 calendar days for a live birth, 60 for a miscarriage or emergency termination, plus 15 more for a solo parent",
    paid: "Paid. SSS pays the maternity benefit; the employer pays the salary differential where the benefit falls short of full pay.",
    who: "Every female worker, in the public or private sector, whether or not married, for every instance of pregnancy. There is no longer a limit on the number of times it may be claimed.",
    toFile: [
      "Notify your employer of the pregnancy and the expected date of delivery",
      "SSS Maternity Notification, filed through the employer or directly for self-employed and voluntary members",
      "SSS Maternity Benefit Application after delivery, with the PSA birth certificate or medical certificate",
      "A written allocation notice, if transferring days to the father or an alternate caregiver",
    ],
    notes: [
      "Up to 7 days may be transferred to the child's father, whether or not married to the mother. In his absence, death or incapacity, the days may go to a relative within the fourth degree of consanguinity or to the current partner sharing the same household.",
      "An extra 30 days without pay may be taken after a live birth, on written notice to the employer at least 45 days before the end of the leave.",
      "Late notification to SSS is the most common reason a claim stalls.",
    ],
  },
  {
    id: "paternity",
    name: "Paternity leave",
    law: "RA 8187, the Paternity Leave Act",
    days: "7 days",
    paid: "Paid, at full pay, by the employer",
    who: "A married male employee living with his legitimate wife, for the first four deliveries.",
    toFile: [
      "Notice to the employer of the pregnancy and the expected date of delivery",
      "PSA marriage certificate and the child's birth certificate on return",
    ],
    notes: [
      "Separate from, and in addition to, any days transferred to the father under RA 11210.",
      "Must be availed of within 60 days of the delivery.",
    ],
  },
  {
    id: "solo-parent",
    name: "Parental leave for solo parents",
    law: "RA 8972 as amended by RA 11861, the Expanded Solo Parents Welfare Act",
    days: "7 working days a year",
    paid: "Paid",
    who: "A solo parent who has rendered at least six months of service, whether continuous or broken, and who holds a Solo Parent Identification Card issued by the City or Municipal Social Welfare and Development Office.",
    toFile: [
      "Solo Parent Identification Card application at the City or Municipal Social Welfare and Development Office",
      "A leave application to the employer, supported by the Solo Parent ID",
    ],
    notes: [
      "The card is renewed annually and the leave does not accumulate — unused days are not carried over.",
      "RA 11861 also grants a solo parent earning below ₱250,000 a year a 10% discount and VAT exemption on baby's milk, food and micronutrient supplements, medicines and vaccines for a child up to six years old.",
      "A solo parent is also entitled to 15 additional days of maternity leave under RA 11210.",
    ],
  },
  {
    id: "vawc",
    name: "Leave for victims of violence against women and their children",
    law: "RA 9262, the Anti-Violence Against Women and Their Children Act",
    days: "Up to 10 days",
    paid: "Paid",
    who: "A woman employee who is a victim of physical, sexual, psychological or economic abuse as defined by RA 9262, in the public or private sector.",
    toFile: [
      "A certification from the Punong Barangay, the Barangay Kagawad, the prosecutor, or the clerk of court that an action under RA 9262 is pending",
      "A leave application to the employer, supported by that certification",
    ],
    notes: [
      "Extendible when the necessity arises as specified in a protection order.",
      "The employer is required to keep the matter confidential.",
      "The days are in addition to any other paid leave the employee holds.",
    ],
  },
  {
    id: "special-leave-women",
    name: "Special leave benefit for women",
    law: "RA 9710, the Magna Carta of Women",
    days: "Up to 2 months",
    paid: "Paid, based on gross monthly compensation",
    who: "A woman employee who has rendered at least six months of aggregate service in the last twelve months and who undergoes surgery due to a gynaecological disorder.",
    toFile: [
      "Notice to the employer of the intended date of surgery, at least five days before, where the surgery is not an emergency",
      "A medical certificate from the attending physician specifying the gynaecological disorder and the surgery performed",
    ],
    notes: [
      "Applies to surgery for gynaecological disorders as certified by a competent physician. It is not the same as sick leave.",
      "The leave is non-cumulative and non-convertible to cash.",
    ],
  },
];

/* --------------------- Employment status and red flags --------------------- */

export type ContractFlag = {
  id: string;
  label: string;
  detail: string;
  law: string;
};

export const CONTRACT_FLAGS: ContractFlag[] = [
  {
    id: "probation-over-six",
    label: "The probationary period is longer than six months",
    detail:
      "Probationary employment shall not exceed six months from the date the employee started working, unless it is covered by an apprenticeship agreement stipulating a longer period. An employee allowed to work after the probationary period is considered a regular employee.",
    law: "Labor Code Art. 296",
  },
  {
    id: "no-standards",
    label: "The standards for becoming regular were never communicated",
    detail:
      "The employer must make known to the probationary employee the reasonable standards for regularisation at the time of engagement. Where standards are not communicated, the employee is deemed a regular employee.",
    law: "Labor Code Art. 296; Omnibus Rules Book VI",
  },
  {
    id: "repeated-fixed-term",
    label: "Repeated fixed-term contracts that end just short of six months",
    detail:
      "This is the pattern people call endo. Successive short contracts, sometimes with a gap in between, that keep an employee from reaching regular status. The test the law applies is whether the work performed is necessary or desirable to the usual business of the employer.",
    law: "Labor Code Arts. 295 and 296; DOLE Department Order 174-17",
  },
  {
    id: "agency-deployed",
    label: "You are deployed by an agency but supervised entirely by the client",
    detail:
      "Contracting is permitted where the contractor has substantial capital, carries on an independent business, and exercises control over the work. Where the client controls the work and the contractor supplies only workers, the arrangement is labour-only contracting.",
    law: "Labor Code Art. 106; DOLE Department Order 174-17",
  },
  {
    id: "no-written-contract",
    label: "There is no written contract at all",
    detail:
      "A written contract is not required for employment to exist, and its absence does not remove any statutory entitlement. But without one, the terms are harder to establish, so ask for a copy in writing.",
    law: "Labor Code Art. 295",
  },
  {
    id: "no-payslip",
    label: "No payslip is issued, or the deductions are not itemised",
    detail:
      "An employer is required to keep a payroll showing, among other things, the rate of pay and the amount and purpose of every deduction. An employee is entitled to see how their pay was computed.",
    law: "Labor Code Art. 113; Omnibus Rules Book III Rule X",
  },
  {
    id: "deductions-not-authorised",
    label: "Deductions you never authorised in writing",
    detail:
      "Deductions from wages are limited to those authorised by law, those where the employee has given written authorisation for payment to a third person, and insurance premiums with the employee's consent.",
    law: "Labor Code Arts. 113 and 114",
  },
  {
    id: "cash-bond",
    label: "A cash bond or deposit is taken from your wages",
    detail:
      "Deposits to answer for loss or damage to tools, materials or equipment are allowed only where the employer is engaged in a trade where that practice is recognised, or where it is necessary as determined by the Secretary of Labor.",
    law: "Labor Code Art. 114",
  },
  {
    id: "no-13th",
    label: "No 13th month pay, or it is called a discretionary bonus",
    detail:
      "13th month pay is a legal entitlement for every rank-and-file employee who worked at least one month in the calendar year. It is not a bonus and it is not discretionary.",
    law: "PD 851",
  },
  {
    id: "quitclaim-pressure",
    label: "Asked to sign a quitclaim before seeing the computation",
    detail:
      "A quitclaim is a document waiving further claims. Ask for the itemised computation of the final pay before signing anything, so you know what you are agreeing to.",
    law: "DOLE Labor Advisory 06-20 on final pay",
  },
];

/* ---------------------------- Discounts ---------------------------- */

export type DiscountEntitlement = {
  id: string;
  name: string;
  law: string;
  rate: string;
  vat: string;
  covers: string[];
  id_required: string;
  notes: string[];
};

export const DISCOUNT_ENTITLEMENTS: DiscountEntitlement[] = [
  {
    id: "senior",
    name: "Senior citizen",
    law: "RA 9994, the Expanded Senior Citizens Act of 2010",
    rate: "20% discount",
    vat: "Exempt from the 12% VAT. The discount is computed on the VAT-exclusive price.",
    covers: [
      "Medicines, and influenza and pneumococcal vaccines",
      "Medical and dental services, diagnostic and laboratory fees in all private facilities",
      "Professional fees of attending physicians and licensed health workers in private facilities",
      "Restaurants, including fast food, and food delivery for the senior's own consumption",
      "Hotels, lodging establishments, restaurants and recreation centres",
      "Theatres, cinemas, concert halls, circuses and other places of culture and leisure",
      "Land, air and sea transportation fares, including domestic flights and inter-island travel",
      "Funeral and burial services for the senior citizen",
      "A separate 5% discount on the monthly utilisation of water and electricity, subject to conditions on the meter being in the senior's name and consumption limits",
    ],
    id_required:
      "The Senior Citizen Identification Card issued by the Office of the Senior Citizens Affairs of the city or municipality of residence. A passport or a government ID showing age is also accepted for the 20% discount.",
    notes: [
      "Being charged 12% VAT on top of a 20% senior discount is incorrect. The sale is VAT exempt, so VAT comes off before the discount is applied.",
      "For a group bill at a restaurant, the discount covers the senior's share, computed as the total divided by the number of diners.",
      "The discount does not apply to 'promotional' or already-discounted prices where the senior discount is the higher of the two — the senior takes whichever is higher, not both.",
      "Present the ID at the point of order, not after the bill is printed.",
    ],
  },
  {
    id: "pwd",
    name: "Person with disability",
    law: "RA 10754 amending RA 7277, the Magna Carta for Persons with Disability",
    rate: "20% discount",
    vat: "Exempt from the 12% VAT. The discount is computed on the VAT-exclusive price.",
    covers: [
      "Medicines and medical supplies",
      "Medical and dental services, diagnostic and laboratory fees in all private facilities",
      "Professional fees of attending physicians in private facilities",
      "Restaurants, hotels, lodging establishments and recreation centres",
      "Theatres, cinemas, concert halls and other places of culture and leisure",
      "Land, air and sea transportation fares",
      "Funeral and burial services for the person with disability",
    ],
    id_required:
      "The PWD Identification Card issued by the Persons with Disability Affairs Office or the City or Municipal Social Welfare and Development Office, or the PWD booklet.",
    notes: [
      "Same VAT treatment as the senior citizen discount: VAT comes off first, then the 20%.",
      "The PWD discount and the senior discount cannot be claimed together on the same purchase. Use whichever applies.",
      "Establishments are entitled to record the ID number and the name on the sales invoice.",
    ],
  },
  {
    id: "solo-parent",
    name: "Solo parent",
    law: "RA 11861, the Expanded Solo Parents Welfare Act",
    rate: "10% discount",
    vat: "Exempt from the 12% VAT on the covered items.",
    covers: [
      "Baby's milk",
      "Food supplements and micronutrient supplements",
      "Medicines and vaccines",
      "Other medical supplements for a child up to six years old",
    ],
    id_required:
      "The Solo Parent Identification Card issued by the City or Municipal Social Welfare and Development Office, renewed annually.",
    notes: [
      "Applies to a solo parent whose gross annual income does not exceed ₱250,000.",
      "Narrower than the senior and PWD discounts: it covers goods for the child, not restaurants, transport or leisure.",
      "RA 11861 also grants seven days of paid parental leave a year, and priority in government housing and educational assistance programmes.",
    ],
  },
];

/* --------------------------- PhilHealth benefits --------------------------- */

export type PhilHealthBenefit = {
  id: string;
  name: string;
  what: string;
  howToUse: string[];
  law: string;
};

export const PHILHEALTH_BENEFITS: PhilHealthBenefit[] = [
  {
    id: "konsulta",
    name: "Konsulta — primary care",
    what: "Free outpatient consultations, selected laboratory tests and selected medicines at a registered Konsulta provider, at no cost at the point of service.",
    howToUse: [
      "Register with a Konsulta provider — an accredited clinic, health centre or hospital outpatient department — through the PhilHealth member portal or at the facility.",
      "You are assigned to that provider. Consultations there are covered.",
      "Bring your PhilHealth ID or your PIN, and a valid government ID, on your first visit.",
      "Ask which laboratory tests and medicines are in the Konsulta package. It is a defined list, not everything.",
    ],
    law: "RA 11223, the Universal Health Care Act",
  },
  {
    id: "case-rates",
    name: "Inpatient case rates",
    what: "A fixed amount paid to the hospital for a specific admission, covering both the hospital charges and the professional fees, deducted from the bill at discharge.",
    howToUse: [
      "Tell the admitting clerk you are a PhilHealth member, at admission and not at discharge.",
      "Submit the PhilHealth Claim Form 1 and the supporting documents the hospital asks for, before discharge.",
      "The case rate is deducted from the final bill. You pay the balance.",
      "Ask the billing section which case rate was applied and how much it covered — it should appear as a line on the statement.",
    ],
    law: "RA 11223; case rate amounts are set by PhilHealth circular",
  },
  {
    id: "z-benefits",
    name: "Z Benefits",
    what: "Larger fixed packages for catastrophic and high-cost conditions, such as certain cancers, kidney transplantation and selected paediatric conditions, available only at contracted facilities.",
    howToUse: [
      "Z Benefit packages are available only at PhilHealth-contracted Z Benefit facilities, which are a specific list of hospitals.",
      "The attending physician applies for the package on the patient's behalf after the diagnosis meets the package criteria.",
      "Confirm with the hospital's PhilHealth desk that the facility is contracted for that particular package before treatment starts.",
      "The package covers a defined course of treatment. Anything outside it is billed normally.",
    ],
    law: "RA 11223; Z Benefit packages are defined by PhilHealth circular",
  },
  {
    id: "no-balance-billing",
    name: "No Balance Billing",
    what: "For qualified patients in basic or ward accommodation in government hospitals, no other fee or expense is charged beyond the PhilHealth package.",
    howToUse: [
      "Applies to qualified patients admitted to basic or ward accommodation in government facilities.",
      "Ask at admission whether the admission qualifies. Choosing a private room usually takes the admission out of the policy.",
      "If you are asked to pay beyond the package while qualified, raise it with the hospital's PhilHealth desk, and then with PhilHealth.",
    ],
    law: "RA 11223 and its IRR",
  },
];

/**
 * DELIBERATELY EMPTY. There are thousands of case rates and they change by
 * circular. A stale case rate table is worse than none, so this stays empty
 * until populated from the current circular.
 *
 * TO POPULATE: fill from the PhilHealth circular in force, set `circular` and
 * `effective`, and the app will render the table in place of the empty state.
 */
export type CaseRate = {
  code: string;
  condition: string;
  /** Total case rate in pesos. */
  amount: number;
  /** The portion attributable to professional fees. */
  professionalFee?: number;
  circular: string;
  effective: string;
};

export const CASE_RATES: CaseRate[] = [];

export const CASE_RATE_NOTICE =
  "PhilHealth case rate amounts are not compiled into this app. There are thousands of them and they change by circular — a stale figure here would be worse than none. Ask the hospital's PhilHealth desk which case rate applies to your admission, or check the current circular on the PhilHealth site.";

export const PHILHEALTH_ADMISSION_CHECKLIST = [
  "Your PhilHealth ID, or your PIN written down, and one valid government ID",
  "Tell the admitting clerk you are a PhilHealth member at admission, not at discharge",
  "PhilHealth Claim Form 1, which the hospital provides",
  "Proof of contribution, where the hospital asks for it — for employed members, the employer's certification; for self-paying members, official receipts",
  "For a dependant's admission: the PSA birth certificate or marriage certificate proving the relationship, and the dependant declared on your PhilHealth record",
  "Ask the billing section, before discharge, which case rate was applied and what it covered",
];

/* ------------------------------ OFW steps ------------------------------ */

export const OFW_STEPS = [
  {
    title: "Check the agency on the official DMW list",
    detail:
      "Go to the Department of Migrant Workers list of licensed recruitment agencies and search the agency's exact name. A licence can be suspended, cancelled or expired, so check the status and not just the presence of the name. This app does not hold agency names or licence statuses — a wrong answer here could cost you your placement fee, so the check goes to the source.",
    action: "Open the DMW licensed agencies list",
  },
  {
    title: "Check that the job order itself is approved",
    detail:
      "An agency may hold a valid licence and still be recruiting for a job order that is not approved. Ask for the job order number and the name of the foreign principal or employer, and confirm both with DMW. A licensed agency will give you these without hesitation.",
    action: "Ask the agency for the job order number and the principal's name",
  },
  {
    title: "Read the contract before any money changes hands",
    detail:
      "The employment contract must state the position, the salary, the working hours, the rest days, the food and accommodation arrangements, and the employer's name and address. Compare every figure against what you were told verbally. The verified contract is what governs abroad; verbal promises are not enforceable.",
    action: "Get your own signed copy of the contract",
  },
  {
    title: "Pay only what may lawfully be collected, and only with a receipt",
    detail:
      "No placement fee may be collected before an employment contract is signed. Where a placement fee is allowed at all, it may not exceed one month of the worker's basic salary. Domestic workers, and workers going to countries whose rules prohibit it, pay no placement fee. Every payment goes to the agency and is receipted in the agency's name — never to a personal account.",
    action: "Insist on an official receipt in the agency's name",
  },
];

export const OFW_FEE_RULES = [
  {
    label: "Placement fee ceiling",
    rule: "Where a placement fee may be charged at all, it may not exceed the equivalent of one month of the worker's basic salary.",
    law: "RA 8042 as amended by RA 10022; DMW rules on placement fees",
  },
  {
    label: "When it may be collected",
    rule: "Only after an employment contract has been signed. Nothing may be collected before that point.",
    law: "RA 8042 as amended by RA 10022",
  },
  {
    label: "Who pays nothing",
    rule: "Domestic workers pay no placement fee. Neither do workers bound for destinations whose rules prohibit collection.",
    law: "RA 10361, the Batas Kasambahay; DMW rules",
  },
  {
    label: "Documentation costs",
    rule: "Passport, medical examination, authentication and other documentation costs are separate from the placement fee and are receipted separately.",
    law: "DMW rules on recruitment and placement",
  },
  {
    label: "Illegal recruitment",
    rule: "Recruiting without a licence, collecting a fee without a licence, or charging more than the allowed amount is illegal recruitment. Report it to DMW.",
    law: "RA 8042 as amended by RA 10022",
  },
];
