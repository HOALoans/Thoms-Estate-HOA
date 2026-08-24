"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useTreasurer() {
  const pathname = usePathname();
  const [isTreasurer, setIsTreasurer] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { treasurer?: boolean }) => {
        if (!cancelled) setIsTreasurer(Boolean(data.treasurer));
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return {
    isTreasurer,
    ready,
    treasurer: isTreasurer,
    logout: async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsTreasurer(false);
      window.location.href = "/budget";
    },
  };
}
