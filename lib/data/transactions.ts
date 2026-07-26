/**
 * Government transactions, nationwide content only.
 *
 * Requirements and step order are stable and are stated plainly. Fees are
 * volatile and vary by office and purpose, so every fee renders with a verify
 * tag and a confirm-before-you-travel line. LGU-specific requirements are
 * deliberately absent — those fragment per city and would turn one dataset into
 * hundreds.
 *
 * `turnedAwayFor` is the field nobody publishes and everybody needs.
 */

export type TransactionCategory =
  | "Identity"
  | "Civil registry"
  | "Clearance"
  | "Travel"
  | "Employment"
  | "Tax"
  | "Licence"
  | "Business";

export type Transaction = {
  id: string;
  name: string;
  agency: string;
  category: TransactionCategory;
  /** One sentence on when you need it. */
  why: string;
  bring: string[];
  /** Ordered, because order matters for permits. */
  steps: string[];
  time: string;
  /** Always rendered with a "verify" tag. */
  fee: string;
  online: boolean | string;
  turnedAwayFor: string[];
  keywords?: string[];
};

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  "Identity",
  "Civil registry",
  "Clearance",
  "Travel",
  "Employment",
  "Tax",
  "Licence",
  "Business",
];

export const TRANSACTIONS: Transaction[] = [
  {
    id: "psa-birth-certificate",
    name: "PSA birth certificate",
    agency: "Philippine Statistics Authority",
    category: "Civil registry",
    why: "The base document for almost everything else — passport, PhilSys, licence, employment, school.",
    bring: [
      "Your own valid government-issued ID, if claiming in person",
      "The complete name of the person on the certificate, as registered",
      "Date and place of birth, and both parents' full names including the mother's maiden name",
      "An authorisation letter and a copy of the owner's ID, if claiming for someone else",
      "Proof of relationship, if requesting for a relative — spouse, parent, child, or sibling only",
    ],
    steps: [
      "Order online through [PSA Serbilis](https://www.psaserbilis.com.ph) or [PSAHelpline](https://www.psahelpline.ph), or go to a PSA outlet or a Serbilis centre in person.",
      "Give the registered details exactly as they appear on the record, including the mother's maiden name.",
      "Pay the fee. Online orders are paid by card, over the counter at a partner outlet, or through an e-wallet.",
      "Wait for release. Online orders are delivered; walk-in requests are usually released the same day at PSA outlets.",
      "Check the copy before you leave. Errors on the record need a separate correction petition at the Local Civil Registrar.",
    ],
    time:
      "Same day at a PSA outlet in most cases. Online delivery is typically 3–9 working days in Metro Manila and longer in the provinces.",
    fee: "Around ₱155 per copy at a PSA outlet; online orders cost more because of processing and delivery.",
    online: "Yes — PSA Serbilis and PSAHelpline deliver to a Philippine address.",
    turnedAwayFor: [
      "The birth was never registered, or was registered late and is not yet in the PSA database. The record has to be endorsed by the Local Civil Registrar first, which takes weeks.",
      "Giving the mother's married surname instead of her maiden name, so the search returns nothing.",
      "Requesting for a cousin, aunt, uncle, or friend — PSA releases only to the owner, spouse, parent, child, sibling, or a duly authorised representative.",
      "Bringing an authorisation letter without a photocopy of the owner's valid ID.",
      "A name spelled differently from the registered record. The search is literal — one letter off returns no record.",
      "Expecting a PSA copy to fix an error. Corrections go through the Local Civil Registrar under RA 9048 or RA 10172, not through a reprint.",
    ],
    keywords: ["birth cert", "nso", "live birth", "psa", "kapanganakan"],
  },
  {
    id: "nbi-clearance",
    name: "NBI clearance",
    agency: "National Bureau of Investigation",
    category: "Clearance",
    why: "Required by most employers, for overseas work, and for several licence and permit applications.",
    bring: [
      "One valid government-issued ID, original — not a photocopy",
      "Your online application reference number and proof of payment",
      "A second valid ID, which many branches ask for even though one is the stated minimum",
    ],
    steps: [
      "Register at the [NBI Clearance online portal](https://clearance.nbi.gov.ph) and fill in your personal details.",
      "Choose the purpose. Local employment and travel abroad are processed differently, so pick correctly the first time.",
      "Set an appointment date and branch. Slots at popular branches go weeks ahead.",
      "Pay through the payment channel shown — an e-wallet, over the counter at a partner, or online banking.",
      "Appear at the branch on your appointment date for biometrics and photo capture.",
      "Collect the clearance the same day, unless you get a HIT.",
    ],
    time:
      "Same day if there is no HIT. A HIT — a name matching someone in NBI records — adds anywhere from a few days to two weeks for verification.",
    fee: "Around ₱130 for local employment plus an e-payment service charge; higher for travel abroad.",
    online: "Booking and payment only. Biometrics must be captured in person.",
    turnedAwayFor: [
      "Arriving without the original ID. Photocopies and photos of an ID on a phone are refused.",
      "Arriving on the wrong day. The appointment slot is enforced, and walk-ins are usually turned away.",
      "A name that does not match the ID exactly — a missing middle name or a married surname on one document and not the other.",
      "An ID that has expired, even by a few days.",
      "Not having paid before arriving. Payment must clear before the appointment; several branches do not accept payment on site.",
      "Picking the wrong purpose during registration. Changing it usually means starting the application again.",
    ],
    keywords: ["nbi", "clearance", "police record", "hit"],
  },
  {
    id: "passport-new",
    name: "Passport, first-time application",
    agency: "Department of Foreign Affairs",
    category: "Travel",
    why: "Required for any international travel, and the strongest single proof of identity in the country.",
    bring: [
      "PSA birth certificate on security paper, original plus a photocopy",
      "One valid government-issued ID, original plus a photocopy",
      "A confirmed online appointment printout",
      "PSA marriage certificate, if a married woman is using her husband's surname",
      "For a minor: PSA birth certificate, the personal appearance of the minor, and a parent or an authorised adult with a notarised affidavit of support and consent",
    ],
    steps: [
      "Book an appointment on the [DFA passport appointment site](https://www.passport.gov.ph). Slots are released in batches and go quickly.",
      "Pay the processing fee through the channel shown in the confirmation.",
      "Print the application form and the appointment confirmation.",
      "Appear at the consular office on the appointment date, 30 minutes early, in the required dress code — no sleeveless tops, no slippers.",
      "Submit documents, then have your photo, fingerprints and signature captured.",
      "Collect the passport at the same office, or pay for courier delivery.",
    ],
    time:
      "Around 12 working days for regular processing in Metro Manila and 15 or more in the provinces; roughly 7 for express.",
    fee: "Around ₱950 regular and ₱1,200 express, plus a courier fee if you choose delivery.",
    online: "Appointment booking and payment only. Personal appearance is required.",
    turnedAwayFor: [
      "Bringing a photocopied or laminated birth certificate. It must be a PSA copy on security paper.",
      "A birth certificate with an unresolved discrepancy — a different spelling, a blank entry, or 'late registered' without supporting documents.",
      "A married woman presenting an ID in her married name without a PSA marriage certificate.",
      "Not meeting the dress code. Sleeveless tops, shorts, slippers and anything with a collar-less neckline are commonly refused.",
      "Arriving late. Appointment windows are enforced strictly and a missed slot usually means rebooking weeks out.",
      "Bringing a minor without a parent, or with an adult who has no notarised affidavit of support and consent.",
      "Buying a slot from a fixer. Appointments are tied to the applicant's details and mismatches are rejected at the counter.",
    ],
    keywords: ["passport", "dfa", "travel", "pasaporte"],
  },
  {
    id: "philsys-national-id",
    name: "PhilSys national ID",
    agency: "Philippine Statistics Authority",
    category: "Identity",
    why: "A free, valid government ID accepted for most transactions, useful for anyone who has no other ID.",
    bring: [
      "One primary document: PSA birth certificate, or a valid Philippine passport, or a UMID card",
      "A secondary ID if you have no primary document — see the PhilSys list of accepted supporting documents",
      "Your appointment confirmation, if you booked online",
    ],
    steps: [
      "Book a registration slot on the [PhilSys registration site](https://register.philsys.gov.ph), or go to a registration centre that accepts walk-ins.",
      "Step 1 is demographic data collection — name, birth date, address, marital status.",
      "Step 2 is biometrics — fingerprints, iris scan and a photograph — at the registration centre.",
      "Receive the transaction slip. The PhilID card is delivered later by post.",
      "Meanwhile, download or request the [ePhilID](https://philsys.gov.ph), which is accepted in the same way as the card.",
    ],
    time:
      "Registration takes under an hour. Card delivery has ranged from weeks to many months; the ePhilID is available almost immediately.",
    fee: "Free for first registration. A replacement for a lost or damaged card carries a fee.",
    online: "Booking only. Biometrics must be captured in person.",
    turnedAwayFor: [
      "Bringing no primary document and no acceptable supporting ID at all.",
      "A birth certificate whose details do not match the ID being presented alongside it.",
      "Walking in at a centre that is appointment-only that day. Practice varies by centre.",
      "Damaged fingerprints from manual work, which sometimes needs a second capture attempt on another visit.",
      "Assuming the transaction slip is the ID. It is not accepted as one — use the ePhilID until the card arrives.",
    ],
    keywords: ["philsys", "national id", "philid", "ephilid"],
  },
  {
    id: "drivers-licence",
    name: "Driver's licence, student permit to non-professional",
    agency: "Land Transportation Office",
    category: "Licence",
    why: "The legal requirement to drive, and one of the most widely accepted IDs in the country.",
    bring: [
      "PSA birth certificate or any valid government ID showing your date of birth",
      "A completed application form, available at the LTO office or online",
      "A medical certificate from an LTO-accredited clinic, issued electronically",
      "Certificate of completion of the theoretical driving course, 15 hours, from an LTO-accredited driving school",
      "For the non-professional licence: your student permit, held for at least one month",
      "Certificate of completion of the practical driving course, 8 hours, from an accredited school",
    ],
    steps: [
      "Take the 15-hour theoretical driving course at an LTO-accredited school and get the certificate.",
      "Get a medical examination at an LTO-accredited clinic. The result is transmitted electronically to the LTO.",
      "Create an [LTMS account](https://portal.lto.gov.ph), then apply for the student permit at any LTO office: submit documents, have your photo and signature captured, pay the fee.",
      "Hold the student permit for at least one month before applying for a non-professional licence.",
      "Take the 8-hour practical driving course at an accredited school and get the certificate.",
      "Return to the LTO, pass the written examination and the practical driving test, then pay and have the licence issued.",
    ],
    time:
      "The student permit is usually released the same day. The non-professional licence is same day where card stock is available; some offices issue a temporary receipt instead.",
    fee: "Roughly ₱320 for the student permit and around ₱820 for a non-professional licence, plus the driving school and medical fees, which are much larger.",
    online: "LTMS online account creation and some appointments. Testing and biometrics are in person.",
    turnedAwayFor: [
      "Not having the theoretical driving course certificate. It has been mandatory for new applicants since 2021 and offices do not waive it.",
      "Applying for a non-professional licence before the student permit has been held for a full month.",
      "A medical certificate from a clinic that is not LTO-accredited, or one that was not transmitted electronically.",
      "Card stock shortages at the office, which means a paper temporary licence instead of the card.",
      "Failing the written exam, which requires rebooking rather than a retake on the same day at many offices.",
      "An unpaid traffic violation on the LTMS record, which blocks renewal and issuance until settled.",
    ],
    keywords: ["lto", "licence", "license", "student permit", "driving", "lisensya"],
  },
  {
    id: "tin-registration",
    name: "TIN registration",
    agency: "Bureau of Internal Revenue",
    category: "Tax",
    why: "The taxpayer identification number required for employment, business registration, and most financial transactions.",
    bring: [
      "One valid government-issued ID",
      "PSA birth certificate, if the ID does not show your full name and birth date",
      "BIR Form 1902 for employees, or 1901 for self-employed, professionals and mixed-income earners",
      "For employees: a certificate of employment or the employer's details, including their TIN and RDO code",
      "For self-employed: proof of address, and DTI registration if operating under a business name",
      "PSA marriage certificate, if applying under a married surname",
    ],
    steps: [
      "Identify the correct Revenue District Office. For employees this is the RDO of the employer; for self-employed it is the RDO covering your place of business or residence.",
      "Fill in the correct form: 1902 for a purely compensation-income employee, 1901 for self-employed and professionals.",
      "Submit the form and documents at that RDO, or through the [BIR ORUS online registration system](https://orus.bir.gov.ph).",
      "For self-employed registrants, pay the registration-related fees and register books of account and receipts.",
      "Receive the Certificate of Registration, BIR Form 2303, for self-employed registrants. Employees receive the TIN only.",
    ],
    time:
      "Often same day at the RDO if the queue is short and the documents are complete. ORUS applications vary.",
    fee: "TIN issuance itself carries no fee. Self-employed registrants pay documentary stamp tax and printing costs for receipts.",
    online: "Yes for many applicant types, through BIR ORUS.",
    turnedAwayFor: [
      "Already having a TIN. Holding more than one is prohibited under the Tax Code, and a duplicate application is refused — you need a transfer instead.",
      "Applying at the wrong RDO. Each taxpayer is tied to one district office, and applications outside it are turned away.",
      "Using Form 1902 when you are self-employed, or 1901 when you are a plain employee.",
      "Employees applying on their own when the employer is meant to file the 1902 on their behalf.",
      "Not having a registered address that matches the RDO's jurisdiction.",
      "For a business registration: arriving before DTI or SEC registration is complete.",
    ],
    keywords: ["tin", "bir", "tax id", "1901", "1902", "rdo"],
  },
  {
    id: "police-clearance",
    name: "Police clearance",
    agency: "Philippine National Police",
    category: "Clearance",
    why: "Often asked for alongside or instead of an NBI clearance, especially by local employers and LGUs.",
    bring: [
      "Two valid government-issued IDs, originals",
      "Community tax certificate, or cedula, which several stations still require",
      "Your online application reference number and proof of payment",
    ],
    steps: [
      "Register on the [PNP national police clearance system](https://pnpclearance.ph) and create an account.",
      "Book an appointment at a police station that issues clearances.",
      "Pay the fee through the accepted channel before the appointment.",
      "Appear at the station for biometrics and photo capture.",
      "Collect the clearance, usually the same day.",
    ],
    time: "Same day in most stations, subject to system availability.",
    fee: "Around ₱150 plus a service charge; some LGUs add a local fee.",
    online: "Registration and appointment booking only.",
    turnedAwayFor: [
      "Not having a cedula, which several stations still insist on even though it is not universally required.",
      "Applying at a station outside your city or municipality of residence.",
      "System downtime, which happens often enough that going early in the day matters.",
      "Only bringing one ID when the station requires two.",
      "Assuming a police clearance substitutes for an NBI clearance. Many employers ask for both, and they are separate documents.",
    ],
    keywords: ["police", "clearance", "pnp", "cedula"],
  },
  {
    id: "sss-membership",
    name: "SSS membership registration",
    agency: "Social Security System",
    category: "Employment",
    why: "Mandatory coverage for employees, and the gateway to sickness, maternity, disability, retirement and death benefits.",
    bring: [
      "One primary ID, or two secondary IDs, at least one bearing a photo and signature",
      "PSA birth certificate",
      "For employees: the employer registers you, but you still need your own SS number",
      "For self-employed and voluntary members: proof of income or the nature of your work",
      "PSA marriage certificate and children's birth certificates, if declaring dependants",
    ],
    steps: [
      "Get an SS number online through the [SSS website](https://www.sss.gov.ph). This step is free and does not need a branch visit.",
      "Create a [My.SSS online account](https://member.sss.gov.ph) once the number is issued.",
      "For employees: give the SS number to your employer, who reports you for coverage and starts remitting.",
      "For self-employed and voluntary members: file the appropriate membership form and pay your first contribution to activate coverage.",
      "Get a UMID card at a branch, which requires biometrics capture in person.",
    ],
    time:
      "The SS number is issued within a day or so online. The UMID card takes weeks to months to arrive.",
    fee: "Registration is free. The UMID card is free for the first issuance; replacements carry a fee.",
    online: "Yes — number issuance and account creation are fully online.",
    turnedAwayFor: [
      "Already having an SS number from a previous job and applying for a second one. Duplicate numbers have to be merged, which is slower than using the original.",
      "A name or birth date that does not match the PSA record, which blocks activation.",
      "Applying for a UMID card without an activated SSS membership and at least one posted contribution.",
      "For self-employed members: expecting coverage to start on registration. It starts when the first contribution is paid.",
      "Bringing only one secondary ID when two are required.",
    ],
    keywords: ["sss", "umid", "ss number", "social security"],
  },
  {
    id: "philhealth-membership",
    name: "PhilHealth membership registration",
    agency: "Philippine Health Insurance Corporation",
    category: "Employment",
    why: "Mandatory coverage under the Universal Health Care Act, and what pays part of any hospital bill.",
    bring: [
      "One valid government-issued ID",
      "PSA birth certificate",
      "PhilHealth Member Registration Form, PMRF",
      "PSA marriage certificate and children's birth certificates, if enrolling dependants",
    ],
    steps: [
      "Register online through the [PhilHealth member portal](https://www.philhealth.gov.ph), or file a PMRF at a Local Health Insurance Office.",
      "Receive your PhilHealth Identification Number, the PIN.",
      "For employees: give the PIN to your employer, who reports you and remits the premium share.",
      "For self-employed, voluntary and OFW members: pay the premium yourself, which under RA 11223 is the whole 5%.",
      "Declare dependants — they are covered under the same membership without a separate premium.",
    ],
    time: "The PIN is issued the same day online in most cases.",
    fee: "Registration is free. The premium is a separate monthly obligation.",
    online: "Yes — registration and the member portal are online.",
    turnedAwayFor: [
      "Already having a PIN under a slightly different name from an old employer, creating a duplicate record that has to be merged.",
      "Not declaring dependants, then discovering at a hospital admission that a parent or child is not covered.",
      "Arriving at a hospital with unpaid premiums as a self-paying member. Coverage rules on lapsed contributions are strict.",
      "A name that does not match the PSA record, which blocks claim processing later even if registration went through.",
      "Assuming employed coverage continues after resignation. It does not — you have to shift to voluntary or self-paying status.",
    ],
    keywords: ["philhealth", "pin", "health insurance", "pmrf"],
  },
  {
    id: "pagibig-membership",
    name: "Pag-IBIG membership registration",
    agency: "Home Development Mutual Fund",
    category: "Employment",
    why: "Mandatory coverage, and what makes you eligible for the multi-purpose loan, the calamity loan and a housing loan.",
    bring: [
      "One valid government-issued ID",
      "PSA birth certificate, if the ID does not show your birth date",
      "Members Data Form, MDF",
      "For self-employed members: proof of income or the nature of your work",
    ],
    steps: [
      "Register online through the [Virtual Pag-IBIG portal](https://www.pagibigfundservices.com/virtualpagibig), or file an MDF at a branch.",
      "Receive your Pag-IBIG MID number.",
      "For employees: give the MID to your employer, who reports you and remits both shares.",
      "For self-employed and voluntary members: pay your own contributions, and choose whether to contribute above the ₱200 mandatory ceiling.",
      "Get a Loyalty Card Plus at a branch if you want a physical card, which is optional.",
    ],
    time: "The MID number is issued within a day or so online.",
    fee: "Registration is free. The Loyalty Card Plus carries a small fee.",
    online: "Yes — Virtual Pag-IBIG handles registration, contributions and loan applications.",
    turnedAwayFor: [
      "Holding more than one MID number from separate employers, which has to be consolidated before any loan is approved.",
      "Applying for a multi-purpose loan before 24 monthly contributions have posted.",
      "Applying for a loan with contributions that were remitted but not yet posted to the record — posting lags remittance.",
      "Expecting a housing loan on the strength of membership alone. Loan capacity is assessed separately.",
      "A name mismatch between the Pag-IBIG record and the ID presented at the branch.",
    ],
    keywords: ["pagibig", "pag-ibig", "hdmf", "mid number", "loyalty card"],
  },
  {
    id: "business-permit",
    name: "Business permit for a new small business",
    agency: "DTI, BIR and the Local Government Unit",
    category: "Business",
    why: "The minimum legal setup for a sole proprietorship, and what the BIR and the LGU will ask for.",
    bring: [
      "DTI Certificate of Business Name Registration",
      "Barangay business clearance for the address where you will operate",
      "Proof of the business address: a lease contract, or the tax declaration and owner's consent if you own it",
      "Two valid government-issued IDs",
      "Occupancy permit or sanitary permit, where the LGU requires them for your line of business",
      "Fire safety inspection certificate, issued after the Bureau of Fire Protection inspects",
      "BIR Form 1901 and the documents for BIR registration",
    ],
    steps: [
      "Register the business name with DTI, online through the [DTI Business Name Registration System](https://bnrs.dti.gov.ph). Do this first — everything else asks for it.",
      "Get the barangay business clearance for the exact address where you will operate.",
      "File the business permit application at the City or Municipal Hall business permits office, with the DTI certificate and barangay clearance.",
      "Undergo the inspections the LGU requires: fire safety, sanitary, and zoning where applicable.",
      "Pay the local business taxes and regulatory fees, then collect the Mayor's Permit.",
      "Register with the BIR at the RDO covering the business address: file Form 1901, register books of account, and get authority to print or register receipts.",
      "Register as an employer with SSS, PhilHealth and Pag-IBIG before hiring anyone.",
    ],
    time:
      "DTI registration is same day online. The LGU permit commonly takes several days to a few weeks depending on inspections. BIR registration is often same day if documents are complete.",
    fee: "Varies widely. DTI registration is roughly ₱200 to ₱2,000 depending on territorial scope; LGU taxes and fees depend on the line of business and on gross receipts.",
    online: "DTI and BIR registration are largely online. LGU permits vary — some cities have full online systems, many do not.",
    turnedAwayFor: [
      "Going to the LGU before DTI registration is done. Every downstream step asks for the DTI certificate.",
      "A business address that does not match the barangay clearance, or a barangay clearance issued for a different address.",
      "No lease contract, or a lease in someone else's name without a consent letter from the owner.",
      "Zoning. The address is not classified for that line of business, which is discovered at the counter and cannot be fixed on the day.",
      "No fire safety inspection certificate, which requires an inspection appointment and cannot be issued over the counter.",
      "Registering with the BIR before the Mayor's Permit is issued, where the RDO asks for it as a supporting document.",
      "Hiring staff before registering as an employer with SSS, PhilHealth and Pag-IBIG.",
    ],
    keywords: ["business permit", "mayors permit", "dti", "negosyo", "sole proprietor", "barangay clearance"],
  },
  {
    id: "marriage-licence",
    name: "Marriage licence",
    agency: "Local Civil Registrar",
    category: "Civil registry",
    why: "Required before a civil or church wedding, and valid for 120 days anywhere in the Philippines.",
    bring: [
      "PSA birth certificate of both parties, original plus a photocopy",
      "Certificate of No Marriage Record, CENOMAR, from the PSA for both parties",
      "Valid government-issued IDs for both parties",
      "Certificate of attendance at the pre-marriage counselling seminar, from the LGU",
      "Community tax certificate, or cedula, for both parties in many LGUs",
      "For applicants aged 21 to 24: a notarised parental advice",
      "For applicants aged 18 to 20: a notarised parental consent",
      "For a widowed applicant: the PSA death certificate of the former spouse",
      "For an applicant whose prior marriage was annulled: the court decision and the certificate of finality, annotated on the PSA record",
    ],
    steps: [
      "Get PSA birth certificates and CENOMARs for both parties. Order these first — they take the longest.",
      "Attend the pre-marriage counselling seminar at the LGU where the licence will be filed. Schedules are set by the LGU.",
      "File the application at the Local Civil Registrar of the city or municipality where either party habitually resides.",
      "Wait out the 10-day mandatory posting period, during which the application is published on the LCR notice board.",
      "Collect the licence after the posting period. It is valid for 120 days anywhere in the country.",
    ],
    time:
      "At least 10 days for the mandatory posting period, plus whatever the seminar schedule adds. Plan for three to four weeks.",
    fee: "Commonly a few hundred pesos in total for the licence and the seminar, but it is set by each LGU and varies.",
    online: "Rarely. A few LGUs accept online pre-application, but personal appearance by both parties is standard.",
    turnedAwayFor: [
      "Filing at an LCR where neither party habitually resides. It must be the residence of one of you.",
      "A CENOMAR that shows a prior marriage record, including one the applicant has forgotten or did not know was registered.",
      "Not having attended the pre-marriage counselling seminar, which cannot be done on the same day as filing at most LGUs.",
      "Missing the parental advice for a 21 to 24 year old applicant, which people routinely assume applies only to minors.",
      "An annulment decision that has not yet been annotated on the PSA record. The court decision alone is not enough.",
      "Letting the licence lapse. It expires after 120 days and a new application means starting over, posting period included.",
      "Only one party appearing. Both are usually required at filing.",
    ],
    keywords: ["marriage", "kasal", "wedding", "cenomar", "licence", "license", "lcr"],
  },
];

export function findTransaction(id: string): Transaction | undefined {
  return TRANSACTIONS.find((t) => t.id === id);
}

export function searchTransactions(query: string, category?: TransactionCategory | "All") {
  const q = query.trim().toLowerCase();
  return TRANSACTIONS.filter((t) => {
    if (category && category !== "All" && t.category !== category) return false;
    if (!q) return true;
    const haystack = [t.name, t.agency, t.why, t.category, ...(t.keywords ?? [])]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
