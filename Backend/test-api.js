import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "password123";

async function runTests() {
  console.log("🚀 Starting API Tests...\n");

  try {
    // Test 1: Login
    console.log("Test 1: Login");
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const userId = loginRes.data.user._id;
    console.log(`✓ Logged in with userId: ${userId}\n`);

    // Test 2: Get User Info
    console.log("Test 2: Get User Info");
    const userInfoRes = await axios.get(`${API_BASE}/userInfo/${userId}`);
    console.log(`✓ User: ${userInfoRes.data.userInfo.fullName}`);
    console.log(`  Income: ₹${userInfoRes.data.userInfo.monthlyIncome}\n`);

    // Test 3: Get Expenses (All)
    console.log("Test 3: Get All Expenses");
    const allExpensesRes = await axios.get(`${API_BASE}/expenses/${userId}`, {
      params: { limit: 10 },
    });
    console.log(`✓ Total expenses: ${allExpensesRes.data.total}`);
    console.log(`  Showing: ${allExpensesRes.data.expenses.length}\n`);

    // Test 4: Get Summary for This Month
    console.log("Test 4: Get Monthly Summary (April 2026)");
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    const summaryRes = await axios.get(`${API_BASE}/expenses/${userId}/summary`, {
      params: { startDate: startOfMonth, endDate: endOfMonth },
    });

    console.log("✓ Monthly Summary:");
    summaryRes.data.summary.forEach(item => {
      console.log(`  ${item._id}: ₹${item.total} (${item.count} transactions)`);
    });
    console.log();

    // Test 5: Create a New Expense
    console.log("Test 5: Create New Expense");
    const newExpenseRes = await axios.post(`${API_BASE}/expenses/create`, {
      userId,
      description: "Test Expense",
      amount: 500,
      category: "Food",
      type: "expense",
      date: new Date().toISOString(),
      tag: "Test",
      notes: "API Test",
      paymentMethod: "card",
    });
    console.log(`✓ Created expense with ID: ${newExpenseRes.data.expense._id}\n`);

    // Test 6: Get Latest Expenses
    console.log("Test 6: Get Latest Expenses (5 records)");
    const latestRes = await axios.get(`${API_BASE}/expenses/${userId}`, {
      params: { limit: 5 },
    });
    console.log(`✓ Latest ${latestRes.data.expenses.length} expenses:\n`);
    latestRes.data.expenses.forEach((exp, idx) => {
      const date = new Date(exp.date).toLocaleDateString();
      console.log(
        `  ${idx + 1}. ${exp.description} - ₹${exp.amount} (${exp.category}) [${date}]`
      );
    });

    console.log("\n✅ All tests passed!\n");
    console.log("System is working correctly:");
    console.log("  ✓ Authentication working");
    console.log("  ✓ User data retrieval working");
    console.log("  ✓ Expense fetching working");
    console.log("  ✓ Summary aggregation working");
    console.log("  ✓ New expense creation working");
    console.log("\n🎉 Ready to use the application!");
  } catch (error) {
    console.error("❌ Test failed:");
    console.error("  Error:", error.response?.data?.msg || error.message);
    console.error("\n🔍 Debugging info:");
    console.error("  - Is backend running on port 5000?");
    console.error("  - Is MongoDB connected?");
    console.error("  - Has test data been setup? (Run: node setup-test-data.js)");
    process.exit(1);
  }
}

runTests();
