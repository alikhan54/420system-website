/**
 * ColorGrade.tsx — the site-wide grade ("one camera") + the film-cut veil.
 *
 *  - .omega-grade: a fixed full-viewport backdrop-filter (saturate/contrast/
 *    brightness) + a soft-light scene tint, unifying the 8 wildly different
 *    atmospheres into one consistent look — a digital LUT. Sits ABOVE the canvas
 *    and content (z-40) but BELOW the chrome (z-50) so the header stays ungraded.
 *  - #omega-cut: a near-white veil flashed briefly on act boundaries (film cut).
 */
export function ColorGrade() {
  return (
    <>
      <div className="omega-grade" aria-hidden />
      <div id="omega-cut" className="omega-cut" aria-hidden />
    </>
  )
}
