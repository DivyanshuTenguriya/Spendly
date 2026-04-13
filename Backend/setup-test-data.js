import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Auth } from "./models/authModel.js";
import { UserInfo } from "./models/userInfoModel.js";
import { Expense } from "./models/expenseModel.js";

const DB_URL = "mongodb://127.0.0.1:27017/spendly";

async function setupTestData() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(DB_URL);
    console.log("✓ Connected to database");

    // Step 1: Clear existing data
    console.log("\nClearing existing test data...");
    await Auth.deleteMany({ email: { $regex: "test" } });
    await UserInfo.deleteMany({ fullName: { $regex: "Test" } });
    await Expense.deleteMany({ tag: "Imported" });
    console.log("✓ Cleared test data");

    // Step 2: Create test user
    console.log("\nCreating test user...");
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Auth.create({
      email,
      password: hashedPassword,
    });
    console.log(`✓ Created user with ID: ${user._id}`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);

    // Step 3: Create user info
    console.log("\nCreating user profile...");
    const userInfo = await UserInfo.create({
      userId: user._id,
      fullName: "Test User",
      phone: "+91-9876543210",
      currency: "INR – Indian Rupee",
      monthlyIncome: 50000,
      monthlyExpenseBudget: 25000,
      budgets: [],
    });
    console.log(`✓ Created user info with ID: ${userInfo._id}`);
    console.log(`  Name: Test User`);
    console.log(`  Monthly Income: ₹50,000`);
    console.log(`  Monthly Budget: ₹25,000`);

    // Link userInfo to Auth
    await Auth.findByIdAndUpdate(user._id, { userInfo: userInfo._id });
    console.log(`✓ Linked user info to auth`);

    // Step 4: Load sample expenses
    console.log("\nLoading sample expenses...");
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const sampleExpenses = [
      {
        userId: user._id,
        description: "Groceries",
        amount: 500,
        category: "Food",
        type: "expense",
        date: new Date(year, month, 13),
        tag: "Imported",
        paymentMethod: "card",
        notes: "Weekly groceries",
      },
      {
        userId: user._id,
        description: "Salary",
        amount: 50000,
        category: "Other",
        type: "income",
        date: new Date(year, month, 10),
        tag: "Imported",
        paymentMethod: "online",
        notes: "Monthly salary",
      },
      {
        userId: user._id,
        description: "Petrol",
        amount: 1500,
        category: "Transport",
        type: "expense",
        date: new Date(year, month, 12),
        tag: "Imported",
        paymentMethod: "card",
        notes: "Fuel refill",
      },
      {
        userId: user._id,
        description: "Restaurant",
        amount: 800,
        category: "Food",
        type: "expense",
        date: new Date(year, month, 11),
        tag: "Imported",
        paymentMethod: "cash",
        notes: "Dinner with friends",
      },
      {
        userId: user._id,
        description: "Freelance work",
        amount: 5000,
        category: "Other",
        type: "income",
        date: new Date(year, month, 9),
        tag: "Imported",
        paymentMethod: "online",
        notes: "Project payment",
      },
      {
        userId: user._id,
        description: "Electricity bill",
        amount: 1200,
        category: "Utilities",
        type: "expense",
        date: new Date(year, month, 5),
        tag: "Imported",
        paymentMethod: "online",
        notes: "Monthly utility",
      },
      {
        userId: user._id,
        description: "Gym membership",
        amount: 500,
        category: "Healthcare",
        type: "expense",
        date: new Date(year, month, 1),
        tag: "Imported",
        paymentMethod: "card",
        notes: "Monthly gym fee",
      },
      {
        userId: user._id,
        description: "Shopping",
        amount: 2000,
        category: "Shopping",
        type: "expense",
        date: new Date(year, month, 8),
        tag: "Imported",
        paymentMethod: "card",
        notes: "Clothes shopping",
      },
    ];

    const inserted = await Expense.insertMany(sampleExpenses);
    console.log(`✓ Inserted ${inserted.length} sample expenses`);

    // Step 5: Verify data
    console.log("\nVerifying data...");
    const authCount = await Auth.countDocuments();
    const userInfoCount = await UserInfo.countDocuments();
    const expenseCount = await Expense.countDocuments();

    console.log(`  Total users: ${authCount}`);
    console.log(`  Total user profiles: ${userInfoCount}`);
    console.log(`  Total expenses: ${expenseCount}`);

    // Get aggregated data
    const summary = await Expense.aggregate([
      { $group: { _id: "$type", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    console.log("\n✓ Summary:");
    summary.forEach(s => {
      if (s._id === "income") {
        console.log(`  Total Income: ₹${s.total.toLocaleString()}`);
      } else {
        console.log(`  Total Expenses: ₹${s.total.toLocaleString()}`);
      }
    });

    console.log("\n✅ Test data setup complete!");
    console.log("\n📝 Login Details:");
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log("\n🚀 Now open the app and login to verify all data is displaying correctly!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error during setup:", error.message);
    process.exit(1);
  }
}

setupTestData();
