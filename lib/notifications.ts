import { Platform } from "react-native";

import { HOLIDAYS_2026, type Holiday } from "./data/holidays";
import { DAY_TYPES } from "./rates";
import type { NotificationPrefs, Role } from "./store/useAppStore";

/**
 * expo-notifications is required lazily, and only on native. Importing it at
 * module scope pulls a push-token listener into the web bundle that then warns
 * it does nothing — dead weight for a feature the web build cannot have.
 */
type NotificationsModule = typeof import("expo-notifications");

function loadNotifications(): NotificationsModule | null {
  if (Platform.OS === "web") return null;
  try {
    return require("expo-notifications") as NotificationsModule;
  } catch {
    return null;
  }
}

/**
 * Everything here is scheduled locally on the device. There is no push
 * infrastructure, no token, and nothing leaves the phone.
 *
 * Cap: a few a month. Every notification carries a specific figure or date
 * rather than a nudge to open the app.
 */

const MAX_SCHEDULED = 24;

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = loadNotifications();
  if (!Notifications) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.status === "granted";
}

function holidayBody(h: Holiday): string {
  if (h.type === "regular") {
    const rule = DAY_TYPES.find((d) => d.id === "regular-holiday")!;
    return `Regular holiday. Work pays ${rule.workedRate * 100}% of your daily rate; if you do not work, ${rule.unworkedRate * 100}% if you were present the working day before.`;
  }
  if (h.type === "special") {
    const rule = DAY_TYPES.find((d) => d.id === "special")!;
    return `Special non-working day. Work pays ${rule.workedRate * 100}% of your daily rate. No work, no pay unless company policy says otherwise.`;
  }
  return "Special working day. Ordinary pay rules apply — no premium.";
}

/** Deadlines that matter to HR and business owners, with the figure attached. */
const COMPLIANCE_DEADLINES: { month: number; day: number; title: string; body: string }[] = [
  {
    month: 1,
    day: 28,
    title: "BIR 1604-C and alphalist",
    body: "Annual information return on compensation and the alphalist of employees are due 31 January.",
  },
  {
    month: 2,
    day: 26,
    title: "BIR 2316 to employees",
    body: "Certificates of compensation payment and tax withheld are due to employees by 28 February.",
  },
  {
    month: 11,
    day: 20,
    title: "13th month pay",
    body: "13th month pay is total basic salary earned ÷ 12, payable on or before 24 December. Start computing now.",
  },
  {
    month: 12,
    day: 15,
    title: "13th month pay deadline",
    body: "13th month pay must be released on or before 24 December, and reported to DOLE by 15 January.",
  },
];

function nextOccurrence(month: number, day: number, hour = 9): Date | null {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), month - 1, day, hour, 0, 0);
  if (thisYear > now) return thisYear;
  return new Date(now.getFullYear() + 1, month - 1, day, hour, 0, 0);
}

export async function syncNotifications(
  prefs: NotificationPrefs,
  roles: Role[]
): Promise<void> {
  const Notifications = loadNotifications();
  if (!Notifications) return;

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!prefs.enabled) return;

    const granted = await requestNotificationPermission();
    if (!granted) return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const queue: { title: string; body: string; date: Date }[] = [];
    const now = new Date();

    if (prefs.holidays) {
      for (const h of HOLIDAYS_2026) {
        const date = new Date(`${h.date}T09:00:00`);
        const dayBefore = new Date(date.getTime() - 24 * 60 * 60 * 1000);
        dayBefore.setHours(17, 0, 0, 0);
        if (dayBefore > now) {
          queue.push({
            title: `Tomorrow: ${h.name}`,
            body: holidayBody(h),
            date: dayBefore,
          });
        }
      }
    }

    const isHrOrBusiness = roles.includes("hr");
    if (prefs.deadlines && isHrOrBusiness) {
      for (const d of COMPLIANCE_DEADLINES.filter((x) => x.month !== 11)) {
        const date = nextOccurrence(d.month, d.day);
        if (date) queue.push({ title: d.title, body: d.body, date });
      }
      // Monthly remittance reminder, one a month, on the 9th.
      const remit = new Date(now.getFullYear(), now.getMonth(), 9, 9, 0, 0);
      const target = remit > now ? remit : new Date(now.getFullYear(), now.getMonth() + 1, 9, 9, 0, 0);
      queue.push({
        title: "Contribution remittance",
        body: "SSS, PhilHealth and Pag-IBIG contributions for last month fall due this month. Deadlines vary by employer number and agency.",
        date: target,
      });
    }

    if (prefs.thirteenthMonth) {
      const d = COMPLIANCE_DEADLINES.find((x) => x.month === 11)!;
      const date = nextOccurrence(d.month, d.day);
      if (date) queue.push({ title: d.title, body: d.body, date });
    }

    queue.sort((a, b) => a.date.getTime() - b.date.getTime());

    for (const item of queue.slice(0, MAX_SCHEDULED)) {
      await Notifications.scheduleNotificationAsync({
        content: { title: item.title, body: item.body },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: item.date,
        },
      });
    }
  } catch {
    /* Notifications are a convenience. The app works without them. */
  }
}
