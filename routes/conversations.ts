import { getConversationById } from "../controllers/ConversationController";

import express, { Request, Response } from "express";
const router = express.Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const conversation = await getConversationById(req.params.id);
    res.json(conversation);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
