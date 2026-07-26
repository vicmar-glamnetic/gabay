import { MATERNITY } from "../rates";
import { num } from "./money";
import type { CalcResult } from "./types";

export type DeliveryType = "live-birth" | "miscarriage";

export type MaternityInput = {
  delivery: DeliveryType;
  soloParent?: boolean;
  /** Days the mother chooses to transfer to the father or an alternate caregiver. */
  transferredDays?: number;
  /** The optional unpaid 30-day extension after a live birth. */
  takeUnpaidExtension?: boolean;
};

export type MaternityFigures = {
  paidDays: number;
  transferable: number;
  transferred: number;
  motherDays: number;
  unpaidExtensionDays: number;
  totalDays: number;
};

export function computeMaternityLeave(
  input: MaternityInput
): CalcResult<MaternityFigures> {
  const r = MATERNITY.value;
  const live = input.delivery === "live-birth";
  const base = live ? r.liveBirthDays : r.miscarriageDays;
  const solo = live && input.soloParent ? r.soloParentAdditionalDays : 0;
  const paidDays = base + solo;

  const transferable = live ? r.transferableDays : 0;
  const transferred = Math.min(Math.max(0, input.transferredDays ?? 0), transferable);
  const motherDays = paidDays - transferred;
  const unpaidExtensionDays =
    live && input.takeUnpaidExtension ? r.optionalExtensionDaysUnpaid : 0;

  const days = (n: number) => `${num(n, 0)} day${n === 1 ? "" : "s"}`;

  return {
    headline: {
      label: "Paid maternity leave",
      amount: paidDays,
      rule: live ? "Live birth · RA 11210" : "Miscarriage or emergency termination · RA 11210",
    },
    sections: [
      {
        title: "Day count",
        subtitle: "RA 11210, the 105-Day Expanded Maternity Leave Law",
        lines: [
          {
            label: live ? "Live birth" : "Miscarriage or emergency termination of pregnancy",
            rule: live
              ? `${r.liveBirthDays} calendar days with full pay · RA 11210 Sec. 3`
              : `${r.miscarriageDays} calendar days with full pay · RA 11210 Sec. 3`,
            raw: days(base),
          },
          ...(live
            ? [
                {
                  label: "Solo parent",
                  rule: input.soloParent
                    ? `An additional ${r.soloParentAdditionalDays} days for a solo parent · RA 11210 in relation to RA 8972`
                    : "Not claimed",
                  raw: solo ? `+ ${days(solo)}` : "—",
                },
              ]
            : []),
          {
            label: "Total paid leave",
            rule: "Calendar days, not working days",
            raw: days(paidDays),
            strong: true,
          },
        ],
      },
      ...(live
        ? [
            {
              title: "Allocation",
              subtitle: "Transferring days to the father or an alternate caregiver",
              lines: [
                {
                  label: "Transferable",
                  rule: `Up to ${r.transferableDays} days may go to the child's father, whether or not married to the mother · RA 11210 Sec. 6`,
                  raw: days(transferable),
                },
                {
                  label: "Transferred",
                  rule:
                    "In the father's absence, death or incapacity, the days may go to an alternate caregiver: a relative within the fourth degree, or the current partner sharing the same household",
                  raw: days(transferred),
                },
                {
                  label: "Days the mother keeps",
                  rule: "Written notice to the employer is required to allocate",
                  raw: days(motherDays),
                  strong: true,
                },
                {
                  label: "Paternity leave, separately",
                  rule: `${r.paternityLeaveDays} days for a married father, first four deliveries · RA 8187`,
                  raw: days(r.paternityLeaveDays),
                  note: true,
                },
              ],
            },
          ]
        : []),
      ...(unpaidExtensionDays
        ? [
            {
              title: "Optional extension",
              lines: [
                {
                  label: "Unpaid extension",
                  rule: `Up to ${r.optionalExtensionDaysUnpaid} days without pay, on written notice to the employer at least 45 days before the end of the leave · RA 11210 Sec. 3`,
                  raw: days(unpaidExtensionDays),
                },
                {
                  label: "Total leave",
                  rule: "Paid plus unpaid",
                  raw: days(paidDays + unpaidExtensionDays),
                  strong: true,
                },
              ],
            },
          ]
        : []),
    ],
    figures: {
      paidDays,
      transferable,
      transferred,
      motherDays,
      unpaidExtensionDays,
      totalDays: paidDays + unpaidExtensionDays,
    },
    notes: [
      "This is the day count, not the peso benefit. The SSS maternity benefit is computed separately from the average monthly salary credit, and the employer pays the salary differential where the SSS benefit falls short of full pay.",
      "The leave applies to every instance of pregnancy, with no limit on the number of times it may be claimed. The old four-pregnancy limit was removed by RA 11210.",
      "Notify the employer and SSS of the pregnancy and the expected date of delivery. Late notification is the most common reason a claim stalls.",
    ],
  };
}
