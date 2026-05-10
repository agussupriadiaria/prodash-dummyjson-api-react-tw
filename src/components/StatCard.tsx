import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  sub?: string;
}

export default function StatCard({ label, value, icon, color, sub }: StatCardProps) {
  return (
    <div
      className="animate-fade-in relative overflow-hidden rounded-2xl p-6 transition-all duration-200 ease-in-out border border-[var(--color-border)] bg-[var(--color-surface)] hover:-translate-y-0.5"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border)";
      }}
    >
      {/* Glow bg */}
      <div
        className="pointer-events-none absolute -top-10 -right-10 h-[120px] w-[120px] rounded-full blur-[30px] opacity-[0.08]"
        style={{ background: color }}
      />

      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-[0.05em] text-[var(--color-text-muted)]">
            {label}
          </div>
          <div
            className="text-[32px] font-bold leading-none text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {value}
          </div>
          {sub && (
            <div className="mt-1.5 text-xs text-[var(--color-text-muted)]">{sub}</div>
          )}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border"
          style={{
            background: `${color}22`,
            borderColor: `${color}44`,
            color,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
