import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "ghost-light" | "outline-light";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-gli-blue text-white hover:bg-gli-navy",
  accent: "bg-gli-yellow text-gli-ink hover:bg-[color-mix(in_oklab,var(--color-gli-yellow),black_8%)]", // Press Yellow: max one per view
  secondary: "border border-gli-blue text-gli-blue bg-white hover:bg-gli-tint",
  "ghost-light": "text-white hover:bg-white/10",
  "outline-light": "border border-white text-white hover:bg-white hover:text-gli-navy",
};
const sizes: Record<Size, string> = {
  md: "min-h-11 px-4 text-[0.9375rem]",
  lg: "min-h-12 px-6 text-base",
};

export const buttonClass = (variant: Variant = "primary", size: Size = "md", className?: string) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-heading font-semibold transition-colors",
    variants[variant],
    sizes[size],
    className,
  );

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
