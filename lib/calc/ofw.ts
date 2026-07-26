import { OFW } from "../rates";

/**
 * The app's contribution to OFW verification is the red-flag logic and the
 * process walkthrough. It does NOT hold agency names, licence numbers or
 * licence statuses — a fabricated "licensed" result can cost someone their
 * placement fee, so verification always goes out to the official DMW check.
 */

export type RedFlagWeight = 1 | 2 | 3;

export type RedFlag = {
  id: string;
  label: string;
  detail: string;
  weight: RedFlagWeight;
  basis: string;
};

export const OFW_RED_FLAGS: RedFlag[] = [
  {
    id: "fee-before-contract",
    label: "Asked for money before you signed an employment contract",
    detail:
      "No placement fee may be collected before an employment contract is signed and the worker is deployed.",
    weight: 3,
    basis: "RA 8042 as amended by RA 10022; DMW rules on placement fees",
  },
  {
    id: "no-receipt",
    label: "Refused to issue an official receipt for money you paid",
    detail:
      "Every payment to a licensed agency is receipted in the agency's name. No receipt means no proof, and no recourse.",
    weight: 3,
    basis: "RA 8042 as amended; DMW licensing conditions",
  },
  {
    id: "not-on-dmw-list",
    label: "The agency does not appear on the DMW list of licensed agencies",
    detail:
      "Check the name against the official DMW list yourself. An agency that is not on it cannot lawfully recruit.",
    weight: 3,
    basis: "RA 8042 as amended — recruitment without a licence is illegal recruitment",
  },
  {
    id: "personal-account",
    label: "Payment sent to a personal bank account, GCash or remittance name",
    detail: "Agency payments go to the agency, not to an individual's account.",
    weight: 2,
    basis: "DMW rules on placement fees and receipting",
  },
  {
    id: "tourist-visa",
    label: "Told to leave on a tourist visa and 'fix the papers' abroad",
    detail:
      "Deployment on a tourist visa strips you of contract protection and of any claim through Philippine channels.",
    weight: 2,
    basis: "RA 8042 as amended; DMW deployment rules",
  },
  {
    id: "no-contract-copy",
    label: "You were not given your own signed copy of the contract",
    detail:
      "The contract must be verified by the Philippine post abroad, and you keep a copy.",
    weight: 2,
    basis: "DMW standard employment contract rules",
  },
  {
    id: "salary-differs",
    label: "The salary you were told differs from what the contract says",
    detail: "The verified contract is what governs. Verbal promises are not enforceable abroad.",
    weight: 2,
    basis: "DMW standard employment contract rules",
  },
  {
    id: "rush",
    label: "Pressured to decide or pay quickly, or told the slot expires today",
    detail: "Urgency is the oldest tool in recruitment fraud. A legitimate placement survives a day's delay.",
    weight: 1,
    basis: "Common indicator, not a statutory test",
  },
  {
    id: "no-office",
    label: "No physical office, or the office address does not match the DMW record",
    detail: "Licensed agencies operate from a registered address, and branches are separately licensed.",
    weight: 1,
    basis: "DMW licensing conditions",
  },
  {
    id: "social-media-only",
    label: "Recruitment happened entirely through social media or chat",
    detail:
      "Not disqualifying on its own, but combined with anything above it is the standard pattern.",
    weight: 1,
    basis: "Common indicator, not a statutory test",
  },
  {
    id: "no-medical-through-accredited",
    label: "Medical exam arranged outside a DOH-accredited clinic",
    detail: "Pre-employment medical exams go through accredited medical clinics only.",
    weight: 1,
    basis: "DOH accreditation rules for OFW medical examinations",
  },
];

export type OfwVerdictLevel = "stop" | "caution" | "proceed";

export type OfwCheckResult = {
  score: number;
  maxScore: number;
  level: OfwVerdictLevel;
  headline: string;
  body: string;
  triggered: RedFlag[];
  disqualifying: RedFlag[];
};

export function scoreRedFlags(selectedIds: string[]): OfwCheckResult {
  const r = OFW.value;
  const triggered = OFW_RED_FLAGS.filter((f) => selectedIds.includes(f.id));
  const disqualifying = triggered.filter((f) => f.weight >= r.disqualifyingWeight);
  const score = triggered.reduce((s, f) => s + f.weight, 0);
  const maxScore = OFW_RED_FLAGS.reduce((s, f) => s + f.weight, 0);

  const level: OfwVerdictLevel =
    disqualifying.length > 0 || score >= r.stopScore
      ? "stop"
      : score > 0
        ? "caution"
        : "proceed";

  const headline =
    level === "stop"
      ? "Stop. Do not pay anything."
      : level === "caution"
        ? "Slow down and verify before you pay."
        : "Nothing flagged here.";

  const body =
    level === "stop"
      ? disqualifying.length > 0
        ? `${disqualifying.length === 1 ? "One thing you flagged is" : "Things you flagged are"} on its own enough to stop: ${disqualifying
            .map((f) => f.label.toLowerCase())
            .join("; ")}. Verify the agency on the DMW list and report the recruiter to DMW before any money changes hands.`
        : `You flagged enough concerns to stop and verify. Check the agency on the official DMW list and bring what you have to a DMW office.`
      : level === "caution"
        ? "None of what you flagged is disqualifying on its own, but verify the agency on the official DMW list and get everything in writing before paying."
        : "Still run the four verification steps below. A clean checklist is not the same as a verified agency.";

  return { score, maxScore, level, headline, body, triggered, disqualifying };
}
