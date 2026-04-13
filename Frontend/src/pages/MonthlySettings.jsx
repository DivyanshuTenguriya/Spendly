import { useState, useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

export default function MonthlySettings() {
  const [monthlyData, setMonthlyData] = useState({
    monthlyIncome: 0,
    monthlyExpenseBudget: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMonthlySettings();
  }, []);

  const fetchMonthlySettings = async () => {
    try {
      if (!userId) {
        setMessage("Please log in first");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/userInfo/${userId}`,
        { credentials: "include" },
      );

      const data = await response.json();
      if (data.userInfo) {
        setMonthlyData({
          monthlyIncome: data.userInfo.monthlyIncome || 0,
          monthlyExpenseBudget: data.userInfo.monthlyExpenseBudget || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching monthly settings:", error);
      setMessage("Error loading monthly settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMonthlySettings = async () => {
    try {
      if (!userId) {
        setMessage("User ID not found");
        return;
      }

      const expenseBudget = parseFloat(monthlyData.monthlyExpenseBudget) || 0;
      const income = parseFloat(monthlyData.monthlyIncome) || 0;

      if (expenseBudget > income) {
        setMessage("Expense budget cannot exceed monthly income");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/userInfo/${userId}/monthly-settings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            monthlyIncome: income,
            monthlyExpenseBudget: expenseBudget,
          }),
        },
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Monthly settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.msg || "Error saving settings");
      }
    } catch (error) {
      console.error("Error saving monthly settings:", error);
      setMessage("Error saving settings");
    }
  };

  if (!userId) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--text-muted)" }}>
        Please log in to manage monthly settings
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2
          className="font-display text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Monthly Settings
        </h2>
        <p
          className="text-xs font-mono mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Manage your monthly income and budget
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
          {message}
        </div>
      )}

      {/* Monthly Income & Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Monthly Income
              </p>
              <h3
                className="font-display text-base font-semibold mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Expected income
              </h3>
            </div>
          </div>
          <input
            type="number"
            value={monthlyData.monthlyIncome}
            onChange={(e) =>
              setMonthlyData({ ...monthlyData, monthlyIncome: e.target.value })
            }
            placeholder="0.00"
            step="0.01"
            className="w-full rounded-xl px-4 py-3 text-lg font-medium focus:outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-orange-400" />
            </div>
            <div>
              <p
                className="text-xs font-mono uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Monthly Expense Budget
              </p>
              <h3
                className="font-display text-base font-semibold mt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Budget for expenses
              </h3>
            </div>
          </div>
          <input
            type="number"
            value={monthlyData.monthlyExpenseBudget}
            onChange={(e) =>
              setMonthlyData({
                ...monthlyData,
                monthlyExpenseBudget: e.target.value,
              })
            }
            placeholder="0.00"
            step="0.01"
            className="w-full rounded-xl px-4 py-3 text-lg font-medium focus:outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-color)",
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSaveMonthlySettings}
        className="w-full px-6 py-3 rounded-xl font-medium transition-all"
        style={{
          backgroundColor: "var(--accent-primary)",
          color: "var(--text-on-accent)",
          borderColor: "var(--accent-primary)",
        }}
      >
        Save Monthly Settings
      </button>
    </div>
  );
}
