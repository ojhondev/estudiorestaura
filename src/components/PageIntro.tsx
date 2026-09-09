import type { ReactNode } from "react";

export function PageIntro({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="shell pt-32 md:pt-44">
      <p
        data-reveal="fade"
        className="font-display text-xs uppercase tracking-[0.32em] text-terracotta"
      >
        {kicker}
      </p>
      <h1
        data-reveal="up"
        data-reveal-delay="0.05"
        className="display mt-4 text-[clamp(2.75rem,9vw,7.5rem)]"
      >
        {title}
      </h1>
      {children && (
        <div
          data-reveal="up"
          data-reveal-delay="0.12"
          className="mt-8 max-w-3xl text-[clamp(1.05rem,1.7vw,1.4rem)] leading-[1.55] text-ink-soft"
        >
          {children}
        </div>
      )}
    </header>
  );
}
