import { updateMatch } from './MatchController';
import { putProfile } from './ProfileController';
const logger = require('../service/loggers/winston/index');

const ProposalPayment = require("../models/ProposalPayment");

type CreateProposalPaymentRequest = {
    amount: number;
    ownerId: string;
    receiverId: string;
    match_id: string
}

export const createProposalPayment = async (req: CreateProposalPaymentRequest) => {
    try {
        const newProposalPayment = await new ProposalPayment(req)
        await newProposalPayment.save()
        await updateMatch(req.match_id, { proposalPaymentId: newProposalPayment._id })

        /**
         * Update owner profile
         */
        await putProfile(req.ownerId, { proposalPayments: newProposalPayment._id })
        
        /**
         * Update receiver profile
         */
        await putProfile(req.receiverId, { proposalPayments: newProposalPayment._id })

        return newProposalPayment
    } catch (error) {
        logger.error(error)
        return error
    }
};

module.exports = { createProposalPayment }
