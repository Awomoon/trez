/**
 * Stars, the moon, and the light it throws.
 *
 * Always rendered, shown only under the moon theme: the whole thing is
 * hidden with one CSS rule, so nothing here has to know which theme is on
 * and there is no chance of the server and the browser disagreeing.
 *
 * It sits in the same stacking layer as the liquid background and is
 * mounted after it, so the sky reads as being behind the glass but in
 * front of the blobs.
 */
export default function MoonSky() {
  return (
    <div
      aria-hidden
      className="moon-sky pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="moon-stars-fine" />
      <div className="moon-stars-bright" />
      <div className="moon-wash" />
      <div className="moon-disc" />
    </div>
  );
}
