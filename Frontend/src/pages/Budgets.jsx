import { useState, useEffect } from "react";
import { Plus, X, Edit2 } from "lucide-react";
import { categories } from "../data/mockData";
import {
  getCategoryMeta,
  formatCurrency,
  pct,
  getStoredUserId,
} from "../utils/helpers";
import { getUserInfo, getExpenses } from "../utils/api";

function BudgetCard({ goal }) {
  const meta = getCategoryMeta(categories, goal.category);
  const percent = pct(goal.spent, goal.budget);
  const over = goal.spent > goal.budget;
  const remaining = goal.budget - goal.spent;

  return (
    <div
      className="card p-5 transition-colors fade-up relative"
      style={{ animationDelay: "150ms", borderColor: "var(--border-color)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: `${meta.color}15`,
              border: `1px solid ${meta.color}25`,
            }}
          >
            {meta.icon}
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {meta.label}
            </p>
            <p
              className="text-[10px] font-mono"
              style={{ color: "var(--text-muted)" }}
            >
              Current month
            </p>
          </div>
        </div>
        <div
          className={`chip ${over ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"} border`}
        >
          {over ? "Over budget" : "On track"}
        </div>
      </div>

      {/* Circular-ish progress indicator */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p
            className="font-display text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {formatCurrency(goal.spent, true)}
          </p>
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            of {formatCurrency(goal.budget, true)}
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-display font-bold ${over ? "text-red-400" : "text-emerald-400"}`}
          >
            {percent}%
          </p>
          <p
            className="text-xs font-mono"
            style={{ color: "var(--text-muted)" }}
          >
            used
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className="h-2 rounded-full overflow-hidden mb-3"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(percent, 100)}%`,
            background: over
              ? "linear-gradient(90deg, #f87171, #ef4444)"
              : `linear-gradient(90deg, ${meta.color}99, ${meta.color})`,
          }}
        />
      </div>

      <p
        className="text-xs font-mono"
        style={{ color: over ? "var(--danger)" : "var(--text-muted)" }}
      >
        {over
          ? `₹${formatCurrency(Math.abs(remaining)).replace("₹", "")} over limit`
          : `₹${formatCurrency(remaining).replace("₹", "")} remaining`}
      </p>
    </div>
  );
}

function AddBudgetModal({
  isOpen,
  onClose,
  onAdd,
  existingCategories,
  currentMonth,
  currentYear,
}) {
  const [form, setForm] = useState({ category: "", budget: "" });
  const [error, setError] = useState("");

  const availableCategories = categories.filter(
    (c) => !existingCategories.includes(c.label),
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Please select a category");
      return;
    }

    if (!form.budget || parseFloat(form.budget) <= 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    onAdd({
      category: form.category,
      budget: parseFloat(form.budget),
      month: currentMonth,
      year: currentYear,
    });
    setForm({ category: "", budget: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="rounded-2xl p-6 w-full max-w-md mx-4"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          border: `1px solid var(--border-color)`,
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Add New Budget
          </h3>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <option value="">Select a category</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.label}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Budget Amount (₹)
            </label>
            <input
              type="number"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="Enter budget amount"
              step="0.01"
              min="0"
              className="w-full rounded-xl px-4 py-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                borderColor: "var(--border-color)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--text-on-accent)",
                borderColor: "var(--accent-primary)",
              }}
            >
              Add Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [monthlyExpenseBudget, setMonthlyExpenseBudget] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const userId = getStoredUserId();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (userId) {
      fetchBudgetsAndExpenses();
    }
  }, [userId]);

  const fetchBudgetsAndExpenses = async () => {
    try {
      // Fetch budgets for this month
      const budgetResponse = await API.get(
        `/userInfo/${userId}/monthly-settings/${currentMonth}/${currentYear}`,
        { withCredentials: true },
      );
      const budgetData = budgetResponse.data;
      let allBudgets = budgetData.budgets || [];

      // Fetch current month expenses and user settings
      const [expensesResponse, userInfoResponse] = await Promise.all([
        getExpenses(userId, {
          startDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
            0,
            0,
            0,
            0,
          ).toISOString(),
          endDate: new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          ).toISOString(),
        }),
        getUserInfo(userId),
      ]);

      console.log("API RESPONSE:", expensesResponse.data);
      const expenses = expensesResponse.data.expenses || [];
      const userInfo = userInfoResponse.data.userInfo || {};

      const spentByCategory = {};
      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        const startOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1,
          0,
          0,
          0,
          0,
        );
        const endOfMonth = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        if (
          expenseDate >= startOfMonth &&
          expenseDate <= endOfMonth &&
          expense.type === "expense"
        ) {
          const category = expense.category.toLowerCase();
          spentByCategory[category] =
            (spentByCategory[category] || 0) + (expense.amount || 0);
        }
      });

      allBudgets = allBudgets.map((budget) => ({
        ...budget,
        spent: spentByCategory[budget.category.toLowerCase()] || 0,
      }));

      setBudgets(allBudgets);
      setMonthlyExpenseBudget(userInfo.monthlyExpenseBudget || 0);
    } catch (error) {
      console.error("Error fetching budgets and expenses:", error);
      setMessage("Error loading budgets");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="p-8 text-center">
        <p style={{ color: "var(--text-muted)" }}>
          Please log in to view budget overview
        </p>
      </div>
    );
  }

  const handleAddBudget = async (newBudget) => {
    try {
      const response = await API.post(
        `/userInfo/${userId}/budgets`,
        {
          category: newBudget.category,
          budget: newBudget.budget,
          month: currentMonth,
          year: currentYear,
        },
        { withCredentials: true },
      );

      const data = response.data;
      if (response.status >= 200 && response.status < 300) {
        setMessage("Budget added successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchBudgetsAndExpenses(); // Refresh the list
      } else {
        setMessage(data.msg || "Error adding budget");
      }
    } catch (error) {
      console.error("Error adding budget:", error);
      setMessage("Error adding budget");
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;

    try {
      const response = await API.delete(
        `/userInfo/${userId}/budgets/${budgetId}`,
        { withCredentials: true },
      );

      if (response.status >= 200 && response.status < 300) {
        setMessage("Budget deleted successfully!");
        setTimeout(() => setMessage(""), 3000);
        fetchBudgetsAndExpenses(); // Refresh the list
      } else {
        setMessage("Error deleting budget");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      setMessage("Error deleting budget");
    }
  };

  const totalBudgeted = budgets.reduce(
    (sum, budget) => sum + (budget.budget || 0),
    0,
  );
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + (budget.spent || 0),
    0,
  );
  const totalRemaining = monthlyExpenseBudget - totalSpent;
  const overBudgetCount = budgets.filter(
    (budget) => budget.spent > budget.budget,
  ).length;

  return (
    <div className="p-8 max-w-screen-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between fade-up">
        <div>
          <h2
            className="font-display text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Budget Goals
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Set and track your spending limits for this month
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--accent-primary)",
            color: "var(--text-on-accent)",
            borderColor: "var(--accent-primary)",
          }}
        >
          <Plus size={15} /> New Budget
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm ${message.includes("Error") ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-green-500/10 border-green-500/30 text-green-300"}`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div
          className="text-center py-8"
          style={{ color: "var(--text-muted)" }}
        >
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-12">
          <p className="mb-4" style={{ color: "var(--text-muted)" }}>
            No budgets set for this month
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--text-on-accent)",
              borderColor: "var(--accent-primary)",
            }}
          >
            <Plus size={16} /> Create Your First Budget
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {budgets.map((goal) => (
              <BudgetCard key={goal._id} goal={goal} />
            ))}
          </div>

          {/* Summary */}
          <div className="card p-6 fade-up" style={{ animationDelay: "300ms" }}>
            <h3
              className="font-display text-lg font-semibold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Budget Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                {
                  label: "Monthly Expense Budget",
                  value: monthlyExpenseBudget,
                  color: "#d0b880",
                },
                { label: "Total Spent", value: totalSpent, color: "#f09070" },
                {
                  label: "Remaining Budget",
                  value: totalRemaining,
                  color: "#6dc7a4",
                },
                {
                  label: "Over Budget",
                  value: overBudgetCount > 0 ? "Yes" : "No",
                  color: "#f87171",
                  isBadge: true,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <p
                    className="text-[10px] font-mono uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="font-display text-xl font-bold"
                    style={{ color: s.color }}
                  >
                    {s.isBadge ? s.value : formatCurrency(s.value, true)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddBudget}
        existingCategories={budgets.map((b) => b.category)}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
}
