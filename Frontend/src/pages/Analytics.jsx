import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency, getStoredUserId } from "../utils/helpers";
import { getExpenses } from "../utils/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 shadow-2xl"
      style={{
        backgroundColor: "var(--bg-tertiary)",
        border: `1px solid var(--border-color)`,
      }}
    >
      <p
        className="text-xs font-mono mb-1"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </p>
      {payload.map((p) => (
        <p
          key={p.name}
          className="text-sm font-medium"
          style={{ color: p.stroke }}
        >
          {p.name}: {formatCurrency(p.value, true)}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const userId = getStoredUserId();
      if (!userId) return;

      // Fetch last 6 months of data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6);

      const expenses = await getExpenses(userId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: 10000,
      });

      console.log("API RESPONSE:", expenses.data);
      const transactions = expenses.data.expenses || [];

      // Process monthly data
      const monthlyMap = {};
      transactions.forEach((tx) => {
        const date = new Date(tx.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }
        if (tx.type === "income") {
          monthlyMap[monthKey].income += tx.amount || 0;
        } else if (tx.type === "expense") {
          monthlyMap[monthKey].expenses += tx.amount || 0;
        }
      });

      const monthlyArray = Object.values(monthlyMap).sort((a, b) =>
        a.month.localeCompare(b.month),
      );
      setMonthlyData(monthlyArray);

      // Process category data for current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const currentMonthKey = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

      const categoryMap = {};
      transactions.forEach((tx) => {
        const date = new Date(tx.date);
        const txMonth = date.getMonth() + 1;
        const txYear = date.getFullYear();
        if (
          txMonth === currentMonth &&
          txYear === currentYear &&
          tx.type === "expense"
        ) {
          const category = tx.category || "Other";
          categoryMap[category] =
            (categoryMap[category] || 0) + (tx.amount || 0);
        }
      });

      const categoryArray = Object.entries(categoryMap).map(
        ([name, value]) => ({
          name,
          value,
          color: "#d0b880", // Default color, could be improved
        }),
      );
      setCategoryData(categoryArray);
      setRadarData(
        categoryArray.map((c) => ({ subject: c.name, value: c.value })),
      );
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--text-muted)" }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="fade-up">
        <h2
          className="font-display text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Analytics
        </h2>
        <p
          className="text-xs font-mono mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Deep dive into your spending patterns
        </p>
      </div>

      {/* Savings trend */}
      <div className="card p-6 fade-up" style={{ animationDelay: "100ms" }}>
        <h3
          className="font-display text-lg font-semibold mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Savings Over Time
        </h3>
        <p
          className="text-xs font-mono mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Income minus expenses per month
        </p>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={monthlyData.map((m) => ({
                ...m,
                savings: m.income - m.expenses,
              }))}
            >
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6dc7a4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6dc7a4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(61,74,99,0.3)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontFamily: "DM Mono",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontFamily: "DM Mono",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="savings"
                name="Savings"
                stroke="#6dc7a4"
                strokeWidth={2}
                fill="url(#savGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#6dc7a4" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            className="flex items-center justify-center h-40"
            style={{ color: "var(--text-muted)" }}
          >
            <p>No data available</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Radar */}
        <div className="card p-6 fade-up" style={{ animationDelay: "200ms" }}>
          <h3
            className="font-display text-lg font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Spend Distribution
          </h3>
          <p
            className="text-xs font-mono mb-4"
            style={{ color: "var(--text-muted)" }}
          >
            Relative spending by category
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(61,74,99,0.4)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: "rgba(255,255,255,0.35)",
                  fontSize: 11,
                  fontFamily: "DM Mono",
                }}
              />
              <Radar
                name="Spending"
                dataKey="value"
                stroke="#d0b880"
                fill="#d0b880"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories ranking */}
        <div className="card p-6 fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="font-display text-lg font-semibold text-white mb-1">
            Top Spending Categories
          </h3>
          <p
            className="text-xs font-mono mb-5"
            style={{ color: "var(--text-muted)" }}
          >
            Ranked by total spend this month
          </p>
          <div className="flex flex-col gap-4">
            {[...categoryData]
              .sort((a, b) => b.value - a.value)
              .map((c, i) => {
                const max = categoryData[0].value;
                return (
                  <div key={c.name} className="flex items-center gap-4">
                    <span
                      className="text-xs font-mono w-4 text-right"
                      style={{ color: "var(--text-muted)" }}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-white">{c.name}</span>
                        <span
                          className="text-xs font-mono"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {formatCurrency(c.value, true)}
                        </span>
                      </div>
                      <div className="h-1 bg-slate-muted/30 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(c.value / max) * 100}%`,
                            background: c.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
