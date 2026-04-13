import { Help } from "../models/helpModel.js";
import mongoose from "mongoose";

export const createHelpMessage = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const helpMessage = await Help.create({
      userId: new mongoose.Types.ObjectId(userId),
      message,
    });

    res.json({ msg: "Help message sent successfully", helpMessage });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getHelpMessages = async (req, res) => {
  try {
    const helpMessages = await Help.find().populate('userId', 'email').sort({ createdAt: -1 });
    res.json({ helpMessages });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};