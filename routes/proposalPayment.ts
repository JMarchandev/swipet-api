import express, { Request, Response } from "express";
import {
  createOfferProposalPayment,
  createProposalPayment,
  getProposalPaymentById,
} from "../controllers/proposalPaymentController";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const newProposalPayment = await createProposalPayment(req.body, true);
    res.json(newProposalPayment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:proposalPaymentId", async (req: Request, res: Response) => {
  try {
    const proposalPayment = await getProposalPaymentById(
      req.params.proposalPaymentId
    );
    res.json(proposalPayment);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post(
  "/:proposalPaymentId/offer",
  async (req: Request, res: Response) => {
    try {
      const offerProposalPayment = await createOfferProposalPayment(
        req.params.proposalPaymentId,
        req.body
      );
      res.json(offerProposalPayment);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = router;
