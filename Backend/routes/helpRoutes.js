import express from "express";
import { createHelpMessage, getHelpMessages } from "../controller/helpController.js";

const router = express.Router();

router.post("/", createHelpMessage);
router.get("/", getHelpMessages);

export default router;