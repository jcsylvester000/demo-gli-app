"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Renders children except on the listed paths (e.g. the CTA band and chat button are hidden on /quote). */
export function HideOn({ paths, children }: { paths: string[]; children: ReactNode }) {
  const pathname = usePathname() || "/";
  return paths.some((p) => pathname === p || pathname.startsWith(p + "/")) ? null : <>{children}</>;
}
