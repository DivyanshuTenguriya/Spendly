import mongoose from "mongoose";

const userInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  currency: {
    type: String,
    default: 'INR – Indian Rupee',
  },
  monthlyIncome: {
    type: Number,
    default: 0,
  },
  monthlyExpenseBudget: {
    type: Number,
    default: 0,
  },
  budgets: [
    {
      category: String,
      budget: Number,
      month: Number, // 0-11
      year: Number,
      spent: { type: Number, default: 0 },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserInfo = mongoose.model("UserInfo", userInfoSchema);
