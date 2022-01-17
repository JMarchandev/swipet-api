import express, { Request, Response } from "express";

import { createMessage } from "../controllers/MessageController";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => { 
  try {
    const newMessage = await createMessage(req.body);
    res.json(newMessage);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
