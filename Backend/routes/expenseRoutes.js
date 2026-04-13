import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  importExpenses,
  exportExpenses,
} from "../controller/expenseController.js";

const router = express.Router();

// Specific routes (must come FIRST before :userId param routes)
router.post("/create", createExpense);
router.get("/expense/:expenseId", getExpenseById);

// Summary and analytics routes
router.get("/:userId/summary", getExpenseSummary);
router.post("/:userId/import", importExpenses);
router.get("/:userId/export", exportExpenses);

// General routes (must come LAST with :userId param)
router.get("/:userId", getExpenses);
router.put("/:expenseId", updateExpense);
router.delete("/:expenseId", deleteExpense);

export default router;
