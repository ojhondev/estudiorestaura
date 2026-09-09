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
    <header className="shell pt-28 md:pt-40">
      <p
        data-reveal="wipe"
        className="text-[12px] uppercase tracking-[0.32em] text-terracotta"
      >
        {kicker}
      </p>
      <h1
        data-reveal
        className="display mt-5 text-[clamp(2.75rem,10vw,8rem)]"
      >
        {title}
      </h1>
      {children && (
        <>
          <hr data-reveal="wipe" className="rule mt-8" />
          <div
            data-reveal
            className="mt-8 max-w-[58rem] text-[clamp(1.05rem,1.8vw,1.45rem)] leading-[1.5] text-ink-soft"
          >
            {children}
          </div>
        </>
      )}
    </header>
  );
}
