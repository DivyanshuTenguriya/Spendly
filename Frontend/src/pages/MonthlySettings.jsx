import { useState, useEffect } from "react";
import { DollarSign, TrendingUp } from "lucide-react";
import API from "../utils/api";
import { formatCurrency, getStoredUserId } from "../utils/helpers";

export default function MonthlySettings() {
  const [monthlyData, setMonthlyData] = useState({
    monthlyIncome: 0,
    monthlyExpenseBudget: 0,
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ FIXED USER ID (VERY IMPORTANT)
  const userId = getStoredUserId();

  useEffect(() => {
    fetchMonthlySettings();
  }, []);

  const fetchMonthlySettings = async () => {
    try {
      if (!userId) {
        setMessage("Please log in first");
        return;
      }

      const response = await API.get(`/userInfo/${userId}`, {
        withCredentials: true,
      });

      const data = response.data;

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

      const response = await API.post(
        `/userInfo/${userId}/monthly-settings`,
        {
          monthlyIncome: income,
          monthlyExpenseBudget: expenseBudget,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (response.status >= 200 && response.status < 300) {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest">
                Monthly Income
              </p>
              <h3 className="font-display text-base font-semibold mt-0.5">
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
            className="w-full rounded-xl px-4 py-3 text-lg font-medium"
          />
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-orange-400" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-widest">
                Monthly Expense Budget
              </p>
              <h3 className="font-display text-base font-semibold mt-0.5">
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
            className="w-full rounded-xl px-4 py-3 text-lg font-medium"
          />
        </div>
      </div>

      <button
        onClick={handleSaveMonthlySettings}
        className="w-full px-6 py-3 rounded-xl font-medium"
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
