/**
 * Two looks, one build.
 *
 *   ?theme=moon    the moonlit night version
 *   ?theme=blue    the original
 *
 * The choice sticks in localStorage so it survives the walk down the page,
 * and the default when nothing has been chosen is the original, so nobody
 * arriving at the plain link sees anything change.
 *
 * `applyTheme` is stringified into a blocking script in the document head:
 * it has to run before the first paint or the page flashes one theme and
 * then swaps, which looks like a fault. That means it can use nothing from
 * outside its own body.
 */
export type Theme = "blue" | "moon";

export const THEME_KEY = "trez:theme";

export function applyTheme() {
  try {
    const key = "trez:theme";
    const param = new URLSearchParams(window.location.search).get("theme");
    let chosen: string | null =
      param === "moon" || param === "blue" ? param : null;

    if (chosen) {
      try {
        window.localStorage.setItem(key, chosen);
      } catch (e) {
        /* private window: it just will not be remembered */
      }
    } else {
      try {
        const saved = window.localStorage.getItem(key);
        if (saved === "moon" || saved === "blue") chosen = saved;
      } catch (e) {
        /* ignore */
      }
    }

    if (chosen === "moon") {
      document.documentElement.setAttribute("data-theme", "moon");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (e) {
    /* Any failure here must leave the original theme standing. */
  }
}

/** The script tag's body. */
export const themeScript = `(${applyTheme.toString()})();`;
