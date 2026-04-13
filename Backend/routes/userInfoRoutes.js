import express from "express";
import { 
  createUserInfo, 
  updateUserInfo, 
  getUserInfo,
  setMonthlySettings,
  addBudget,
  updateBudget,
  deleteBudget,
  getMonthlySettings,
} from "../controller/userInfoController.js";

const router = express.Router();

// Specific routes MUST come FIRST before the generic :userId parameter routes
router.post("/create", createUserInfo);

// Monthly settings endpoints (specific sub-paths)
router.post("/:userId/monthly-settings", (req, res, next) => {
  console.log('Monthly settings route called:', req.path);
  next();
}, setMonthlySettings);

router.get("/:userId/monthly-settings/:month/:year", (req, res, next) => {
  console.log('Get monthly settings route called:', req.path);
  next();
}, getMonthlySettings);

router.post("/:userId/budgets", (req, res, next) => {
  console.log('Add budget route called:', req.path);
  next();
}, addBudget);

router.put("/:userId/budgets/:budgetId", updateBudget);
router.delete("/:userId/budgets/:budgetId", deleteBudget);

// Generic routes (must come LAST with :userId param)
router.put("/:userId", updateUserInfo);
router.get("/:userId", getUserInfo);

export default router;
