"use client";

import Script from "next/script";
import { useTrackingConsent } from "@/lib/tracking/consent-context";

const FB_EVENTS_URL = "https://connect.facebook.net/en_US/fbevents.js";

/**
 * Inline script that creates the fbq stub before fbevents.js loads.
 * Must run before the external script so Meta's script can attach to it.
 */
function getFbqStubScript(): string {
  return `
(function(f,b,e,v,n,t,s){
  if(f.fbq)return;
  n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;
  n.push=n;
  n.loaded=!0;
  n.version='2.0';
  n.queue=[];
})(window,document,'script','${FB_EVENTS_URL}');
`;
}

export function MetaPixel() {
  const { consent } = useTrackingConsent();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (consent !== "accepted" || !pixelId) {
    return null;
  }

  console.log("pixelId", pixelId);
  console.log("consent", consent);
  console.log("typeof window", typeof window);
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: getFbqStubScript() }}
        type="text/javascript"
      />
      <Script
        src={FB_EVENTS_URL}
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined" && window.fbq) {
            window.fbq("init", pixelId);
            window.fbq("track", "PageView");
          }
        }}
      />
      <noscript>
        <img
          height={1}
          width={1}
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

declare global {
  interface Window {
    fbq: (
      action: string,
      ...args: (string | Record<string, unknown>)[]
    ) => void;
  }
}
