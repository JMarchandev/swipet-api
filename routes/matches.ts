import {
  createMatch,
  getMatchesByProfileId,
} from "../controllers/MatchController";
import express, { Request, Response } from "express";
const router = express.Router();

// router.post("/", async (req: Request, res: Response) => {
//   try {
//     const newMatch = await createMatch(req.body);
//     res.json(newMatch);
//   } catch (error) {
//     res.status(400).json(error);
//   }
// });

router.get("/profile/:id", async (req: Request, res: Response) => {
  try {
    const matches = await getMatchesByProfileId(req.params.id);
    res.json(matches);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/manual-match/:id1/:id2", async (req, res) => {
  try {
    const newMatch = await createMatch(
      {
        members: [req.params.id1, req.params.id2],
      },
      req.params.id2
    );
    res.json(newMatch);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;