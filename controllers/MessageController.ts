import { putConversation } from "./ConversationController";

const Message = require("../models/Message");

type CreateMessageRequest = {
  content_text: string;
  sender: string;
  conversation: string;
};

const errorLogger = (functionName: string, error: any) => {
  console.error(`MessageController: error on ${functionName}`);
  console.error("Error => " + error);
};

export const createMessage = async (req: CreateMessageRequest) => {
  const newMessage = await new Message(req);

  try {
    const createdMessage = await newMessage.save();
    await putConversation(req.conversation, { message_id: createdMessage._id });

    return createdMessage;
  } catch (error) {
    errorLogger("createMatch", error);
    return error;
  }
};
