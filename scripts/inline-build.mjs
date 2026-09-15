/**
 * Folds the static export in `out/` into ONE self-contained HTML fragment.
 *
 * Why: a preview host may serve the page from any URL depth, and every
 * `/_next/...` reference in the export is absolute. Inlining the CSS, the JS
 * chunks and the font files as data URIs removes every external reference, so
 * the page renders correctly wherever it is dropped — no base path, no CDN, no
 * network beyond the initial document.
 *
 * Output is a fragment (no <html>/<head>/<body>) because that is what the
 * Artifact host expects; it supplies its own skeleton.
 *
 *   node scripts/inline-build.mjs [outFile]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const dest = process.argv[2] ?? "dist/standalone.html";

const asset = (url) => join(OUT, url.replace(/^\//, ""));
/* Next's nomodule polyfill contains literal U+FFFD characters — a URL-decoding
 * routine that returns the replacement character for invalid input. They are
 * intentional, but a raw U+FFFD in a published file reads as corruption, and an
 * HTML entity would not help: entities are not decoded inside <script>. The JS
 * escape is the lossless equivalent inside a string or regex literal, which is
 * the only place the character appears. */
const escapeScript = (js) =>
  js.replaceAll("</script", "<\\/script").replaceAll("\uFFFD", "\\uFFFD");

let html = readFileSync(join(OUT, "index.html"), "utf8");

/* ---- 1. Fonts: base64 into the stylesheet ------------------------------- */
const cssHref = html.match(
  /<link rel="stylesheet" href="([^"]+)"[^>]*\/?>/,
)?.[1];
if (!cssHref) throw new Error("no stylesheet found in export");

let css = readFileSync(asset(cssHref), "utf8");
let fontCount = 0;

css = css.replace(/url\((\/_next\/static\/media\/[^)]+?)\)/g, (_, url) => {
  const b64 = readFileSync(asset(url)).toString("base64");
  fontCount += 1;
  return `url(data:font/woff2;base64,${b64})`;
});

/* ---- 2. Swap the stylesheet link for the inlined style ------------------ */
html = html.replace(
  /<link rel="stylesheet" href="[^"]+"[^>]*\/?>/,
  `<style>${css}</style>`,
);

/* ---- 3. Inline every script, preserving document order ------------------ */
let scriptCount = 0;

html = html.replace(
  /<script src="([^"]+)"([^>]*)><\/script>/g,
  (_, src, attrs) => {
    const js = escapeScript(readFileSync(asset(src), "utf8"));
    scriptCount += 1;
    // `nomodule` must survive; `async`/`defer` must not — inline scripts run in
    // document order, which is stricter and safer than the async ordering the
    // export relied on.
    const nomodule = /nomodule/i.test(attrs) ? " nomodule" : "";
    return `<script${nomodule}>${js}</script>`;
  },
);

/* ---- 4. Drop references that would now 404 ------------------------------ */
html = html
  .replace(/<link rel="preload"[^>]*\/?>/g, "")
  .replace(/<link rel="icon"[^>]*\/?>/g, "")
  // The artifact skeleton supplies charset + viewport itself.
  .replace(/<meta charSet="[^"]*"\/?>/gi, "")
  .replace(/<meta name="viewport"[^>]*\/?>/gi, "");

/* ---- 4b. Clean the RSC flight payload -----------------------------------
 * The payload embedded in the page still names the original asset URLs, and
 * React acts on them during hydration: `:HL[...]` rows become <link rel=
 * preload> and the layout's stylesheet row is re-injected into the head. Both
 * would 404 now that the real bytes live inline, so the preload rows are
 * dropped and the stylesheet is pointed at an empty data: URI. The inlined
 * <style> above is already doing that job.                                  */
const beforeHints = html.length;
html = html.replace(/:HL\[\\"\/_next\/[^\]]*?\]\\n/g, "");
const hintsDropped = beforeHints !== html.length;

html = html.replaceAll(cssHref, "data:text/css,");

/* ---- 4c. Inline anything left in /public --------------------------------
 * The favicon is referenced from the metadata config, so React re-injects it
 * on hydration even after the static <link rel="icon"> is removed. Any such
 * root-relative asset is turned into a base64 data URI — base64 has no
 * characters that would break the JSON escaping of the flight payload.       */
const MIME = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  ico: "image/x-icon",
  gif: "image/gif",
};

/* The trailing `?hash` matters: the app/icon.svg file convention adds a
 * cache-busting query, and replacing only the path would leave that query
 * dangling on the end of the data URI, corrupting the base64. */
const publicRefs = new Set(
  [
    ...html.matchAll(
      /\/[\w.\-/]+\.(?:svg|png|jpe?g|webp|ico|gif)(?:\?[\w.\-]*)?/g,
    ),
  ].map((m) => m[0]),
);

for (const ref of publicRefs) {
  const path = ref.split("?")[0];
  let bytes;
  try {
    bytes = readFileSync(asset(path));
  } catch {
    continue; // Not something we ship; leave it alone.
  }
  const ext = path.split(".").pop().toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  html = html.replaceAll(
    ref,
    `data:${mime};base64,${bytes.toString("base64")}`,
  );
}

/* ---- 5. Reduce the document to a fragment ------------------------------- */
const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] ?? "";
if (!head || !body) throw new Error("could not split the exported document");

/* next/font declares its CSS variables on classes that live on the exported
 * <html> element (and `antialiased` on <body>). The host supplies its own
 * skeleton, so those attributes would be lost and every font would silently
 * fall back. Re-apply them from a script that runs before anything paints. */
const htmlClass = html.match(/<html[^>]*\sclass="([^"]*)"/)?.[1] ?? "";
const bodyClass = html.match(/<body[^>]*\sclass="([^"]*)"/)?.[1] ?? "";

if (!htmlClass) throw new Error("no class found on the exported <html>");

const restoreClasses = `<script>
(function () {
  var h = ${JSON.stringify(htmlClass)}.split(/\\s+/);
  var b = ${JSON.stringify(bodyClass)}.split(/\\s+/).filter(Boolean);
  var apply = function () {
    h.forEach(function (c) { if (c) document.documentElement.classList.add(c); });
    b.forEach(function (c) { document.body && document.body.classList.add(c); });
  };
  apply();
  // React owns <html> and <body> in the App Router, so re-apply once it has
  // hydrated in case it reconciles the attribute away.
  document.addEventListener("DOMContentLoaded", apply);
  requestAnimationFrame(function () { requestAnimationFrame(apply); });
})();
</script>`;

/* Hoist <title> to the very top. Inlining the chunks pushes the head past
 * 350KB, and hosts that sniff a page's title only read the opening bytes. */
const title = head.match(/<title>[\s\S]*?<\/title>/)?.[0] ?? "";
const headRest = title ? head.replace(title, "") : head;

const fragment = `${title}\n${restoreClasses}\n${headRest}\n${body}`;

/* Guard: no element or stylesheet may still POINT at an exported asset.
 * A bare "/_next/" inside inlined JS is fine — that is webpack's publicPath,
 * and it is only ever read to fetch a chunk that is now already inlined. What
 * would actually break the page is a src/href/url() still naming a file that
 * no longer ships, so that is what is checked. */
const dangling = fragment.match(
  /(?:src|href)="\/[^"]*"|url\(\/[^)]*\)/g,
);
if (dangling) {
  throw new Error(
    `these references survived inlining:\n  ${dangling.join("\n  ")}`,
  );
}

if (fragment.includes("\uFFFD")) {
  throw new Error("a raw U+FFFD survived inlining");
}

writeFileSync(dest, fragment);

const mb = (Buffer.byteLength(fragment) / 1024 / 1024).toFixed(2);
console.log(
  `inlined ${scriptCount} scripts, ${fontCount} fonts` +
    `${hintsDropped ? ", dropped preload hints" : ""} -> ${dest} (${mb} MB)`,
);
