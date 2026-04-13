import bcrypt from "bcryptjs";
import { Auth } from "../models/authModel.js";
import { UserInfo } from "../models/userInfoModel.js";

export const register = async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ msg: "Email, password, and name are required" });
  }

  const exist = await Auth.findOne({ email });
  if (exist) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await Auth.create({
    email,
    password: hashed,
  });

  // Auto-create UserInfo
  const userInfo = await UserInfo.create({
    userId: user._id,
    fullName: fullName,
    phone: '',
    currency: 'INR – Indian Rupee',
    monthlyIncome: 0,
    monthlyExpenseBudget: 0,
    budgets: [],
  });

  // Link userInfo to Auth
  await Auth.findByIdAndUpdate(user._id, { userInfo: userInfo._id });
  req.session.user = user;
  res.json({ msg: "Register success", user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await Auth.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid email" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Wrong password" });

  req.session.user = user;

  res.json({ msg: "Login success", user });
};