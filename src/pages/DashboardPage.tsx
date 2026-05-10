import { useDashboardStats } from "@/hooks/useProducts";
import StatCard from "@/components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Package, DollarSign, AlertTriangle, Layers } from "lucide-react";

const CHART_COLORS = [
  "#6c63ff","#ff6584","#43e97b","#f093fb","#4facfe",
  "#fa709a","#fee140","#30cfd0","#a18cd1","#fbc2eb",
];

function formatRupiah(value: number): string {
  if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}K`;
  return `Rp ${value}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-[13px]">
        <div
          className="mb-1 text-[var(--color-text-secondary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </div>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {payload.map((p: any, i: number) => (
          <div key={i} className="font-semibold" style={{ color: p.color }}>
            {p.name === "totalValue"
              ? formatRupiah(p.value as number)
              : `${p.value} products`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-10">
        <div
          className="mb-2 text-[28px] font-extrabold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </div>
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="skeleton h-[320px]" />
          <div className="skeleton h-[320px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1
          className="mb-1 text-2xl font-extrabold text-[var(--color-text-primary)] lg:text-[28px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Overview
        </h1>
        <p className="m-0 text-sm text-[var(--color-text-muted)]">
          Product statistics & analytics
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:mb-8 md:grid-cols-4 md:gap-4">
        <StatCard
          label="Total Products"
          value={stats?.totalProducts ?? 0}
          icon={<Package size={20} />}
          color="#6c63ff"
          sub={`${stats?.categories.length ?? 0} categories`}
        />
        <StatCard
          label="Inventory Value"
          value={formatRupiah(stats?.totalValue ?? 0)}
          icon={<DollarSign size={20} />}
          color="#43e97b"
          sub="Total stock value"
        />
        <StatCard
          label="Low Stock"
          value={stats?.lowStock ?? 0}
          icon={<AlertTriangle size={20} />}
          color="#ff6584"
          sub="Items below 10 units"
        />
        <StatCard
          label="Categories"
          value={stats?.categories.length ?? 0}
          icon={<Layers size={20} />}
          color="#4facfe"
          sub="Unique categories"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
          <h3
            className="mb-1 text-[15px] font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Products per Category
          </h3>
          <p className="mb-6 text-xs text-[var(--color-text-muted)]">
            Count of products by category
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={stats?.categories ?? []}
              margin={{ top: 0, right: 0, left: -20, bottom: 40 }}
            >
              <XAxis
                dataKey="category"
                tick={{ fill: "var(--color-text-muted)", fontSize: 11, fontFamily: "var(--font-body)" }}
                axisLine={false}
                tickLine={false}
                angle={-35}
                textAnchor="end"
              />
              <YAxis
                tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(108,99,255,0.06)" }} />
              <Bar dataKey="count" name="count" radius={[6, 6, 0, 0]}>
                {(stats?.categories ?? []).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
          <h3
            className="mb-1 text-[15px] font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Category Distribution
          </h3>
          <p className="mb-2 text-xs text-[var(--color-text-muted)]">
            Share of inventory value
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats?.categories ?? []}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="45%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={3}
              >
                {(stats?.categories ?? []).map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    stroke="var(--color-surface)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span
                    className="text-[11px] text-[var(--color-text-secondary)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {value}
                  </span>
                )}
                iconType="circle"
                iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category table */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="px-4 pb-4 pt-5 sm:px-6">
          <h3
            className="m-0 text-[15px] font-bold text-[var(--color-text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Category Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr className="border-y border-[var(--color-border)]">
                {["Category", "Products", "Inventory Value"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--color-text-muted)] sm:px-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats?.categories ?? []).map((cat, i) => (
                <tr
                  key={cat.category}
                  className="border-b border-[var(--color-border)] transition-colors duration-150 last:border-none hover:bg-[var(--color-surface-2)]"
                >
                  <td className="px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {cat.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)] sm:px-6">{cat.count}</td>
                  <td className="px-4 py-3 font-medium text-[var(--color-accent-3)] sm:px-6">
                    {formatRupiah(cat.totalValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
