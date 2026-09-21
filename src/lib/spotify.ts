/**
 * Spotify share links come with tracking on the end: `si`, `pt` and `pi` tie
 * the copied link back to the account that copied it. None of it is needed to
 * embed anything, and this site is public, so the id is pulled out and the
 * rest is thrown away rather than shipped inside the page.
 *
 * A bare id still works, so either can be pasted into the config.
 */
export function playlistId(link: string): string {
  return link.match(/playlist\/([A-Za-z0-9]+)/)?.[1] ?? link;
}
