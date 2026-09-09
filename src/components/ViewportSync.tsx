'use client'

import { useEffect, useRef } from 'react'

/**
 * Keeps `--app-h` equal to the height that is actually visible on screen.
 *
 * The rule this file exists to enforce: **`100dvh` is authoritative, and JS only
 * intervenes when the engine is measurably wrong.**
 *
 * That is a correction of the first version (2026-09-08), which unconditionally wrote
 * `window.innerHeight` into `--app-h` on every viewport event. It made the gap it was
 * meant to fix *more* likely, and here is why: `100dvh` is recomputed continuously by
 * the browser, so it is correct by construction at every instant. A pixel snapshot is
 * correct only until the next change. Writing one as an inline style on `<html>`
 * permanently replaces the self-maintaining value with a static one — so when iOS fired
 * `resize` repeatedly *through* its toolbar animation and the last event carried an
 * intermediate height, that intermediate value was latched forever, and `dvh` could no
 * longer rescue it. The blank strip came back (Jack, 2026-09-09).
 *
 * So: sample only once the viewport has stopped moving, hand the value back to `dvh`
 * first, and re-apply an override only if `dvh` still disagrees with the real visible
 * height. In the normal case nothing is overridden at all.
 *
 * The `removeProperty` is doing two jobs — it restores `dvh`, and the style mutation is
 * itself the relayout iOS otherwise skips on a page with no scrollable document, which
 * was the original diagnosis and still holds.
 *
 * `window.innerHeight` remains the reference rather than `visualViewport.height`: the
 * two agree as the toolbars animate, but only the latter also shrinks under pinch-zoom,
 * which would collapse the shell to the zoom window. Zoomed viewports are skipped.
 */
export function ViewportSync() {
  // Rendered below at exactly `100dvh`. Its measured height is what `dvh` currently
  // resolves to — the only way to ask the engine that question directly.
  const probeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const probe = probeRef.current
    if (!probe) return

    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let raf = 0

    const measure = () => {
      if ((window.visualViewport?.scale ?? 1) > 1) return

      // Hand control back to `dvh` and let it re-resolve.
      root.style.removeProperty('--app-h')

      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const want = window.innerHeight
        const got = probe.getBoundingClientRect().height
        // Sub-pixel disagreement is normal on fractional device ratios; 1px of
        // tolerance keeps us from thrashing an override on and off.
        if (want > 0 && Math.abs(got - want) > 1) {
          root.style.setProperty('--app-h', `${Math.round(want)}px`)
        }
        // A browser with no `dvh` support leaves the probe at 0, so it lands here
        // too and JS supplies the height outright — which is the old `100vh`
        // fallback's job, done with a real measurement instead.
      })
    }

    const schedule = () => {
      clearTimeout(settleTimer)
      // Long enough to outlast an iOS toolbar animation. Sampling mid-flight is
      // precisely the mistake that caused the regression described above.
      settleTimer = setTimeout(measure, 250)
    }

    measure()

    const vv = window.visualViewport
    vv?.addEventListener('resize', schedule)
    window.addEventListener('resize', schedule)
    window.addEventListener('orientationchange', schedule)
    // bfcache restores can come back sized for whatever the chrome was doing when
    // the page was frozen.
    window.addEventListener('pageshow', schedule)

    return () => {
      clearTimeout(settleTimer)
      cancelAnimationFrame(raf)
      vv?.removeEventListener('resize', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('orientationchange', schedule)
      window.removeEventListener('pageshow', schedule)
    }
  }, [])

  return (
    <div
      ref={probeRef}
      aria-hidden
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: '100dvh',
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
    />
  )
}
