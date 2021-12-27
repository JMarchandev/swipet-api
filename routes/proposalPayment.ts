import express, { Request, Response } from "express";
import { createProposalPayment } from "../controllers/proposalPaymentController";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const newProposalPayment = await createProposalPayment(req.body)
        res.json(newProposalPayment)
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
