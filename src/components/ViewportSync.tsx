'use client'

import { useEffect } from 'react'

/**
 * Keeps `--app-h` equal to the height that is actually visible on screen, so every
 * full-screen layer on the site can size off one honest number.
 *
 * Why this exists at all, given globals.css already defaults `--app-h` to `100dvh`:
 * `dvh` fixes the *value* but not the *timing*. iOS only re-resolves the size of
 * `position: fixed` layers at scroll-end or on layout, and this site has no scrollable
 * document to produce either — the homepage is a fixed, overscroll-none shell, and
 * /acquire is one viewport tall. So when the browser chrome settles into a different
 * height shortly after load (or after a bfcache restore, or a tab switch), the fixed
 * layers keep the size they were laid out at, and the strip they no longer cover is
 * simply never painted — it shows the page canvas, i.e. body's warm sand. That is the
 * gap reported at the bottom of the page on mobile, which a reload or a long scroll
 * clears because both force the layout iOS skipped.
 *
 * Writing this custom property IS that missing layout trigger, which is the real reason
 * the effect is here rather than trusting `dvh` alone.
 *
 * The measurement is `window.innerHeight`, not `visualViewport.height`, on purpose:
 * the two agree as the toolbars animate, but only the latter also shrinks when the user
 * pinch-zooms in — which would collapse the shell to the size of the zoom window.
 * visualViewport is still the better *signal*, so it drives the listener while
 * innerHeight supplies the value; a zoomed-in viewport is skipped outright.
 */
export function ViewportSync() {
  useEffect(() => {
    const root = document.documentElement

    const apply = () => {
      // Mid-pinch-zoom, innerHeight is stale and visualViewport is misleading; the
      // chrome cannot resize while zoomed anyway, so there is nothing to re-sync.
      if ((window.visualViewport?.scale ?? 1) > 1) return
      root.style.setProperty('--app-h', `${Math.round(window.innerHeight)}px`)
    }

    apply()

    // `resize` on visualViewport is what actually fires as iOS animates its toolbars;
    // window resize covers desktop and orientation, and pageshow covers bfcache
    // restores, where the page can come back sized for whatever the chrome was doing
    // when it was frozen. Deliberately NOT visualViewport's `scroll` — it fires
    // continuously and adds nothing here.
    const vv = window.visualViewport
    vv?.addEventListener('resize', apply)
    window.addEventListener('resize', apply)
    window.addEventListener('orientationchange', apply)
    window.addEventListener('pageshow', apply)

    return () => {
      vv?.removeEventListener('resize', apply)
      window.removeEventListener('resize', apply)
      window.removeEventListener('orientationchange', apply)
      window.removeEventListener('pageshow', apply)
    }
  }, [])

  return null
}
