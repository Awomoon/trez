import { site } from "@/config/site";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export type CountdownPhase = "before" | "today" | "after";

export type CountdownState = {
  phase: CountdownPhase;
  timeLeft: TimeLeft;
};

const ZERO: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

/**
 * The next occurrence of the birthday. If today *is* the birthday we return
 * today's midnight so the "today" phase can be detected by the caller.
 */
export function nextBirthday(from: Date): Date {
  const { month, day } = site.birthday;
  const thisYear = new Date(from.getFullYear(), month - 1, day, 0, 0, 0, 0);

  if (from.getTime() < thisYear.getTime()) return thisYear;

  const endOfBirthday = new Date(thisYear);
  endOfBirthday.setDate(endOfBirthday.getDate() + 1);

  // Still inside the birthday itself.
  if (from.getTime() < endOfBirthday.getTime()) return thisYear;

  return new Date(from.getFullYear() + 1, month - 1, day, 0, 0, 0, 0);
}

export function getCountdown(now: Date): CountdownState {
  const target = nextBirthday(now);
  const isToday =
    now.getMonth() === site.birthday.month - 1 &&
    now.getDate() === site.birthday.day;

  if (isToday) return { phase: "today", timeLeft: ZERO };

  const diff = Math.max(0, target.getTime() - now.getTime());
  const seconds = Math.floor(diff / 1000);

  return {
    phase: "before",
    timeLeft: {
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60,
    },
  };
}

export const pad = (value: number, length = 2) =>
  String(value).padStart(length, "0");

/** "October 8" — used in the hero badge, locale-independent on purpose. */
export const birthdayLabel = () => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
  });
  return formatter.format(
    new Date(2000, site.birthday.month - 1, site.birthday.day),
  );
};
