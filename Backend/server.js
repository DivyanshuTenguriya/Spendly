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

// ✅ FIXED CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://spendly-nu-ten.vercel.app", // ✅ ADD THIS
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// session setup
app.use(
  session({
    secret: "myscretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // OK for now
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/userInfo", userInfoRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/help", helpRoutes);
app.use("/api/notifications", notificationRoutes);

// Test route
app.get("/test-route", (req, res) => {
  res.json({ message: "Server is running", routes: "loaded" });
});

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(console.log);

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
