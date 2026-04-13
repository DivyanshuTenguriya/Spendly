import { Notification } from "../models/notificationModel.js";
import mongoose from "mongoose";

export const createNotification = async (req, res) => {
  const { userId, title, message, type } = req.body;

  try {
    const notification = await Notification.create({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      message,
      type: type || 'alert',
    });

    res.json({ msg: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    res.json({ msg: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};