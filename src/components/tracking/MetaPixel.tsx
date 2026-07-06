"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PIXEL_ID = "729465692904797";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    /** Posé par la 404 (NotFoundGame) : ne pas compter de PageView. */
    __unboaredNoTrack?: boolean;
  }
}

/**
 * Meta Pixel (Facebook Ads) — same pixel ID as console.unboared.com so the
 * whole funnel (ad click → landing → signup → trial) is attributed to one pixel.
 * Fires PageView on initial load (snippet) and on client-side navigations.
 *
 * Les pages 404 lèvent `window.__unboaredNoTrack` : typos, liens morts et
 * scans de bots ne doivent pas polluer les PageView qui servent à
 * l'optimisation des campagnes (le snippet, `afterInteractive`, s'exécute
 * après l'hydratation, donc après la pose du drapeau).
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Initial PageView is fired by the inline snippet below.
      isFirstRender.current = false;
      return;
    }
    if (window.__unboaredNoTrack) return;
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
if(!window.__unboaredNoTrack)fbq('track', 'PageView');`}
    </Script>
  );
}
