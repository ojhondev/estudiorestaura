import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TextArrow({
  href,
  children,
  className = "",
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & Record<`data-${string}`, string | undefined>) {
  const inner = (
    <>
      {children}
      <Arrow />
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={`text-arrow ${className}`} {...rest}>
      {inner}
    </Link>
  ) : (
    <a href={href} className={`text-arrow ${className}`} {...rest}>
      {inner}
    </a>
  );
}

export function SectionHeader({
  label,
  title,
  className = "",
  as: Tag = "h2",
}: {
  label: string;
  title: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={className}>
      <p data-reveal="fade" className="label">
        {label}
      </p>
      <Tag
        data-reveal
        className="h-lg mt-4 text-[clamp(2.25rem,5.5vw,3.875rem)]"
      >
        {title}
      </Tag>
    </div>
  );
}
