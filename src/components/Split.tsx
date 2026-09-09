const NBSP = " ";

/** Wrap each word in a rise-from-mask span. Use `.sw` as the GSAP target. */
export function SplitWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="mask">
          <span className="sw">{w + NBSP}</span>
        </span>
      ))}
    </span>
  );
}

/** Wrap each character in a rise-from-mask span. Use `.sl` as the GSAP target. */
export function SplitLetters({
  text,
  className = "",
  vertical = false,
}: {
  text: string;
  className?: string;
  vertical?: boolean;
}) {
  return (
    <span
      className={className}
      aria-label={text}
      style={vertical ? { writingMode: "vertical-rl" } : undefined}
    >
      {[...text].map((c, i) => (
        <span
          key={i}
          className="mask"
          aria-hidden
          style={vertical ? { verticalAlign: "top" } : undefined}
        >
          <span className="sl">{c === " " ? NBSP : c}</span>
        </span>
      ))}
    </span>
  );
}
