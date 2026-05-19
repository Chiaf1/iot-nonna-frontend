"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  intervalSeconds?: number;
};

export function AutoRefresh({ intervalSeconds = 30 }: Props) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, intervalSeconds * 1000);
    // cleanup: quando il componente viene smontato ferma il timer
    return () => clearInterval(interval);
  }, [router, intervalSeconds]);
  // non renderizzando nulla é invisibile
  return null;
}
