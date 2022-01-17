import { addNotification } from "./NotificationsController";
import { putConversation } from "./ConversationController";
const logger = require("../service/loggers/winston/index");

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
    const updatedConversation = await putConversation(req.conversation, {
      message_id: createdMessage._id,
    });
    const opositeProfileId = updatedConversation.members.filter(
      (profile: any) => {
        return profile._id.toString() !== req.sender;
      }
    );

    await addNotification(opositeProfileId[0]._id.toString(), {
      message: { conversation_id: req.content_text, seen: false },
    });

    return createdMessage;
  } catch (error) {
    logger.error(error);
    return error;
  }
};
