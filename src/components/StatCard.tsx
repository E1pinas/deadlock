import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  className?: string;
  valueClassName?: string;
};

export default function StatCard({
  label,
  value,
  className = "",
  valueClassName = "text-2xl",
}: StatCardProps) {
  return (
    <article
      className={`rounded-[24px] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] ${className}`.trim()}
    >
      <p className="text-[10px] tracking-[0.24em] text-[var(--muted)] uppercase">
        {label}
      </p>
      <p className={`mt-3 font-semibold text-[var(--foreground)] ${valueClassName}`}>
        {value}
      </p>
    </article>
  );
}
