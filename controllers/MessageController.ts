import { putConversation } from "./ConversationController";
const logger = require('../service/loggers/winston/index');

const Message = require("../models/Message");

type CreateMessageRequest = {
  content_text: string;
  sender: string;
  conversation: string;
};

export const createMessage = async (req: CreateMessageRequest) => {
  const newMessage = await new Message(req);

  try {
    const createdMessage = await newMessage.save();
    await putConversation(req.conversation, { message_id: createdMessage._id });

    return createdMessage;
  } catch (error) {
    logger.error(error)
    return error;
  }
};
