import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Auth = mongoose.model("Auth", authSchema);