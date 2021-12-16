const Conversation = require("../models/Conversation");
const logger = require('../service/loggers/winston/index');

type CreateConversationRequest = {
  members: string[];
  match_id: string;
};

type UpdateConversationRequest = {
  message_id: string;
};

export const createConversation = async (req: CreateConversationRequest) => {
  let request = {
    members: req.members,
    match_id: req.match_id,
  };
  const newConversation = await new Conversation(request);

  try {
    const createdConversation = newConversation.save();
    return createdConversation;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const getConversationById = async (conversationId: string) => {
  try {
    const conversation = await Conversation.findOne({
      _id: conversationId,
    })
      .populate({
        path: "members",
        select: "firstName lastName profileImage",
      })
      .populate({
        path: "messages",
        select: "content_text sender creationDate",
        options: { sort: { creationDate: 1 } },
      });
    return conversation;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

export const putConversation = async (
  conversationId: string,
  req: UpdateConversationRequest
) => {
  try {
    const conversation = await getConversationById(conversationId);
    if (req.message_id) {
      conversation.messages = [...conversation.messages, req.message_id];
    }
    conversation.updatedDate = Date.now();

    const updatedConversation = await conversation.save();
    return updatedConversation;
  } catch (error) {
    logger.error(error)
    return error;
  }
};

module.exports = {
  createConversation,
  getConversationById,
  putConversation,
};
