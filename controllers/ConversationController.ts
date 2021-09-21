const Conversation = require("../models/Conversation");

type CreateConversationRequest = {
  members: string[];
  match_id: string;
};

const errorLogger = (functionName: string, error: any) => {
  console.error(`ConversationController: error on ${functionName}`);
  console.error("Error => " + error);
};

export const createConversation = async (req: CreateConversationRequest) => {
  let request = {
    members: req.members,
    match_id: req.match_id
  };
  const newConversation = await new Conversation(request);

  try {
    const createdConversation = newConversation.save();
    return createdConversation;
  } catch (error) {
    errorLogger("create", error);
    return error;
  }
};

module.exports = {
  createConversation,
};
