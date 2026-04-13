import { Expense } from "../models/expenseModel.js";
import mongoose from "mongoose";


export const createExpense = async (req, res) => {
  const { userId, description, amount, category, type, date, tag, notes, paymentMethod, isRecurring, recurringFrequency } = req.body;

  try {
    if (!userId || !description || !amount || !category) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const expense = await Expense.create({
      userId: new mongoose.Types.ObjectId(userId),
      description,
      amount,
      category,
      type: type || 'expense',
      date: date ? new Date(date) : new Date(),
      tag: tag || 'General',
      notes: notes || '',
      paymentMethod: paymentMethod || 'cash',
      isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || 'none',
    });

    res.status(201).json({ msg: "Expense created successfully", expense });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getExpenses = async (req, res) => {
  const { userId } = req.params;
  const { category, type, startDate, endDate, limit = 50, skip = 0 } = req.query;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    let query = { userId: objectId };

    if (category) query.category = category;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    console.log(`[GET /expenses/${userId}] Query:`, JSON.stringify(query, null, 2), `Filters: category=${category}, type=${type}, startDate=${startDate}, endDate=${endDate}`);

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Expense.countDocuments(query);

    console.log(`[GET /expenses/${userId}] Found ${expenses.length} expenses (total: ${total})`);

    res.json({ msg: "Expenses retrieved", expenses, total });
  } catch (error) {
    console.error(`[GET /expenses/${userId}] Error:`, error);
    res.status(500).json({ msg: error.message });
  }
};

// Get single expense
export const getExpenseById = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.json({ msg: "Expense retrieved", expense });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { description, amount, category, type, date, tag, notes, paymentMethod, isRecurring, recurringFrequency } = req.body;

  try {
    const updateData = {};
    if (description) updateData.description = description;
    if (amount !== undefined) updateData.amount = amount;
    if (category) updateData.category = category;
    if (type) updateData.type = type;
    if (date) updateData.date = new Date(date);
    if (tag) updateData.tag = tag;
    if (notes !== undefined) updateData.notes = notes;
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
    if (recurringFrequency) updateData.recurringFrequency = recurringFrequency;
    updateData.updatedAt = Date.now();

    const expense = await Expense.findByIdAndUpdate(expenseId, updateData, { new: true });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    res.json({ msg: "Expense updated successfully", expense });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findByIdAndDelete(expenseId);
    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }
    res.json({ msg: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Get expense summary (for dashboard)
export const getExpenseSummary = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const query = { userId: objectId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    console.log(`[GET /expenses/${userId}/summary] Query:`, JSON.stringify(query, null, 2), `Dates: ${startDate} to ${endDate}`);

    // Get total income and expenses
    const summary = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`[GET /expenses/${userId}/summary] Summary result:`, JSON.stringify(summary, null, 2));

    // Get by category
    const byCategory = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log(`[GET /expenses/${userId}/summary] By category:`, JSON.stringify(byCategory, null, 2));

    res.json({ msg: "Summary retrieved", summary, byCategory });
  } catch (error) {
    console.error(`[GET /expenses/${userId}/summary] Error:`, error);
    res.status(500).json({ msg: error.message });
  }
};

// Bulk import expenses
export const importExpenses = async (req, res) => {
  const { userId } = req.params;
  const { expenses } = req.body;

  try {
    console.log(`[POST /expenses/${userId}/import] Starting import...`);
    console.log(`[POST /expenses/${userId}/import] Received ${expenses?.length || 0} expenses to import`);

    if (!Array.isArray(expenses) || expenses.length === 0) {
      console.log(`[POST /expenses/${userId}/import] Invalid expenses array`);
      return res.status(400).json({ msg: "Invalid expenses array" });
    }

    const objectId = new mongoose.Types.ObjectId(userId);
    
    // Validate and prepare expenses
    const preparedExpenses = expenses.map(exp => {
      const prepared = {
        userId: objectId,
        description: exp.description || 'Imported',
        amount: parseFloat(exp.amount),
        category: exp.category || 'Other',
        type: exp.type || 'expense',
        date: exp.date ? new Date(exp.date) : new Date(),
        tag: exp.tag || 'Imported',
        notes: exp.notes || '',
        paymentMethod: exp.paymentMethod || 'cash',
        isRecurring: exp.isRecurring || false,
        recurringFrequency: exp.recurringFrequency || 'none',
      };
      console.log(`[POST /expenses/${userId}/import] Preparing expense:`, JSON.stringify(prepared, null, 2));
      return prepared;
    });

    console.log(`[POST /expenses/${userId}/import] Inserting ${preparedExpenses.length} prepared expenses...`);
    const imported = await Expense.insertMany(preparedExpenses);
    
    console.log(`[POST /expenses/${userId}/import] Successfully imported ${imported.length} expenses`);
    console.log(`[POST /expenses/${userId}/import] Inserted IDs:`, imported.map(e => e._id));

    // Verify inserted data
    const count = await Expense.countDocuments({ userId: objectId });
    console.log(`[POST /expenses/${userId}/import] Total expenses for user now: ${count}`);

    res.status(201).json({ msg: `Successfully imported ${imported.length} expenses`, count: imported.length, insertedIds: imported.map(e => e._id) });
  } catch (error) {
    console.error(`[POST /expenses/${userId}/import] Error:`, error);
    res.status(500).json({ msg: error.message });
  }
};

// Export expenses as JSON
export const exportExpenses = async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const query = { userId: objectId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    // Format for CSV export
    const csvData = [
      ['Date', 'Description', 'Category', 'Type', 'Amount', 'Tag', 'Payment Method', 'Notes'].join(','),
      ...expenses.map(e => [
        e.date.toISOString().split('T')[0],
        `"${e.description}"`,
        e.category,
        e.type,
        e.amount,
        e.tag,
        e.paymentMethod,
        `"${e.notes}"`
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=expenses-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvData);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
