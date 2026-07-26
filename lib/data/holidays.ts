import type { DayTypeId } from "../rates";

/**
 * 2026 national holidays: Proclamation No. 1006, s. 2025, plus the separate
 * proclamations declaring Eid'l Fitr and Eid'l Adha.
 *
 * Twelve regular, eight special non-working, one special working.
 * LGUs declare their own local holidays on top of this list.
 */

export type HolidayType = "regular" | "special" | "special-working";

export type Holiday = {
  /** ISO date, parsed in local time by `holidayDate` below. */
  date: string;
  name: string;
  type: HolidayType;
  note?: string;
};

export const HOLIDAY_SOURCE =
  "Proclamation No. 1006, s. 2025, and the separate proclamations for Eid'l Fitr and Eid'l Adha";

export const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "New Year's Day", type: "regular" },
  { date: "2026-02-17", name: "Chinese New Year", type: "special" },
  {
    date: "2026-02-25",
    name: "EDSA People Power Revolution Anniversary",
    type: "special-working",
    note: "Special working day. Ordinary pay rules apply — there is no premium.",
  },
  {
    date: "2026-03-20",
    name: "Eid'l Fitr",
    type: "regular",
    note: "Declared by separate proclamation. The date follows the Islamic calendar and may move by a day on the actual sighting of the moon.",
  },
  { date: "2026-04-02", name: "Maundy Thursday", type: "regular" },
  { date: "2026-04-03", name: "Good Friday", type: "regular" },
  { date: "2026-04-04", name: "Black Saturday", type: "special" },
  { date: "2026-04-09", name: "Araw ng Kagitingan", type: "regular" },
  { date: "2026-05-01", name: "Labor Day", type: "regular" },
  {
    date: "2026-05-27",
    name: "Eid'l Adha",
    type: "regular",
    note: "Declared by separate proclamation. The date follows the Islamic calendar and may move by a day on the actual sighting of the moon.",
  },
  { date: "2026-06-12", name: "Independence Day", type: "regular" },
  { date: "2026-08-21", name: "Ninoy Aquino Day", type: "special" },
  { date: "2026-08-31", name: "National Heroes Day", type: "regular" },
  { date: "2026-11-01", name: "All Saints' Day", type: "special" },
  { date: "2026-11-02", name: "All Souls' Day", type: "special" },
  { date: "2026-11-30", name: "Bonifacio Day", type: "regular" },
  { date: "2026-12-08", name: "Feast of the Immaculate Conception of Mary", type: "special" },
  { date: "2026-12-24", name: "Christmas Eve", type: "special" },
  { date: "2026-12-25", name: "Christmas Day", type: "regular" },
  { date: "2026-12-30", name: "Rizal Day", type: "regular" },
  { date: "2026-12-31", name: "Last Day of the Year", type: "special" },
];

/** Parses the ISO date in local time, so the weekday never shifts by a day. */
export function holidayDate(h: Holiday): Date {
  const [y, m, d] = h.date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isRestDay(date: Date): boolean {
  return date.getDay() === 0;
}

export const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatHolidayDate(h: Holiday): string {
  const d = holidayDate(h);
  return `${WEEKDAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export const HOLIDAY_TYPE_LABEL: Record<HolidayType, string> = {
  regular: "Regular holiday",
  special: "Special non-working",
  "special-working": "Special working",
};

/** Maps a holiday to the day type used by the premium pay calculator. */
export function dayTypeForHoliday(h: Holiday, onRestDay = false): DayTypeId {
  if (h.type === "regular") return onRestDay ? "regular-holiday-rest-day" : "regular-holiday";
  if (h.type === "special") return onRestDay ? "special-rest-day" : "special";
  return onRestDay ? "rest-day" : "ordinary";
}

export function upcomingHolidays(from = new Date()): Holiday[] {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return HOLIDAYS_2026.filter((h) => holidayDate(h) >= today);
}

export function nextHoliday(from = new Date()): Holiday | undefined {
  return upcomingHolidays(from)[0];
}

export function daysUntil(h: Holiday, from = new Date()): number {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((holidayDate(h).getTime() - today.getTime()) / 86_400_000);
}
