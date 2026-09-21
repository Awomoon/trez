"use client";

import { site } from "@/config/site";

const STORAGE_KEY = "trez:unlocked";

/** Local midnight on the configured date. */
export function unlockDate(): Date {
  const [year, month, day] = site.lock.unlocksOn.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

/**
 * Whether the date has arrived. Deliberately a fixed date from config rather
 * than the countdown's "next birthday", which rolls forward to the year after
 * once the day passes and would silently re-lock the site on October 9th.
 */
export function isUnlockable(now: Date = new Date()): boolean {
  return now.getTime() >= unlockDate().getTime();
}

/* Storage is wrapped because it throws in private windows and when site data
   is blocked. A failure there should cost the passcode, not the page. */
export function hasStoredUnlock(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function storeUnlock(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* Nothing to do: she will simply be asked again next visit. */
  }
}

export function clearStoredUnlock(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export type LockOverride = "before" | "open" | null;

/**
 * Testing switches, so every state can be checked without changing the clock:
 *
 *   ?preview      skip the lock entirely and go straight to the site
 *   ?lock=before  force the countdown state, whatever today is
 *   ?lock=open    force the passcode pad, whatever today is
 *   ?reset        forget a previous unlock and start over
 */
export function readPreviewFlags(): {
  preview: boolean;
  override: LockOverride;
} {
  if (typeof window === "undefined") return { preview: false, override: null };

  const params = new URLSearchParams(window.location.search);

  if (params.has("reset")) clearStoredUnlock();

  const raw = params.get("lock");
  const override: LockOverride =
    raw === "before" || raw === "open" ? raw : null;

  return { preview: params.has("preview"), override };
}
