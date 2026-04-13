import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import userInfoRoutes from "./routes/userInfoRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import helpRoutes from "./routes/helpRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// session setup
app.use(
  session({
    secret: "myscretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

console.log("Mounting routes...");
app.use("/api/auth", authRoutes);
console.log("Auth routes mounted");
app.use("/api/userInfo", userInfoRoutes);
console.log("UserInfo routes mounted");
app.use("/api/expenses", expenseRoutes);
console.log("Expense routes mounted");
app.use("/api/help", helpRoutes);
console.log("Help routes mounted");
app.use("/api/notifications", notificationRoutes);
console.log("Notification routes mounted");

// Debug logging
console.log("Routes registered:");
console.log("  /api/auth");
console.log("  /api/userInfo");
console.log("  /api/expenses");
console.log("  /api/help");
console.log("  /api/notifications");

// Test route to verify userInfo routes are working
app.get("/test-route", (req, res) => {
  res.json({ message: "Server is running", routes: "loaded" });
});

mongoose.connect("mongodb://127.0.0.1:27017/spendly")
  .then(() => console.log("DB connected"))
  .catch(console.log);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});