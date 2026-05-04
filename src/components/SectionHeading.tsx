type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  titleAs?: "h1" | "h2";
  compact?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  titleAs = "h1",
  compact = false,
}: SectionHeadingProps) {
  const TitleTag = titleAs;

  return (
    <div>
      <p className="text-[11px] tracking-[0.32em] text-[var(--muted)] uppercase">
        {eyebrow}
      </p>
      <TitleTag
        className={`mt-3 font-[family-name:var(--font-cormorant)] font-semibold text-[var(--foreground)] ${
          compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl"
        }`}
      >
        {title}
      </TitleTag>
      {description ? (
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[#d3c3a5]">
          {description}
        </p>
      ) : null}
    </div>
  );
}
