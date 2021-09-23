const { createConversation } = require("../controllers/ConversationController");

import express, { Request, Response } from "express";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const newConversation = await createConversation(req.body);
    res.json(newConversation);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
