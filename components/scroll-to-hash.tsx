"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * On the home page, scrolls to the element matching window.location.hash after
 * paint (e.g. when navigating from /contact to /#protein). Also handles
 * hashchange so same-page hash links scroll correctly.
 */
export function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const scrollToHash = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (!hash) return;
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    // Run after paint so target section exists when navigating from another page
    const t = setTimeout(scrollToHash, 0);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      clearTimeout(t);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname]);

  return null;
}
