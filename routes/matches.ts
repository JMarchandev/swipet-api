import { createMatch, getMatchesByProfileId } from "../controllers/MatchController";

import express, { Request, Response } from "express";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const newMatch = await createMatch(req.body);
    res.json(newMatch);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    const matches = await getMatchesByProfileId(req.params.id);
    res.json(matches);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;