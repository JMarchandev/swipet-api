import { getProfileById, putProfile } from "./ProfileController";
const Match = require("../models/Match");
import { createConversation } from "./ConversationController";

type CreateMatchRequest = {
  members: string[];
};

type UpdateMatchRequest = {
  conversation_id?: string;
};

const errorLogger = (functionName: string, error: any) => {
  console.error(`MatchController: error on ${functionName}`);
  console.error("Error => " + error);
};

export const getMatchById = async (match_id: string) => {
  try {
    const match = await Match.findOne({ _id: match_id });
    return match;
  } catch (error) {
    errorLogger("getMatchById", error);
    return error;
  }
};

export const createMatch = async (req: CreateMatchRequest) => {
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

    const updatedMatch = await updateMatch(newMatch._id, {
      conversation_id: newConversation._id,
    });

    return { match: updatedMatch, conversation: newConversation };
  } catch (error) {
    errorLogger("createMatch", error);
    return error;
  }
};

export const getMatchesByProfileId = async (profileId: string) => {
  try {
    const currentUser = await getProfileById(profileId);
    const { matches } = await currentUser.populate({ path: "matches.members", select: "firstName lastName profileImage" });

    return matches;
  } catch (error) {
    errorLogger("getMatchesByProfileId", error);
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
    currentMatch.updatedDate = Date.now();

    const updatedMatch = await currentMatch.save();
    const populatedMatch = await updatedMatch.populate("members");

    return populatedMatch;
  } catch (error) {
    errorLogger("updateMatch", error);
    return error;
  }
};

module.exports = {
  createMatch,
  getMatchesByProfileId,
};
