import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const targetId = decodeURIComponent(location.hash.slice(1));
    let attempts = 0;
    let retryId: number | null = null;

    const scrollToTarget = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      attempts += 1;
      if (attempts >= 20) return;

      retryId = window.setTimeout(scrollToTarget, 100);
    };

    scrollToTarget();

    return () => {
      if (retryId != null) {
        window.clearTimeout(retryId);
      }
    };
  }, [location.hash, location.pathname]);

  return null;
}
