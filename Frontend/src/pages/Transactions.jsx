import { useState, useEffect } from "react";
import { Plus, X, Download, Edit2 } from "lucide-react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpenses,
} from "../utils/api";
import { formatCurrency, formatDate, getStoredUserId } from "../utils/helpers";
import { categories } from "../data/mockData";
import { getCategoryMeta } from "../utils/helpers";

const CATEGORIES = categories.map((c) => c.label);
const PAYMENT_METHODS = ["cash", "card", "online", "cheque", "other"];

function TransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction = null,
  userId,
}) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    tag: "General",
    notes: "",
    paymentMethod: "cash",
    isRecurring: false,
    recurringFrequency: "none",
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        date: new Date(transaction.date).toISOString().split("T")[0],
        tag: transaction.tag,
        notes: transaction.notes,
        paymentMethod: transaction.paymentMethod,
        isRecurring: transaction.isRecurring,
        recurringFrequency: transaction.recurringFrequency,
      });
    }
  }, [transaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.category) {
      alert("Please fill required fields");
      return;
    }

    try {
      if (transaction) {
        await updateExpense(transaction._id, form);
      } else {
        await createExpense(userId, form);
      }
      onSave();
      onClose();
    } catch (error) {
      alert("Error saving transaction: " + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-slate-950 border border-slate-muted/40 rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`.bg-slate-950::-webkit-scrollbar { display: none; }`}</style>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold text-white">
            {transaction ? "Edit Transaction" : "Add Transaction"}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-300/50 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="What did you spend on?"
              className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Amount *
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || "" })
                }
                placeholder="0.00"
                step="0.01"
                className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Tag
              </label>
              <input
                type="text"
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Tag"
                className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Payment Method
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm({ ...form, paymentMethod: e.target.value })
                }
                className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes (optional)"
              rows="3"
              className="w-full rounded-xl px-4 py-2.5 focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isRecurring}
                onChange={(e) =>
                  setForm({ ...form, isRecurring: e.target.checked })
                }
                className="w-4 h-4 rounded"
              />
              <span
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Recurring
              </span>
            </label>
            {form.isRecurring && (
              <select
                value={form.recurringFrequency}
                onChange={(e) =>
                  setForm({ ...form, recurringFrequency: e.target.value })
                }
                className="flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            )}
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
              className="flex-1 px-4 py-2 rounded-xl transition-all font-medium"
              style={{
                backgroundColor: "var(--accent-primary)",
                color: "var(--text-on-accent)",
                borderColor: "var(--accent-primary)",
              }}
            >
              {transaction ? "Update" : "Add"} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    type: "",
  });
  const [message, setMessage] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const userId = getStoredUserId();

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      if (!userId) {
        setMessage("Please log in first");
        return;
      }
      setLoading(true);
      console.log(`[Transactions] Fetching transactions for user ${userId}...`);
      console.log(`[Transactions] Filters:`, filters);
      const response = await getExpenses(userId, filters);
      console.log(
        `[Transactions] Received ${response.data.expenses?.length || 0} transactions`,
      );
      console.log(`[Transactions] Response:`, response.data);
      setTransactions(response.data.expenses || []);
    } catch (error) {
      setMessage("Error loading transactions");
      console.error("[Transactions] Error:", error);
      console.error(
        "[Transactions] Error details:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedTransaction(null);
    setModalOpen(true);
  };

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleExport = async () => {
    try {
      const response = await exportExpenses(userId, filters);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `expenses-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentElement.removeChild(link);
      setMessage("Exported successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error exporting data");
    }
  };

  const handleDeleteClick = (transaction) => {
    setDeleteTarget(transaction);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteExpense(deleteTarget._id);
      setMessage("Transaction deleted successfully");
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      fetchTransactions();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error deleting transaction");
      console.error("Delete error:", error);
    }
  };

  if (!userId) {
    return (
      <div className="p-8 text-center text-slate-400">
        Please log in to view transactions
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            className="font-display text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Transactions
          </h2>
          <p
            className="text-xs font-mono mt-0.5"
            style={{ color: "var(--text-muted)" }}
          >
            Manage and track all your expenses
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-2 rounded-lg bg-ink-500/20 border border-ink-500/30 text-ink-300 hover:bg-ink-500/30 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={handleAddClick}
            className="px-3 py-2 rounded-lg bg-ink-500/20 border border-ink-500/30 text-ink-300 hover:bg-ink-500/30 transition-all flex items-center gap-2 text-sm font-medium"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-300 text-sm">
          {message}
        </div>
      )}

      <div className="card p-4 mb-6 rounded-2xl border">
        <div
          className="flex items-center gap-2 overflow-x-auto pb-2 rounded-xl"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.pb-2 .overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
          <button
            onClick={() => setFilters({ category: "", type: "" })}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${!filters.category && !filters.type ? "dark:bg-ink-500/20 dark:text-ink-300 dark:border-ink-500/30 bg-ink-300/30 text-ink-700 border-ink-400/50" : "dark:bg-slate-muted/20 dark:text-slate-300 dark:hover:bg-slate-muted/30 bg-slate-300/20 text-slate-700 hover:bg-slate-300/30 dark:border-slate-muted/20 border-slate-600/30"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => {
            const meta = getCategoryMeta(categories, cat);
            return (
              <button
                key={cat}
                onClick={() =>
                  setFilters({
                    ...filters,
                    category: filters.category === cat ? "" : cat,
                  })
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${filters.category === cat ? "dark:bg-ink-500/20 dark:text-ink-300 dark:border-ink-500/30 bg-ink-300/30 text-ink-700 border-ink-400/50" : "dark:bg-slate-muted/20 dark:text-slate-300 dark:hover:bg-slate-muted/30 bg-slate-300/20 text-slate-700 hover:bg-slate-300/30 dark:border-slate-muted/20 border-slate-600/30"}`}
              >
                {meta.icon}
                {cat}
              </button>
            );
          })}
          <button
            onClick={() =>
              setFilters({
                ...filters,
                type: filters.type === "expense" ? "" : "expense",
              })
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${filters.type === "expense" ? "dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30 bg-red-300/30 text-red-700 border-red-400/50" : "dark:bg-slate-muted/20 dark:text-slate-300 dark:hover:bg-slate-muted/30 bg-slate-300/20 text-slate-700 hover:bg-slate-300/30 dark:border-slate-muted/20 border-slate-600/30"}`}
          >
            Expense
          </button>
          <button
            onClick={() =>
              setFilters({
                ...filters,
                type: filters.type === "income" ? "" : "income",
              })
            }
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${filters.type === "income" ? "dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30 bg-green-300/30 text-green-700 border-green-400/50" : "dark:bg-slate-muted/20 dark:text-slate-300 dark:hover:bg-slate-muted/30 bg-slate-300/20 text-slate-700 hover:bg-slate-300/30 dark:border-slate-muted/20 border-slate-600/30"}`}
          >
            Income
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-slate-400">
          No transactions yet. Add your first transaction!
        </div>
      ) : (
        <div className="card p-4 overflow-hidden">
          <div
            className="overflow-x-auto rounded-xl"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.card .overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-muted/20 bg-slate-900/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Tag
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold dark:text-slate-300 text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-slate-muted/10 hover:bg-slate-900/30 transition-colors"
                  >
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {formatDate(tx.date)}
                    </td>
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {tx.description}
                    </td>
                    <td
                      className="px-6 py-4 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tx.category}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${tx.type === "income" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium text-right ${tx.type === "income" ? "text-green-400" : "text-red-400"}`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm dark:text-slate-400 text-slate-500">
                      {tx.tag}
                    </td>
                    <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(tx)}
                        className="text-slate-400 hover:text-ink-300 transition-colors p-1.5 rounded-lg hover:bg-ink-500/10"
                        title="Edit transaction"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tx)}
                        className="text-red-400 hover:text-red-200 transition-colors p-1.5 rounded-lg hover:bg-red-500/10"
                        title="Delete transaction"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTransaction(null);
        }}
        onSave={fetchTransactions}
        transaction={selectedTransaction}
        userId={userId}
      />

      {deleteConfirmOpen && deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-950 border border-slate-muted/40 rounded-3xl p-6 w-full max-w-lg text-center">
            <h3 className="font-display text-xl font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              Are you sure you want to delete the transaction "
              {deleteTarget.description}"? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTarget(null);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-muted/40 text-slate-300 hover:bg-slate-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-400 transition-all"
              >
                Delete Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
