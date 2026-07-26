/**
 * Payday countdown. Most Philippine companies pay on the 15th and the 30th, so
 * that is the default — but it is a convention, not a rule, and the card says so
 * rather than pretending it knows the user's payroll calendar.
 */

export type Payday = {
  date: Date;
  /** Days from today. 0 means today. */
  daysAway: number;
  label: string;
};

/** Last day of the month, so February and the 31st-day months behave. */
function endOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function nextPayday(from = new Date()): Payday {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const y = today.getFullYear();
  const m = today.getMonth();

  // The 30th, or the last day of the month where there is no 30th.
  const secondCutoff = Math.min(30, endOfMonth(y, m));

  const candidates = [
    new Date(y, m, 15),
    new Date(y, m, secondCutoff),
    new Date(y, m + 1, 15),
  ];

  const next = candidates.find((d) => d >= today) ?? candidates[2];
  const daysAway = Math.round((next.getTime() - today.getTime()) / 86_400_000);

  return {
    date: next,
    daysAway,
    label:
      daysAway === 0
        ? "Sahod today"
        : daysAway === 1
          ? "Sahod tomorrow"
          : `${daysAway} days to sahod`,
  };
}

export const PAYDAY_CAVEAT =
  "Assumes a semi-monthly payroll on the 15th and the 30th, which is the common convention. Your company may run a different calendar.";
