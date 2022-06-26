import { getProfileById, putProfile } from "./ProfileController";

import { addNotification } from "./NotificationsController";
import { createConversation } from "./ConversationController";

const logger = require("../service/loggers/winston/index");
const Match = require("../models/Match");

type CreateMatchRequest = {
  members: string[];
};

type UpdateMatchRequest = {
  conversation_id?: string;
  proposalPaymentId?: string;
};

export const getMatchById = async (match_id: string) => {
  try {
    const match = await Match.findOne({ _id: match_id });
    return match;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

export const createMatch = async (
  req: CreateMatchRequest,
  oppositeProfileId: string
) => {
  let request = {
    members: req.members,
  };

  const newMatch = await new Match(request);
  try {
    const createdMatch = await newMatch.save();
    const newConversation = await createConversation({
      members: request.members,
      match_id: createdMatch._id,
    });

    request.members.map(async (profile_id) => {
      await putProfile(profile_id, {
        match_id: createdMatch._id,
      });
    });

    await addNotification(
      oppositeProfileId,
      {
        matches: { match_id: createdMatch._id, seen: false },
      },
      "matches"
    );

    const updatedMatch = await updateMatch(newMatch._id, {
      conversation_id: newConversation._id,
    });

    return { match: updatedMatch, conversation: newConversation };
  } catch (error) {
    logger.error(error);
    return error;
  }
};

export const getMatchesByProfileId = async (profileId: string) => {
  try {
    const currentUser = await getProfileById(profileId);
    const { matches } = await currentUser.populate({
      path: "matches.members",
      select: "firstName lastName profileImage",
    });

    return matches;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const updateMatch = async (
  match_id: string,
  req: UpdateMatchRequest
) => {
  try {
    const currentMatch = await getMatchById(match_id);
    if (req.conversation_id) {
      currentMatch.conversation_id = req.conversation_id;
    }
    if (req.proposalPaymentId) {
      currentMatch.proposalPayments = currentMatch.proposalPayments.length
        ? [...currentMatch.proposalPayments, req.proposalPaymentId]
        : [req.proposalPaymentId];
    }
    currentMatch.updatedDate = Date.now();

    const updatedMatch = await currentMatch.save();
    const populatedMatch = await updatedMatch.populate("members");

    return populatedMatch;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

module.exports = {
  createMatch,
  getMatchesByProfileId,
  updateMatch,
};
