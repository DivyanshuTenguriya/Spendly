import { Wallet, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { useState, useEffect } from "react";
import StatsCard from "../components/StatsCard";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import CategoryChart from "../components/CategoryChart";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import BudgetProgress from "../components/BudgetProgress";
import RecentTransactions from "../components/RecentTransactions";
import API, { getExpenseSummary, getExpenses, getUserInfo } from "../utils/api";
import { getStoredUserId, normalizeExpensesResponse } from "../utils/helpers";

export default function Dashboard({
  userInfo = { fullName: "User" },
  onNavigate,
  theme = "dark",
}) {
  const [stats, setStats] = useState([
    {
      title: "Total Balance",
      value: 0,
      sub: "Across all accounts",
      trend: "up",
      trendValue: "₹0",
      icon: Wallet,
      accent: "#d0b880",
    },
    {
      title: "Monthly Income",
      value: 0,
      sub: "This month",
      trend: "up",
      trendValue: "₹0",
      icon: TrendingUp,
      accent: "#6dc7a4",
    },
    {
      title: "Monthly Expenses",
      value: 0,
      sub: "This month",
      trend: "down",
      trendValue: "₹0",
      icon: TrendingDown,
      accent: "#f09070",
    },
    {
      title: "Savings Rate",
      value: "0%",
      sub: "Of monthly income",
      trend: "neutral",
      trendValue: "₹0",
      icon: Percent,
      accent: "#6e9ed4",
    },
  ]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState([]);
  const [settings, setSettings] = useState({
    monthlyIncome: 0,
    monthlyExpenseBudget: 0,
  });
  const [recentTx, setRecentTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = getStoredUserId();

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  // Listen for import event from Transactions page
  useEffect(() => {
    const handleTransactionsUpdate = async () => {
      console.log(
        `[Dashboard] Received transactionsUpdated event, waiting 800ms...`,
      );
      // Add a small delay to ensure data is persisted in DB
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log(
        `[Dashboard] 800ms wait complete, refreshing dashboard data...`,
      );
      await fetchDashboardData();
      console.log(`[Dashboard] Dashboard data refreshed`);
    };

    window.addEventListener("transactionsUpdated", handleTransactionsUpdate);
    return () =>
      window.removeEventListener(
        "transactionsUpdated",
        handleTransactionsUpdate,
      );
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const currentDate = new Date();
      // Fetch data from the last 3 months instead of just current month
      const threeMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 2,
        1,
        0,
        0,
        0,
        0,
      );
      const startOfLastThreeMonths = threeMonthsAgo.toISOString();
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      ).toISOString();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      console.log(`[Dashboard] Fetching data for last 3 months`);
      console.log(
        `[Dashboard] Date range: ${startOfLastThreeMonths} to ${endOfMonth}`,
      );

      const [summaryRes, transactionsRes, userInfoRes, monthlySettingsRes] =
        await Promise.all([
          getExpenseSummary(userId, {
            startDate: startOfLastThreeMonths,
            endDate: endOfMonth,
          }),
          getExpenses(userId, {
            startDate: startOfLastThreeMonths,
            endDate: endOfMonth,
            limit: 500,
          }),
          getUserInfo(userId),
          API.get(`/userInfo/${userId}/monthly-settings/${month}/${year}`, {
            withCredentials: true,
          }),
        ]);

      console.log(`[Dashboard] Summary response:`, summaryRes.data);
      console.log(`[Dashboard] Transactions response:`, transactionsRes.data);
      console.log("Expenses API response:", transactionsRes.data);
      console.log(`[Dashboard] UserInfo response:`, userInfoRes.data);

      const summary = summaryRes.data.summary || [];
      let byCategory = summaryRes.data.byCategory || [];
      const userInfo = userInfoRes.data.userInfo || {};
      const monthlySettings = monthlySettingsRes.data;

      console.log(`[Dashboard] Monthly settings:`, monthlySettings);

      const monthlyIncome = userInfo.monthlyIncome || 0;
      const monthlyExpenseBudget = monthlySettings.monthlyExpenseBudget || 0;

      let totalIncome = 0;
      let totalExpenses = 0;

      summary.forEach((item) => {
        if (item._id === "income") totalIncome = item.total;
        if (item._id === "expense") totalExpenses = item.total;
      });

      const expenses = normalizeExpensesResponse(transactionsRes.data);

      console.log(
        `[Dashboard] Total: Income=${totalIncome}, Expenses=${totalExpenses}, Transactions count=${expenses.length}`,
      );

      // Fallback when summary aggregation returns empty or incorrect data
      if (summary.length === 0 && expenses.length > 0) {
        console.log(
          `[Dashboard] Summary empty, calculating from transactions...`,
        );
        expenses.forEach((tx) => {
          if (tx.type === "income") totalIncome += tx.amount || 0;
          if (tx.type === "expense") totalExpenses += tx.amount || 0;
        });

        const categoryMap = {};
        expenses.forEach((tx) => {
          const category = tx.category || "Other";
          categoryMap[category] =
            (categoryMap[category] || 0) + (tx.amount || 0);
        });
        byCategory = Object.entries(categoryMap).map(([name, value]) => ({
          name,
          value,
        }));
        console.log(
          `[Dashboard] Calculated totals: Income=${totalIncome}, Expenses=${totalExpenses}`,
        );
      }

      const referenceIncome = monthlyIncome > 0 ? monthlyIncome : totalIncome;
      const actualSavings = referenceIncome - totalExpenses;
      const savingsRate =
        referenceIncome > 0
          ? Math.round((actualSavings / referenceIncome) * 100)
          : 0;
      const remainingBudgetAmount = monthlyExpenseBudget - totalExpenses;

      setStats([
        {
          title: "Monthly Income",
          value: monthlyIncome,
          sub: "Income target",
          trend: monthlyIncome >= 0 ? "up" : "down",
          trendValue: `₹${monthlyIncome.toLocaleString()}`,
          icon: TrendingUp,
          accent: "#6dc7a4",
        },
        {
          title: "Monthly Expenses",
          value: totalExpenses,
          sub: "Actual spending",
          trend: totalExpenses >= 0 ? "down" : "up",
          trendValue: `₹${totalExpenses.toLocaleString()}`,
          icon: TrendingDown,
          accent: "#f09070",
        },
        {
          title: "Expense Budget",
          value: monthlyExpenseBudget,
          sub:
            remainingBudgetAmount >= 0
              ? `₹${remainingBudgetAmount.toLocaleString()} left`
              : `₹${Math.abs(remainingBudgetAmount).toLocaleString()} over budget`,
          trend: remainingBudgetAmount >= 0 ? "up" : "down",
          trendValue: `₹${monthlyExpenseBudget.toLocaleString()}`,
          icon: Wallet,
          accent: "#d0b880",
        },
        {
          title: "Savings Rate",
          value: `${savingsRate}%`,
          sub: "Of monthly income",
          trend: savingsRate >= 0 ? "up" : "down",
          trendValue: `₹${Math.abs(actualSavings).toLocaleString()}`,
          icon: Percent,
          accent: "#6e9ed4",
        },
      ]);

      setCategoryData(
        byCategory.map((cat) => ({
          name: cat._id || cat.name,
          value: cat.total || cat.value,
        })),
      );
      setRecentTx(expenses);

      // Calculate spent by category for budget progress
      const spentByCategory = {};
      expenses.forEach((tx) => {
        if (tx.type === "expense") {
          const category = tx.category.toLowerCase();
          spentByCategory[category] =
            (spentByCategory[category] || 0) + (tx.amount || 0);
        }
      });

      const budgetsWithSpent = (monthlySettings.budgets || []).map(
        (budget) => ({
          ...budget,
          spent: spentByCategory[budget.category.toLowerCase()] || 0,
        }),
      );

      setMonthlyBudgets(budgetsWithSpent);
      setSettings({ monthlyIncome, monthlyExpenseBudget });

      // Calculate weekly data (last 7 days)
      const today = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weeklyMap = {};

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = days[date.getDay()];
        weeklyMap[dayName] = 0;
      }

      expenses.forEach((tx) => {
        const txDate = new Date(tx.date);
        const dayDiff = Math.floor((today - txDate) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff < 7 && tx.type === "expense") {
          const dayName = days[txDate.getDay()];
          weeklyMap[dayName] = (weeklyMap[dayName] || 0) + tx.amount;
        }
      });

      const weeklyArray = Object.entries(weeklyMap).map(([day, amount]) => ({
        day,
        amount,
      }));

      setWeeklyData(weeklyArray);

      const monthlyMap = {};
      expenses.forEach((tx) => {
        const date = new Date(tx.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}`;
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
      console.error("[Dashboard] Error fetching dashboard data:", error);
      console.error(
        "[Dashboard] Error details:",
        error.response?.data || error.message,
      );
      // Show partial data even if there's an error
      setStats((prev) => prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6 max-w-screen-2xl mx-auto">
      {/* Hero greeting */}
      <div className="fade-up">
        <h2
          className="font-display italic text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Good morning, {userInfo.name || userInfo.fullName} 👋
        </h2>
        <p
          className="text-xs font-mono mt-1"
          style={{ color: "var(--text-muted)" }}
        >
          Here's what's happening with your money today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={s.title} {...s} delay={i * 80} />
        ))}
      </div>

      {/* Row 2: Income/Expense chart + Category donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2">
          <IncomeExpenseChart data={monthlyData} />
        </div>
        <CategoryChart data={categoryData} />
      </div>

      {/* Row 3: Weekly + Budget + Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <WeeklyTrendChart data={weeklyData} theme={theme} />
        </div>
        <div>
          <BudgetProgress data={monthlyBudgets} onNavigate={onNavigate} />
        </div>
        <div>
          <RecentTransactions data={recentTx} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
