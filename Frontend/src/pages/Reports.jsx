import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatCurrency, getStoredUserId } from "../utils/helpers";
import { getExpenses } from "../utils/api";

export default function Reports() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
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

      // Process category data for current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

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
          color: "#d0b880", // Default color
        }),
      );
      setCategoryData(categoryArray);

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
    } catch (error) {
      console.error("Error fetching reports data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--text-muted)" }}>Loading reports...</p>
      </div>
    );
  }

  const total = categoryData.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="p-8 max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between fade-up">
        <div>
          <h2
            className="font-display text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Reports
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Visualised summaries of your finances
          </p>
        </div>
      </div>

      {categoryData.length === 0 ? (
        <div className="card p-6 fade-up">
          <p
            className="text-center py-12"
            style={{ color: "var(--text-muted)" }}
          >
            No data available. Add some transactions to see reports.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Category full pie */}
          <div className="card p-6 fade-up" style={{ animationDelay: "100ms" }}>
            <h3
              className="font-display text-lg font-semibold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Category Breakdown
            </h3>
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="w-full max-w-[180px] mx-auto lg:mx-0">
                <PieChart width={180} height={180}>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatCurrency(v)}
                    contentStyle={{
                      background: "#2d3548",
                      border: "1px solid rgba(61,74,99,0.5)",
                      borderRadius: 12,
                      fontFamily: "DM Sans",
                    }}
                  />
                </PieChart>
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {categoryData.map((c) => (
                  <div key={c.name} className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: c.color }}
                    />
                    <span
                      className="text-xs flex-1 truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {c.name}
                    </span>
                    <span
                      className="text-xs font-mono flex-shrink-0"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatCurrency(c.value, true)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly savings bar */}
          <div className="card p-6 fade-up" style={{ animationDelay: "200ms" }}>
            <h3
              className="font-display text-lg font-semibold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Monthly Net Savings
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={monthlyData.map((m) => ({
                  month: m.month,
                  savings: m.income - m.expenses,
                }))}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(61,74,99,0.3)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontFamily: "DM Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontFamily: "DM Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v) => formatCurrency(v)}
                  contentStyle={{
                    background: "#2d3548",
                    border: "1px solid rgba(61,74,99,0.5)",
                    borderRadius: 12,
                    fontFamily: "DM Sans",
                  }}
                />
                <Bar
                  dataKey="savings"
                  name="Savings"
                  fill="#6dc7a4"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
