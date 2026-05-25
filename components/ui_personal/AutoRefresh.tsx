"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  intervalSeconds?: number;
  disabled?: boolean;
};

export function AutoRefresh({ intervalSeconds = 30, disabled = false }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (disabled) return;

    const interval = setInterval(() => {
      router.refresh();
    }, intervalSeconds * 1000);
    // cleanup: quando il componente viene smontato ferma il timer
    return () => clearInterval(interval);
  }, [router, intervalSeconds, disabled]);
  // non renderizzando nulla é invisibile
  return null;
}
