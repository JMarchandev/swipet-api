import { updateMatch } from "./MatchController";
import { putProfile } from "./ProfileController";
const logger = require("../service/loggers/winston/index");

const ProposalPayment = require("../models/ProposalPayment");

type CreateProposalPaymentRequest = {
  amount: number;
  ownerId: string;
  receiverId: string;
  match_id: string;
};

type UpdateProposalPaymentRequest = {
  offerId: string;
};

const updateMatchAndProfiles = async (
  req: CreateProposalPaymentRequest,
  newProposalPaymentId: string
) => {
  try {
    await updateMatch(req.match_id, {
      proposalPaymentId: newProposalPaymentId,
    });

    /**
     * Update owner profile
     */
    await putProfile(req.ownerId, { proposalPayments: newProposalPaymentId });

    /**
     * Update receiver profile
     */
    await putProfile(req.receiverId, {
      proposalPayments: newProposalPaymentId,
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const createProposalPayment = async (
  req: CreateProposalPaymentRequest,
  hasNeedUpdateMatch: boolean
) => {
  try {
    const newProposalPayment = await new ProposalPayment(req);
    await newProposalPayment.save();

    if (hasNeedUpdateMatch) {
      await updateMatchAndProfiles(req, newProposalPayment._id);
    }

    return newProposalPayment.populate({
      path: "ownerId receiverId",
      select: "name profileImage.croppedImage",
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const getProposalPaymentById = async (proposalPaymentId: string) => {
  try {
    const proposalPayment = await ProposalPayment.findOne({
      _id: proposalPaymentId,
    })
      .populate({
        path: "ownerId receiverId",
        select: "name profileImage.croppedImage",
      })
      .populate({
        path: "offers",
        select: "ownerId receiverId amount",
        populate: {
          path: "ownerId receiverId",
          select: "name",
        },
      });
    return proposalPayment;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const updateProposalPayment = async (
  proposalPaymentId: string,
  req: UpdateProposalPaymentRequest
) => {
  try {
    const currentProposalPayment = await getProposalPaymentById(
      proposalPaymentId
    );
    if (req.offerId) {
      currentProposalPayment.offers = currentProposalPayment.offers.length
        ? [...currentProposalPayment.offers, req.offerId]
        : [req.offerId];
    }

    currentProposalPayment.updatedDate = Date.now();
    const updatedCurrentProposalPayment = currentProposalPayment.save();

    return updatedCurrentProposalPayment;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const createOfferProposalPayment = async (
  proposalPaymentId: string,
  req: CreateProposalPaymentRequest
) => {
  try {
    const offerProposalPayment = await createProposalPayment(req, false);

    const updatedProposalPayment = await updateProposalPayment(
      proposalPaymentId,
      { offerId: offerProposalPayment._id }
    );

    return updatedProposalPayment.populate({
      path: "offers",
      populate: {
        path: "ownerId receiverId",
        select: "name",
      },
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  createProposalPayment,
  getProposalPaymentById,
  updateProposalPayment,
  createOfferProposalPayment,
};
