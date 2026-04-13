import { UserInfo } from "../models/userInfoModel.js";
import { Auth } from "../models/authModel.js";
import mongoose from "mongoose";

export const createUserInfo = async (req, res) => {
  const { userId, fullName, phone, currency, monthlyExpenseBudget } = req.body;

  try {
    // Check if user info already exists
    const existingInfo = await UserInfo.findOne({ userId });

    if (existingInfo) {
      return res.status(400).json({ msg: "User info already exists" });
    }

    // Create user info
    const userInfo = await UserInfo.create({
      userId,
      fullName,
      phone: phone || "",
      currency: currency || "INR – Indian Rupee",
      monthlyIncome: 0,
      monthlyExpenseBudget: monthlyExpenseBudget || 0,
      budgets: [],
    });

    // Link userInfo to Auth
    await Auth.findByIdAndUpdate(userId, { userInfo: userInfo._id });

    res.json({ msg: "User info created successfully", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const { fullName, phone, currency, monthlyIncome, monthlyExpenseBudget } =
    req.body;

  try {
    // Convert string userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    // First check if user exists
    let userInfo = await UserInfo.findOne({ userId: objectId });

    if (!userInfo) {
      // If doesn't exist, create it
      userInfo = await UserInfo.create({
        userId: objectId,
        fullName: fullName || "User",
        phone: phone || "",
        currency: currency || "INR – Indian Rupee",
        monthlyIncome: monthlyIncome !== undefined ? monthlyIncome : 0,
        monthlyExpenseBudget: monthlyExpenseBudget || 0,
        budgets: [],
      });
      return res
        .status(201)
        .json({ msg: "User info created successfully", userInfo });
    }

    // Otherwise update it
    userInfo = await UserInfo.findOneAndUpdate(
      { userId: objectId },
      {
        fullName: fullName || userInfo.fullName,
        phone: phone || "",
        currency: currency || "INR – Indian Rupee",
        monthlyIncome:
          monthlyIncome !== undefined ? monthlyIncome : userInfo.monthlyIncome,
        monthlyExpenseBudget:
          monthlyExpenseBudget !== undefined
            ? monthlyExpenseBudget
            : userInfo.monthlyExpenseBudget,
        updatedAt: Date.now(),
      },
      { new: true },
    );

    res.json({ msg: "User info updated successfully", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    // Convert string userId to ObjectId
    const objectId = new mongoose.Types.ObjectId(userId);

    const userInfo = await UserInfo.findOne({ userId: objectId }).populate(
      "userId",
      "email",
    );

    if (!userInfo) {
      return res.status(404).json({ msg: "User info not found" });
    }

    res.json({ msg: "User info retrieved", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Monthly settings endpoints
export const setMonthlySettings = async (req, res) => {
  const { userId } = req.params;
  const { monthlyIncome, monthlyExpenseBudget } = req.body;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const userInfo = await UserInfo.findOneAndUpdate(
      { userId: objectId },
      {
        monthlyIncome: monthlyIncome || 0,
        monthlyExpenseBudget: monthlyExpenseBudget || 0,
        updatedAt: Date.now(),
      },
      { new: true },
    );

    if (!userInfo) {
      return res.status(404).json({ msg: "User info not found" });
    }

    res.json({ msg: "Monthly settings updated", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const addBudget = async (req, res) => {
  const { userId } = req.params;
  const { category, budget, month, year } = req.body;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const userInfo = await UserInfo.findOne({ userId: objectId });

    if (!userInfo) {
      return res.status(404).json({ msg: "User info not found" });
    }

    // Check if budget exists for this category and month
    const existingBudget = userInfo.budgets.find(
      (b) => b.category === category && b.month === month && b.year === year,
    );

    if (existingBudget) {
      return res
        .status(400)
        .json({ msg: "Budget already exists for this category and month" });
    }

    // Add new budget
    userInfo.budgets.push({
      category,
      budget: budget || 0,
      month,
      year,
      spent: 0,
    });

    await userInfo.save();

    res.json({ msg: "Budget added successfully", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateBudget = async (req, res) => {
  const { userId, budgetId } = req.params;
  const { category, budget, month, year } = req.body;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const budId = new mongoose.Types.ObjectId(budgetId);

    const userInfo = await UserInfo.findOne({ userId: objectId });

    if (!userInfo) {
      return res.status(404).json({ msg: "User info not found" });
    }

    const budgetIndex = userInfo.budgets.findIndex((b) => b._id.equals(budId));

    if (budgetIndex === -1) {
      return res.status(404).json({ msg: "Budget not found" });
    }

    userInfo.budgets[budgetIndex] = {
      ...userInfo.budgets[budgetIndex],
      category: category || userInfo.budgets[budgetIndex].category,
      budget: budget || userInfo.budgets[budgetIndex].budget,
      month: month || userInfo.budgets[budgetIndex].month,
      year: year || userInfo.budgets[budgetIndex].year,
    };

    await userInfo.save();

    res.json({ msg: "Budget updated successfully", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteBudget = async (req, res) => {
  const { userId, budgetId } = req.params;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const budId = new mongoose.Types.ObjectId(budgetId);

    const userInfo = await UserInfo.findOne({ userId: objectId });

    if (!userInfo) {
      return res.status(404).json({ msg: "User info not found" });
    }

    userInfo.budgets = userInfo.budgets.filter((b) => !b._id.equals(budId));

    await userInfo.save();

    res.json({ msg: "Budget deleted successfully", userInfo });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getMonthlySettings = async (req, res) => {
  const { userId, month, year } = req.params;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);

    const userInfo = await UserInfo.findOne({ userId: objectId });

    if (!userInfo) {
      return res.status(404).json({ msg: "User info not found" });
    }

    const monthBudgets = userInfo.budgets.filter(
      (b) => b.month === parseInt(month) && b.year === parseInt(year),
    );

    res.json({
      msg: "Monthly settings retrieved",
      monthlyBalance: userInfo.monthlyBalance,
      monthlyIncome: userInfo.monthlyIncome,
      monthlyExpenseBudget: userInfo.monthlyExpenseBudget || 0,
      budgets: monthBudgets,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
