import express from "express";
import { createNotification, getNotifications, markAsRead } from "../controller/notificationController.js";

const router = express.Router();

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.put("/:notificationId/read", markAsRead);

export default router;